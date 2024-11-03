import * as React from 'react';
import { cn } from '@/lib/utils';
import { type WordState } from '@/lib/words';

interface WordProps {
  word: WordState;
  isActive: boolean;
  isPrevious: boolean;
}

export function Word({ word, isActive, isPrevious }: WordProps) {
  return (
    <div
      className={cn(
        'text-2xl font-mono transition-all duration-200 px-1',
        isActive ? 'scale-110' : 'scale-100 opacity-50'
      )}
    >
      {word.word.split('').map((char, charIndex) => (
        <span
          key={`${char}-${charIndex}`}
          className={cn(
            'transition-colors duration-150',
            isActive &&
              (word.typed[charIndex] === undefined
                ? 'text-gray-400'
                : word.typed[charIndex] === char
                  ? 'text-green-500'
                  : 'text-red-500'),
            isPrevious && (word.isCorrect ? 'text-green-500' : 'text-red-500'),
            !isActive && !isPrevious && 'text-gray-400'
          )}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
