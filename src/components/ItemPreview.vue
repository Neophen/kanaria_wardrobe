<script setup name="ItemPreview" lang="ts">
import { NFTConsolidated } from 'rmrk-tools/dist/tools/consolidator/consolidator';
import RarityBadge from './RarityBadge.vue';

const props = defineProps<{
  item?: NFTConsolidated;
}>();

const state = ref('no-item');
const info = reactive({
  title: '',
  image: '',
  rarity: 'common',
  rarityValue: 0,
  description: '',
  type: '',
});

const dataToInfo = (data) => {
  info.title = `${data.name}: 1 of ${data.properties?.total_count?.value || 0}`;
  info.image = data.image?.replace('ipfs://', 'https://rmrk.mypinata.cloud/');
  info.rarity = data.properties.rarity.value;
  info.rarityValue = data.properties.rarity_percentage.value;
  info.description = data.description;
  info.type = `${data.properties.type.value} - ${data.properties.context.value}`;
};

watch(
  () => props.item,
  (item) => {
    if (!item) {
      state.value = 'no-item';
      return;
    }

    const address = item.metadata?.replace(
      'ipfs://',
      'https://rmrk.mypinata.cloud/'
    );

    if (!address) return;

    state.value = 'loading';
    fetch(address)
      .then((response) => response.json())
      .then(dataToInfo)
      .then(() => (state.value = 'idle'));
  },
  {
    immediate: true,
  }
);
</script>
<template>
  <div class="p-4 bg-white border border-pink-500 rounded-xl">
    <div v-if="state === 'idle'" class="space-y-2">
      <img class="w-full rounded-lg" :src="info.image" alt="" />
      <h2 class="text-lg font-bold">
        {{ info.title }}
      </h2>
      <RarityBadge :rarity="info.rarity" :value="info.rarityValue" />
      <p>
        {{ info.type }}
      </p>
      <p>{{ info.description }}</p>
    </div>
    <div v-else-if="state === 'loading'" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-else class="text-center">
      <p>Please select an item</p>
    </div>
  </div>
</template>
