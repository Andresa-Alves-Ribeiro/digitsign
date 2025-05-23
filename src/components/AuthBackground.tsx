import Image from 'next/image';
import background from '@/assets/images/back.jpeg';
import { FC } from 'react';

export const AuthBackground: FC = (): JSX.Element => {
  return (
    <div className="hidden lg:block lg:w-1/2 bg-neutral-100 relative overflow-hidden">
      <Image
        src={background}
        alt="Background"
        fill
        sizes="50vw"
        className="object-cover transform scale-105 transition-transform duration-1000 hover:scale-110"
        priority
        quality={100}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/95 backdrop-blur-[1px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_100%)]"></div>
    </div>
  );
}; 