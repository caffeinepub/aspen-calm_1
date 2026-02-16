import { useNavigate, useParams } from '@tanstack/react-router';
import { Play, Pause, Square, Volume2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePlayback } from '../../../hooks/usePlayback';
import YouTubeFallbackPlayer from '../../../components/YouTubeFallbackPlayer';
import { useClinicalSafety } from '../../../hooks/useClinicalSafety';
import { useState } from 'react';

const programTitles: Record<string, string> = {
  'sonic-shield': 'The Sonic Shield',
  'deep-zen': 'Deep Zen',
  'garden-escape': 'Garden Escape',
};

export default function NowPlaying() {
  const navigate = useNavigate();
  const { programId } = useParams({ from: '/now-playing/$programId' });
  const programTitle = programTitles[programId];
  
  const {
    currentItem,
    isPlaying,
    volume,
    volumeCap,
    error,
    errorType,
    play,
    pause,
    stop,
    setVolume,
    clearError,
  } = usePlayback();
  
  const { emergencyTalkActive } = useClinicalSafety();
  const [showYouTubeFallback, setShowYouTubeFallback] = useState(false);

  if (!programTitle) {
    return (
      <div className="min-h-screen bg-twilight p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Program not found</h1>
          <Button onClick={() => navigate({ to: '/audio-pharmacy' })}>Back to Audio Pharmacy</Button>
        </div>
      </div>
    );
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = Math.min(value[0], volumeCap);
    setVolume(newVolume);
  };

  const handlePlayClick = () => {
    clearError();
    setShowYouTubeFallback(false);
    play();
  };

  const handleSwitchToYouTube = () => {
    if (isPlaying) {
      pause();
    }
    setShowYouTubeFallback(true);
    clearError();
  };

  const isVolumeCapped = volume >= volumeCap;
  const hasPlaybackError = error && (errorType === 'network' || errorType === 'unsupported' || errorType === 'playback');

  return (
    <div className="min-h-screen bg-twilight p-4 md:p-8">
      <div className="container mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Now Playing</h1>
        </div>

        <div className="glass-panel border-white/10 p-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{currentItem?.title || programTitle}</h2>
            <p className="text-foreground/70">Continuous loop - 3 hour session</p>
          </div>

          {!showYouTubeFallback && (
            <>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-foreground" />
                    <span className="font-medium text-foreground">Volume</span>
                  </div>
                  <span className="text-foreground/70">
                    {volume}% {isVolumeCapped && '(Max)'}
                  </span>
                </div>
                <Slider value={[volume]} onValueChange={handleVolumeChange} max={volumeCap} step={1} />
                {isVolumeCapped && (
                  <p className="text-sm text-amber-500">Safe volume limit reached (set by staff)</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={isPlaying ? pause : handlePlayClick}
                  className="flex-1 btn-primary"
                  size="lg"
                  disabled={emergencyTalkActive}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-6 w-6 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-6 w-6 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                <Button onClick={stop} variant="outline" size="lg" disabled={!isPlaying}>
                  <Square className="h-6 w-6" />
                </Button>
              </div>

              {hasPlaybackError && (
                <div className="space-y-3">
                  <div className="h-px bg-border" />
                  <div className="text-center space-y-3">
                    <p className="text-sm text-foreground/70">
                      Having trouble with playback? Switch to YouTube:
                    </p>
                    <Button
                      onClick={handleSwitchToYouTube}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Switch to YouTube
                    </Button>
                  </div>
                </div>
              )}

              {emergencyTalkActive && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Audio paused for emergency talk</AlertDescription>
                </Alert>
              )}
            </>
          )}

          {showYouTubeFallback && (
            <div className="space-y-4">
              <YouTubeFallbackPlayer programId={programId} title={programTitle} />
              
              <div className="text-center">
                <Button
                  onClick={() => setShowYouTubeFallback(false)}
                  variant="ghost"
                  size="sm"
                >
                  ← Back to local playback
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
