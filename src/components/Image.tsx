import type { ImageSrc } from '../types';

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: ImageSrc;
}

export function Image({ src, ...props }: ImageProps) {
  const url = typeof src === 'string' ? src : src.src;
  return <img src={url} {...props} />;
}
