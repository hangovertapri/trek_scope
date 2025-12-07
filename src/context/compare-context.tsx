'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Trek } from '@/lib/types';

const MAX_COMPARE = 3;

interface CompareContextType {
  compareList: Trek[];
  toggleCompare: (trek: Trek) => void;
  isComparing: (trekId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Trek[]>([]);
  const { toast } = useToast();

  const isComparing = useCallback(
    (trekId: string) => compareList.some((t) => t.id === trekId),
    [compareList]
  );

  const toggleCompare = (trek: Trek) => {
    if (isComparing(trek.id)) {
      setCompareList((prev) => prev.filter((t) => t.id !== trek.id));
    } else {
      if (compareList.length >= MAX_COMPARE) {
        toast({
          variant: 'destructive',
          title: 'Comparison Limit Reached',
          description: `You can only compare up to ${MAX_COMPARE} treks at a time.`,
        });
        return;
      }
      setCompareList((prev) => [...prev, trek]);
    }
  };
  
  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, isComparing, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
