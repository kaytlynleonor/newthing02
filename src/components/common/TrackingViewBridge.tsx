import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

export const TrackingViewBridge: React.FC = () => {
  const { setActiveView } = useStore();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'tracking') {
      setActiveView('tracking');
    }
  }, [setActiveView]);
  return null;
};