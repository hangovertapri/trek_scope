import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

const imageMap = new Map(placeholderImages.map(img => [img.id, img]));

const defaultImage: ImagePlaceholder = {
  id: 'default-trek',
  description: 'A scenic mountain trail',
  imageUrl: 'https://picsum.photos/seed/defaultTrek/600/400',
  imageHint: 'mountain trail'
};

export function findImage(id: string): ImagePlaceholder {
  return imageMap.get(id) || defaultImage;
}
