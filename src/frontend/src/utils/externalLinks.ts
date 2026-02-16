/**
 * Centralized external links for Spotify playlists, streaming providers, Kids cartoon favorites, and Audiobooks
 * to ensure correct language-specific URLs and reduce maintenance overhead
 */

import { Language, MediaProvider, OTTProvider } from '../backend';

// Spotify playlist URLs by language
export const spotifyPlaylists = {
  [Language.kannada]: {
    hits: 'https://open.spotify.com/playlist/37i9dQZF1DWZqTcNLmb3sH', // Latest Kannada
    classics: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp', // Kannada Classics
  },
  [Language.hindi]: {
    hits: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM', // Hot Hits Hindi (Official Spotify)
    classics: 'https://open.spotify.com/playlist/4hgLMZWGcTH9bPFJYegzpM', // Hindi Handpicked
  },
  [Language.telugu]: {
    hits: 'https://open.spotify.com/playlist/37i9dQZF1DX6XE7HRLM75P', // Hot Hits Telugu (Official Spotify)
    classics: 'https://open.spotify.com/playlist/37i9dQZF1DX44F1QWqYoaV', // Telugu Love Songs (Official Spotify)
  },
  [Language.tamil]: {
    hits: 'https://open.spotify.com/playlist/1uvSuVApwODnOSBGkpBiR6', // Tamil Top 50 (Official Spotify)
    classics: 'https://open.spotify.com/playlist/37i9dQZF1DX4Gs5Zzqe0Zy', // Tamil Classics (Official Spotify)
  },
  [Language.english]: {
    lofi: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn', // Lofi Beats
    classics: 'https://open.spotify.com/playlist/37i9dQZF1DWTJ7xPn4vNaz', // 70s & 80s Hits
  },
};

// Audio Pharmacy curated Spotify collections
export const audioPharmacySpotify = {
  deepFocus: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', // Deep Focus
  peacefulPiano: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', // Peaceful Piano
  ambientRelaxation: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp', // Ambient Relaxation
  natureSounds: 'https://open.spotify.com/playlist/37i9dQZF1DX4PP3DA4J0N8', // Nature Sounds
};

// YouTube fallback destinations for Audio Pharmacy built-in programs
export const audioPharmacyYouTube = {
  'sonic-shield': 'https://www.youtube.com/results?search_query=brown+noise+3+hours+sleep', // Brown noise / nature sounds
  'deep-zen': 'https://www.youtube.com/results?search_query=4hz+theta+waves+meditation', // 4-5Hz binaural beats
  'garden-escape': 'https://www.youtube.com/results?search_query=432hz+nature+sounds+relaxation', // 432Hz nature/piano
};

// Visual Escapes YouTube fallback destinations
export const visualEscapesYouTube = {
  'virtual-window': 'https://www.youtube.com/results?search_query=4k+drone+footage+silent+nature',
  'ocean-nature': 'https://www.youtube.com/results?search_query=4k+ocean+waves+nature+sounds',
};

// Kids cartoon favorites - one-tap quick picks
export interface KidsCartoonFavorite {
  id: string;
  title: string;
  embedUrl?: string;
  externalUrl: string;
}

export const kidsCartoonFavorites: KidsCartoonFavorite[] = [
  {
    id: 'peppa-pig',
    title: 'Peppa Pig',
    externalUrl: 'https://www.youtube.com/results?search_query=peppa+pig+full+episodes',
  },
  {
    id: 'shinchan',
    title: 'Shinchan',
    externalUrl: 'https://www.youtube.com/results?search_query=shin+chan+episodes',
  },
  {
    id: 'bluey',
    title: 'Bluey',
    externalUrl: 'https://www.youtube.com/results?search_query=bluey+full+episodes',
  },
  {
    id: 'paw-patrol',
    title: 'PAW Patrol',
    externalUrl: 'https://www.youtube.com/results?search_query=paw+patrol+full+episodes',
  },
  {
    id: 'spongebob',
    title: 'SpongeBob SquarePants',
    externalUrl: 'https://www.youtube.com/results?search_query=spongebob+squarepants+full+episodes',
  },
  {
    id: 'daniel-tiger',
    title: "Daniel Tiger's Neighborhood",
    externalUrl: 'https://www.youtube.com/results?search_query=daniel+tiger+full+episodes',
  },
];

// Audiobooks category destinations by audience
export const audiobooksCategories = {
  kids: {
    'short-stories': 'https://www.youtube.com/results?search_query=kids+short+stories+audiobook',
    'light-fiction': 'https://www.youtube.com/results?search_query=children+fiction+audiobook',
    'inspirational': 'https://www.youtube.com/results?search_query=inspirational+stories+for+kids+audiobook',
    'comedy': 'https://www.youtube.com/results?search_query=funny+stories+for+kids+audiobook',
    'travel-memoirs': 'https://www.youtube.com/results?search_query=adventure+stories+for+kids+audiobook',
  },
  adults: {
    'short-stories': 'https://www.youtube.com/results?search_query=short+stories+audiobook+adults',
    'light-fiction': 'https://www.youtube.com/results?search_query=light+fiction+audiobook',
    'inspirational': 'https://www.youtube.com/results?search_query=inspirational+audiobook',
    'comedy': 'https://www.youtube.com/results?search_query=comedy+audiobook',
    'travel-memoirs': 'https://www.youtube.com/results?search_query=travel+memoir+audiobook',
  },
};

// OTT Provider URLs
export const ottProviderUrls = {
  [OTTProvider.netflix]: 'https://www.netflix.com',
  [OTTProvider.primeVideo]: 'https://www.primevideo.com',
  [OTTProvider.hotstar]: 'https://www.hotstar.com',
  [OTTProvider.youtube]: 'https://www.youtube.com',
};

// Media Provider URLs
export const mediaProviderUrls = {
  [MediaProvider.spotify]: 'https://open.spotify.com',
  [MediaProvider.youtubeMusic]: 'https://music.youtube.com',
  [MediaProvider.appleMusic]: 'https://music.apple.com',
};
