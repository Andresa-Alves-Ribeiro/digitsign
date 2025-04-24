import Image from 'next/image';
import background from '@/assets/images/back.jpeg';
import { FC } from 'react';

export const AuthBackground: FC = (): JSX.Element => {
  return (
    <div className="hidden lg:block lg:w-1/2 bg-gray-800 relative">
      <Image
        src={background}
        alt="Background"
        fill
        sizes="50vw"
        className="object-cover opacity-50"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-70"></div>
    </div>
  );
}; 