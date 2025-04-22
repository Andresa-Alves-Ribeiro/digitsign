import NewDocumentButton from '@/components/features/NewDocumentButton';
import { Session } from 'next-auth';

interface PageHeaderProps {
  session?: Session | null;
  title: string;
  description: string;
}

export default function PageHeader({ session, title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 mb-4 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl shadow-sm border border-green-100">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {title}
          </h1>

          <p className="text-md text-gray-500 font-medium">
            {description}
          </p>
        </div>

        <NewDocumentButton />
      </div>
    </div>
  );
} 