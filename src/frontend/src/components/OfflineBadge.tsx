import { Download, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OfflineBadgeProps {
  isOfflineCapable: boolean;
  isDownloaded?: boolean;
  onToggleDownload?: () => void;
  className?: string;
}

export default function OfflineBadge({
  isOfflineCapable,
  isDownloaded = false,
  onToggleDownload,
  className,
}: OfflineBadgeProps) {
  if (!isOfflineCapable) {
    return (
      <Badge variant="outline" className={cn('gap-1', className)}>
        <Wifi className="h-3 w-3" />
        Internet Required
      </Badge>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant={isDownloaded ? 'default' : 'outline'} className="gap-1">
        <WifiOff className="h-3 w-3" />
        {isDownloaded ? 'Available Offline' : 'Offline Capable'}
      </Badge>
      {onToggleDownload && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDownload}
          className="h-7 px-2 text-xs"
        >
          <Download className="h-3 w-3 mr-1" />
          {isDownloaded ? 'Remove' : 'Download'}
        </Button>
      )}
    </div>
  );
}
