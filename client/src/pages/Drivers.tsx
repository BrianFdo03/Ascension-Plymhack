import Layout from "../components/layout/Layout";
import { Filter, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  nic: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
}

const Drivers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Mock data - replace with actual data from API
  const [drivers, setDrivers] = useState<Driver[]>([
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
  ]);

  // Handle edit driver
  const handleEdit = (driver: Driver) => {
    setEditingDriver({ ...driver });
    setIsEditModalOpen(true);
  };

  // Handle save changes
  const handleSaveChanges = () => {
    if (editingDriver) {
      setDrivers(drivers.map(d => d.id === editingDriver.id ? editingDriver : d));
      setIsEditModalOpen(false);
      setEditingDriver(null);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingDriver(null);
  };

  // Handle input change
  const handleInputChange = (field: keyof Driver, value: string) => {
    if (editingDriver) {
      setEditingDriver({ ...editingDriver, [field]: value });
    }
  };

  // Handle delete driver
  const handleDelete = (driverId: number) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver && window.confirm(`Are you sure you want to delete ${driver.name}?`)) {
      setDrivers(drivers.filter(d => d.id !== driverId));
    }
  };

  // Filter drivers based on search query
  const filteredDrivers = drivers.filter((driver) => {
    const query = searchQuery.toLowerCase();
    return (
      driver.name.toLowerCase().includes(query) ||
      driver.licenseNumber.toLowerCase().includes(query) ||
      driver.nic.toLowerCase().includes(query) ||
      driver.phone.toLowerCase().includes(query) ||
      driver.email.toLowerCase().includes(query) ||
      driver.address.toLowerCase().includes(query)
    );
  });

  return (
    <Layout title="Drivers">
      <div className="space-y-6">
        {/* Edit Modal */}
        {isEditModalOpen && editingDriver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Driver</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Driver Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      value={editingDriver.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* License Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={editingDriver.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* NIC */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIC
                    </label>
                    <input
                      type="text"
                      value={editingDriver.nic}
                      onChange={(e) => handleInputChange('nic', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editingDriver.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editingDriver.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingDriver.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Address - Full width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={editingDriver.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No drivers found matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
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
                          <button 
                            onClick={() => handleEdit(driver)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit driver"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(driver.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete driver"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Drivers;
