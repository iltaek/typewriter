import { useState, useCallback, useRef, useEffect } from 'react';

import { getCharacterFromKeyCode } from '@/lib/keyboard';
import { calculateAccuracy, calculateWPM } from '@/lib/typing-stats';
import { getRandomWords } from '@/lib/words';
import { type ColorClass, CHARACTER_COLORS } from '@/schemas/common.schema';
import { type LayoutType } from '@/schemas/keyboard.schema';
import { type TypingStats } from '@/schemas/typing.schema';
import { WORDS_COUNT } from '@/schemas/typing.schema';
import { type WordState } from '@/schemas/word.schema';

/** useTyping 훅의 Props 인터페이스 */
interface UseTypingProps {
  initialWords: string[]; // 서버에서 생성된 초기 단어 목록
}

export function useTyping({ initialWords }: UseTypingProps) {
  // 상태 초기화 시 Props로 받은 initialWords 사용
  const [words, setWords] = useState<WordState[]>(() =>
    initialWords.map((word) => ({
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

  // 새 단어 세트 생성 함수
  const generateNewWords = useCallback(() => {
    startTimeRef.current = null;
    setStats({
      accuracy: 0,
      wpm: 0,
      correctChars: 0,
      totalChars: 0,
    });
    const newWords = getRandomWords(WORDS_COUNT).map((word) => ({
      word,
      typed: '',
      isCorrect: false,
    }));
    setWords(newWords); // 상태 업데이트
    setCurrentIndex(0); // 인덱스 초기화
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, layout: LayoutType) => {
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
        if (!currentWord?.word) return;
        const isWordComplete = currentWord.typed.length === currentWord.word.length;

        if (currentWord && isWordComplete && currentWord.isCorrect) {
          if (currentIndex === words.length - 1) {
            generateNewWords();
          } else {
            setCurrentIndex((prev) => prev + 1);
          }
        }
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();

        const mappedChar = getCharacterFromKeyCode(e.code, layout, e.shiftKey);

        if (!mappedChar) return;

        setWords((prev) => {
          const newWords = [...prev];
          const currentWordIndex = currentIndex;
          if (!newWords[currentWordIndex]) return prev;

          const currentWord = { ...newWords[currentWordIndex] };
          const newTyped = currentWord.typed + mappedChar;

          if (currentWord.word && newTyped.length <= currentWord.word.length) {
            currentWord.typed = newTyped;
            currentWord.isCorrect = currentWord.word.startsWith(newTyped);
            newWords[currentWordIndex] = currentWord;

            const isCharCorrect = currentWord.word[currentWord.typed.length - 1] === mappedChar;
            updateStats(isCharCorrect);
          }

          return newWords;
        });
      }
    },
    [currentIndex, words, generateNewWords, updateStats]
  );

  // 이전 단어의 색상을 결정하는 함수
  const getPreviousWordColor = useCallback(
    (wordState: WordState, charIndex: number): ColorClass => {
      const typedChar = wordState.typed[charIndex];
      const targetChar = wordState.word[charIndex];

      if (typedChar === undefined) return CHARACTER_COLORS.PENDING;
      return typedChar === targetChar ? CHARACTER_COLORS.CORRECT : CHARACTER_COLORS.INCORRECT;
    },
    []
  );

  // 현재 문자의 색상을 결정하는 함수
  const getCurrentCharacterColor = useCallback(
    (typedChar: string | undefined, targetChar: string): ColorClass => {
      if (typedChar === undefined) return CHARACTER_COLORS.PENDING;
      return typedChar === targetChar ? CHARACTER_COLORS.CORRECT : CHARACTER_COLORS.INCORRECT;
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
      return CHARACTER_COLORS.PENDING;
    },
    [currentIndex, getCurrentCharacterColor, getPreviousWordColor]
  );

  return {
    words,
    currentIndex,
    stats,
    handleKeyDown,
    getCharacterColor,
  };
}
