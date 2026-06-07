import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const adminService = {
  /**
   * Get all users (Admin only)
   */
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, { withCredentials: true });
      return response.data.users || [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  /**
   * Delete a user by ID (Admin only)
   */
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/admin/users/${userId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Get all monitors across the system (Admin only)
   */
  getMonitors: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/monitors`, { withCredentials: true });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch monitors:', error);
      throw error;
    }
  },

  /**
   * Delete any monitor by ID (Admin only)
   */
  deleteMonitor: async (monitorId) => {
    try {
      const response = await axios.delete(`${API_URL}/admin/monitors/${monitorId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Failed to delete monitor ${monitorId}:`, error);
      throw error;
    }
  }
};

export default adminService;
