import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import GlassTile from '../../../components/GlassTile';
import { useLanguagePreference } from '../../../hooks/useLanguagePreference';
import { SiSpotify, SiYoutube, SiApplemusic } from 'react-icons/si';
import type { Language, MediaProvider } from '../../../backend';
import { Language as LanguageEnum, MediaProvider as MediaProviderEnum } from '../../../backend';
import { spotifyPlaylists } from '../../../utils/externalLinks';

interface Playlist {
  id: string;
  title: string;
  language: Language;
  provider: MediaProvider;
  url: string;
  category: 'hits' | 'classics' | 'upbeat';
}

const playlists: Playlist[] = [
  // Kannada playlists
  {
    id: 'kannada-hits',
    title: 'Latest Kannada Hits',
    language: LanguageEnum.kannada,
    provider: MediaProviderEnum.spotify,
    url: spotifyPlaylists[LanguageEnum.kannada].hits,
    category: 'hits',
  },
  {
    id: 'kannada-classics',
    title: 'Kannada Classics',
    language: LanguageEnum.kannada,
    provider: MediaProviderEnum.spotify,
    url: spotifyPlaylists[LanguageEnum.kannada].classics,
    category: 'classics',
  },
  // Hindi playlists
  {
    id: 'bollywood-hits',
    title: 'Bollywood Top 50',
    language: LanguageEnum.hindi,
    provider: MediaProviderEnum.spotify,
    url: spotifyPlaylists[LanguageEnum.hindi].hits,
    category: 'hits',
  },
  {
    id: 'bollywood-classics',
    title: 'Bollywood Classics',
    language: LanguageEnum.hindi,
    provider: MediaProviderEnum.spotify,
    url: spotifyPlaylists[LanguageEnum.hindi].classics,
    category: 'classics',
  },
  // Telugu playlists
  {
    id: 'telugu-hits',
    title: 'Telugu Top Hits',
    language: LanguageEnum.telugu,
    provider: MediaProviderEnum.spotify,
    url: spotifyPlaylists[LanguageEnum.telugu].hits,
    category: 'hits',
  },
  {
    id: 'telugu-classics',
    title: 'Telugu Classics',
    language: LanguageEnum.telugu,
    provider: MediaProviderEnum.spotify,
    url: spotifyPlaylists[LanguageEnum.telugu].classics,
    category: 'classics',
  },
  // Tamil playlists
  {
    id: 'tamil-hits',
    title: 'Tamil Chartbusters',
    language: LanguageEnum.tamil,
    provider: MediaProviderEnum.spotify,
    url: spotifyPlaylists[LanguageEnum.tamil].hits,
    category: 'hits',
  },
  {
    id: 'tamil-classics',
    title: 'Tamil Classics',
    language: LanguageEnum.tamil,
    provider: MediaProviderEnum.spotify,
    url: spotifyPlaylists[LanguageEnum.tamil].classics,
    category: 'classics',
  },
  // English playlists
  {
    id: 'modern-chill',
    title: 'Modern Chill - Lofi Beats',
    language: LanguageEnum.english,
    provider: MediaProviderEnum.spotify,
    url: spotifyPlaylists[LanguageEnum.english].lofi,
    category: 'upbeat',
  },
  {
    id: 'retro-comfort',
    title: 'Retro Comfort - 70s & 80s',
    language: LanguageEnum.english,
    provider: MediaProviderEnum.spotify,
    url: spotifyPlaylists[LanguageEnum.english].classics,
    category: 'classics',
  },
  {
    id: 'upbeat-energy',
    title: 'Active Distraction - High Energy',
    language: LanguageEnum.english,
    provider: MediaProviderEnum.youtubeMusic,
    url: 'https://music.youtube.com/playlist?list=RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJFs',
    category: 'upbeat',
  },
];

const languages: { value: Language; label: string }[] = [
  { value: LanguageEnum.english, label: 'English' },
  { value: LanguageEnum.kannada, label: 'Kannada' },
  { value: LanguageEnum.hindi, label: 'Hindi' },
  { value: LanguageEnum.telugu, label: 'Telugu' },
  { value: LanguageEnum.tamil, label: 'Tamil' },
];

const providerIcons: Record<MediaProvider, typeof SiSpotify> = {
  [MediaProviderEnum.spotify]: SiSpotify,
  [MediaProviderEnum.youtubeMusic]: SiYoutube,
  [MediaProviderEnum.appleMusic]: SiApplemusic,
};

const providerNames: Record<MediaProvider, string> = {
  [MediaProviderEnum.spotify]: 'Spotify',
  [MediaProviderEnum.youtubeMusic]: 'YouTube Music',
  [MediaProviderEnum.appleMusic]: 'Apple Music',
};

export default function RegionalRadio() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguagePreference();

  const handleOpenPlaylist = (url: string) => {
    window.open(url, '_blank');
  };

  const handleTabChange = (newLanguage: string) => {
    setLanguage(newLanguage as Language);
  };

  return (
    <div className="min-h-screen bg-twilight p-4 md:p-8">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Regional Radio & Hits</h1>
            <p className="text-foreground/70">Music in your language</p>
          </div>
        </div>

        <Tabs value={language} onValueChange={handleTabChange} className="w-full">
          <TabsList className="glass-panel border-white/10 w-full justify-start overflow-x-auto">
            {languages.map((lang) => (
              <TabsTrigger key={lang.value} value={lang.value} className="flex-shrink-0">
                {lang.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {languages.map((lang) => {
            const langPlaylists = playlists.filter((p) => p.language === lang.value);
            return (
              <TabsContent key={lang.value} value={lang.value} className="space-y-4 mt-6">
                {langPlaylists.length === 0 ? (
                  <div className="glass-panel border-white/10 p-8 text-center">
                    <p className="text-foreground/70">No playlists available for this language yet</p>
                  </div>
                ) : (
                  langPlaylists.map((playlist) => {
                    const ProviderIcon = providerIcons[playlist.provider];
                    return (
                      <GlassTile key={playlist.id}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <h3 className="text-xl font-semibold text-foreground">{playlist.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="gap-1">
                                <ProviderIcon className="h-3 w-3" />
                                {providerNames[playlist.provider]}
                              </Badge>
                              {playlist.category === 'upbeat' && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                                  Active Distraction
                                </Badge>
                              )}
                              <Badge variant="outline">Internet Required</Badge>
                            </div>
                          </div>
                          <Button onClick={() => handleOpenPlaylist(playlist.url)} className="btn-primary">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                          </Button>
                        </div>
                      </GlassTile>
                    );
                  })
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
