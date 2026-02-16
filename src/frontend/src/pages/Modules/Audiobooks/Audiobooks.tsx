import { useEffect, useState } from 'react';
import { BookAudio } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import CategoryTile from './CategoryTile';
import { audiobooksCategories } from '../../../utils/externalLinks';
import { useIntakeState } from '../../../hooks/useIntakeState';
import { ProfileType } from '../../../backend';

type Audience = 'kids' | 'adults';

interface Category {
  id: string;
  title: string;
  description: string;
  icon: typeof BookAudio;
}

const categories: Category[] = [
  {
    id: 'short-stories',
    title: 'Short Stories',
    description: 'Quick tales and narratives',
    icon: BookAudio,
  },
  {
    id: 'light-fiction',
    title: 'Light Fiction',
    description: 'Easy reads and feel-good stories',
    icon: BookAudio,
  },
  {
    id: 'inspirational',
    title: 'Inspirational',
    description: 'Uplifting and motivational content',
    icon: BookAudio,
  },
  {
    id: 'comedy',
    title: 'Comedy',
    description: 'Humorous stories and laughs',
    icon: BookAudio,
  },
  {
    id: 'travel-memoirs',
    title: 'Travel Memoirs',
    description: 'Adventures and journeys',
    icon: BookAudio,
  },
];

export default function Audiobooks() {
  const { intakeState } = useIntakeState();
  
  // Default tab based on intake profile: Kids -> kids, all others -> adults
  const getDefaultAudience = (): Audience => {
    return intakeState.profile === ProfileType.kid ? 'kids' : 'adults';
  };

  const [audience, setAudience] = useState<Audience>(getDefaultAudience());

  // Update audience only on initial mount if profile changes
  useEffect(() => {
    setAudience(getDefaultAudience());
  }, []); // Empty deps - only run once on mount

  const handleOpenCategory = (categoryId: string) => {
    const url = audiobooksCategories[audience][categoryId as keyof typeof audiobooksCategories.kids];
    
    if (!url) {
      toast.error('Link unavailable', {
        description: `The ${categoryId.replace('-', ' ')} category is not available at this time.`,
      });
      return;
    }

    // Safe external navigation
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-twilight p-4 md:p-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Audiobooks</h1>
          <p className="text-lg text-foreground/70">Stories and inspiration for all ages</p>
        </div>

        <Tabs value={audience} onValueChange={(value) => setAudience(value as Audience)} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="glass-panel border-white/10 p-1">
              <TabsTrigger 
                value="kids" 
                className="px-8 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Kids
              </TabsTrigger>
              <TabsTrigger 
                value="adults" 
                className="px-8 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Adults
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="kids" className="space-y-6">
            <div className="audiobook-section-header kids-accent">
              <div className="glass-panel border-white/10 p-4 md:p-6 rounded-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Kids Collection</h2>
                <p className="text-foreground/70">Age-appropriate stories and adventures for young listeners</p>
              </div>
            </div>
            <div className="audiobook-category-grid">
              {categories.map((category) => (
                <CategoryTile
                  key={category.id}
                  id={category.id}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  onClick={() => handleOpenCategory(category.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="adults" className="space-y-6">
            <div className="audiobook-section-header adults-accent">
              <div className="glass-panel border-white/10 p-4 md:p-6 rounded-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Adults Collection</h2>
                <p className="text-foreground/70">Curated audiobooks for mature audiences</p>
              </div>
            </div>
            <div className="audiobook-category-grid">
              {categories.map((category) => (
                <CategoryTile
                  key={category.id}
                  id={category.id}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  onClick={() => handleOpenCategory(category.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
