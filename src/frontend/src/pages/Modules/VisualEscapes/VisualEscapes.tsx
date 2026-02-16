import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Play, X, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GlassTile from '../../../components/GlassTile';
import OfflineBadge from '../../../components/OfflineBadge';
import { useIntakeState } from '../../../hooks/useIntakeState';
import { useClinicalSafety } from '../../../hooks/useClinicalSafety';
import { useMediaActivity } from '../../../hooks/useMediaActivity';
import { ProfileType as ProfileTypeEnum } from '../../../backend';
import { visualEscapesYouTube, kidsCartoonFavorites, type KidsCartoonFavorite } from '../../../utils/externalLinks';

interface VisualEscape {
  id: string;
  title: string;
  description: string;
  videoSrc?: string;
  externalUrl?: string;
  youtubeSearchUrl?: string;
  isOfflineCapable: boolean;
  kidsOnly?: boolean;
}

const visualEscapes: VisualEscape[] = [
  {
    id: 'virtual-window',
    title: 'Virtual Window',
    description: '4K silent drone footage of global landscapes',
    videoSrc: '/assets/video/virtual-window-silent.mp4',
    youtubeSearchUrl: visualEscapesYouTube['virtual-window'],
    isOfflineCapable: true,
  },
  {
    id: 'ocean-nature',
    title: 'Ocean & Nature 4K',
    description: 'Calming ocean waves and natural scenery',
    videoSrc: '/assets/video/ocean-nature-4k.mp4',
    youtubeSearchUrl: visualEscapesYouTube['ocean-nature'],
    isOfflineCapable: true,
  },
  {
    id: 'kids-tv',
    title: 'Kids TV',
    description: 'Safe-filtered YouTube Kids content - Cartoons & Nature',
    externalUrl: 'https://www.youtubekids.com',
    isOfflineCapable: false,
    kidsOnly: true,
  },
];

