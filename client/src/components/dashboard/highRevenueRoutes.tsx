

interface Route {
  id: string;
  routeNo: number;
  routeName: string;
  noBuses: number;
  revenue: String;
}

const highRevenueRoutes: Route[] = [
  {
    id: "R-7352",
    routeNo: 128,
    routeName: "Kottawa - Homagama",
    noBuses: 10,
    revenue: "LKR 500.00",
  },
  {
    id: "R-7342",
    routeNo: 267,
    routeName: "Kottawa - Maharagama",
    noBuses: 20,
    revenue: "LKR 500.00",
  },
  {
    id: "R-7350",
    routeNo: 299,
    routeName: "Gampaha - Kandy",
    noBuses: 10,
    revenue: "LKR 500.00",
  },
  {
    id: "R-7349",
    routeNo: 101,
    routeName: "Panadura - Mt. Lavinia",
    noBuses: 10,
    revenue: "LKR 500.00",
  },
  {
    id: "R-7348",
    routeNo: 100,
    routeName: "Moratuwa - Kaluthara",
    noBuses: 10,
    revenue: "LKR 500.00",
  },
];


// @ts-ignore - refreshKey reserved for future use
const HighRevenueRoutes = ({ refreshKey }: { refreshKey?: number }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg shadow-blue-500/5 border border-blue-100 mt-8 overflow-hidden">
      <div className="p-6 border-b border-blue-50 flex justify-between items-center bg-white">
        <h2 className="text-xl font-bold text-blue-900">Routes</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-50/50 text-blue-900 text-sm font-semibold uppercase tracking-wider border-b border-blue-100">
            <tr>
              <th className="p-4 pl-6">Route ID</th>
              <th className="p-4">Route No</th>
              <th className="p-4">Route Name</th>
              <th className="p-4">No of Buses</th>
              <th className="p-4">Revenue</th>
              {/* <th className="p-4 pr-6">Status</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {highRevenueRoutes.map((route) => (
              <tr key={route.id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                <td className="p-4 pl-6 font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{route.id}</td>
                <td className="p-4 text-slate-600 font-medium">{route.routeNo}</td>
                <td className="p-4 text-slate-500">{route.routeName}</td>
                <td className="p-4 text-slate-400 text-sm">{route.noBuses}</td>
                <td className="p-4 font-bold text-slate-700">{route.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighRevenueRoutes;
