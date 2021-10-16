export const KANARIA_ITEMS_COLLECTIONS_IDS = {
  background: ['e0b9bdcc456a36497a-KANBG'],
  foreground: ['e0b9bdcc456a36497a-KANFRNT'],
  headwear: ['e0b9bdcc456a36497a-KANHEAD', '9cba890074545f2e7c-KANPRTN'],
  handheld: ['e0b9bdcc456a36497a-KANHAND'],
  necklace: ['e0b9bdcc456a36497a-KANCHEST'],
  backpack: ['e0b9bdcc456a36497a-KANBACK'],
};

export const birdSlots = [
  {
    id: 'background',
    img: '/background_slot.svg',
    collection: 'background',
    label: 'Background',
  },
  {
    id: 'foreground',
    img: '/foreground_slot.svg',
    collection: 'foreground',
    label: 'Foreground',
  },
  {
    id: 'headwear',
    img: '/headwear_slot.svg',
    collection: 'headwear',
    label: 'Headwear',
  },
  {
    id: 'objectleft',
    img: '/objectleft_slot.svg',
    collection: 'handheld',
    label: 'Hand left',
  },
  {
    id: 'objectright',
    img: '/objectright_slot.svg',
    collection: 'handheld',
    label: 'Hand Right',
  },
  {
    id: 'necklace',
    img: '/necklace_slot.svg',
    collection: 'necklace',
    label: 'Necklace',
  },
  {
    id: 'backpack',
    img: '/backpack_slot.svg',
    collection: 'backpack',
    label: 'Backpack',
  },
];

export const getUniqueItems = (key, nfts) => {
  const ids = KANARIA_ITEMS_COLLECTIONS_IDS[key];
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
      resources: item.resources
        .filter((resource) => Boolean(resource.thumb))
        .map((resource) => ({
          ...resource,
          src: resource.src.replace('ipfs://', 'https://rmrk.mypinata.cloud/'),
          thumb: resource.thumb.replace(
            'ipfs://',
            'https://rmrk.mypinata.cloud/'
          ),
        })),
    }));
};
