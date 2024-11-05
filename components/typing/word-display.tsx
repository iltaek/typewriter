'use client';

import { useEffect, Fragment, useState } from 'react';
import { cn } from '@/lib/utils';
import { type LayoutType } from '@/lib/keyboard';
import { useTyping, type ColorClass } from '@/hooks/use-typing';
import { TypingStatsDisplay } from './typing-stats';

interface WordDisplayProps {
  layout: LayoutType;
}

export function WordDisplay({ layout }: WordDisplayProps) {
  const [mounted, setMounted] = useState(false);
  const {
    words,
    currentIndex,
    stats,
    isInitialized,
    setIsInitialized,
    handleKeyDown,
    getCharacterColor,
  } = useTyping();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isInitialized && mounted) {
      setIsInitialized(true);
    }
  }, [isInitialized, setIsInitialized, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDownEvent = (e: KeyboardEvent) => handleKeyDown(e, layout);
    const handleKeyPress = (e: KeyboardEvent) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDownEvent);
    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyDown, layout, mounted]);

  if (!mounted || !words) return null;

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <TypingStatsDisplay stats={stats} />
      <div className="flex flex-wrap justify-center gap-x-1 max-w-3xl">
        {words.map((wordState, index) => (
          <Fragment key={`${wordState.word}-${index}`}>
            <div
              className={cn(
                'text-2xl font-mono transition-all duration-200 px-1',
                index === currentIndex ? 'scale-110' : 'scale-100 opacity-50'
              )}
            >
              {wordState.word.split('').map((targetChar, charIndex) => (
                <span
                  key={`${targetChar}-${charIndex}`}
                  className={cn(
                    'transition-colors duration-150',
                    getCharacterColor(wordState, index, charIndex, targetChar)
                  )}
                >
                  {targetChar}
                </span>
              ))}
            </div>
            {index < words.length - 1 && (
              <span className="text-2xl font-mono text-gray-200">·</span>
            )}
          </Fragment>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        {currentIndex + 1} / {words.length}
      </div>
    </div>
  );
}
