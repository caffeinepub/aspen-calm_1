import { useNavigate, useLocation } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

interface NavigationHistory {
  path: string;
  timestamp: number;
}

const MAX_HISTORY_SIZE = 20;
const navigationHistory: NavigationHistory[] = [];

export function useBackNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousPathRef = useRef<string | null>(null);

  // Track navigation history
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Only add to history if it's a different path
    if (previousPathRef.current !== null && previousPathRef.current !== currentPath) {
      // Don't add the same path consecutively
      const lastEntry = navigationHistory[navigationHistory.length - 1];
      if (!lastEntry || lastEntry.path !== previousPathRef.current) {
        navigationHistory.push({
          path: previousPathRef.current,
          timestamp: Date.now(),
        });
        
        // Keep history size manageable
        if (navigationHistory.length > MAX_HISTORY_SIZE) {
          navigationHistory.shift();
        }
      }
    }
    previousPathRef.current = currentPath;
  }, [location.pathname]);

  const goBack = () => {
    const currentPath = location.pathname;
    
    // Try to find a previous path in history that's different from current
    let previousEntry: NavigationHistory | undefined;
    for (let i = navigationHistory.length - 1; i >= 0; i--) {
      if (navigationHistory[i].path !== currentPath) {
        previousEntry = navigationHistory[i];
        // Remove entries after this one
        navigationHistory.splice(i + 1);
        break;
      }
    }
    
    if (previousEntry) {
      // Navigate to previous in-app route
      navigate({ to: previousEntry.path });
      return;
    }
    
    // Fallback logic based on current route
    if (currentPath.startsWith('/now-playing/')) {
      navigate({ to: '/audio-pharmacy' });
    } else if (currentPath === '/audiobooks') {
      navigate({ to: '/dashboard' });
    } else if (currentPath === '/audio-pharmacy' || 
               currentPath === '/regional-radio' || 
               currentPath === '/cinema' || 
               currentPath === '/visual-escapes') {
      navigate({ to: '/dashboard' });
    } else if (currentPath === '/dashboard') {
      navigate({ to: '/' });
    } else if (currentPath === '/staff') {
      navigate({ to: '/dashboard' });
    } else {
      // Default fallback to dashboard
      navigate({ to: '/dashboard' });
    }
  };

  const canGoBack = () => {
    const currentPath = location.pathname;
    // Can always go back except from the intake flow
    return currentPath !== '/';
  };

  return {
    goBack,
    canGoBack: canGoBack(),
  };
}
