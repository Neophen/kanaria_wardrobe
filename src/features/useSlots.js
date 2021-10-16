export const KANARIA_ITEMS_COLLECTIONS_IDS = {
  background: 'e0b9bdcc456a36497a-KANBG',
  foreground: 'e0b9bdcc456a36497a-KANFRNT',
  headwear: 'e0b9bdcc456a36497a-KANHEAD',
  handheld: 'e0b9bdcc456a36497a-KANHAND',
  necklace: 'e0b9bdcc456a36497a-KANCHEST',
  backpack: 'e0b9bdcc456a36497a-KANBACK',
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
  const id = KANARIA_ITEMS_COLLECTIONS_IDS[key];
  const items = nfts.filter((nft) => {
    return nft.collection === id;
  });

  const uniqueItems = [
    ...new Map(items.map((item) => [item.resources[0].src, item])).values(),
  ];

  return uniqueItems.map((item) => ({
    ...item,
    resources: item.resources.map((resource) => ({
      ...resource,
      src: resource.src.replace('ipfs://', 'https://rmrk.mypinata.cloud/'),
      thumb: resource.thumb.replace('ipfs://', 'https://rmrk.mypinata.cloud/'),
    })),
  }));
};
