<script setup name="BaseButton" lang="ts">
const emit = defineEmits<{
  (event: 'click'): void;
}>();
</script>
<template>
  <button
    type="button"
    @click="emit('click')"
    class="block px-4 py-2 text-base leading-tight bg-white border border-pink-500 rounded-xl hover:bg-pink-500 hover:text-white"
  >
    <slot />
  </button>
</template>
