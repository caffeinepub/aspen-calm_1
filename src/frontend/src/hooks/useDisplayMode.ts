import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useLocation } from '@tanstack/react-router';

export type DisplayMode = 'Front' | 'Back';

// In-tab broadcast channel for display mode changes
const DISPLAY_MODE_EVENT = 'displayModeChange';

// Normalize pathname to ensure consistent storage keys
function normalizePathname(pathname: string): string {
  // Remove trailing slash unless it's the root path
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  return normalized;
}

export function useDisplayMode() {
  const location = useLocation();
  const normalizedPath = normalizePathname(location.pathname);
  const storageKey = `displayMode-${normalizedPath}`;

  const [displayMode, setDisplayModeState] = useState<DisplayMode>(() => {
    const stored = sessionStorage.getItem(storageKey);
    return (stored === 'Front' || stored === 'Back') ? stored : 'Front';
  });

  // Use layout effect for synchronous route-based storage sync to avoid race conditions
  useLayoutEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    const newMode = (stored === 'Front' || stored === 'Back') ? stored : 'Front';
    setDisplayModeState(newMode);
  }, [storageKey]);

  // Listen for display mode changes from other components
  useEffect(() => {
    const handleDisplayModeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string; mode: DisplayMode }>;
      if (customEvent.detail && customEvent.detail.key === storageKey) {
        setDisplayModeState(customEvent.detail.mode);
      }
    };

    window.addEventListener(DISPLAY_MODE_EVENT, handleDisplayModeChange);
    return () => {
      window.removeEventListener(DISPLAY_MODE_EVENT, handleDisplayModeChange);
    };
  }, [storageKey]);

  // Stable setter that always uses current storageKey
  const setDisplayMode = useCallback((mode: DisplayMode) => {
    // Update state immediately
    setDisplayModeState(mode);
    
    // Persist to storage
    sessionStorage.setItem(storageKey, mode);
    
    // Broadcast the change to other components
    const event = new CustomEvent(DISPLAY_MODE_EVENT, {
      detail: { key: storageKey, mode },
      bubbles: true,
      cancelable: false
    });
    window.dispatchEvent(event);
  }, [storageKey]);

  return { displayMode, setDisplayMode };
}
