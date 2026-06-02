import { useState, useEffect } from 'react';
import alertService from '../service/alertService';
import toast from 'react-hot-toast';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertService.getAllAlerts();
      setAlerts(data);
    } catch {
      setError('Failed to fetch alerts');
      toast.error('Could not load alerts history');
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (incidentId) => {
    try {
      await alertService.resolveAlert(incidentId);
      toast.success('Incident marked as resolved');
      fetchAlerts(); // refresh
    } catch {
      toast.error('Failed to resolve incident');
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    loading,
    error,
    refresh: fetchAlerts,
    resolveAlert
  };
};
