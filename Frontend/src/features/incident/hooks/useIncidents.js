import { useState, useEffect, useCallback } from 'react';
import incidentService from '../service/incidentService';
import toast from 'react-hot-toast';
import socketService from '../../../services/socketService';

const formatIncident = (incident) => {
  const startTime = incident.startTime ? new Date(incident.startTime) : null;
  const endTime = incident.endTime ? new Date(incident.endTime) : null;
  const status = incident.resolved ? 'recovered' : incident.type;
  const durationMs = startTime ? (endTime || new Date()).getTime() - startTime.getTime() : 0;
  const durationMinutes = Math.max(1, Math.round(durationMs / 60000));

  return {
    ...incident,
    id: incident._id,
    service: incident.monitorName || 'Unknown monitor',
    url: incident.monitorUrl || '#',
    status,
    time: startTime ? startTime.toLocaleString() : '-',
    duration: `${durationMinutes}m`,
    ongoing: !incident.resolved,
    aiAnalysis: incident.ai ? {
      summary: incident.ai.summary,
      recommendation: incident.ai.suggestion || incident.ai.rootCause,
    } : null,
  };
};

export const useIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // Get only unresolved incidents for Alert Center
        const data = await incidentService.getUnresolvedIncidents();
        setIncidents(data.map(formatIncident));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();

    // Listen for incident updates and refresh
    const refreshIncidents = () => {
      console.log('📡 Incident update received, refreshing Alert Center...');
      fetchIncidents();
    };

    socketService.onIncidentCreated(refreshIncidents);
    return () => socketService.off('incidentUpdate', refreshIncidents);
  }, []);

  const resolveIncident = useCallback(async (incidentId) => {
    try {
      await incidentService.resolveIncident(incidentId);
      toast.success('Incident marked as resolved ✅');
      // Remove resolved incident from the list immediately
      setIncidents(prev => prev.filter(i => i.id !== incidentId));
    } catch (err) {
      toast.error('Failed to resolve incident');
      throw err;
    }
  }, []);

  const deleteIncidents = useCallback(async (monitorId) => {
    try {
      await incidentService.deleteIncidents(monitorId);
      toast.success('Incident history cleared');
      // Refresh incidents
      const data = await incidentService.getAllIncidents();
      setIncidents(data.map(formatIncident));
    } catch (err) {
      toast.error('Failed to clear incidents');
      throw err;
    }
  }, []);

  return { incidents, loading, error, resolveIncident, deleteIncidents };
};
