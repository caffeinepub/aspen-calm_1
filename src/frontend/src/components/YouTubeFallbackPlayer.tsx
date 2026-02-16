import { useState } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { audioPharmacyYouTube } from '../utils/externalLinks';

interface YouTubeFallbackPlayerProps {
  programId: string;
  title: string;
}

export default function YouTubeFallbackPlayer({ programId, title }: YouTubeFallbackPlayerProps) {
  const [embedError, setEmbedError] = useState(false);
  const youtubeUrl = audioPharmacyYouTube[programId as keyof typeof audioPharmacyYouTube];

  if (!youtubeUrl) {
    return null;
  }

  const handleOpenYouTube = () => {
    window.open(youtubeUrl, '_blank', 'noreferrer');
  };

  // Extract video ID from YouTube URL if it's a direct video link
  const getYouTubeEmbedUrl = (url: string): string | null => {
    // For search results, we can't embed, return null
    if (url.includes('youtube.com/results')) {
      return null;
    }
    
    // For direct video links
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&loop=1`;
    }
    
    return null;
  };

  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  return (
    <div className="space-y-4">
      <div className="h-px bg-border" />
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground text-center">
          YouTube Fallback
        </h3>
        
        {embedUrl && !embedError ? (
          <div className="space-y-3">
            <div className="aspect-video rounded-lg overflow-hidden bg-black/20">
              <iframe
                src={embedUrl}
                title={`${title} - YouTube`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                onError={() => setEmbedError(true)}
              />
            </div>
            <p className="text-sm text-center text-foreground/70">
              Playing from YouTube
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {embedError && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  YouTube embedding is blocked. Use the button below to open in a new tab.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="text-center space-y-3">
              <p className="text-sm text-foreground/70">
                Can't play the audio? Listen on YouTube instead:
              </p>
              <Button
                onClick={handleOpenYouTube}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Open on YouTube
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
