import { useState, useEffect } from 'react';
import type { Language } from '../backend';
import { Language as LanguageEnum } from '../backend';

const STORAGE_KEY = 'aspen-calm-language';

export function useLanguagePreference() {
  const [language, setLanguageRaw] = useState<Language>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return stored as Language;
      }
    } catch (e) {
      console.warn('Failed to load language preference:', e);
    }
    return LanguageEnum.english;
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageRaw(newLanguage);
    try {
      sessionStorage.setItem(STORAGE_KEY, newLanguage);
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
  };

  return { language, setLanguage };
}
