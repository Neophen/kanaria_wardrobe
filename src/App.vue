<script setup>
import { getUniqueItems } from './features/useSlots.js';

import BirdPreview from './components/BirdPreview.vue';
import Wardrobe from './components/Wardrobe.vue';

const perPage = 20;
const nfts = ref([]);
const bases = ref([]);
const isLoading = ref(true);

const backgrounds = computed(() => getUniqueItems('background', nfts.value));
const foregrounds = computed(() => getUniqueItems('foreground', nfts.value));
const headwears = computed(() => getUniqueItems('headwear', nfts.value));
const handhelds = computed(() => getUniqueItems('handheld', nfts.value));
const necklaces = computed(() => getUniqueItems('necklace', nfts.value));
const backpacks = computed(() => getUniqueItems('backpack', nfts.value));

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
const backgroundsPaginated = computed(() => chunk(backgrounds.value, perPage));
const foregroundsPaginated = computed(() => chunk(foregrounds.value, perPage));
const headwearsPaginated = computed(() => chunk(headwears.value, perPage));
const handheldsPaginated = computed(() => chunk(handhelds.value, perPage));
const necklacesPaginated = computed(() => chunk(necklaces.value, perPage));
const backpacksPaginated = computed(() => chunk(backpacks.value, perPage));

const superFounderBirds = computed(() => {
  //   return nfts.value.filter((nft) => nft.symbol === 'KANS');
  return nfts.value.filter(
    (nft) => nft.id === '8949162-e0b9bdcc456a36497a-KANBIRD-KANR-00000618'
  );
});

const birdId = ref(null);

const selectedBird = ref(superFounderBirds.value[0]);

const theme = computed(() => {
  if (!selectedBird.value) {
    return {};
  }
  const resource = selectedBird.value.resources.find((x) => Boolean(x.base));
  const base = bases.value.find((x) => x.id === resource.base);
  const theme = base?.themes[resource.themeId];
  return theme;
});

const baseParts = computed(() => {
  if (!selectedBird.value) {
    return [];
  }
  const resource = selectedBird.value.resources.find((x) => Boolean(x.base));
  if (!resource) {
    return [];
  }

  const base = bases.value.find((x) => x.id === resource.base);
  const baseParts = base?.parts
    ? base.parts.filter((part) => (resource.parts || []).includes(part.id))
    : [];

  return baseParts;
});

const fixedParts = computed(
  () =>
    baseParts.value.filter(
      (resources_part) => resources_part.type === 'fixed'
    ) || []
);

const equipedParts = computed(() => {
  if (!baseParts.value || !selectedBird.value) {
    return [];
  }
  const resourceParts = baseParts.value;
  const children = selectedBird.value.children;

  const equippedChildren = (children || []).map((child) => {
    const nft = nfts.value.find((nft) => nft.id === child.id);
    if (!nft) {
      return null;
    }

    const matchingResource = nft.resources.find(
      (resource) => resource.slot === child.equipped
    );

    return matchingResource;
  });

  const slotParts = (resourceParts || []).map((part) => {
    // Find base slot for each equipped children
    const matchingResource = equippedChildren.find(
      (resource) => resource?.slot && resource.slot.split('.')[1] === part.id
    );

    if (part.type !== 'slot') {
      return null;
    }

    return {
      z: part.z,
      src: matchingResource?.src || part.src,
      id: part.id,
    };
  });

  return slotParts.filter((part) => Boolean(part));
});

const parts = computed(() => {
  return [...(equipedParts.value || []), ...fixedParts.value].sort(
    (first, second) => first.z - second.z
  );
});

const onEquip = ({ equip, slot, item }) => {
  if (!selectedBird.value) {
    return;
  }

  const resource = item.resources.find((x) => x.slot.endsWith(slot.id));

  const children = selectedBird.value.children.filter(
    (x) => x.equipped !== resource.slot
  );

  if (equip) {
    children.push({
      id: item.id,
      equipped: resource.slot,
      pending: false,
    });
  }

  selectedBird.value.children = children;
};

watch(
  () => nfts.value,
  () => {
    nextTick(() => (birdId.value = superFounderBirds.value[0].id));
  }
);

watch(
  () => birdId.value,
  (id) => {
    if (!id) {
      selectedBird.value = superFounderBirds.value[0];
    }

    selectedBird.value = nfts.value.find((nft) => nft.id === id);
  }
);

const fetchData = async () => {
  try {
    const payload = await fetch('/precon-rmrk2.json');
    const data = await payload.json();
    if (data?.nfts && data?.bases) {
      nfts.value = Object.values(data.nfts);
      bases.value = Object.values(data.bases);
    }
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};

fetchData();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 min-w-max"
  >
    <div>
      <h1 class="text-3xl font-black">Welcome to Kanaria wardrobe</h1>
    </div>
    <div v-if="isLoading" class="mt-12">
      <h1 class="text-3xl text-gray-400">Loading wardrobe...</h1>
    </div>
    <div v-else class="grid w-full h-full grid-cols-3 gap-6 p-8">
      <div class="flex flex-col items-center justify-end h-full">
        <select
          v-model="birdId"
          class="w-full p-4 border border-black rounded-xl"
        >
          <option
            v-for="bird in superFounderBirds"
            :key="bird.id"
            :value="bird.id"
          >
            {{ bird.properties.name.value }}
          </option>
        </select>
        <div class="w-full mt-4">
          <BirdPreview :bird="parts" :theme="theme" />
        </div>
      </div>
      <Wardrobe
        class="flex-1 gap-4"
        :backgrounds="backgroundsPaginated"
        :foregrounds="foregroundsPaginated"
        :headwears="headwearsPaginated"
        :handhelds="handheldsPaginated"
        :necklaces="necklacesPaginated"
        :backpacks="backpacksPaginated"
        @equip="onEquip"
      />
    </div>
  </div>
</template>
