import Layout from "../components/layout/Layout";
import { Filter, Pencil, Trash2 } from "lucide-react";

const Drivers = () => {
  // Mock data - replace with actual data from API
  const drivers = [
    {
      id: 1,
      name: "John Smith",
      licenseNumber: "DL-123456",
      nic: "123456789V",
      dateOfBirth: "1985-03-15",
      address: "123 Main St, Plymouth",
      phone: "+1 (555) 123-4567",
      email: "john.smith@email.com",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      licenseNumber: "DL-789012",
      nic: "987654321V",
      dateOfBirth: "1990-07-22",
      address: "456 Oak Ave, Plymouth",
      phone: "+1 (555) 234-5678",
      email: "sarah.johnson@email.com",
    },
    {
      id: 3,
      name: "Michael Brown",
      licenseNumber: "DL-345678",
      nic: "456789123V",
      dateOfBirth: "1988-11-08",
      address: "789 Pine Rd, Plymouth",
      phone: "+1 (555) 345-6789",
      email: "michael.brown@email.com",
    },
    {
      id: 4,
      name: "Emily Davis",
      licenseNumber: "DL-901234",
      nic: "321654987V",
      dateOfBirth: "1992-05-30",
      address: "321 Elm St, Plymouth",
      phone: "+1 (555) 456-7890",
      email: "emily.davis@email.com",
    },
  ];

  return (
    <Layout title="Drivers">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg font-medium transition-colors shadow-sm">
            <span className="text-xl">+</span>
            Add Driver
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search drivers..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Driver Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    License Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    NIC
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date of Birth
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {drivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {driver.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {driver.licenseNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {driver.nic}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {driver.dateOfBirth}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {driver.address}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {driver.phone}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {driver.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Pencil size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Drivers;
