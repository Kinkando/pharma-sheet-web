import { Avatar } from '@mui/material';
import Image from 'next/image';
import { useMemo } from 'react';

export type UserAvatarProps = {
  size?: 'small' | 'medium' | 'large';
  imageURL?: string;
};

export function UserAvatar({ size, imageURL }: UserAvatarProps) {
  const imageSize = useMemo(() => {
    switch (size) {
      case 'large':
        return { width: 52, height: 52 };
      case 'small':
        return { width: 24, height: 24 };
    }
    return { width: 36, height: 36 };
  }, [size]);

  if (imageURL) {
    return (
      <Image
        src={imageURL}
        loader={() => imageURL}
        alt="Avatar"
        width={imageSize.width}
        height={imageSize.height}
        unoptimized
        className="rounded-full"
      />
    );
  }
  return <Avatar sx={imageSize} />;
}
