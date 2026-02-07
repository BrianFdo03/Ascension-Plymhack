

interface Order {
  id: string;
  customer: string;
  product: string;
  date: string;
  amount: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

const recentOrders: Order[] = [
  {
    id: "#ORD-7352",
    customer: "Sarah Mitchell",
    product: "Hydrating Serum",
    date: "2 mins ago",
    amount: "$45.00",
    status: "Processing",
  },
  {
    id: "#ORD-7351",
    customer: "Michael Chen",
    product: "Daily Moisturizer",
    date: "15 mins ago",
    amount: "$32.00",
    status: "Shipped",
  },
  {
    id: "#ORD-7350",
    customer: "Emma Wilson",
    product: "Gentle Cleanser",
    date: "1 hour ago",
    amount: "$28.00",
    status: "Delivered",
  },
  {
    id: "#ORD-7349",
    customer: "James Rodriguez",
    product: "Sun Defense SPF",
    date: "3 hours ago",
    amount: "$38.00",
    status: "Processing",
  },
  {
    id: "#ORD-7348",
    customer: "Lisa Thompson",
    product: "Night Cream",
    date: "5 hours ago",
    amount: "$55.00",
    status: "Cancelled",
  },
];

const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const styles = {
    Processing: "bg-blue-100 text-blue-600",
    Shipped: "bg-purple-100 text-purple-600",
    Delivered: "bg-green-100 text-green-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

// @ts-ignore - refreshKey reserved for future use
const RecentOrders = ({ refreshKey }: { refreshKey?: number }) => {
  return (
    <div className="bg-[#F8F9FA] rounded-xl shadow-sm border border-gray-100/50 mt-8 overflow-hidden">
      <div className="p-6 border-b border-gray-200/50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
        <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#EAECEF] text-gray-600 text-sm font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-6">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Product</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4 pr-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 pl-6 font-medium text-gray-900">{order.id}</td>
                <td className="p-4 text-gray-600">{order.customer}</td>
                <td className="p-4 text-gray-600">{order.product}</td>
                <td className="p-4 text-gray-500 text-sm">{order.date}</td>
                <td className="p-4 font-semibold text-gray-900">{order.amount}</td>
                <td className="p-4 pr-6">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
