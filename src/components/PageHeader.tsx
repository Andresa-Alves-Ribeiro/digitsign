import NewDocumentButton from './NewDocumentButton';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: ReactNode;
  showNewDocumentButton?: boolean;
}

export default function PageHeader({ title, description, showNewDocumentButton = true }: PageHeaderProps): JSX.Element {
  return (
    <div className="w-full bg-component-bg-light dark:bg-component-bg-dark p-8 md:p-10 rounded-md shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-medium text-text-light dark:text-text-dark tracking-tight">
            {title}
          </h2>

          <div className="text-sm md:text-base text-text-light/70 dark:text-text-dark/70 font-normal leading-relaxed">
            {description}
          </div>
        </div>

        {showNewDocumentButton && (
          <div className="w-full md:w-auto">
            <NewDocumentButton />
          </div>
        )}
      </div>
    </div>
  );
} 