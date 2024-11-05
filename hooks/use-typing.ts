import { useState, useCallback, useRef } from 'react';
import { type WordState, getRandomWords } from '@/lib/words';
import { type TypingStats, calculateAccuracy, calculateWPM } from '@/lib/typing-stats';
import { type LayoutType, getCharacterFromKeyCode } from '@/lib/keyboard';

const WORDS_COUNT = 10;

export type ColorClass = 'text-green-500' | 'text-red-500' | 'text-gray-400';

const CharacterColors = {
  CORRECT: 'text-green-500',
  INCORRECT: 'text-red-500',
  PENDING: 'text-gray-400',
} as const;

export function useTyping() {
  const [words, setWords] = useState<WordState[]>(() =>
    getRandomWords(WORDS_COUNT).map((word) => ({
      word,
      typed: '',
      isCorrect: false,
    }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<TypingStats>({
    accuracy: 0,
    wpm: 0,
    correctChars: 0,
    totalChars: 0,
  });
  const startTimeRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 타이핑 통계 업데이트 함수
  const updateStats = useCallback((isCharCorrect: boolean) => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const timeElapsed = (Date.now() - startTimeRef.current) / 1000;

    setStats((prevStats) => {
      const newStats = {
        ...prevStats,
        correctChars: prevStats.correctChars + (isCharCorrect ? 1 : 0),
        totalChars: prevStats.totalChars + 1,
      };

      return {
        ...newStats,
        accuracy: calculateAccuracy(newStats.correctChars, newStats.totalChars),
        wpm: calculateWPM(newStats.correctChars, timeElapsed),
      };
    });
  }, []);

  // 새 단어 세트 생성 시 통계 초기화
  const generateNewWords = useCallback(() => {
    startTimeRef.current = null;
    setStats({
      accuracy: 0,
      wpm: 0,
      correctChars: 0,
      totalChars: 0,
    });
    return getRandomWords(WORDS_COUNT).map((word) => ({
      word,
      typed: '',
      isCorrect: false,
    }));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, layout: LayoutType) => {
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

        if (isWordComplete && currentWord.isCorrect) {
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

            // 타이핑 통계 업데이트
            const isCharCorrect = currentWord.word[currentWord.typed.length - 1] === mappedChar;
            updateStats(isCharCorrect);
          }

          return newWords;
        });
      }
    },
    [currentIndex, words, isInitialized, generateNewWords, updateStats]
  );

  // 이전 단어의 색상을 결정하는 함수
  const getPreviousWordColor = useCallback(
    (wordState: WordState, charIndex: number): ColorClass => {
      const typedChar = wordState.typed[charIndex];
      const targetChar = wordState.word[charIndex];

      if (typedChar === undefined) return CharacterColors.PENDING;
      return typedChar === targetChar ? CharacterColors.CORRECT : CharacterColors.INCORRECT;
    },
    []
  );

  // 현재 문자의 색상을 결정하는 함수
  const getCurrentCharacterColor = useCallback(
    (typedChar: string | undefined, targetChar: string): ColorClass => {
      if (typedChar === undefined) return CharacterColors.PENDING;
      return typedChar === targetChar ? CharacterColors.CORRECT : CharacterColors.INCORRECT;
    },
    []
  );

  // 문자 색상을 결정하는 함수
  const getCharacterColor = useCallback(
    (wordState: WordState, index: number, charIndex: number, targetChar: string): ColorClass => {
      if (index === currentIndex) {
        return getCurrentCharacterColor(wordState.typed[charIndex], targetChar);
      }
      if (index < currentIndex) {
        return getPreviousWordColor(wordState, charIndex);
      }
      return CharacterColors.PENDING;
    },
    [currentIndex, getCurrentCharacterColor, getPreviousWordColor]
  );

  return {
    words,
    currentIndex,
    stats,
    isInitialized,
    setIsInitialized,
    handleKeyDown,
    getCharacterColor,
  };
}
