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
  count: 'Unknown amount',
  description: '',
  type: '',
});

const dataToInfo = (data) => {
  const total = data.properties?.total_count?.value || 0;
  info.title = data.name;
  info.count = total ? `1 of ${total}` : 'Unknown amount';
  info.image = data.image?.replace('ipfs://', 'https://rmrk.mypinata.cloud/');
  info.rarity = data.properties.rarity.value;
  info.rarityValue = data.properties.rarity_percentage?.value || null;
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
  <div class="p-4 bg-white shadow rounded-xl">
    <div v-if="state === 'idle'" class="space-y-2">
      <div class="flex items-start space-x-4">
        <img
          class="w-2/5 bg-pink-100 border border-pink-500 rounded-lg"
          :src="info.image"
          alt=""
        />
        <div class="space-y-1">
          <h2 class="text-lg font-bold">
            {{ info.title }}
          </h2>
          <div class="flex items-center space-x-2">
            <RarityBadge :rarity="info.rarity" />
            <p>{{ info.count }}</p>

            <p>{{ info.type }}</p>
          </div>
          <p>{{ info.description }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="state === 'loading'" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-else class="text-center">
      <p>Please select an item</p>
    </div>
  </div>
</template>
