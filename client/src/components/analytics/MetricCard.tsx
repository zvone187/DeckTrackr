import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, icon: Icon, description, trend }: MetricCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-2 border-emerald-200/60 dark:border-emerald-800/60 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/40 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-green-950/40">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{title}</p>
            <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{value}</p>
            {description && (
              <p className="text-xs text-emerald-600 dark:text-emerald-500">{description}</p>
            )}
            {trend && (
              <p className={`text-xs font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}