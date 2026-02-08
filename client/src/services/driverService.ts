const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Driver {
  _id: string;
  name: string;
  licenseNumber: string;
  nic: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDriverDto {
  name: string;
  licenseNumber: string;
  nic: string;
  dateOfBirth?: string;
  address?: string;
  phone?: string;
  email?: string;
}

// Get all drivers
export const getDrivers = async (): Promise<Driver[]> => {
  try {
    console.log('📡 Fetching drivers from:', `${API_URL}/drivers`);
    const response = await fetch(`${API_URL}/drivers`);
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ Failed to fetch drivers:', errorData);
      throw new Error(errorData.message || 'Failed to fetch drivers');
    }
    
    const data = await response.json();
    console.log('✅ Successfully fetched', data.length, 'drivers');
    return data;
  } catch (error) {
    console.error('❌ Error fetching drivers:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:3000');
    }
    throw error;
  }
};

// Get single driver by ID
export const getDriverById = async (id: string): Promise<Driver> => {
  try {
    const response = await fetch(`${API_URL}/drivers/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch driver');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching driver:', error);
    throw error;
  }
};

// Create new driver
export const createDriver = async (driverData: CreateDriverDto): Promise<Driver> => {
  try {
    console.log('📡 Creating driver with data:', driverData);
    console.log('📡 API URL:', `${API_URL}/drivers`);
    
    const response = await fetch(`${API_URL}/drivers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData),
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ Failed to create driver:', error);
      throw new Error(error.message || 'Failed to create driver');
    }
    
    const data = await response.json();
    console.log('✅ Driver created successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error creating driver:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:3000');
    }
    throw error;
  }
};

// Update driver
export const updateDriver = async (id: string, driverData: Partial<CreateDriverDto>): Promise<Driver> => {
  try {
    console.log('📡 Updating driver:', id, 'with data:', driverData);
    
    const response = await fetch(`${API_URL}/drivers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData),
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ Failed to update driver:', error);
      throw new Error(error.message || 'Failed to update driver');
    }
    
    const data = await response.json();
    console.log('✅ Driver updated successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error updating driver:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:3000');
    }
    throw error;
  }
};

// Delete driver
export const deleteDriver = async (id: string): Promise<void> => {
  try {
    console.log('📡 Deleting driver:', id);
    
    const response = await fetch(`${API_URL}/drivers/${id}`, {
      method: 'DELETE',
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ Failed to delete driver:', error);
      throw new Error(error.message || 'Failed to delete driver');
    }
    
    console.log('✅ Driver deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting driver:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:3000');
    }
    throw error;
  }
};
