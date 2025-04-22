import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { ElementType, FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value?: number;
  total?: number;
  icon: ElementType;
  iconColor: string;
  valueColor?: string;
  percentageColor?: string;
  description?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  buttonText?: string;
  href?: string;
  isActionCard?: boolean;
}

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  total,
  icon: Icon,
  iconColor,
  valueColor = 'text-gray-900',
  percentageColor = 'text-green-500',
  description,
  buttonColor = 'bg-blue-600',
  buttonHoverColor = 'hover:bg-blue-700',
  buttonText,
  href,
  isActionCard = false,
}): JSX.Element => {
  const percentage = total && value ? Math.round((value / total) * 100) : 0;

  const CardWrapper = isActionCard ? motion.div : 'div';
  const wrapperProps = isActionCard ? {
    whileHover: { scale: 1.02 },
    className: 'bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 h-full'
  } : {
    className: 'bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full'
  };

  return (
    <CardWrapper {...wrapperProps}>
      <div className={`${isActionCard ? 'p-6' : ''} flex flex-col h-full`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <div className={`p-2 rounded-full ${iconColor.replace('text-', 'bg-').replace('-500', '-100')}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex items-baseline gap-2">
            <p className={`text-4xl font-bold ${valueColor}`}>{value}</p>
            {percentage > 0 && (
              <span className={`text-sm ${percentageColor} flex items-center`}>
                {percentage > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                {Math.abs(percentage)}%
              </span>
            )}
          </div>
        </div>

        {href && buttonText && (
          <div className="mt-auto pt-6">
            {description && (
              <p className="text-sm text-gray-500 mb-2">{description}</p>
            )}

            <Link
              href={href}
              className={`inline-flex items-center justify-center w-fit px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white ${buttonColor} ${buttonHoverColor} transition-colors duration-200`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default StatCard; 