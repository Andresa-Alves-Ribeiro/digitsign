export interface CardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
} 