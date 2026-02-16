import { ExternalLink, LucideIcon } from 'lucide-react';
import GlassTile from '../../../components/GlassTile';

interface CategoryTileProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export default function CategoryTile({ title, description, icon: Icon, onClick }: CategoryTileProps) {
  return (
    <GlassTile onClick={onClick} className="audiobook-category-tile">
      <div className="flex items-start gap-4 md:gap-6">
        <div className="flex-shrink-0 p-4 md:p-5 rounded-2xl bg-primary/10">
          <Icon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm md:text-base text-foreground/70 mb-4">{description}</p>
          <div className="flex items-center gap-2 text-primary font-medium text-sm md:text-base">
            <span>Open</span>
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
          </div>
        </div>
      </div>
    </GlassTile>
  );
}
