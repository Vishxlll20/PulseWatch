import { useState, useCallback } from 'react';
import incidentService from '../service/incidentService';
import toast from 'react-hot-toast';

/**
 * Custom hook for incident operations
 */
export const useIncident = () => {
  const [incidents, setIncidents] = useState([]);
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch incidents for a monitor
   */
  const fetchIncidents = useCallback(async (monitorId, limit = 50, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await incidentService.getIncidents(monitorId, limit, page);
      setIncidents(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch incidents';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch active incidents for a monitor
   */
  const fetchActiveIncidents = useCallback(async (monitorId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await incidentService.getActiveIncidents(monitorId);
      setActiveIncidents(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch active incidents';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all incidents from all monitors
   */
  const fetchAllIncidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incidentService.getAllIncidents();
      setIncidents(data);
      setActiveIncidents(data.filter(incident => !incident.resolved));
      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch incidents';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Resolve an incident
   */
  const resolveIncident = useCallback(async (incidentId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await incidentService.resolveIncident(incidentId);
      setIncidents(prev =>
        prev.map(i => i._id === incidentId ? { ...i, resolved: true, endTime: new Date() } : i)
      );
      setActiveIncidents(prev => prev.filter(i => i._id !== incidentId));
      toast.success('Incident resolved');
      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to resolve incident';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete incidents for a monitor
   */
  const deleteIncidents = useCallback(async (monitorId) => {
    try {
      setLoading(true);
      setError(null);
      await incidentService.deleteIncidents(monitorId);
      setIncidents([]);
      setActiveIncidents([]);
      toast.success('Incidents deleted');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to delete incidents';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    incidents,
    activeIncidents,
    loading,
    error,
    fetchIncidents,
    fetchActiveIncidents,
    fetchAllIncidents,
    resolveIncident,
    deleteIncidents,
    setIncidents,
    setError
  };
};

export default useIncident;
