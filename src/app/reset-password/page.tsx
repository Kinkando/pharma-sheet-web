'use client';

import { useContext } from 'react';
import { Image } from '@/components/ui';
import { GlobalContext } from '@/core/context';
import ResetPasswordCard from '@/modules/reset-password/components/ResetPasswordCard';

export default function ResetPasswordPage() {
  const { user } = useContext(GlobalContext);
  if (user) {
    return <></>;
  }
  return (
    <div className="bg-blue-400 flex flex-col-reverse lg:flex-row h-screen w-screen overflow-auto">
      <section className="flex h-full w-full items-center justify-center p-4">
        <ResetPasswordCard />
      </section>

      <section className="bg-blue-500 w-full h-full rounded-b-[36px] lg:rounded-s-[36px] hidden lg:flex lg:justify-center lg:items-center">
        <section className="p-4 flex flex-col items-center justify-center gap-7 lg:gap-10">
          <Image
            src="/images/banner.png"
            alt="Sign In Logo"
            width={600}
            height={230}
            objectFit="cover"
            priority
            unoptimized
          />
        </section>
      </section>
    </div>
  );
}
