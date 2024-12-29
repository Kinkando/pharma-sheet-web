import { CircularProgress } from '@mui/material';

export type LoadingCircularProps = {
  isLoading: boolean;
  backdrop?: boolean;
  blur?: boolean;
};

export function LoadingCircular({
  isLoading,
  backdrop,
  blur,
}: LoadingCircularProps) {
  if (!isLoading) return null;
  return (
    <div
      className={
        'absolute w-full h-full z-[9000]' +
        (backdrop ? ' bg-black bg-opacity-25' : '') +
        (blur ? ' backdrop-filter backdrop-blur-sm' : '')
      }
    >
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress color="info" />
      </div>
    </div>
  );
}
