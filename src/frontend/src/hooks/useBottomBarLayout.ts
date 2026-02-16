import { useState } from 'react';

/**
 * Shared hook for managing bottom bar layout measurements and offsets.
 * Provides a single source of truth for bottom bar positioning to prevent overlap.
 */
export function useBottomBarLayout() {
  // Constants for bar heights (including padding and safe area)
  const EMERGENCY_BAR_HEIGHT = 96; // h-16 button + p-4 padding + safe area
  const NOW_PLAYING_BAR_HEIGHT = 140; // Measured height of Now Playing bar with padding
  
  const [hasNowPlaying, setHasNowPlaying] = useState(false);
  const [hasEmergencyBar, setHasEmergencyBar] = useState(false);

  // Calculate offsets
  const emergencyBarBottom = 0; // Always at the bottom when visible
  const nowPlayingBarBottom = hasEmergencyBar ? EMERGENCY_BAR_HEIGHT : 0; // Stack above Emergency bar if present
  
  // Calculate content padding based on what's visible
  let contentPaddingBottom = 0;
  if (hasEmergencyBar) {
    contentPaddingBottom += EMERGENCY_BAR_HEIGHT;
  }
  if (hasNowPlaying) {
    contentPaddingBottom += NOW_PLAYING_BAR_HEIGHT;
  }

  return {
    emergencyBarBottom,
    nowPlayingBarBottom,
    contentPaddingBottom,
    setHasNowPlaying,
    setHasEmergencyBar,
    EMERGENCY_BAR_HEIGHT,
    NOW_PLAYING_BAR_HEIGHT,
  };
}
