import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const alertService = {
  // Since there's no global incidents route, we aggregate from all monitors
  getAllAlerts: async () => {
    try {
      // 1. Get all monitors
      const monitorsRes = await axios.get(`${API_URL}/monitor`, { withCredentials: true });
      const monitors = monitorsRes.data;

      // 2. Fetch incidents for each monitor
      const incidentPromises = monitors.map(monitor => 
        axios.get(`${API_URL}/incidents/${monitor._id}`, { withCredentials: true })
          .then(res => res.data.map(incident => ({
            ...incident,
            monitorName: monitor.name || monitor.url,
            monitorUrl: monitor.url
          })))
          .catch(() => [])
      );

      const allIncidents = await Promise.all(incidentPromises);
      
      // 3. Flatten and sort by startTime (newest first)
      return allIncidents.flat().sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      throw err;
    }
  },

  resolveAlert: async (incidentId) => {
    const response = await axios.post(`${API_URL}/incidents/resolve/${incidentId}`, {}, { withCredentials: true });
    return response.data;
  }
};

export default alertService;
