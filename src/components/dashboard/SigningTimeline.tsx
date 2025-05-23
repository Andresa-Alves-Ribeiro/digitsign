import { ChartBarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Document } from '@/types/interfaces';
import { DocumentStatus } from '@prisma/client';
import { motion } from 'framer-motion';
import { FC, useState } from 'react';

interface SigningTimelineProps {
  documents: Document[];
}

interface DayCount {
  date: Date;
  count: number;
}

const SigningTimeline: FC<SigningTimelineProps> = ({ documents }): JSX.Element => {
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  const getLast7Days = (): Date[] => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const getSignedDocumentsByDay = (): DayCount[] => {
    const days = getLast7Days();
    return days.map(date => {
      const dayDocuments = documents.filter(doc => {
        const docDate = new Date(doc.updatedAt);
        return (
          doc.status === DocumentStatus.SIGNED &&
          docDate.toDateString() === date.toDateString()
        );
      });
      return {
        date,
        count: dayDocuments.length
      };
    });
  };

  const signedByDay = getSignedDocumentsByDay();
  const maxCount = Math.max(...signedByDay.map(day => day.count), 1);
  const totalSigned = signedByDay.reduce((sum, day) => sum + day.count, 0);
  const averagePerDay = totalSigned / 7;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const barVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: (i: number) => ({
      height: '100%',
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: 'easeOut'
      }
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  const legendVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-component-bg-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-neutral-700 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-text-dark">Timeline de Assinaturas</h3>
          <motion.button
            className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLegend(!showLegend)}
          >
            <InformationCircleIcon className="w-5 h-5 text-slate-400 dark:text-neutral-500" />
          </motion.button>
        </div>
        <motion.div 
          className="p-2 rounded-full bg-teal-50 dark:bg-green-900/30"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <ChartBarIcon className="w-5 h-5 text-teal-600 dark:text-green-400" />
        </motion.div>
      </motion.div>

      <motion.div 
        className="space-y-4"
        variants={itemVariants}
      >
        {showLegend && (
          <motion.div 
            className="bg-neutral-50/50 dark:bg-neutral-800/50 p-3 rounded-lg text-sm text-slate-600 dark:text-neutral-400 mb-4"
            variants={legendVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-teal-600 to-teal-400"></div>
              <span className="font-medium">Documentos assinados nos últimos 7 dias</span>
            </div>
            <div className="text-xs">
              <p>Total: <span className="font-semibold">{totalSigned}</span> documentos</p>
              <p>Média: <span className="font-semibold">{averagePerDay.toFixed(1)}</span> documentos por dia</p>
            </div>
          </motion.div>
        )}

        {documents.length > 0 ? (
          <div className="h-48 relative pl-8">
            {/* Y-axis labels - Moved outside the chart area */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-2 text-xs text-slate-400">
              {[maxCount, Math.round(maxCount * 0.75), Math.round(maxCount * 0.5), Math.round(maxCount * 0.25), 0].map((value, i) => (
                <span key={i}>{value}</span>
              ))}
            </div>
            
            {/* Chart container with overflow hidden */}
            <div className="relative h-full overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-between px-2 pb-6">
                {signedByDay.map((day, index) => {
                  const height = day.count > 0 ? `${(day.count / maxCount) * 100}%` : '0%';
                  const isActive = activeBar === index;
                  const formattedDate = day.date.toLocaleDateString('pt-BR', { 
                    weekday: 'short', 
                    day: '2-digit', 
                    month: 'short' 
                  });
                  
                  return (
                    <div key={day.date.toISOString()} className="flex flex-col items-center w-full">
                      <motion.div
                        className="w-full max-w-[40px] rounded-t-md relative cursor-pointer"
                        custom={index}
                        variants={barVariants}
                        whileHover="hover"
                        onHoverStart={() => setActiveBar(index)}
                        onHoverEnd={() => setActiveBar(null)}
                        style={{ 
                          height: height,
                          background: isActive 
                            ? 'linear-gradient(to top, #0f766e, #14b8a6)' 
                            : 'linear-gradient(to top, #14b8a6, #2dd4bf)',
                          boxShadow: isActive
                            ? '0 8px 12px -1px rgba(20, 184, 166, 0.3), 0 4px 6px -1px rgba(20, 184, 166, 0.2)'
                            : '0 4px 6px -1px rgba(20, 184, 166, 0.2), 0 2px 4px -1px rgba(20, 184, 166, 0.1)'
                        }}
                      >
                        {day.count > 0 && (
                          <motion.div
                            className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-1.5 py-0.5 rounded-full shadow-sm text-xs font-medium text-slate-800"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            {day.count}
                          </motion.div>
                        )}
                        
                        {isActive && (
                          <motion.div
                            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap z-10"
                            variants={tooltipVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <div className='font-bold'>{day.count} documento{day.count !== 1 ? 's' : ''}</div>
                            <div className='text-slate-300'>{formattedDate}</div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></div>
                          </motion.div>
                        )}
                      </motion.div>
                      <motion.span 
                        className="text-xs text-slate-500 mt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {day.date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </motion.span>
                    </div>
                  );
                })}
              </div>
              
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between px-2 pb-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full border-t border-slate-100" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            className="text-center py-6"
            variants={itemVariants}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              <ChartBarIcon className="w-12 h-12 text-slate-300 dark:text-neutral-600 mx-auto mb-2" />
            </motion.div>
            <p className="text-slate-500 dark:text-neutral-400">Nenhum documento encontrado</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SigningTimeline; 