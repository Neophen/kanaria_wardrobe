<script setup name="Wardrobe" lang="ts">
import { NFTConsolidated } from 'rmrk-tools/dist/tools/consolidator/consolidator';
import { BirdSlot, birdSlots, SlotType } from '../features/useSlots.ts';

import Pagination from './Pagination.vue';

const props = defineProps<{
  backgrounds: Array<NFTConsolidated[]>;
  foregrounds: Array<NFTConsolidated[]>;
  headwears: Array<NFTConsolidated[]>;
  handhelds: Array<NFTConsolidated[]>;
  necklaces: Array<NFTConsolidated[]>;
  backpacks: Array<NFTConsolidated[]>;
}>();

const emit = defineEmits<{
  (
    event: 'equip',
    payload: {
      equip: boolean;
      item: NFTConsolidated;
      slot: BirdSlot;
    }
  ): void;
}>();

const ID_TO_ITEM_PAGES = {
  [SlotType.background]: props.backgrounds,
  [SlotType.foreground]: props.foregrounds,
  [SlotType.headwear]: props.headwears,
  [SlotType.objectleft]: props.handhelds,
  [SlotType.objectright]: props.handhelds,
  [SlotType.necklace]: props.necklaces,
  [SlotType.backpack]: props.backpacks,
};

const selectedSlot = ref<BirdSlot>(birdSlots[0]);

const slotIsActive = computed(
  () => (slot: BirdSlot) => slot.id === selectedSlot.value.id
);

const equipedItems = reactive<{
  background: NFTConsolidated | null;
  foreground: NFTConsolidated | null;
  headwear: NFTConsolidated | null;
  objectleft: NFTConsolidated | null;
  objectright: NFTConsolidated | null;
  necklace: NFTConsolidated | null;
  backpack: NFTConsolidated | null;
}>({
  background: null,
  foreground: null,
  headwear: null,
  objectleft: null,
  objectright: null,
  necklace: null,
  backpack: null,
});

const itemIsEquiped = computed(
  () => (item: NFTConsolidated) =>
    item.id === equipedItems[selectedSlot.value.id]?.id
);

const currentPage = ref(0);

const pages = computed(() => {
  return ID_TO_ITEM_PAGES[selectedSlot.value.id].length;
});

const onSelectPage = (page: number) => {
  currentPage.value = page;
};

const itemsPage = computed(() => {
  const pages = ID_TO_ITEM_PAGES[selectedSlot.value.id];
  return pages[currentPage.value];
});

const onChooseSlot = (slot: BirdSlot) => {
  selectedSlot.value = slot;
  currentPage.value = 0;
};

const equipItem = (item: NFTConsolidated) => {
  let equip = true;
  if (equipedItems[selectedSlot.value.id]?.id === item.id) {
    equipedItems[selectedSlot.value.id] = null;
    equip = false;
  } else {
    equipedItems[selectedSlot.value.id] = item;
  }
  emit('equip', {
    equip,
    slot: selectedSlot.value,
    item,
  });
};

const getThumb = (item: NFTConsolidated): string => {
  const resource = item.resources.find((x) => Boolean(x.thumb));
  return resource?.thumb || '';
};
</script>
<template>
  <div>
    <div
      class="grid flex-1 gap-4 justify-items-center"
      style="grid-template-columns: repeat(auto-fit, minmax(38px, 1fr))"
    >
      <button
        v-for="slot in birdSlots"
        :key="slot.id"
        class="flex items-center justify-center w-full bg-white border-2 rounded-md whitespace-nowrap"
        :class="{
          'hover:bg-yellow-100': !slotIsActive(slot),
          'bg-yellow-500 text-white hover:bg-yellow-400': slotIsActive(slot),
        }"
        @click="onChooseSlot(slot)"
      >
        <img :src="slot.img" class="w-full h-full" style="aspect-ratio: 1" />
      </button>
    </div>
    <div
      class="grid flex-1 gap-4 mt-8"
      style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))"
    >
      <button
        v-for="item in itemsPage"
        :key="item.id"
        class="overflow-hidden bg-white border-4 shadow rounded-xl"
        :class="{
          'border-white hover:shadow-xl hover:border-blue-400':
            !itemIsEquiped(item),
          'border-green-500 hover:shadow-xl hover:border-green-400 ':
            itemIsEquiped(item),
        }"
        @click="equipItem(item)"
      >
        <img
          class="object-contain w-full"
          style="aspect-ratio: 1"
          :src="getThumb(item)"
          width="100%"
          height="100%"
        />
      </button>
    </div>
    <Pagination
      class="mt-4"
      :pages="pages"
      :current-page="currentPage"
      @select="onSelectPage"
    />
  </div>
</template>
