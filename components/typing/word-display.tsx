'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { type WordState, getRandomWords } from '@/lib/words';
import { type LayoutType, remapKey, getCharacterFromKeyCode } from '@/lib/keyboard';

const WORDS_COUNT = 10;

interface WordDisplayProps {
  layout: LayoutType;
}

export function WordDisplay({ layout }: WordDisplayProps) {
  const [words, setWords] = useState<WordState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const generateNewWords = () => {
    return getRandomWords(WORDS_COUNT).map((word) => ({
      word,
      typed: '',
      isCorrect: false,
    }));
  };

  useEffect(() => {
    if (!isInitialized) {
      setWords(generateNewWords());
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInitialized) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        setWords((prev) => {
          const newWords = [...prev];
          const currentWord = { ...newWords[currentIndex] };
          if (currentWord.typed.length > 0) {
            currentWord.typed = currentWord.typed.slice(0, -1);
            currentWord.isCorrect = currentWord.typed === currentWord.word;
            newWords[currentIndex] = currentWord;
          }
          return newWords;
        });
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        const currentWord = words[currentIndex];
        const isWordComplete = currentWord.typed.length === currentWord.word.length;

        if (isWordComplete) {
          if (currentIndex === words.length - 1) {
            setWords(generateNewWords());
            setCurrentIndex(0);
          } else {
            setCurrentIndex((prev) => prev + 1);
          }
        }
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();

        const mappedChar =
          layout === 'qwerty' ? e.key : getCharacterFromKeyCode(e.code, layout, e.shiftKey);

        if (!mappedChar) return;

        setWords((prev) => {
          const newWords = [...prev];
          const currentWord = { ...newWords[currentIndex] };
          const newTyped = currentWord.typed + mappedChar;

          if (newTyped.length <= currentWord.word.length) {
            currentWord.typed = newTyped;
            currentWord.isCorrect = currentWord.word.startsWith(newTyped);
            newWords[currentIndex] = currentWord;
          }

          return newWords;
        });
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [currentIndex, words, isInitialized, layout]);

  const getCharacterColor = (
    wordState: WordState,
    index: number,
    charIndex: number,
    char: string
  ) => {
    if (index !== currentIndex) {
      if (index < currentIndex) {
        return wordState.isCorrect ? 'text-green-500' : 'text-red-500';
      }
      return 'text-gray-400';
    }

    const typedChar = wordState.typed[charIndex];

    if (typedChar === undefined) {
      return 'text-gray-400';
    }

    return typedChar === char ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="flex flex-wrap justify-center gap-x-1 max-w-3xl">
        {words.map((wordState, index) => (
          <React.Fragment key={`${wordState.word}-${index}`}>
            <div
              className={cn(
                'text-2xl font-mono transition-all duration-200 px-1',
                index === currentIndex ? 'scale-110' : 'scale-100 opacity-50'
              )}
            >
              {wordState.word.split('').map((char, charIndex) => (
                <span
                  key={`${char}-${charIndex}`}
                  className={cn(
                    'transition-colors duration-150',
                    getCharacterColor(wordState, index, charIndex, char)
                  )}
                >
                  {char}
                </span>
              ))}
            </div>
            {index < words.length - 1 && (
              <span className="text-2xl font-mono text-gray-200">·</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        {currentIndex + 1} / {words.length}
      </div>
    </div>
  );
}
