import { ReactNode, useEffect } from 'react';
import NowPlayingBar from './NowPlayingBar';
import EmergencyTalkBar from './EmergencyTalkBar';
import { usePlayback } from '../hooks/usePlayback';
import { useMediaActivity } from '../hooks/useMediaActivity';
import { useBottomBarLayout } from '../hooks/useBottomBarLayout';

interface BottomBarsProps {
  children?: ReactNode;
}

export default function BottomBars({ children }: BottomBarsProps) {
  const { currentItem } = usePlayback();
  const { isVideoActive } = useMediaActivity();
  const { 
    emergencyBarBottom, 
    nowPlayingBarBottom, 
    contentPaddingBottom,
    setHasNowPlaying,
    setHasEmergencyBar
  } = useBottomBarLayout();
  
  const hasNowPlaying = !!currentItem;
  const hasEmergencyBar = hasNowPlaying || isVideoActive;

  // Update layout state when playback or video activity changes
  useEffect(() => {
    setHasNowPlaying(hasNowPlaying);
  }, [hasNowPlaying, setHasNowPlaying]);

  useEffect(() => {
    setHasEmergencyBar(hasEmergencyBar);
  }, [hasEmergencyBar, setHasEmergencyBar]);

  return (
    <>
      {/* Apply bottom padding to children (page content) */}
      <div style={{ paddingBottom: `${contentPaddingBottom}px` }}>
        {children}
      </div>

      {/* Now Playing Bar - slides up when content is playing, positioned above Emergency bar */}
      {hasNowPlaying && <NowPlayingBar bottomOffset={nowPlayingBarBottom} />}

      {/* Emergency Talk Bar - only visible when media is active */}
      {hasEmergencyBar && <EmergencyTalkBar bottomOffset={emergencyBarBottom} />}
    </>
  );
}
