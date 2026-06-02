import { useState, useCallback } from 'react';
import logService from '../service/logService';
import toast from 'react-hot-toast';

/**
 * Custom hook for log operations
 */
export const useLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch logs for a monitor
   */
  const fetchLogs = useCallback(async (monitorId, limit = 100, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await logService.getLogs(monitorId, limit, page);
      setLogs(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch logs';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch recent logs for a monitor
   */
  const fetchRecentLogs = useCallback(async (monitorId, limit = 20) => {
    try {
      setLoading(true);
      setError(null);
      const data = await logService.getRecentLogs(monitorId, limit);
      setLogs(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch logs';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete logs for a monitor
   */
  const deleteLogs = useCallback(async (monitorId) => {
    try {
      setLoading(true);
      setError(null);
      await logService.deleteLogs(monitorId);
      setLogs([]);
      toast.success('Logs deleted');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to delete logs';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    fetchRecentLogs,
    deleteLogs,
    setLogs,
    setError
  };
};

export default useLog;
