<script setup name="SelectBird" lang="ts">
import { NFTConsolidated } from 'rmrk-tools/dist/tools/consolidator/consolidator';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  nfts: NFTConsolidated[];
}>();

const emit = defineEmits<{
  (event: 'select', bird: NFTConsolidated): void;
  (event: 'reset'): void;
}>();

// const BIRD_SYMBOLS = ['KANS', 'KANR', 'KANL'];
const BIRD_SYMBOLS = ['KANS', 'KANR'];

const availableBirds = computed(() =>
  props.nfts
    .filter((nft) => BIRD_SYMBOLS.includes(nft.symbol))
    .map((bird) => ({
      id: bird.id,
      name: bird.properties?.name.value,
    }))
);
const selectedId = ref<string | null>(availableBirds.value[0].id);

watch(
  selectedId,
  (id) => {
    if (!id) {
      return;
    }

    const bird = props.nfts.find((nft) => nft.id === id);
    if (!bird) {
      return;
    }

    emit('select', bird);
  },
  {
    immediate: true,
  }
);
</script>
<template>
  <div class="flex items-end w-full space-x-2">
    <div class="flex-1">
      <label class="text-xs font-bold uppercase" for="manual-id"
        >Enter a bird id</label
      >
      <input
        id="manual-id"
        placeholder="Enter full id of the bird"
        type="text"
        class="block w-full px-4 py-2 text-base leading-tight border border-pink-500 rounded-xl"
        v-model.trim="selectedId"
      />
    </div>
    <p class="mb-2 font-bold whitespace-nowrap">- Or -</p>
    <div class="flex-1">
      <label class="text-xs font-bold uppercase" for="select-id"
        >Select a bird</label
      >
      <select
        id="select-id"
        v-model="selectedId"
        class="block w-full px-4 py-2 text-base leading-tight border border-pink-500 rounded-xl"
        placeholder="Select a bird"
      >
        <option v-for="bird in availableBirds" :key="bird.id" :value="bird.id">
          {{ bird.name }}
        </option>
      </select>
    </div>
    <div>
      <BaseButton @click="emit('reset')">Reset Wardrobe</BaseButton>
    </div>
  </div>
</template>
