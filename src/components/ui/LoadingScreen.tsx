import { Backdrop, CircularProgress } from '@mui/material';

export type LoadingScreenProps = {
  isLoading: boolean;
};

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: () => 9000 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
