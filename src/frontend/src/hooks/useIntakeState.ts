import { useState, useEffect } from 'react';
import type { IntakeState, ProfileType, Mood, Vibe, Language } from '../backend';
import { Language as LanguageEnum, Mood as MoodEnum } from '../backend';

const STORAGE_KEY = 'aspen-calm-intake';

const defaultIntakeState: IntakeState = {
  profile: undefined,
  anxietyLevel: BigInt(5),
  mood: undefined,
  vibe: undefined,
  language: LanguageEnum.english,
};

// Export helper function for clearing storage (non-hook)
export function clearIntakeStateStorage() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear intake state:', e);
  }
}

export function useIntakeState() {
  const [intakeState, setIntakeStateRaw] = useState<IntakeState>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          anxietyLevel: BigInt(parsed.anxietyLevel || 5),
        };
      }
    } catch (e) {
      console.warn('Failed to load intake state:', e);
    }
    return defaultIntakeState;
  });

  const setIntakeState = (updates: Partial<IntakeState>) => {
    setIntakeStateRaw((prev) => {
      const newState = { ...prev, ...updates };
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...newState,
            anxietyLevel: newState.anxietyLevel.toString(),
          })
        );
      } catch (e) {
        console.warn('Failed to save intake state:', e);
      }
      return newState;
    });
  };

  const clearIntakeState = () => {
    setIntakeStateRaw(defaultIntakeState);
    clearIntakeStateStorage();
  };

  const isIntakeComplete = () => {
    return !!(
      intakeState.profile &&
      intakeState.mood &&
      (intakeState.mood !== MoodEnum.relax || intakeState.vibe)
    );
  };

  const getEarliestIncompleteStep = (): number => {
    // Step 0: Profile selection
    if (!intakeState.profile) return 0;
    
    // Step 1: Anxiety level (always shown after profile)
    // Step 2: Mood selection
    if (!intakeState.mood) return 2;
    
    // Step 3: Vibe selection (only for relax mood)
    if (intakeState.mood === MoodEnum.relax && !intakeState.vibe) return 3;
    
    // All complete
    return -1;
  };

  return {
    intakeState,
    setIntakeState,
    clearIntakeState,
    isIntakeComplete,
    getEarliestIncompleteStep,
  };
}
