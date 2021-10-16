<script setup name="Wardrobe">
import { getUniqueItems, birdSlots } from '../features/useSlots.js';

const props = defineProps({
  nfts: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['equip']);

const selectedSlot = ref(birdSlots[0]);
const isActiveSlot = computed(
  () => (slot) => slot.id === selectedSlot.value.id
);

const equipedItems = reactive({
  background: null,
  foreground: null,
  headwear: null,
  objectleft: null,
  objectright: null,
  necklace: null,
  backpack: null,
});

const isEquipedItem = computed(
  () => (item) => item.id === equipedItems[selectedSlot.value.id]?.id
);

const backgrounds = computed(() => getUniqueItems('background', props.nfts));
const foregrounds = computed(() => getUniqueItems('foreground', props.nfts));
const headwears = computed(() => getUniqueItems('headwear', props.nfts));
const handhelds = computed(() => getUniqueItems('handheld', props.nfts));
const necklaces = computed(() => getUniqueItems('necklace', props.nfts));
const backpacks = computed(() => getUniqueItems('backpack', props.nfts));

const ID_TO_ITEMS = {
  background: backgrounds,
  foreground: foregrounds,
  headwear: headwears,
  objectleft: handhelds,
  objectright: handhelds,
  necklace: necklaces,
  backpack: backpacks,
};

const activeItems = computed(() => ID_TO_ITEMS[selectedSlot.value.id].value);

const onChooseSlot = (slot) => {
  selectedSlot.value = slot;
};

const equipItem = (item) => {
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
          'hover:bg-yellow-100': !isActiveSlot(slot),
          'bg-yellow-500 text-white hover:bg-yellow-400': isActiveSlot(slot),
        }"
        @click="onChooseSlot(slot)"
      >
        <img :src="slot.img" class="w-full h-full" style="aspect-ratio: 1" />
      </button>
    </div>
    <div
      class="grid flex-1 gap-4 mt-8"
      style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr))"
    >
      <button
        v-for="item in activeItems"
        :key="item.id"
        class="overflow-hidden bg-white border-4 shadow rounded-xl"
        :class="{
          'border-white hover:shadow-xl hover:border-blue-400':
            !isEquipedItem(item),
          'border-green-500 hover:shadow-xl hover:border-green-400 ':
            isEquipedItem(item),
        }"
        @click="equipItem(item)"
      >
        <img
          class="object-contain w-full"
          style="aspect-ratio: 1"
          :src="item.resources[0].thumb"
          width="100%"
          height="100%"
        />
      </button>
    </div>
  </div>
</template>