export default function VisualEscapes() {
  const navigate = useNavigate();
  const { intakeState } = useIntakeState();
  const [playingVideo, setPlayingVideo] = useState<VisualEscape | null>(null);
  const [showKidsTVEmbed, setShowKidsTVEmbed] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showYouTubeFallback, setShowYouTubeFallback] = useState(false);
  const [downloadedVideos, setDownloadedVideos] = useState<Set<string>>(new Set(['virtual-window']));
  const [playingCartoon, setPlayingCartoon] = useState<KidsCartoonFavorite | null>(null);
  const [cartoonEmbedError, setCartoonEmbedError] = useState(false);
  const { emergencyTalkActive } = useClinicalSafety();
  const { setVideoActive } = useMediaActivity();
  const videoRef = useRef<HTMLVideoElement>(null);

  const isKidsProfile = intakeState.profile === ProfileTypeEnum.kid;

  const filteredEscapes = visualEscapes.filter((escape) => {
    if (escape.kidsOnly && !isKidsProfile) {
      return false;
    }
    return true;
  });

  const orderedEscapes = [...filteredEscapes].sort((a, b) => {
    if (isKidsProfile && a.kidsOnly && !b.kidsOnly) return -1;
    if (isKidsProfile && !a.kidsOnly && b.kidsOnly) return 1;
    return 0;
  });

  // Update video activity state when modals open/close
  useEffect(() => {
    const isActive = !!playingVideo || showKidsTVEmbed || !!playingCartoon;
    setVideoActive(isActive);
    
    return () => {
      setVideoActive(false);
    };
  }, [playingVideo, showKidsTVEmbed, playingCartoon, setVideoActive]);

  useEffect(() => {
    if (emergencyTalkActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [emergencyTalkActive]);

  const handlePlayVideo = (escape: VisualEscape) => {
    if (escape.id === 'kids-tv') {
      setShowKidsTVEmbed(true);
      setEmbedError(false);
      return;
    }

    setPlayingVideo(escape);
    setVideoError(false);
    setShowYouTubeFallback(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    // Auto-show YouTube fallback after video error
    setTimeout(() => {
      setShowYouTubeFallback(true);
    }, 500);
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
    setVideoError(false);
    setShowYouTubeFallback(false);
  };

  const handleCloseKidsTV = () => {
    setShowKidsTVEmbed(false);
    setEmbedError(false);
  };

  const handlePlayCartoon = (cartoon: KidsCartoonFavorite) => {
    setPlayingCartoon(cartoon);
    setCartoonEmbedError(false);
  };

  const handleCloseCartoon = () => {
    setPlayingCartoon(null);
    setCartoonEmbedError(false);
  };

  const handleToggleDownload = (escapeId: string) => {
    setDownloadedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(escapeId)) {
        newSet.delete(escapeId);
      } else {
        newSet.add(escapeId);
      }
      return newSet;
    });
  };

  const handleOpenYouTube = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <div className="min-h-screen bg-twilight pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => navigate({ to: '/dashboard' })} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold text-foreground">Visual Escapes</h1>
            <p className="text-foreground/70 mt-2">Immersive nature and calming visuals</p>
          </div>
        </div>

        {/* Kids Quick Cartoon Picks - Only for Kids profile */}
        {isKidsProfile && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Quick Cartoon Picks</h2>
            </div>
            <p className="text-foreground/70 text-sm">Tap to watch your favorite cartoons instantly!</p>
            
            {/* Responsive favorites grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {kidsCartoonFavorites.map((cartoon) => (
                <GlassTile 
                  key={cartoon.id} 
                  className="favorite-tile group cursor-pointer"
                  onClick={() => handlePlayCartoon(cartoon)}
                >
                  <div className="favorite-tile-icon">
                    <Play className="h-8 w-8 text-primary transition-transform group-hover:scale-110 group-active:scale-95" />
                  </div>
                  <h3 className="favorite-tile-title">{cartoon.title}</h3>
                </GlassTile>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {orderedEscapes.map((escape) => (
            <GlassTile key={escape.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">{escape.title}</h3>
                  <p className="text-foreground/70 text-sm mb-4">{escape.description}</p>
                </div>
                {escape.kidsOnly && (
                  <Badge variant="secondary" className="ml-2">
                    Kids
                  </Badge>
                )}
              </div>

              <OfflineBadge
                isOfflineCapable={escape.isOfflineCapable}
                isDownloaded={downloadedVideos.has(escape.id)}
                onToggleDownload={escape.isOfflineCapable ? () => handleToggleDownload(escape.id) : undefined}
              />

              <Button onClick={() => handlePlayVideo(escape)} className="w-full btn-primary" size="lg">
                <Play className="mr-2 h-5 w-5" />
                Play Video
              </Button>
            </GlassTile>
          ))}
        </div>

        {/* Video Player Modal */}
        {playingVideo && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{playingVideo.title}</h2>
                <Button variant="ghost" size="icon" onClick={handleCloseVideo} className="text-white hover:bg-white/10">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {videoError && !showYouTubeFallback && (
                <Alert className="bg-destructive/10 border-destructive/20">
                  <AlertDescription className="text-white">
                    Unable to load the video. Showing YouTube fallback option...
                  </AlertDescription>
                </Alert>
              )}

              {!showYouTubeFallback && playingVideo.videoSrc && (
                <video
                  ref={videoRef}
                  src={playingVideo.videoSrc}
                  controls
                  autoPlay
                  loop
                  className="w-full aspect-video bg-black rounded-lg"
                  onError={handleVideoError}
                  onLoadedData={() => setVideoError(false)}
                />
              )}

              {(showYouTubeFallback || videoError) && playingVideo.youtubeSearchUrl && (
                <div className="space-y-4">
                  <Alert className="bg-primary/10 border-primary/20">
                    <AlertDescription className="text-white">
                      Local video unavailable. Opening curated YouTube content for {playingVideo.title}.
                    </AlertDescription>
                  </Alert>
                  <div className="text-center space-y-3">
                    <p className="text-sm text-white/70">
                      Can't play the video? Watch on YouTube instead:
                    </p>
                    <Button
                      onClick={() => handleOpenYouTube(playingVideo.youtubeSearchUrl!)}
                      variant="outline"
                      size="lg"
                      className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Open on YouTube
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Kids TV Embed Modal */}
        {showKidsTVEmbed && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Kids TV</h2>
                <Button variant="ghost" size="icon" onClick={handleCloseKidsTV} className="text-white hover:bg-white/10">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {!embedError ? (
                <iframe
                  src="https://www.youtubekids.com"
                  className="w-full aspect-video bg-black rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => setEmbedError(true)}
                />
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-primary/10 border-primary/20">
                    <AlertDescription className="text-white">
                      YouTube Kids cannot be embedded. Opening in a new tab for the best experience.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={() => window.open('https://www.youtubekids.com', '_blank')}
                    className="w-full btn-primary"
                    size="lg"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Open YouTube Kids
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cartoon Player Modal */}
        {playingCartoon && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{playingCartoon.title}</h2>
                <Button variant="ghost" size="icon" onClick={handleCloseCartoon} className="text-white hover:bg-white/10">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-4">
                <Alert className="bg-primary/10 border-primary/20">
                  <AlertDescription className="text-white">
                    Opening {playingCartoon.title} on YouTube for the best viewing experience.
                  </AlertDescription>
                </Alert>
                <div className="text-center space-y-3">
                  <p className="text-sm text-white/70">
                    Click below to watch {playingCartoon.title} episodes:
                  </p>
                  <Button
                    onClick={() => handleOpenYouTube(playingCartoon.externalUrl)}
                    variant="outline"
                    size="lg"
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Watch on YouTube
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
