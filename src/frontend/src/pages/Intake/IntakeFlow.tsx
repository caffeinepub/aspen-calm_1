import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Baby, Users, User, UserCog, ArrowRight, ArrowLeft } from 'lucide-react';
import { useIntakeState } from '../../hooks/useIntakeState';
import OnboardingHint from '../../components/OnboardingHint';
import type { ProfileType, Mood, Vibe } from '../../backend';
import { ProfileType as ProfileTypeEnum, Mood as MoodEnum, Vibe as VibeEnum } from '../../backend';
import { getAssetUrl } from '../../utils/assetUrl';

const profileOptions: { value: ProfileType; label: string; icon: typeof Baby }[] = [
  { value: ProfileTypeEnum.kid, label: 'Kids', icon: Baby },
  { value: ProfileTypeEnum.teen, label: 'Teens', icon: Users },
  { value: ProfileTypeEnum.adult, label: 'Adults', icon: User },
  { value: ProfileTypeEnum.senior, label: 'Seniors', icon: UserCog },
];

const moodOptions: { value: Mood; label: string; description: string }[] = [
  { value: MoodEnum.relax, label: 'I want to Relax', description: 'Calming sounds and visuals' },
  { value: MoodEnum.distract, label: 'I want to be Distracted', description: 'Movies and entertainment' },
  { value: MoodEnum.listen, label: 'I want to Listen', description: 'Music and audio content' },
];

const vibeOptions: { value: Vibe; label: string; description: string }[] = [
  { value: VibeEnum.escape, label: 'Escape', description: 'High-intensity visual & audio distraction' },
  { value: VibeEnum.focus, label: 'Focus', description: 'Low-distraction lofi or nature sounds' },
  { value: VibeEnum.nurture, label: 'Nurture', description: 'Nostalgic content for comfort' },
];

export default function IntakeFlow() {
  const navigate = useNavigate();
  const { intakeState, setIntakeState, isIntakeComplete, getEarliestIncompleteStep } = useIntakeState();
  const [step, setStep] = useState<number>(-1);
  const [logoError, setLogoError] = useState(false);

  const anxietyValue = Number(intakeState.anxietyLevel);

  // Initialize step based on intake completion state
  useEffect(() => {
    if (isIntakeComplete()) {
      navigate({ to: '/dashboard' });
    } else {
      const earliestStep = getEarliestIncompleteStep();
      setStep(earliestStep);
    }
  }, []);

  const canProceedFromStep = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return !!intakeState.profile;
      case 1:
        return true;
      case 2:
        return !!intakeState.mood;
      case 3:
        return intakeState.mood !== MoodEnum.relax || !!intakeState.vibe;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 2 && intakeState.mood !== MoodEnum.relax) {
      navigate({ to: '/dashboard' });
    } else if (step === 3) {
      navigate({ to: '/dashboard' });
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Don't render until step is initialized
  if (step === -1) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-twilight">
      <div className="w-full max-w-4xl space-y-6">
        {step === 0 && (
          <Card className="glass-panel border-white/10 p-8 space-y-6">
            <div className="text-center space-y-4">
              {!logoError && (
                <img
                  src={getAssetUrl('assets/generated/aspen-calm-logo.dim_1024x256.png')}
                  alt="Aspen Calm"
                  className="h-16 mx-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
              <h1 className="text-4xl font-bold text-foreground">Welcome to Aspen Calm</h1>
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                Your personal digital sedation portal. We'll help you find the perfect audio-visual experience to keep
                you calm and comfortable during your dental procedure.
              </p>
            </div>

            <OnboardingHint>
              This quick setup takes less than a minute. You can make your selections now, even before sitting in the
              chair. Your preferences will be personalized for your session.
            </OnboardingHint>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Select Your Profile</h2>
              <p className="text-foreground/70">Choose the profile that best describes you</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profileOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = intakeState.profile === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setIntakeState({ profile: option.value })}
                    className={`glass-panel border-2 p-6 rounded-2xl transition-all hover:scale-105 ${
                      isSelected ? 'border-primary bg-primary/10 selected-glow' : 'border-white/10'
                    }`}
                  >
                    <Icon className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <p className="text-lg font-semibold text-foreground">{option.label}</p>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleNext}
              size="lg"
              className="w-full btn-primary h-14 text-lg"
              disabled={!canProceedFromStep(0)}
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        )}

        {step === 1 && (
          <Card className="glass-panel border-white/10 p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Anxiety Level</h2>
              <p className="text-foreground/70">How anxious are you feeling today? (1 = calm, 10 = very anxious)</p>
            </div>

            <div className="space-y-6 py-4">
              <Slider
                value={[anxietyValue]}
                onValueChange={(values) => setIntakeState({ anxietyLevel: BigInt(values[0]) })}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <div className="text-6xl font-bold text-primary">{anxietyValue}</div>
                <p className="text-sm text-foreground/60 mt-2">
                  {anxietyValue >= 7 && 'We recommend calming audio options for you'}
                </p>
              </div>
            </div>

            {anxietyValue >= 7 && (
              <OnboardingHint>
                Based on your anxiety level, we'll prioritize "The Sonic Shield" (Brown Noise) and "Deep Zen" (Binaural
                Beats) to help you relax.
              </OnboardingHint>
            )}

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" size="lg" className="flex-1">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              <Button onClick={handleNext} size="lg" className="flex-1 btn-primary">
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="glass-panel border-white/10 p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">What's Your Mood?</h2>
              <p className="text-foreground/70">Choose how you'd like to spend your time</p>
            </div>

            <div className="space-y-3">
              {moodOptions.map((option) => {
                const isSelected = intakeState.mood === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setIntakeState({ mood: option.value })}
                    className={`w-full glass-panel border-2 p-6 rounded-2xl text-left transition-all hover:scale-[1.02] ${
                      isSelected ? 'border-primary bg-primary/10 selected-glow' : 'border-white/10'
                    }`}
                  >
                    <p className="text-xl font-semibold text-foreground mb-1">{option.label}</p>
                    <p className="text-sm text-foreground/60">{option.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" size="lg" className="flex-1">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                size="lg"
                className="flex-1 btn-primary"
                disabled={!canProceedFromStep(2)}
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && intakeState.mood === MoodEnum.relax && (
          <Card className="glass-panel border-white/10 p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Choose Your Vibe</h2>
              <p className="text-foreground/70">Select the relaxation style that suits you best</p>
            </div>

            <div className="space-y-3">
              {vibeOptions.map((option) => {
                const isSelected = intakeState.vibe === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setIntakeState({ vibe: option.value })}
                    className={`w-full glass-panel border-2 p-6 rounded-2xl text-left transition-all hover:scale-[1.02] ${
                      isSelected ? 'border-primary bg-primary/10 selected-glow' : 'border-white/10'
                    }`}
                  >
                    <p className="text-xl font-semibold text-foreground mb-1">{option.label}</p>
                    <p className="text-sm text-foreground/60">{option.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" size="lg" className="flex-1">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                size="lg"
                className="flex-1 btn-primary"
                disabled={!canProceedFromStep(3)}
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
