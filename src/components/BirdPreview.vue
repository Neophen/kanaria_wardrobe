<script setup name="BirdPreview">
import InlineSvg from './InlineSvg.vue';

const props = defineProps({
  bird: {
    type: Array,
    required: true,
  },
});

const parts = computed(() =>
  props.bird
    .filter((x) => Boolean(x.src))
    .map((part, i) => ({
      key: `svg-${part.src}-${i}`,
      src: part.src.replace('ipfs://', 'https://rmrk.mypinata.cloud/'),
      style: `z-index: ${part.z};`,
    }))
);

const svgRef = ref(null);
const canvasRef = ref(null);
const isLoading = ref(false);

function triggerDownload(imgURI) {
  var evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true,
  });

  var a = document.createElement('a');
  a.setAttribute('download', 'MY_COOL_IMAGE.png');
  a.setAttribute('href', imgURI);
  a.setAttribute('target', '_blank');

  a.dispatchEvent(evt);
  isLoading.value = false;
}

const onDownload = () => {
  isLoading.value = true;
  var canvas = canvasRef.value;
  var ctx = canvas.getContext('2d');
  var data = new XMLSerializer().serializeToString(svgRef.value);
  var DOMURL = window.URL || window.webkitURL || window;

  var img = new Image(1080, 1512);
  var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  var url = DOMURL.createObjectURL(svgBlob);

  img.onload = function () {
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0, this.width, this.height);
    DOMURL.revokeObjectURL(url);

    var imgURI = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    triggerDownload(imgURI);
  };

  img.src = url;
};
</script>
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 1080 1512"
    id="bird"
    ref="svgRef"
    class="border-2 border-black rounde-xl"
  >
    <InlineSvg v-for="part in parts" v-bind="part" width="100%" height="100%" />
  </svg>
  <button
    type="button"
    @click="onDownload"
    class="px-4 py-2 mt-4 bg-white border border-black rounded hover:bg-indigo-100"
    :disabled="isLoading"
  >
    {{ isLoading ? 'Saving...' : 'Download' }}
  </button>
  <canvas
    ref="canvasRef"
    class="fixed top-[-1512px] left-0 w-[1080px] h-[1512px]"
  ></canvas>
</template>
