import React, { createContext, useContext, useState, useEffect } from 'react';

type Region = 'global' | 'india';

interface RegionContextType {
  region: Region;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider = ({ children }: { children: React.ReactNode }) => {
  const [region, setRegion] = useState<Region>(() => {
    const savedRegion = localStorage.getItem('region');
    return (savedRegion as Region) || 'global';
  });

  useEffect(() => {
    localStorage.setItem('region', region);
  }, [region]);

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}; 