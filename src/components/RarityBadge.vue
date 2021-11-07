<script setup name="RarityBadge" lang="ts">
const RARITY_TO_COLOR = {
  legendary: '#ED8936',
  epic: '#805AD5',
  rare: '#3182ce',
  uncommon: '#0DD27F',
  common: '#A0AEC0',
};

const props = defineProps<{
  rarity: keyof typeof RARITY_TO_COLOR;
  value?: number;
}>();

const style = computed(
  () => `background-color: ${RARITY_TO_COLOR[props.rarity]}`
);

const label = computed(() => {
  if (props.value) {
    return `${props.rarity} - ${props.value.toFixed(2)}%`;
  }
  return props.rarity;
});
</script>
<template>
  <div
    class="inline-block p-1 text-xs font-bold leading-none text-white uppercase rounded "
    :style="style"
  >
    {{ label }}
  </div>
</template>
