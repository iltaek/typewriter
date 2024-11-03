import { useState, useCallback } from 'react';
import { getRandomWords } from '@/lib/words';

export interface WordState {
  word: string;
  typed: string;
  isCorrect: boolean;
}

const WORDS_COUNT = 10;

export function useTyping() {
  const [words, setWords] = useState<WordState[]>(() =>
    getRandomWords(WORDS_COUNT).map((word: string) => ({
      word,
      typed: '',
      isCorrect: false,
    }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleTyping = useCallback(
    (char: string) => {
      if (currentIndex >= words.length) return;

      setWords((prev) => {
        const newWords = [...prev];
        const currentWord = { ...newWords[currentIndex] };
        const newTyped = currentWord.typed + char;

        if (newTyped.length <= currentWord.word.length) {
          currentWord.typed = newTyped;
          currentWord.isCorrect = currentWord.word.startsWith(newTyped);
          newWords[currentIndex] = currentWord;
        }

        return newWords;
      });
    },
    [currentIndex, words.length]
  );

  const handleBackspace = useCallback(() => {
    setWords((prev) => {
      const newWords = [...prev];
      const currentWord = { ...newWords[currentIndex] };
      if (currentWord.typed.length > 0) {
        currentWord.typed = currentWord.typed.slice(0, -1);
        currentWord.isCorrect = currentWord.word.startsWith(currentWord.typed);
        newWords[currentIndex] = currentWord;
      }
      return newWords;
    });
  }, [currentIndex]);

  const handleSpace = useCallback(() => {
    const currentWord = words[currentIndex];
    const isWordComplete = currentWord.typed.length === currentWord.word.length;

    if (isWordComplete && currentWord.isCorrect) {
      if (currentIndex === words.length - 1) {
        setWords(
          getRandomWords(WORDS_COUNT).map((word: string) => ({
            word,
            typed: '',
            isCorrect: false,
          }))
        );
        setCurrentIndex(0);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  }, [currentIndex, words]);

  return {
    words,
    currentIndex,
    handleTyping,
    handleBackspace,
    handleSpace,
  };
}
