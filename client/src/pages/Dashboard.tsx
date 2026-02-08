import { useState } from 'react';
import Layout from "../components/layout/Layout";
import DashboardStats from "../components/dashboard/DashboardStats";
import RevenueCharts from "../components/dashboard/RevenueCharts";
import { Button } from "../components/common/Button";
import HighRevenueRoutes from '../components/dashboard/highRevenueRoutes';

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // @ts-ignore - handleRefresh reserved for future use
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Layout
      title="Dashboard Overview"
      action={
        <Button asChild>
          <a
            href="https://docs.google.com/spreadsheets/d/1kLs8Gc7RP-zruKhptf0rkTNszhnlrdzbZ46lQApEeEU/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            See Messages
          </a>
        </Button>
      }
    >
      <DashboardStats refreshKey={refreshKey} />
      <HighRevenueRoutes />
      <RevenueCharts />
    </Layout>
  );
};

export default Dashboard;
