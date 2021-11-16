<script setup name="BirdPreview" lang="ts">
import {
  BaseConsolidated,
  NFTConsolidated,
} from 'rmrk-tools/dist/tools/consolidator/consolidator';
import { IBasePart } from 'rmrk-tools/dist/classes/base';

import InlineSvg from './InlineSvg.vue';
import BaseButton from './BaseButton.vue';
import { IResourceConsolidated } from 'rmrk-tools/dist/classes/nft';

const props = defineProps<{
  nfts: NFTConsolidated[];
  bird: NFTConsolidated;
  bases: BaseConsolidated[];
}>();

const resource = computed<IResourceConsolidated>(() =>
  props.bird.resources.find((x) => Boolean(x.base))
);

const base = computed<BaseConsolidated>(() =>
  props.bases.find((x) => x.id === resource.value.base)
);

const theme = computed(() => {
  return base.value.themes![resource.value.themeId!];
});

const baseParts = computed<IBasePart[]>(() =>
  base.value.parts
    ? base.value.parts.filter((part) =>
        (resource.value.parts || []).includes(part.id)
      )
    : []
);

interface IPart {
  z: number;
  src: string;
  id: string;
}

const fixedParts = computed<IPart[]>(() => {
  const parts = baseParts.value.filter((x) => x.type === 'fixed') || [];

  return parts
    .filter((x) => Boolean(x.src))
    .map((x) => ({
      id: x.id,
      z: x.z || 0,
      src: x.src,
    }));
});

const equipedParts = computed<IPart[]>(() => {
  if (!baseParts.value || !props.bird) {
    return [];
  }
  const resourceParts = baseParts.value;
  const children = props.bird.children;

  const equippedChildren = (children || []).map((child) => {
    const nft = props.nfts.find((nft) => nft.id === child.id);
    if (!nft) {
      return null;
    }

    const matchingResource = nft.resources.find(
      (resource) => resource.slot === child.equipped
    );

    return matchingResource;
  });

  const slotParts = (resourceParts || []).map((part) => {
    // Find base slot for each equipped children
    const matchingResource = equippedChildren.find(
      (resource) => resource?.slot && resource.slot.split('.')[1] === part.id
    );

    if (part.type !== 'slot') {
      return null;
    }

    return {
      z: part.z,
      src: matchingResource?.src || part.src,
      id: part.id,
    };
  });

  return slotParts.filter(Boolean);
});

const parts = computed(() => {
  return [...(equipedParts.value || []), ...fixedParts.value]
    .sort((first, second) => first.z - second.z)
    .filter((x) => Boolean(x.src))
    .map((part, i) => ({
      key: `svg-${part.src}-${i}`,
      src: part.src.replace('ipfs://', 'https://rmrk.mypinata.cloud/'),
      style: `z-index: ${part.z};`,
    }));
});

const applyTheme = (code: string) => {
  if (!theme.value) {
    return code;
  }
  const color_1 = (/data-theme_color_1="([^"]+)"/.exec(code) || '')[1];
  const color_2 = (/data-theme_color_2="([^"]+)"/.exec(code) || '')[1];
  const color_3 = (/data-theme_color_3="([^"]+)"/.exec(code) || '')[1];
  const color_4 = (/data-theme_color_4="([^"]+)"/.exec(code) || '')[1];

  return code
    .replace(
      new RegExp(`fill="${color_1}"`, 'g'),
      `fill="${theme.value.theme_color_1}"`
    )
    .replace(
      new RegExp(`fill="${color_2}"`, 'g'),
      `fill="${theme.value.theme_color_2}"`
    )
    .replace(
      new RegExp(`fill="${color_3}"`, 'g'),
      `fill="${theme.value.theme_color_3}"`
    )
    .replace(
      new RegExp(`fill="${color_4}"`, 'g'),
      `fill="${theme.value.theme_color_4}"`
    );
};

const svgRef = ref<SVGElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isLoading = ref(false);

function triggerDownload(imgURI: string) {
  try {
    const elem = window.document.createElement('a');
    elem.href = imgURI;
    elem.download = 'Awesome Kanaria Bird.png';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

const onDownload = () => {
  if (!canvasRef.value) return;
  if (!svgRef.value) return;

  isLoading.value = true;
  var canvas: HTMLCanvasElement = canvasRef.value;
  var ctx = canvas.getContext('2d')!;
  var data = new XMLSerializer().serializeToString(svgRef.value);
  var DOMURL = window.URL || window.webkitURL || window;

  var img = new Image(1080, 1512);
  var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  var url = DOMURL.createObjectURL(svgBlob);

  img.onload = function () {
    canvas.width = 1080;
    canvas.height = 1512;
    ctx.drawImage(this, 0, 0, 1080, 1512);
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
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1080 1512"
      id="bird"
      ref="svgRef"
      class="border-2 border-black rounde-xl"
    >
      <InlineSvg
        v-for="part in parts"
        v-bind="part"
        width="100%"
        height="100%"
        :preProcessor="applyTheme"
      />
    </svg>
    <div class="flex mt-4 space-x-4">
      <BaseButton @click="onDownload" :disabled="isLoading">
        {{ isLoading ? 'Saving...' : 'Download' }}
      </BaseButton>
    </div>
    <canvas
      ref="canvasRef"
      class="fixed top-[-9999px] left-0 w-[1080px] h-[1512px]"
    ></canvas>
  </div>
</template>
