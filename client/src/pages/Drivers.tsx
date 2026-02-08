import Layout from "../components/layout/Layout";
import { Filter, Pencil, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import * as driverService from "../services/driverService";
import type { Driver } from "../services/driverService";

const Drivers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    nic: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    email: "",
  });
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      console.log('🔄 Starting to fetch drivers...');
      setLoading(true);
      setError(null);
      const data = await driverService.getDrivers();
      setDrivers(data);
      console.log('✅ Drivers loaded successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load drivers. Please try again.';
      setError(errorMessage);
      console.error('❌ Error in fetchDrivers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit driver
  const handleEdit = (driver: Driver) => {
    setEditingDriver({ ...driver });
    setIsEditModalOpen(true);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (editingDriver) {
      try {
        await driverService.updateDriver(editingDriver._id, editingDriver);
        await fetchDrivers();
        setIsEditModalOpen(false);
        setEditingDriver(null);
      } catch (err: any) {
        alert(err.message || 'Failed to update driver');
      }
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
  const handleDelete = async (driverId: string) => {
    const driver = drivers.find(d => d._id === driverId);
    if (driver && window.confirm(`Are you sure you want to delete ${driver.name}?`)) {
      try {
        await driverService.deleteDriver(driverId);
        await fetchDrivers();
      } catch (err: any) {
        alert(err.message || 'Failed to delete driver');
      }
    }
  };

  // Handle add driver
  const handleAddDriver = () => {
    setIsAddModalOpen(true);
  };

  // Handle save new driver
  const handleSaveNewDriver = async () => {
    console.log('🔄 Attempting to save new driver...');
    
    // Validate required fields
    if (!newDriver.name || !newDriver.licenseNumber || !newDriver.nic) {
      const errorMsg = 'Please fill in all required fields (Name, License Number, and NIC)';
      alert(errorMsg);
      console.warn('⚠️ Validation failed:', errorMsg);
      return;
    }
    
    console.log('✓ Validation passed, creating driver:', newDriver);
    
    try {
      await driverService.createDriver(newDriver);
      console.log('✅ Driver created, fetching updated list...');
      await fetchDrivers();
      setIsAddModalOpen(false);
      // Reset form
      setNewDriver({
        name: "",
        licenseNumber: "",
        nic: "",
        dateOfBirth: "",
        address: "",
        phone: "",
        email: "",
      });
      console.log('✅ Form reset and modal closed');
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to add driver';
      alert(errorMsg);
      console.error('❌ Error in handleSaveNewDriver:', err);
    }
  };

  // Handle cancel add
  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
    // Reset form
    setNewDriver({
      name: "",
      licenseNumber: "",
      nic: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      email: "",
    });
  };

  // Handle new driver input change
  const handleNewDriverInputChange = (field: string, value: string) => {
    setNewDriver({ ...newDriver, [field]: value });
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
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Driver Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Add New Driver</h2>
                <button
                  onClick={handleCancelAdd}
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
                      Driver Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newDriver.name}
                      onChange={(e) => handleNewDriverInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter driver name"
                    />
                  </div>

                  {/* License Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newDriver.licenseNumber}
                      onChange={(e) => handleNewDriverInputChange('licenseNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="DL-XXXXXX"
                    />
                  </div>

                  {/* NIC */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newDriver.nic}
                      onChange={(e) => handleNewDriverInputChange('nic', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="XXXXXXXXXV"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={newDriver.dateOfBirth}
                      onChange={(e) => handleNewDriverInputChange('dateOfBirth', e.target.value)}
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
                      value={newDriver.phone}
                      onChange={(e) => handleNewDriverInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newDriver.email}
                      onChange={(e) => handleNewDriverInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="driver@email.com"
                    />
                  </div>
                </div>

                {/* Address - Full width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={newDriver.address}
                    onChange={(e) => handleNewDriverInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleCancelAdd}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewDriver}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg font-medium transition-colors"
                >
                  Add Driver
                </button>
              </div>
            </div>
          </div>
        )}

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
          <button 
            onClick={handleAddDriver}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg font-medium transition-colors shadow-sm"
          >
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
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Loading drivers...
                    </td>
                  </tr>
                ) : filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? `No drivers found matching "${searchQuery}"` : 'No drivers found. Click "Add Driver" to create one.'}
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr
                      key={driver._id}
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
                            onClick={() => handleDelete(driver._id)}
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
