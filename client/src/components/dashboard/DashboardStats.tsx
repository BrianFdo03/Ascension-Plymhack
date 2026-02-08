import { Bus, Route, BadgeDollarSign } from "lucide-react";
import StatCard from "./StatCard";

// Accepting refreshKey even if not used yet, to match user's snippet
interface DashboardStatsProps {
  refreshKey?: number;
}

// @ts-ignore - refreshKey reserved for future use
const DashboardStats = ({ refreshKey }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Active Buses"
        value="19"
        percentage="20.1%"
        icon={Bus}
        trend="up"
      />
      <StatCard
        title="Total Buses"
        value="37"
        percentage="15.2%"
        icon={Bus}
        trend="up"
      />
      <StatCard
        title="Total Routes"
        value="12"
        percentage="12.5%"
        icon={Route}
        trend="up"
      />
      <StatCard
        title="Total Revenue"
        value="LKR 18,000"
        percentage="4.5%"
        icon={BadgeDollarSign}
        trend="up"
      />
    </div>
  );
};

export default DashboardStats;
