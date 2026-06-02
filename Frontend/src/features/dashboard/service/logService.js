import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const logService = {
  /**
   * Get logs for a specific monitor
   */
  getLogs: async (monitorId, limit = 100, page = 1) => {
    try {
      const response = await axios.get(
        `${API_URL}/logs/${monitorId}?limit=${limit}&page=${page}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch logs for monitor ${monitorId}:`, error);
      throw error;
    }
  },

  /**
   * Delete all logs for a monitor
   */
  deleteLogs: async (monitorId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/logs/${monitorId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete logs for monitor ${monitorId}:`, error);
      throw error;
    }
  },

  /**
   * Get recent logs (last N entries) for a monitor
   */
  getRecentLogs: async (monitorId, limit = 20) => {
    try {
      const response = await axios.get(
        `${API_URL}/logs/${monitorId}?limit=${limit}&page=1`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch recent logs for monitor ${monitorId}:`, error);
      throw error;
    }
  }
};

export default logService;
