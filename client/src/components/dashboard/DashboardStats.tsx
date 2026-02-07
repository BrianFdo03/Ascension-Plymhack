import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
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
          title="Total Revenue"
          value="$45,231.89"
          percentage="20.1%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Total Orders"
          value="2,345"
          percentage="15.2%"
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Total Customers"
          value="1,234"
          percentage="12.5%"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Total Products"
          value="48"
          percentage="4.5%"
          icon={Package}
          trend="up"
        />
    </div>
  );
};

export default DashboardStats;
