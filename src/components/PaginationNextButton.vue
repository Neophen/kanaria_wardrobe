<script setup name="PaginationNextButton" lang="ts">
import PaginationButton from './PaginationButton.vue';
const emit = defineEmits<{
  (event: 'click'): void;
}>();
</script>
<template>
  <PaginationButton :is-active="false" @click="emit('click')">
    <span class="sr-only">Next</span>
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
  </PaginationButton>
</template>
