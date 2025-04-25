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
  percentageColor = 'text-primary',
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
    whileTap: { scale: 0.98 },
    className: 'bg-component-bg-light dark:bg-component-bg-dark overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 h-full'
  } : {
    className: 'bg-component-bg-light dark:bg-component-bg-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full'
  };

  return (
    <CardWrapper {...wrapperProps}>
      <div className={`${isActionCard ? 'p-6' : ''} flex flex-col h-full`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">{title}</h3>
          <motion.div 
            className={`p-2 rounded-full ${iconColor.replace('text-', 'bg-').replace('-500', '-100')}`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </motion.div>
        </div>

        <div className="flex-grow">
          <div className="flex items-baseline gap-2">
            <motion.p 
              className={`text-4xl font-bold ${valueColor} dark:${valueColor.replace('600', '400')}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {value}
            </motion.p>
            {percentage > 0 && (
              <motion.span 
                className={`text-sm ${percentageColor} flex items-center`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {percentage > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                {Math.abs(percentage)}%
              </motion.span>
            )}
          </div>
        </div>

        {buttonText && href && (
          <div className="mt-auto pt-6">
            {description && (
              <motion.p 
                className="text-sm text-text-light/70 dark:text-text-dark/70 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {description}
              </motion.p>
            )}

            <Link href={href}>
              <motion.div
                className={`inline-flex items-center justify-center w-fit px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white ${buttonColor} ${buttonHoverColor} transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4 mr-2" />
                {buttonText}
              </motion.div>
            </Link>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default StatCard; 