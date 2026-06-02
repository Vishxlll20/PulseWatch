import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const incidentService = {
  /**
   * Get all incidents for a specific monitor
   */
  getIncidents: async (monitorId, limit = 50, page = 1) => {
    try {
      const response = await axios.get(
        `${API_URL}/incidents/${monitorId}?limit=${limit}&page=${page}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch incidents for monitor ${monitorId}:`, error);
      throw error;
    }
  },

  /**
   * Get active (unresolved) incidents for a monitor
   */
  getActiveIncidents: async (monitorId) => {
    try {
      const response = await axios.get(
        `${API_URL}/incidents/active/${monitorId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch active incidents for monitor ${monitorId}:`, error);
      throw error;
    }
  },

  /**
   * Resolve a specific incident
   */
  resolveIncident: async (incidentId) => {
    try {
      const response = await axios.post(
        `${API_URL}/incidents/resolve/${incidentId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to resolve incident ${incidentId}:`, error);
      throw error;
    }
  },

  /**
   * Delete all incidents for a monitor
   */
  deleteIncidents: async (monitorId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/incidents/${monitorId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete incidents for monitor ${monitorId}:`, error);
      throw error;
    }
  },

  /**
   * Get all incidents aggregated from all monitors
   * (useful for alerts page)
   */
  getAllIncidents: async () => {
    try {
      const response = await axios.get(`${API_URL}/incidents/all`, { withCredentials: true });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch all incidents:', error);
      throw error;
    }
  },

  /**
   * Get only unresolved incidents (for Alert Center)
   */
  getUnresolvedIncidents: async () => {
    try {
      const response = await axios.get(`${API_URL}/incidents/unresolved`, { withCredentials: true });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch unresolved incidents:', error);
      throw error;
    }
  }
};

export default incidentService;
