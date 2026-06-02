import { useState, useEffect } from 'react';
import dashboardService from '../api/dashboardService';

const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, alertsData] = await Promise.all([
          dashboardService.getSystemStats(),
          dashboardService.getRecentAlerts()
        ]);
        setStats(statsData);
        setAlerts(alertsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, alerts, loading, error };
};

export default useDashboard;
