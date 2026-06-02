import { useState } from 'react';

export const useAlertStore = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, RESOLVED

  return {
    alerts,
    setAlerts,
    filter,
    setFilter
  };
};
