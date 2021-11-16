<script setup name="SelectFile" lang="ts">
import {
  BaseConsolidated,
  NFTConsolidated,
} from 'rmrk-tools/dist/tools/consolidator/consolidator';

interface Payload {
  nfts: NFTConsolidated[];
  bases: BaseConsolidated[];
}

const emit = defineEmits<{
  (event: 'change', payload: Payload): void;
}>();

const parsingFile = ref(false);

const receivedText = (e: ProgressEvent<FileReader>) => {
  if (!e.target) return;
  const result = JSON.parse(e.target.result as string);
  emit('change', result);
};

const onFileChange = (event: Event) => {
  parsingFile.value = true;
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const file = target.files[0];
  const fr = new FileReader();
  fr.onload = receivedText;
  fr.readAsText(file);
};

onBeforeUnmount(() => {
  parsingFile.value = false;
});
</script>
<template>
  <div class="p-8 space-y-4 bg-white rounded-md shadow">
    <p v-if="parsingFile" class="text-xl font-bold text-gray-400">Wait a momment while we parse your file...</p>
    <template v-else>
      <a
        class="block px-4 py-2 font-bold bg-white border border-pink-500 rounded-md hover:bg-pink-500 hover:text-white"
        href="https://gateway.pinata.cloud/ipns/precon-rmrk2.rmrk.link"
        target="_blank"
        download="latest-rmrk2.json"
      >
        Download the latest version of the RMRK2.
      </a>
      <p>
        If the above link opens in a new tab and doesn't start downloading,
        right click on the link and choose "Save link as"
      </p>
      <p>Select the downloaded file</p>
      <input
        type="file"
        @change="onFileChange"
        accept="application/json, .link"
      />
    </template>
  </div>
</template>
