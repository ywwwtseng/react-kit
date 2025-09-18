import { useEffect, useRef } from 'react';

export function Canvas({
  image,
  size = 40,
  ...props
}: {
  image: HTMLImageElement;
  size?: number;
} & React.CanvasHTMLAttributes<HTMLCanvasElement>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(image, 0, 0, size, size);
        }
      }
    }
  }, [image, size]);

  return <canvas ref={canvasRef} {...props} width={size} height={size} />;
}
