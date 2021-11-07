import { IResourceConsolidated } from 'rmrk-tools/dist/classes/nft';
import { NFTConsolidated } from 'rmrk-tools/dist/tools/consolidator/consolidator';

export interface SlotIds {
  background: string[];
  foreground: string[];
  headwear: string[];
  handheld: string[];
  necklace: string[];
  backpack: string[];
}

const MIXED_COLLECTIONS = [
  'e0b9bdcc456a36497a-KANCHAMP',
  'e0b9bdcc456a36497a-EVNTS',
  '9cba890074545f2e7c-KANPRTN',
];

export const ID_TO_COLLECTIONS: SlotIds = {
  background: ['e0b9bdcc456a36497a-KANBG', ...MIXED_COLLECTIONS],
  foreground: ['e0b9bdcc456a36497a-KANFRNT', ...MIXED_COLLECTIONS],
  headwear: ['e0b9bdcc456a36497a-KANHEAD', ...MIXED_COLLECTIONS],
  handheld: ['e0b9bdcc456a36497a-KANHAND', ...MIXED_COLLECTIONS],
  necklace: ['e0b9bdcc456a36497a-KANCHEST', ...MIXED_COLLECTIONS],
  backpack: ['e0b9bdcc456a36497a-KANBACK', ...MIXED_COLLECTIONS],
};

export enum SlotType {
  background = 'background',
  foreground = 'foreground',
  headwear = 'headwear',
  objectleft = 'objectleft',
  objectright = 'objectright',
  necklace = 'necklace',
  backpack = 'backpack',
}

export interface BirdSlot {
  id: SlotType;
  img: string;
  collection: string;
  name: string;
}

export const birdSlots: BirdSlot[] = [
  {
    id: SlotType.background,
    img: '/background_slot.svg',
    collection: 'background',
    name: 'Background',
  },
  {
    id: SlotType.foreground,
    img: '/foreground_slot.svg',
    collection: 'foreground',
    name: 'Foreground',
  },
  {
    id: SlotType.headwear,
    img: '/headwear_slot.svg',
    collection: 'headwear',
    name: 'Headwear',
  },
  {
    id: SlotType.objectleft,
    img: '/objectleft_slot.svg',
    collection: 'handheld',
    name: 'Hand left',
  },
  {
    id: SlotType.objectright,
    img: '/objectright_slot.svg',
    collection: 'handheld',
    name: 'Hand Right',
  },
  {
    id: SlotType.necklace,
    img: '/necklace_slot.svg',
    collection: 'necklace',
    name: 'Necklace',
  },
  {
    id: SlotType.backpack,
    img: '/backpack_slot.svg',
    collection: 'backpack',
    name: 'Backpack',
  },
];

const belongsToSlot =
  (slots: string[]) => (resource: IResourceConsolidated) => {
    const key = resource.slot?.split('.')[1] || '';
    return slots.includes(key);
  };

export const getUniqueItems = (key: keyof SlotIds, nfts: NFTConsolidated[]) => {
  const ids = ID_TO_COLLECTIONS[key];
  const slots = key === 'handheld' ? ['objectleft', 'objectright'] : [key];
  const inSlot = belongsToSlot(slots);
  const items = nfts.filter((nft) => {
    return ids.includes(nft.collection);
  });

  const uniqueItems = [
    ...new Map(items.map((item) => [item.symbol, item])).values(),
  ];

  return uniqueItems
    .filter((item) => !item.burned && item.resources.some(inSlot))
    .map((item) => ({
      ...item,
      resources: item.resources.filter(inSlot).map((resource) => ({
        ...resource,
        src: resource.src?.replace('ipfs://', 'https://rmrk.mypinata.cloud/'),
        thumb: resource.thumb?.replace(
          'ipfs://',
          'https://rmrk.mypinata.cloud/'
        ),
      })),
    }));
};
