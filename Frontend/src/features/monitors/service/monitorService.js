import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const normalizeMonitor = (payload) => payload?.monitor || payload;

export const monitorService = {
  /**
   * Get all monitors for the authenticated user
   */
  getMonitors: async () => {
    try {
      const response = await axios.get(`${API_URL}/monitor`, { withCredentials: true });
      return Array.isArray(response.data) ? response.data.map(normalizeMonitor) : [];
    } catch (error) {
      console.error('Failed to fetch monitors:', error);
      throw error;
    }
  },

  /**
   * Get a single monitor by ID
   */
  getMonitorById: async (monitorId) => {
    try {
      const response = await axios.get(`${API_URL}/monitor/${monitorId}`, { withCredentials: true });
      return normalizeMonitor(response.data);
    } catch (error) {
      console.error(`Failed to fetch monitor ${monitorId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new monitor
   */
  createMonitor: async (monitorData) => {
    try {
      const response = await axios.post(`${API_URL}/monitor/create`, monitorData, { withCredentials: true });
      return normalizeMonitor(response.data);
    } catch (error) {
      console.error('Failed to create monitor:', error);
      throw error;
    }
  },

  /**
   * Update an existing monitor
   */
  updateMonitor: async (monitorId, monitorData) => {
    try {
      const response = await axios.put(`${API_URL}/monitor/${monitorId}/update`, monitorData, { withCredentials: true });
      return normalizeMonitor(response.data);
    } catch (error) {
      console.error(`Failed to update monitor ${monitorId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a monitor
   */
  deleteMonitor: async (monitorId) => {
    try {
      const response = await axios.delete(`${API_URL}/monitor/${monitorId}/delete`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Failed to delete monitor ${monitorId}:`, error);
      throw error;
    }
  },

  /**
   * Toggle monitor active/inactive status
   */
  toggleMonitor: async (monitorId) => {
    try {
      const response = await axios.patch(`${API_URL}/monitor/${monitorId}/toggle`, {}, { withCredentials: true });
      return normalizeMonitor(response.data);
    } catch (error) {
      console.error(`Failed to toggle monitor ${monitorId}:`, error);
      throw error;
    }
  },

  /**
   * Run a manual health check on a monitor
   */
  runMonitorNow: async (monitorId) => {
    try {
      const response = await axios.post(`${API_URL}/monitor/${monitorId}/run`, {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Failed to run monitor ${monitorId}:`, error);
      throw error;
    }
  }
};
