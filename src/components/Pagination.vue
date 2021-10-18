<script setup name="Pagination" lang="ts">
import PaginationPrevButton from './PaginationPrevButton.vue';
import PaginationButton from './PaginationButton.vue';
import PaginationNextButton from './PaginationNextButton.vue';

const props = defineProps<{
  pages: number;
  currentPage: number;
}>();

const emit = defineEmits<{
  (event: 'select', page: number): void;
}>();

const onSelectPage = (page: number) => {
  if (page < 0) {
    emit('select', 0);
    return;
  }
  if (page >= props.pages) {
    emit('select', props.pages - 1);
    return;
  }
  emit('select', page);
};
</script>
<template>
  <nav
    class="flex items-center justify-center space-x-2"
    aria-label="Pagination"
  >
    <PaginationPrevButton @click="onSelectPage(currentPage - 1)" />

    <PaginationButton
      v-for="page in pages"
      :key="page"
      @click="onSelectPage(page - 1)"
      :is-active="page - 1 === currentPage"
    >
      {{ page }}
    </PaginationButton>

    <PaginationNextButton @click="onSelectPage(currentPage + 1)" />
  </nav>
</template>
