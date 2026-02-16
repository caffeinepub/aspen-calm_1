import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';

export default function LocalFileAudioPlayer() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup object URL on unmount
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    const supportedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac'];
    if (!supportedTypes.some((type) => file.type.startsWith('audio/'))) {
      setError('Unsupported file type. Please select an audio file (MP3, WAV, OGG, M4A, AAC).');
      return;
    }

    setError(null);
    setAudioFile(file);
    setIsPlaying(false);
    setCurrentTime(0);

    // Cleanup previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    // Create new object URL
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;

    // Create new audio element
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(objectUrl);
    audio.volume = volume / 100;
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audio.addEventListener('error', () => {
      setError('Failed to load audio file. The file may be corrupted or in an unsupported format.');
      setIsPlaying(false);
    });
  };

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch (err) {
      console.error('Playback error:', err);
      setError('Unable to play audio. Please try again.');
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="audio-file-input">
          <Button variant="outline" className="cursor-pointer" asChild>
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {audioFile ? 'Change File' : 'Select Audio File'}
            </span>
          </Button>
        </label>
        <input
          id="audio-file-input"
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        {audioFile && (
          <span className="text-sm text-foreground/70 truncate max-w-xs">{audioFile.name}</span>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {audioFile && !error && (
        <div className="space-y-4 glass-panel border-white/10 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/70">{formatTime(currentTime)}</span>
            <span className="text-sm text-foreground/70">{formatTime(duration)}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Volume</span>
              <span className="text-sm text-foreground/70">{volume}%</span>
            </div>
            <Slider value={[volume]} onValueChange={handleVolumeChange} max={100} step={1} />
          </div>

          <Button onClick={handlePlayPause} className="w-full btn-primary" size="lg" disabled={!audioFile}>
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Play
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
