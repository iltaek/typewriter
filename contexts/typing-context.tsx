import { createContext, useContext, useState, type ReactNode } from 'react';
import { type LayoutType } from '@/schemas/keyboard.schema';

interface TypingContextType {
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
}

const TypingContext = createContext<TypingContextType | null>(null);

export function useTypingContext() {
  const context = useContext(TypingContext);
  if (!context) {
    throw new Error('useTypingContext must be used within a TypingProvider');
  }
  return context;
}

export function TypingProvider({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState<LayoutType>('qwerty');

  return <TypingContext.Provider value={{ layout, setLayout }}>{children}</TypingContext.Provider>;
}
