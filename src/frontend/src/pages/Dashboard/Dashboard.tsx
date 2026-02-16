import { useNavigate } from '@tanstack/react-router';
import { Music, Film, Waves, Headphones, Baby, Users, User, UserCog, BookAudio } from 'lucide-react';
import GlassTile from '../../components/GlassTile';
import { useIntakeState } from '../../hooks/useIntakeState';
import { useDisplayMode } from '../../hooks/useDisplayMode';
import DashboardDisplayModeToggle from '../../components/DashboardDisplayModeToggle';
import { Badge } from '@/components/ui/badge';
import { ProfileType as ProfileTypeEnum, Mood as MoodEnum, Vibe as VibeEnum } from '../../backend';

export default function Dashboard() {
  const navigate = useNavigate();
  const { intakeState } = useIntakeState();
  const { displayMode } = useDisplayMode();

  const anxietyLevel = Number(intakeState.anxietyLevel);
  const isHighAnxiety = anxietyLevel >= 7;

  // Get profile label
  const getProfileLabel = () => {
    switch (intakeState.profile) {
      case ProfileTypeEnum.kid:
        return 'Kids';
      case ProfileTypeEnum.teen:
        return 'Teens';
      case ProfileTypeEnum.adult:
        return 'Adults';
      case ProfileTypeEnum.senior:
        return 'Seniors';
      default:
        return 'Not selected';
    }
  };

  // Get mood label
  const getMoodLabel = () => {
    switch (intakeState.mood) {
      case MoodEnum.relax:
        return 'Relax';
      case MoodEnum.distract:
        return 'Distract';
      case MoodEnum.listen:
        return 'Listen';
      default:
        return 'Not selected';
    }
  };

  // Get vibe label
  const getVibeLabel = () => {
    if (intakeState.mood !== MoodEnum.relax) return null;
    switch (intakeState.vibe) {
      case VibeEnum.escape:
        return 'Escape';
      case VibeEnum.focus:
        return 'Focus';
      case VibeEnum.nurture:
        return 'Nurture';
      default:
        return 'Not selected';
    }
  };

  const tiles = [
    {
      id: 'audio-pharmacy',
      title: 'Audio Pharmacy',
      description: isHighAnxiety
        ? 'Recommended: Calming sounds for relaxation'
        : 'Therapeutic audio experiences',
      icon: Headphones,
      path: '/audio-pharmacy',
      recommended: isHighAnxiety || intakeState.mood === MoodEnum.relax,
      priority: isHighAnxiety ? 1 : intakeState.mood === MoodEnum.relax ? 2 : 5,
    },
    {
      id: 'regional-radio',
      title: 'Regional Radio & Hits',
      description: 'Music in your language',
      icon: Music,
      path: '/regional-radio',
      recommended: intakeState.mood === MoodEnum.listen,
      priority: intakeState.mood === MoodEnum.listen ? 1 : 4,
    },
    {
      id: 'cinema',
      title: 'Cinema',
      description: 'Movies and entertainment',
      icon: Film,
      path: '/cinema',
      recommended: intakeState.mood === MoodEnum.distract,
      priority: intakeState.mood === MoodEnum.distract ? 1 : 3,
    },
    {
      id: 'visual-escapes',
      title: 'Visual Escapes',
      description: '4K nature and calming visuals',
      icon: Waves,
      path: '/visual-escapes',
      recommended: intakeState.profile === ProfileTypeEnum.kid || intakeState.vibe === VibeEnum.escape,
      priority: intakeState.profile === ProfileTypeEnum.kid ? 1 : intakeState.vibe === VibeEnum.escape ? 2 : 4,
    },
    {
      id: 'audiobooks',
      title: 'Audiobooks',
      description: 'Stories and inspiration for all ages',
      icon: BookAudio,
      path: '/audiobooks',
      recommended: intakeState.mood === MoodEnum.listen || intakeState.profile === ProfileTypeEnum.kid,
      priority: intakeState.mood === MoodEnum.listen ? 2 : intakeState.profile === ProfileTypeEnum.kid ? 2 : 5,
    },
  ];

  const orderedTiles = [...tiles].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return 0;
  });

  const vibeLabel = getVibeLabel();

  return (
    <div className="min-h-screen bg-twilight p-4 md:p-8" data-display-mode={displayMode}>
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Your Aspen Calm Experience</h1>
          <p className="text-lg text-foreground/70">Personalized for your comfort</p>
        </div>

        {/* Dashboard Display Mode Toggle */}
        <div className="flex justify-center">
          <DashboardDisplayModeToggle />
        </div>

        {/* Intake Summary */}
        <div className="glass-panel border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-foreground mb-4">Your Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                {intakeState.profile === ProfileTypeEnum.kid && <Baby className="h-5 w-5 text-primary" />}
                {intakeState.profile === ProfileTypeEnum.teen && <Users className="h-5 w-5 text-primary" />}
                {intakeState.profile === ProfileTypeEnum.adult && <User className="h-5 w-5 text-primary" />}
                {intakeState.profile === ProfileTypeEnum.senior && <UserCog className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <p className="text-sm text-foreground/60">Profile</p>
                <p className="font-semibold text-foreground">{getProfileLabel()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <span className="text-2xl font-bold text-primary">{anxietyLevel}</span>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Anxiety Level</p>
                <p className="font-semibold text-foreground">{anxietyLevel}/10</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Headphones className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Mood</p>
                <p className="font-semibold text-foreground">
                  {getMoodLabel()}
                  {vibeLabel && ` • ${vibeLabel}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orderedTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <GlassTile key={tile.id} onClick={() => navigate({ to: tile.path })} className="relative">
                {tile.recommended && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                    Recommended
                  </Badge>
                )}
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-foreground mb-2">{tile.title}</h3>
                    <p className="text-foreground/70">{tile.description}</p>
                  </div>
                </div>
              </GlassTile>
            );
          })}
        </div>
      </div>
    </div>
  );
}
