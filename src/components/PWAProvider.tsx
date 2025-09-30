'use client';

import { useEffect } from 'react';
import { registerServiceWorker, setupPWAInstall } from '@/lib/pwa';

interface PWAProviderProps {
  children: React.ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  useEffect(() => {
    // Register service worker for offline functionality
    registerServiceWorker();
    
    // Setup PWA install prompt
    setupPWAInstall();
  }, []);

  return <>{children}</>;
}
