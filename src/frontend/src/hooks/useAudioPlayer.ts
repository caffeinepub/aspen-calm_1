import { useState, useRef, useEffect } from 'react';

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  error: string | null;
  errorType: 'network' | 'unsupported' | 'playback' | null;
}

export function useAudioPlayer(audioSrc: string, loop: boolean = false) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryAttemptedRef = useRef(false);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 70,
    error: null,
    errorType: null,
  });

  useEffect(() => {
    if (!audioSrc) return;

    const audio = new Audio(audioSrc);
    audio.loop = loop;
    audio.volume = state.volume / 100;
    audio.preload = 'auto';
    audioRef.current = audio;
    retryAttemptedRef.current = false;

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration, error: null, errorType: null }));
    };

    const handleEnded = () => {
      if (!loop) {
        setState((prev) => ({ ...prev, isPlaying: false }));
      }
    };

    const handleError = (e: ErrorEvent | Event) => {
      const audioElement = e.target as HTMLAudioElement;
      const errorCode = audioElement?.error?.code;
      
      if (errorCode === MediaError.MEDIA_ERR_NETWORK) {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          error: 'Network error: Unable to load audio. Please check your connection.',
          errorType: 'network',
        }));
      } else if (errorCode === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          error: 'Audio format not supported on this device.',
          errorType: 'unsupported',
        }));
      } else if (errorCode === MediaError.MEDIA_ERR_DECODE) {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          error: 'Audio file is corrupted or cannot be decoded.',
          errorType: 'unsupported',
        }));
      } else if (errorCode === MediaError.MEDIA_ERR_ABORTED) {
        // User aborted, don't show error
        setState((prev) => ({ ...prev, isPlaying: false }));
      } else if (errorCode) {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          error: 'Unable to play this audio file.',
          errorType: 'playback',
        }));
      }
    };

    const handleCanPlay = () => {
      // Clear any previous errors when audio can play
      setState((prev) => ({ ...prev, error: null, errorType: null }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Preload the audio
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioSrc, loop]);

  const play = async () => {
    if (audioRef.current) {
      try {
        // Wait for audio to be ready
        if (audioRef.current.readyState < 2) {
          await new Promise<void>((resolve) => {
            const handleCanPlay = () => {
              audioRef.current?.removeEventListener('canplay', handleCanPlay);
              resolve();
            };
            audioRef.current?.addEventListener('canplay', handleCanPlay);
          });
        }

        await audioRef.current.play();
        setState((prev) => ({ ...prev, isPlaying: true, error: null, errorType: null }));
        retryAttemptedRef.current = false;
      } catch (error: any) {
        console.error('Playback error:', error);
        
        // Automatic retry for transient iOS/Safari play() rejections
        if (!retryAttemptedRef.current && error.name === 'NotAllowedError') {
          retryAttemptedRef.current = true;
          console.log('Retrying playback after NotAllowedError...');
          
          // Wait a brief moment and retry
          setTimeout(async () => {
            try {
              await audioRef.current?.play();
              setState((prev) => ({ ...prev, isPlaying: true, error: null, errorType: null }));
            } catch (retryError) {
              console.error('Retry failed:', retryError);
              setState((prev) => ({
                ...prev,
                isPlaying: false,
                error: 'Unable to start playback. Your device may have blocked autoplay.',
                errorType: 'playback',
              }));
            }
          }, 300);
        } else if (error.name === 'NotSupportedError') {
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            error: 'Audio format not supported on this device.',
            errorType: 'unsupported',
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            error: 'Unable to start playback. Please try again.',
            errorType: 'playback',
          }));
        }
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      const clampedVolume = Math.max(0, Math.min(100, volume));
      audioRef.current.volume = clampedVolume / 100;
      setState((prev) => ({ ...prev, volume: clampedVolume }));
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null, errorType: null }));
    retryAttemptedRef.current = false;
  };

  return {
    ...state,
    play,
    pause,
    stop,
    setVolume,
    clearError,
  };
}
