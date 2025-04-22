import NewDocumentButton from '@/components/NewDocumentButton';
import { Session } from 'next-auth';

interface PageHeaderProps {
  session?: Session | null;
  title: string;
  description: string;
}

export default function PageHeader({ session, title, description }: PageHeaderProps) {
  return (
    <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 p-6 md:p-8 rounded-2xl shadow-md border border-green-100 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h2 className="text-4xl max-md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
            {title}
          </h2>

          <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div className="w-full md:w-auto">
          <NewDocumentButton />
        </div>
      </div>
    </div>
  );
} 