import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useGetSafeVolumeCap } from '../hooks/useQueries';
import { useClinicalSafety } from '../hooks/useClinicalSafety';
import { Music } from 'lucide-react';

export interface PlaybackItem {
  id: string;
  title: string;
  audioSrc: string;
  icon?: React.ReactNode;
  loop?: boolean;
}

interface PlaybackContextValue {
  currentItem: PlaybackItem | null;
  isPlaying: boolean;
  volume: number;
  volumeCap: number;
  error: string | null;
  errorType: 'network' | 'unsupported' | 'playback' | null;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  clearError: () => void;
  startPlayback: (item: PlaybackItem) => void;
  canNavigatePrevious: boolean;
  canNavigateNext: boolean;
  navigatePrevious: () => void;
  navigateNext: () => void;
}

export const PlaybackContext = createContext<PlaybackContextValue | null>(null);

interface PlaybackProviderProps {
  children: ReactNode;
}

export function PlaybackProvider({ children }: PlaybackProviderProps) {
  const [currentItem, setCurrentItem] = useState<PlaybackItem | null>(null);
  const [queue, setQueue] = useState<PlaybackItem[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  
  const { data: volumeCapData } = useGetSafeVolumeCap();
  const volumeCap = volumeCapData ? Number(volumeCapData) : 70;
  
  const { emergencyTalkActive } = useClinicalSafety();
  
  const audioPlayer = useAudioPlayer(
    currentItem?.audioSrc || '',
    currentItem?.loop || false
  );
  
  const previousEmergencyState = useRef(emergencyTalkActive);

  // Pause playback when Emergency Talk is activated
  useEffect(() => {
    if (emergencyTalkActive && !previousEmergencyState.current && audioPlayer.isPlaying) {
      audioPlayer.pause();
    }
    previousEmergencyState.current = emergencyTalkActive;
  }, [emergencyTalkActive, audioPlayer]);

  // Clamp volume to safe cap
  useEffect(() => {
    if (audioPlayer.volume > volumeCap) {
      audioPlayer.setVolume(volumeCap);
    }
  }, [volumeCap, audioPlayer]);

  const startPlayback = (item: PlaybackItem) => {
    setCurrentItem(item);
    setQueue([item]);
    setQueueIndex(0);
    // Auto-play will be triggered by the useEffect in the audio player
    setTimeout(() => {
      if (!emergencyTalkActive) {
        audioPlayer.play();
      }
    }, 100);
  };

  const handleSetVolume = (volume: number) => {
    const clampedVolume = Math.min(volume, volumeCap);
    audioPlayer.setVolume(clampedVolume);
  };

  const canNavigatePrevious = queue.length > 1 && queueIndex > 0;
  const canNavigateNext = queue.length > 1 && queueIndex < queue.length - 1;

  const navigatePrevious = () => {
    if (canNavigatePrevious) {
      const newIndex = queueIndex - 1;
      setQueueIndex(newIndex);
      setCurrentItem(queue[newIndex]);
    }
  };

  const navigateNext = () => {
    if (canNavigateNext) {
      const newIndex = queueIndex + 1;
      setQueueIndex(newIndex);
      setCurrentItem(queue[newIndex]);
    }
  };

  const value: PlaybackContextValue = {
    currentItem,
    isPlaying: audioPlayer.isPlaying,
    volume: audioPlayer.volume,
    volumeCap,
    error: audioPlayer.error,
    errorType: audioPlayer.errorType,
    play: audioPlayer.play,
    pause: audioPlayer.pause,
    stop: () => {
      audioPlayer.stop();
      setCurrentItem(null);
      setQueue([]);
      setQueueIndex(-1);
    },
    setVolume: handleSetVolume,
    clearError: audioPlayer.clearError,
    startPlayback,
    canNavigatePrevious,
    canNavigateNext,
    navigatePrevious,
    navigateNext,
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
}
