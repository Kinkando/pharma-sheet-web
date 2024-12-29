import { Avatar } from '@mui/material';
import Image from 'next/image';
import { useMemo } from 'react';

const toSize = (size: number) => {
  return {
    width: size,
    minWidth: size,
    maxWidth: size,
    height: size,
    minHeight: size,
    maxHeight: size,
  };
};

export type UserAvatarProps = {
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  imageURL?: string;
  avatar?: boolean;
  email: string;
};

export function UserAvatar({ size, imageURL, avatar, email }: UserAvatarProps) {
  const imageSize = useMemo(() => {
    switch (size) {
      case 'extra-large':
        return toSize(150);
      case 'large':
        return toSize(52);
      case 'small':
        return toSize(24);
    }
    return toSize(36);
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
        style={{ ...imageSize }}
      />
    );
  } else if (avatar) {
    return <Avatar sx={imageSize} />;
  }
  return (
    <div className="rounded-full bg-blue-400 hover:brightness-90 ease-in duration-200 transition-[--tw-brightness]">
      <div
        className="flex items-center justify-center font-bold text-white"
        style={{ ...imageSize }}
      >
        <span>{email ? email.charAt(0).toUpperCase() : 'G'}</span>
      </div>
    </div>
  );
}
