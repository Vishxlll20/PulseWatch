import { useState, useCallback, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import toast from 'react-hot-toast';

export const useAnalytics = (monitorId = null, range = '24h', autoFetch = false) => {
  const [loading, setLoading] = useState(autoFetch && monitorId);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Fetch analytics data
   */
  const fetchAnalytics = useCallback(async (id, timeRange = '24h') => {
    if (!id) {
      setError('Monitor ID is required');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getAnalyticsData(id, timeRange);
      setData(result);
      return result;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch analytics data';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch multiple analytics
   */
  const fetchMultipleAnalytics = useCallback(async (monitorIds, timeRange = '24h') => {
    if (!monitorIds || monitorIds.length === 0) {
      setError('At least one monitor ID is required');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getMultipleAnalytics(monitorIds, timeRange);
      return result;
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch analytics';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Auto-fetch analytics if monitorId is provided
   */
  useEffect(() => {
    if (autoFetch && monitorId) {
      fetchAnalytics(monitorId, range);
    }
  }, [monitorId, range, autoFetch, fetchAnalytics]);

  return {
    data,
    loading,
    error,
    fetchAnalytics,
    fetchMultipleAnalytics,
    setData,
    setError
  };
};

export default useAnalytics;
