import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Analytics Service - Fetches monitor analytics and uptime data
 * Supports time ranges: 24h, 7d, 30d
 */
export const analyticsService = {
  normalizeAnalyticsData: (data = {}) => {
    const graph = Array.isArray(data.graph) ? data.graph : [];

    const normalizedGraph = graph.map((entry, index) => {
      const date = entry.date ? new Date(entry.date) : entry.createdAt ? new Date(entry.createdAt) : null;
      const fallbackLabel = `Point ${index + 1}`;

      return {
        ...entry,
        time: date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : fallbackLabel,
        day: date ? date.toLocaleDateString([], { weekday: 'short' }) : fallbackLabel,
        value: Number(entry.avgResponseTime ?? entry.value ?? 0),
        percentage: Number(entry.uptime ?? entry.percentage ?? 0),
      };
    });

    return {
      ...data,
      graph: normalizedGraph,
    };
  },

  /**
   * Get analytics for a specific monitor
   * @param {string} monitorId - Monitor ID
   * @param {string} range - Time range: '24h' | '7d' | '30d' (default: '24h')
   * @returns {Promise<Object>} Analytics data including uptime %, response time, error rate, etc.
   */
  getAnalyticsData: async (monitorId, range = '24h') => {
    try {
      const response = await axios.get(
        `${API_URL}/analytics/${monitorId}?range=${range}`,
        { withCredentials: true }
      );
      return analyticsService.normalizeAnalyticsData(response.data);
    } catch (error) {
      console.error(`Failed to fetch analytics for monitor ${monitorId}:`, error);
      throw error;
    }
  },

  /**
   * Get analytics for multiple monitors
   * @param {Array<string>} monitorIds - Array of monitor IDs
   * @param {string} range - Time range: '24h' | '7d' | '30d'
   * @returns {Promise<Object>} Aggregated analytics
   */
  getMultipleAnalytics: async (monitorIds, range = '24h') => {
    try {
      const analyticsPromises = monitorIds.map(monitorId =>
        analyticsService.getAnalyticsData(monitorId, range)
      );
      return await Promise.all(analyticsPromises);
    } catch (error) {
      console.error('Failed to fetch multiple analytics:', error);
      throw error;
    }
  },

};

export default analyticsService;
