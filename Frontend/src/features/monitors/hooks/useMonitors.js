import { useState, useEffect } from 'react';
import { monitorService } from '../service/monitorService';

export const useMonitors = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        setLoading(true);
        const data = await monitorService.getMonitors();
        setMonitors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitors();
  }, []);

  return { monitors, loading, error };
};
