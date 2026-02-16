import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { usePlayback } from '../hooks/usePlayback';
import { useClinicalSafety } from '../hooks/useClinicalSafety';

interface NowPlayingBarProps {
  bottomOffset: number;
}

export default function NowPlayingBar({ bottomOffset }: NowPlayingBarProps) {
  const {
    currentItem,
    isPlaying,
    volume,
    volumeCap,
    play,
    pause,
    setVolume,
    canNavigatePrevious,
    canNavigateNext,
    navigatePrevious,
    navigateNext,
  } = usePlayback();
  
  const { emergencyTalkActive } = useClinicalSafety();

  // Don't render if no content is selected
  if (!currentItem) {
    return null;
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const isVolumeCapped = volume >= volumeCap;

  return (
    <div 
      className="now-playing-bar-container"
      style={{ bottom: `${bottomOffset}px` }}
    >
      <div className="glass-panel border-white/20 p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            {currentItem.icon || <Music className="h-5 w-5 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Now Playing</p>
            <h3 className="text-sm font-semibold text-foreground truncate">{currentItem.title}</h3>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-3">
          {/* Previous Button */}
          <Button
            onClick={navigatePrevious}
            disabled={!canNavigatePrevious || emergencyTalkActive}
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          {/* Play/Pause Button */}
          <Button
            onClick={isPlaying ? pause : play}
            disabled={emergencyTalkActive}
            className="h-12 w-12 shrink-0 btn-primary rounded-full"
            size="icon"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>

          {/* Next Button */}
          <Button
            onClick={navigateNext}
            disabled={!canNavigateNext || emergencyTalkActive}
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
          >
            <SkipForward className="h-5 w-5" />
          </Button>

          {/* Volume Control */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <Volume2 className="h-4 w-4 text-foreground shrink-0" />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={volumeCap}
              step={1}
              className="flex-1"
            />
            <span className="text-xs font-medium text-foreground/70 w-12 text-right shrink-0">
              {volume}%{isVolumeCapped && ' ★'}
            </span>
          </div>
        </div>

        {/* Emergency Talk Warning */}
        {emergencyTalkActive && (
          <p className="text-xs text-amber-500 text-center">
            Playback paused for emergency talk
          </p>
        )}
      </div>
    </div>
  );
}
