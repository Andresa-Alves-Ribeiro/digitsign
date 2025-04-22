import { ChartBarIcon } from '@heroicons/react/24/outline';
import { Document } from '@/types/interfaces';
import { DocumentStatus } from '@/types/enums/document';
import { motion } from 'framer-motion';
import { FC } from 'react';

interface SigningTimelineProps {
  documents: Document[];
}

interface DayCount {
  date: Date;
  count: number;
}

const SigningTimeline: FC<SigningTimelineProps> = ({ documents }): JSX.Element => {
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

  const getX = (index: number): number => {
    const width = 100;
    const padding = 10;
    const availableWidth = width - (padding * 2);
    return padding + (index * availableWidth / (signedByDay.length - 1));
  };

  const getY = (count: number): number => {
    const height = 100;
    const padding = 20;
    const availableHeight = height - (padding * 2);
    return height - padding - (count / maxCount * availableHeight);
  };

  const points = signedByDay.map((day, index) => {
    const x = getX(index);
    const y = getY(day.count);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = [
    `${getX(0)},${getY(0)}`,
    ...signedByDay.map((day, index) => `${getX(index)},${getY(day.count)}`),
    `${getX(signedByDay.length - 1)},100`,
    `${getX(0)},100`,
    'Z'
  ].join(' ');

  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const y = 20 + (i * 20);
    gridLines.push(
      <line 
        key={`grid-${i}`} 
        x1="10" 
        y1={y} 
        x2="90" 
        y2={y} 
        stroke="rgba(0,0,0,0.05)" 
        strokeDasharray="2,2" 
      />
    );
  }

  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Timeline de Assinaturas</h3>
        <div className="p-2 rounded-full bg-green-50">
          <ChartBarIcon className="w-5 h-5 text-green-500" />
        </div>
      </div>
      <div className="space-y-4">
        {documents.length > 0 ? (
          <div className="h-48 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(52, 211, 153, 0.25)" />
                  <stop offset="100%" stopColor="rgba(52, 211, 153, 0.05)" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {gridLines}
              
              <path 
                d={`M ${areaPoints}`} 
                fill="url(#areaGradient)" 
                stroke="none" 
              />
              
              <polyline
                points={points}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
              
              {signedByDay.map((day, index) => (
                <motion.circle
                  key={day.date.toISOString()}
                  cx={getX(index)}
                  cy={getY(day.count)}
                  r="3.5"
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="1.5"
                  initial={{ r: 0 }}
                  animate={{ r: 3.5 }}
                  transition={{ delay: index * 0.1 }}
                  filter="url(#glow)"
                />
              ))}
            </svg>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
              {signedByDay.map(day => (
                <span key={day.date.toISOString()} className="text-xs text-gray-500">
                  {day.date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </span>
              ))}
            </div>
            
            <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
              {signedByDay.map(day => (
                <motion.span 
                  key={day.date.toISOString()} 
                  className="text-xs font-medium text-gray-900 bg-white px-1.5 py-0.5 rounded-full shadow-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {day.count > 0 ? day.count : ''}
                </motion.span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <ChartBarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Nenhum documento encontrado</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SigningTimeline; 