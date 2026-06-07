import { useState, useCallback, useEffect } from 'react';
import { monitorService } from '../service/monitorService';
import socketService from '../../../services/socketService';
import toast from 'react-hot-toast';

/**
 * Custom hook for monitor operations
 * Handles CRUD operations for monitors
 */
export const useMonitor = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Listen for real-time WebSocket updates to avoid full page reloads
   */
  useEffect(() => {
    const handleLogUpdate = (log) => {
      setMonitors(prev => prev.map(m => {
        if (m._id === log.monitorId) {
          // Keep existing history, shift it to append new ping representation
          const newHistory = [...(m.history || [])];
          newHistory.shift(); // Remove oldest
          newHistory.push(log.status === 'DOWN' ? 35 : (log.status === 'DEGRADED' ? 70 : 100));

          return { 
            ...m, 
            status: log.status, 
            response: `${log.responseTime}ms`,
            history: newHistory
          };
        }
        return m;
      }));
    };

    socketService.onMonitorUpdate(handleLogUpdate);
    return () => socketService.off('logUpdate', handleLogUpdate);
  }, []);

  /**
   * Fetch all monitors
   */
  const fetchMonitors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await monitorService.getMonitors();
      setMonitors(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch monitors';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single monitor
   */
  const fetchMonitorById = useCallback(async (monitorId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await monitorService.getMonitorById(monitorId);
      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch monitor';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new monitor
   */
  const createMonitor = useCallback(async (monitorData) => {
    try {
      setLoading(true);
      setError(null);
      const newMonitor = await monitorService.createMonitor(monitorData);
      setMonitors(prev => [newMonitor, ...prev]);
      toast.success('Monitor created successfully');
      return newMonitor;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to create monitor';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing monitor
   */
  const updateMonitor = useCallback(async (monitorId, monitorData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedMonitor = await monitorService.updateMonitor(monitorId, monitorData);
      setMonitors(prev =>
        prev.map(m => m._id === monitorId ? updatedMonitor : m)
      );
      toast.success('Monitor updated successfully');
      return updatedMonitor;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to update monitor';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a monitor
   */
  const deleteMonitor = useCallback(async (monitorId) => {
    try {
      setLoading(true);
      setError(null);
      await monitorService.deleteMonitor(monitorId);
      setMonitors(prev => prev.filter(m => m._id !== monitorId));
      toast.success('Monitor deleted successfully');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to delete monitor';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Toggle monitor active/inactive
   */
  const toggleMonitor = useCallback(async (monitorId) => {
    try {
      setLoading(true);
      setError(null);
      const updatedMonitor = await monitorService.toggleMonitor(monitorId);
      setMonitors(prev =>
        prev.map(m => m._id === monitorId ? updatedMonitor : m)
      );
      const status = updatedMonitor.isActive ? 'enabled' : 'disabled';
      toast.success(`Monitor ${status}`);
      return updatedMonitor;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to toggle monitor';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Run a manual health check
   */
  const runMonitorNow = useCallback(async (monitorId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await monitorService.runMonitorNow(monitorId);
      toast.success('Manual check executed');
      return result;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to run manual check';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    monitors,
    loading,
    error,
    fetchMonitors,
    fetchMonitorById,
    createMonitor,
    updateMonitor,
    deleteMonitor,
    toggleMonitor,
    runMonitorNow,
    setMonitors,
    setError
  };
};

export default useMonitor;
