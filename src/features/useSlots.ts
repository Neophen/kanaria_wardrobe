import { NFTConsolidated } from 'rmrk-tools/dist/tools/consolidator/consolidator';

export interface SlotIds {
  background: string[];
  foreground: string[];
  headwear: string[];
  handheld: string[];
  necklace: string[];
  backpack: string[];
}

export const ID_TO_COLLECTIONS: SlotIds = {
  background: ['e0b9bdcc456a36497a-KANBG'],
  foreground: ['e0b9bdcc456a36497a-KANFRNT'],
  headwear: ['e0b9bdcc456a36497a-KANHEAD', '9cba890074545f2e7c-KANPRTN'],
  handheld: ['e0b9bdcc456a36497a-KANHAND'],
  necklace: ['e0b9bdcc456a36497a-KANCHEST'],
  backpack: ['e0b9bdcc456a36497a-KANBACK'],
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

export const getUniqueItems = (key: keyof SlotIds, nfts: NFTConsolidated[]) => {
  const ids = ID_TO_COLLECTIONS[key];
  const items = nfts.filter((nft) => {
    return ids.includes(nft.collection);
  });

  const uniqueItems = [
    ...new Map(items.map((item) => [item.symbol, item])).values(),
  ];

  return uniqueItems
    .filter((item) => !item.burned)
    .map((item) => ({
      ...item,
      resources: item.resources.map((resource) => ({
        ...resource,
        src: resource.src?.replace('ipfs://', 'https://rmrk.mypinata.cloud/'),
        thumb: resource.thumb?.replace(
          'ipfs://',
          'https://rmrk.mypinata.cloud/'
        ),
      })),
    }));
};
