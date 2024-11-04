'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { type WordState, getRandomWords } from '@/lib/words';
import { type LayoutType, remapKey, getCharacterFromKeyCode } from '@/lib/keyboard';
import { match } from 'ts-pattern';

const WORDS_COUNT = 10;

interface WordDisplayProps {
  layout: LayoutType;
}

type ColorClass = 'text-green-500' | 'text-red-500' | 'text-gray-400';

const CharacterColors = {
  CORRECT: 'text-green-500',
  INCORRECT: 'text-red-500',
  PENDING: 'text-gray-400',
} as const;

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
        const currentWord = words[currentIndex];

        if (currentWord.typed.length === 0 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
          return;
        }

        if (currentWord.typed.length > 0) {
          setWords((prev) => {
            const newWords = [...prev];
            const updatedWord = { ...currentWord };
            updatedWord.typed = updatedWord.typed.slice(0, -1);
            updatedWord.isCorrect = updatedWord.typed === updatedWord.word;
            newWords[currentIndex] = updatedWord;
            return newWords;
          });
        }
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

          if (currentWord.word && newTyped.length <= currentWord.word.length) {
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

  // 이전 단어의 색상을 결정하는 함수
  const getPreviousWordColor = (wordState: WordState, charIndex: number): ColorClass => {
    const typedChar = wordState.typed[charIndex];
    const targetChar = wordState.word[charIndex];

    if (typedChar === undefined) return CharacterColors.PENDING;
    return typedChar === targetChar ? CharacterColors.CORRECT : CharacterColors.INCORRECT;
  };

  // 현재 문자의 색상을 결정하는 함수
  const getCurrentCharacterColor = (
    typedChar: string | undefined,
    targetChar: string
  ): ColorClass => {
    if (typedChar === undefined) return CharacterColors.PENDING;
    return typedChar === targetChar ? CharacterColors.CORRECT : CharacterColors.INCORRECT;
  };

  const getCharacterColor = (
    wordState: WordState,
    index: number,
    charIndex: number,
    targetChar: string
  ): ColorClass => {
    const state = {
      isCurrentWord: index === currentIndex,
      isPreviousWord: index < currentIndex,
    };

    return match(state)
      .with({ isCurrentWord: true }, () =>
        getCurrentCharacterColor(wordState.typed[charIndex], targetChar)
      )
      .with({ isPreviousWord: true }, () => getPreviousWordColor(wordState, charIndex))
      .otherwise(() => CharacterColors.PENDING);
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
          </React.Fragment>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        {currentIndex + 1} / {words.length}
      </div>
    </div>
  );
}
