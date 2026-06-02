import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const dashboardService = {
  getSystemStats: async () => {
    // In a real app, this would call the backend
    // return axios.get(`${API_URL}/dashboard/stats`);
    return {
      uptime: '99.98%',
      monitors: 24,
      incidents: 2,
      cpu: '14%'
    };
  },

  getRecentAlerts: async () => {
    // return axios.get(`${API_URL}/dashboard/alerts`);
    return [
      { id: 1, type: 'API Timeout', target: '/v1/auth/login', time: '2m ago' },
      { id: 2, type: 'Memory High', target: 'Worker-01', time: '15m ago' },
    ];
  }
};

export default dashboardService;
