import React, { createContext, useState, ReactNode } from 'react';

interface MediaActivityContextValue {
  isVideoActive: boolean;
  setVideoActive: (active: boolean) => void;
}

export const MediaActivityContext = createContext<MediaActivityContextValue | null>(null);

interface MediaActivityProviderProps {
  children: ReactNode;
}

export function MediaActivityProvider({ children }: MediaActivityProviderProps) {
  const [isVideoActive, setIsVideoActive] = useState(false);

  const setVideoActive = (active: boolean) => {
    setIsVideoActive(active);
  };

  return (
    <MediaActivityContext.Provider value={{ isVideoActive, setVideoActive }}>
      {children}
    </MediaActivityContext.Provider>
  );
}
