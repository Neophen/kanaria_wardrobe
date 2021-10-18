<script setup name="PaginationButton" lang="ts">
defineProps<{
  isActive: boolean;
}>();

const emit = defineEmits<{
  (event: 'click'): void;
}>();
</script>
<template>
  <button
    type="button"
    @click="emit('click')"
    class="relative z-10 flex items-center justify-center w-8 h-8 text-sm font-medium border rounded-full "
    :class="{
      'text-indigo-600 border-indigo-500  bg-indigo-50': isActive,
      'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 ': !isActive,
    }"
  >
    <slot />
  </button>
</template>
