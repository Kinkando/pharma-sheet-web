import { Avatar } from '@mui/material';
import Image from 'next/image';
import { useMemo } from 'react';

export type UserAvatarProps = {
  size?: 'small' | 'medium' | 'large';
  imageURL?: string;
  avatar?: boolean;
  email: string;
};

export function UserAvatar({ size, imageURL, avatar, email }: UserAvatarProps) {
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
