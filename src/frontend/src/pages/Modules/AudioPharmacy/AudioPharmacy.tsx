import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Play, ExternalLink, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassTile from '../../../components/GlassTile';
import OfflineBadge from '../../../components/OfflineBadge';
import LocalFileAudioPlayer from '../../../components/LocalFileAudioPlayer';
import { useIntakeState } from '../../../hooks/useIntakeState';
import { usePlayback } from '../../../hooks/usePlayback';
import { useState } from 'react';
import { SiSpotify } from 'react-icons/si';
import { audioPharmacySpotify } from '../../../utils/externalLinks';
import { getAssetUrl } from '../../../utils/assetUrl';

interface AudioProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  isOfflineCapable: boolean;
}

const audioPrograms: AudioProgram[] = [
  {
    id: 'sonic-shield',
    title: 'The Sonic Shield',
    description: 'Deep brown noise designed to mask dental procedure sounds. 3-hour gapless loop.',
    duration: '3 hours',
    isOfflineCapable: true,
  },
  {
    id: 'deep-zen',
    title: 'Deep Zen',
    description: '5Hz Theta wave binaural beats for brainwave entrainment and deep relaxation.',
    duration: '1 hour',
    isOfflineCapable: true,
  },
  {
    id: 'garden-escape',
    title: 'Garden Escape',
    description: '432Hz spatial audio mixing rainforest sounds with ambient piano.',
    duration: '45 minutes',
    isOfflineCapable: true,
  },
];

const programData: Record<string, { audioSrc: string; loop: boolean }> = {
  'sonic-shield': {
    audioSrc: getAssetUrl('assets/audio/sonic-shield-brown-noise.mp3'),
    loop: true,
  },
  'deep-zen': {
    audioSrc: getAssetUrl('assets/audio/deep-zen-5hz-binaural.mp3'),
    loop: true,
  },
  'garden-escape': {
    audioSrc: getAssetUrl('assets/audio/garden-escape-432hz-rainforest-piano.mp3'),
    loop: true,
  },
};

const spotifyCollections = [
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    description: 'Instrumental beats to help you concentrate',
    url: audioPharmacySpotify.deepFocus,
  },
  {
    id: 'peaceful-piano',
    title: 'Peaceful Piano',
    description: 'Relax and indulge with beautiful piano pieces',
    url: audioPharmacySpotify.peacefulPiano,
  },
  {
    id: 'ambient-relaxation',
    title: 'Ambient Relaxation',
    description: 'Softly soothing ambient music',
    url: audioPharmacySpotify.ambientRelaxation,
  },
  {
    id: 'nature-sounds',
    title: 'Nature Sounds',
    description: 'Calming sounds from nature',
    url: audioPharmacySpotify.natureSounds,
  },
];

export default function AudioPharmacy() {
  const navigate = useNavigate();
  const { intakeState } = useIntakeState();
  const { startPlayback } = usePlayback();
  const [downloadedPrograms, setDownloadedPrograms] = useState<Set<string>>(new Set(['sonic-shield', 'deep-zen']));

  const anxietyLevel = Number(intakeState.anxietyLevel);
  const isHighAnxiety = anxietyLevel >= 7;

  const orderedPrograms = [...audioPrograms].sort((a, b) => {
    if (isHighAnxiety) {
      const aIsRecommended = a.id === 'sonic-shield' || a.id === 'deep-zen';
      const bIsRecommended = b.id === 'sonic-shield' || b.id === 'deep-zen';
      if (aIsRecommended && !bIsRecommended) return -1;
      if (!aIsRecommended && bIsRecommended) return 1;
    }
    return 0;
  });

  const toggleDownload = (programId: string) => {
    setDownloadedPrograms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(programId)) {
        newSet.delete(programId);
      } else {
        newSet.add(programId);
      }
      return newSet;
    });
  };

  const handlePlayProgram = (program: AudioProgram) => {
    const data = programData[program.id];
    if (data) {
      startPlayback({
        id: program.id,
        title: program.title,
        audioSrc: data.audioSrc,
        icon: <Music className="h-5 w-5 text-primary" />,
        loop: data.loop,
      });
      // Navigate to Now Playing page
      navigate({ to: '/now-playing/$programId', params: { programId: program.id } });
    }
  };

  const handleOpenSpotify = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <div className="min-h-screen bg-twilight p-4 md:p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audio Pharmacy</h1>
            <p className="text-foreground/70">Therapeutic audio optimized for Bose Ultra</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Built-in Programs</h2>
          <p className="text-sm text-foreground/60">
            Tap Play Now to start. If playback fails, you'll see a YouTube option.
          </p>
          {orderedPrograms.map((program) => {
            const isRecommended = isHighAnxiety && (program.id === 'sonic-shield' || program.id === 'deep-zen');
            const isDownloaded = downloadedPrograms.has(program.id);

            return (
              <GlassTile key={program.id} className="relative">
                {isRecommended && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                    Recommended
                  </Badge>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">{program.title}</h3>
                    <p className="text-foreground/70 mb-2">{program.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline">{program.duration}</Badge>
                      <OfflineBadge
                        isOfflineCapable={program.isOfflineCapable}
                        isDownloaded={isDownloaded}
                        onToggleDownload={() => toggleDownload(program.id)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePlayProgram(program)}
                    className="w-full btn-primary"
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Play Now
                  </Button>
                </div>
              </GlassTile>
            );
          })}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Play from Your Device</h2>
          <GlassTile>
            <div className="space-y-3">
              <p className="text-foreground/70">Select an audio file stored on your iPad to play</p>
              <LocalFileAudioPlayer />
            </div>
          </GlassTile>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Spotify (Online)</h2>
          <p className="text-sm text-foreground/60">Curated playlists for relaxation and focus</p>
          {spotifyCollections.map((collection) => (
            <GlassTile key={collection.id} onClick={() => handleOpenSpotify(collection.url)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-green-700">
                    <SiSpotify className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-semibold text-foreground">{collection.title}</h3>
                    <p className="text-sm text-foreground/60">{collection.description}</p>
                    <Badge variant="outline">Internet Required</Badge>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-foreground/40 shrink-0" />
              </div>
            </GlassTile>
          ))}
        </div>
      </div>
    </div>
  );
}
