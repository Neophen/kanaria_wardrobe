<script setup name="Wardrobe">
import { birdSlots } from '../features/useSlots.js';

const props = defineProps({
  backgrounds: {
    type: Array,
    required: true,
  },
  foregrounds: {
    type: Array,
    required: true,
  },
  headwears: {
    type: Array,
    required: true,
  },
  handhelds: {
    type: Array,
    required: true,
  },
  necklaces: {
    type: Array,
    required: true,
  },
  backpacks: {
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

const currentPage = ref(0);

const ID_TO_ITEMS = {
  background: props.backgrounds,
  foreground: props.foregrounds,
  headwear: props.headwears,
  objectleft: props.handhelds,
  objectright: props.handhelds,
  necklace: props.necklaces,
  backpack: props.backpacks,
};

const activeItems = computed(() => {
  const chunks = ID_TO_ITEMS[selectedSlot.value.id];
  return chunks[currentPage.value];
});

const pages = computed(() => {
  return ID_TO_ITEMS[selectedSlot.value.id].length;
});

const onChooseSlot = (slot) => {
  selectedSlot.value = slot;
  currentPage.value = 0;
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

const onSelectPage = (page) => {
  if (page < 0) {
    currentPage.value = 0;
    return;
  }
  if (page >= pages.value) {
    currentPage.value = pages.value - 1;
    return;
  }
  currentPage.value = page;
};

const getThumb = (item) => {
  const resource = item.resources.find((x) => Boolean(x.thumb));
  return resource?.thumb;
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
      style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))"
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
          :src="getThumb(item)"
          width="100%"
          height="100%"
        />
      </button>
    </div>
    <nav
      class="flex items-center justify-center mt-4 space-x-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        @click="onSelectPage(currentPage - 1)"
        class="flex items-center justify-center w-8 h-8 text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
      >
        <span class="sr-only">Previous</span>
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
      <button
        v-for="page in pages"
        :key="page"
        type="button"
        @click="onSelectPage(page - 1)"
        aria-current="page"
        class="relative z-10 flex items-center justify-center w-8 h-8 text-sm font-medium border rounded-full "
        :class="{
          'text-indigo-600 border-indigo-500  bg-indigo-50':
            page - 1 === currentPage,
          'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 ':
            page - 1 !== currentPage,
        }"
      >
        {{ page }}
      </button>

      <button
        type="button"
        class="flex items-center justify-center w-8 h-8 text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
        @click="onSelectPage(currentPage + 1)"
      >
        <span class="sr-only">Next</span>
        <!-- Heroicon name: solid/chevron-right -->
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </nav>
  </div>
</template>
