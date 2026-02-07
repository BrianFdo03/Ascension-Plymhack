import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

const StatCard = ({ title, value, percentage, icon: Icon, trend }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {trend === 'up' ? '↗' : '↘'} {percentage}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
