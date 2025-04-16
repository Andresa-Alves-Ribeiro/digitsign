import Image from 'next/image';
import background from '@/assets/images/back.jpeg';

export function AuthBackground(): JSX.Element {
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
    </div>
  );
} 