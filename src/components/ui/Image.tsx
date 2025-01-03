import Img from 'next/image';
import { useMemo, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useScreen } from '@/core/hooks';

const gap = 0.3;

export type ImageProps = React.ComponentProps<typeof Img> & {
  useLoader?: boolean;
  loaderSize?: number;
  responsiveSize?: number;
};

export function Image({
  useLoader,
  loaderSize,
  responsiveSize,
  ...props
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { width } = useScreen();

  if (useLoader && !loaderSize) {
    throw Error('loaderSize and responsiveSize are required');
  }

  const size = useMemo(() => {
    const size = !loaderSize ? undefined : loaderSize - gap * loaderSize;
    if (size && responsiveSize && width < responsiveSize) {
      return { size: size - (responsiveSize - width), responsive: true };
    }
    return { size, responsive: false };
  }, [width, responsiveSize, loaderSize]);

  if (!useLoader) {
    return <Img {...props} />;
  }
  return (
    <>
      {!isLoaded && (
        <div
          className={'bg-gray-700 animate-pulse flex ' + props.className}
          style={{
            ...props.style,
            height:
              size?.responsive && size?.size && loaderSize
                ? size.size + gap * loaderSize
                : props.style?.height,
          }}
        >
          <div className="h-full w-full">
            <div className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className="m-auto"
                style={{ width: size.size, height: size.size }}
              >
                <CircularProgress size={size?.size} />
              </div>
            </div>
          </div>
        </div>
      )}
      <Img
        {...props}
        className={!isLoaded ? 'absolute w-0 h-0 opacity-0' : props.className}
        onLoad={(e) => (!props.onLoad || props.onLoad(e)) && setIsLoaded(true)}
      />
    </>
  );
}
