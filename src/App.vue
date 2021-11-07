<script setup name="App" lang="ts">
import {
  BaseConsolidated,
  NFTConsolidated,
} from 'rmrk-tools/dist/tools/consolidator/consolidator';
import { BirdSlot, getUniqueItems } from './features/useSlots';

import BirdPreview from './components/BirdPreview.vue';
import Wardrobe from './components/Wardrobe.vue';
import ItemPreview from './components/ItemPreview.vue';
import SelectFile from './components/SelectFile.vue';
import SelectBird from './components/SelectBird.vue';

const perPage = 20;
const nfts = ref<NFTConsolidated[]>([]);
const bases = ref<BaseConsolidated[]>([]);
const fileSelected = ref(false);
const selectedBird = ref<NFTConsolidated | null>(null);
const selectedItem = ref<NFTConsolidated | null>(null);

const chunk = <T>(arr: Array<T>, size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const backgrounds = computed(() =>
  chunk<NFTConsolidated>(getUniqueItems('background', nfts.value), perPage)
);
const foregrounds = computed(() =>
  chunk<NFTConsolidated>(getUniqueItems('foreground', nfts.value), perPage)
);
const headwears = computed(() =>
  chunk<NFTConsolidated>(getUniqueItems('headwear', nfts.value), perPage)
);
const handhelds = computed(() =>
  chunk<NFTConsolidated>(getUniqueItems('handheld', nfts.value), perPage)
);
const necklaces = computed(() =>
  chunk<NFTConsolidated>(getUniqueItems('necklace', nfts.value), perPage)
);
const backpacks = computed(() =>
  chunk<NFTConsolidated>(getUniqueItems('backpack', nfts.value), perPage)
);

interface EquipPayload {
  equip: boolean;
  slot: BirdSlot;
  item: NFTConsolidated;
}
const onEquip = ({ equip, slot, item }: EquipPayload) => {
  selectedItem.value = item;
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

const onSelectBird = (bird: NFTConsolidated) => {
  selectedBird.value = bird;
};

interface Payload {
  nfts: NFTConsolidated[];
  bases: BaseConsolidated[];
}

const updateItems = (payload: Payload) => {
  nfts.value = Object.values(payload.nfts);
  bases.value = Object.values(payload.bases);
  fileSelected.value = true;
};

const resetState = () => {
  nfts.value = [];
  bases.value = [];
  fileSelected.value = false;
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100  min-w-max"
  >
    <div>
      <h1 class="text-3xl font-black">Welcome to Kanaria wardrobe</h1>
    </div>
    <SelectFile v-if="!fileSelected" class="mt-12" @change="updateItems" />
    <div v-else class="w-full">
      <SelectBird
        class="px-8"
        :nfts="nfts"
        @select="onSelectBird"
        @reset="resetState"
      />
      <div class="grid w-full h-full grid-cols-3 gap-6 mt-4 max-w-[100vw] px-8">
        <BirdPreview
          v-if="selectedBird"
          :bird="selectedBird"
          :nfts="nfts"
          :bases="bases"
        />
        <Wardrobe
          :backgrounds="backgrounds"
          :foregrounds="foregrounds"
          :headwears="headwears"
          :handhelds="handhelds"
          :necklaces="necklaces"
          :backpacks="backpacks"
          @equip="onEquip"
        />
        <ItemPreview :item="selectedItem" />
      </div>
    </div>
  </div>
</template>
