import { create } from 'zustand';
import { getCharacterFromKeyCode } from '@/lib/keyboard';
import { getRandomWords } from '@/lib/words';
import { calculateAccuracy, calculateWPM } from '@/lib/typing-stats';
import { type TypingStats } from '@/schemas/typing.schema';
import { type WordState } from '@/schemas/word.schema';
import { type ColorClass, CHARACTER_COLORS, WORDS_COUNT } from '@/constants/typing';
import { useLayoutStore } from './layout-store';
import { useKeyboardStore } from './keyboard-store';

// 타이핑 스토어 상태 인터페이스
interface TypingState {
  // 타이핑 할 단어들 상태
  words: WordState[];
  // 현재 입력 중인 단어 인덱스
  currentIndex: number;
  // 타이핑 통계 (WPM, 정확도 등)
  stats: TypingStats;
  // 타이핑 시작 시간 (성능 측정용)
  startTime: number | null;

  // 액션들
  // 키 다운 이벤트 처리
  handleTypingKeyDown: (e: KeyboardEvent) => void;
  // 새 단어 목록 생성
  generateNewWords: () => void;
  // 초기 단어 목록 설정
  setInitialWords: (words: string[]) => void;
  // 타이핑 통계 업데이트
  updateStats: (isCharCorrect: boolean) => void;
  // 이전 단어의 글자 색상 결정
  getPreviousWordColor: (wordState: WordState, charIndex: number) => ColorClass;
  // 현재 입력 중인 단어의 글자 색상 결정
  getCurrentCharacterColor: (typedChar: string | undefined, targetChar: string) => ColorClass;
  // 글자 색상 계산 기능
  getCharacterColor: (
    wordState: WordState,
    index: number,
    charIndex: number,
    targetChar: string
  ) => ColorClass;
  // 키보드 이벤트 리스너 등록
  registerKeyboardListeners: () => void;
  // 이벤트 리스너 정리
  cleanup: () => void;
}

export const useTypingStore = create<TypingState>()((set, get) => {
  // 클린업 함수 참조 저장용
  let cleanupFunction: (() => void) | null = null;

  return {
    // 초기 상태
    words: [],
    currentIndex: 0,
    stats: {
      accuracy: 0,
      wpm: 0,
      correctChars: 0,
      totalChars: 0,
    },
    startTime: null,

    // 초기 단어 목록 설정
    setInitialWords: (initialWords: string[]) => {
      set({
        words: initialWords.map((word) => ({
          word,
          typed: '',
          isCorrect: false,
        })),
        currentIndex: 0,
        stats: {
          accuracy: 0,
          wpm: 0,
          correctChars: 0,
          totalChars: 0,
        },
        startTime: null,
      });
    },

    // 새 단어 목록 생성
    generateNewWords: () => {
      const newWords = getRandomWords(WORDS_COUNT).map((word) => ({
        word,
        typed: '',
        isCorrect: false,
      }));

      set({
        words: newWords,
        currentIndex: 0,
        stats: {
          accuracy: 0,
          wpm: 0,
          correctChars: 0,
          totalChars: 0,
        },
        startTime: null,
      });
    },

    // 타이핑 통계 업데이트
    updateStats: (isCharCorrect: boolean) => {
      set((state) => {
        // 첫 입력인 경우 시작 시간 기록
        const startTime = state.startTime || Date.now();
        const timeElapsed = (Date.now() - startTime) / 1000;

        const newStats = {
          ...state.stats,
          correctChars: state.stats.correctChars + (isCharCorrect ? 1 : 0),
          totalChars: state.stats.totalChars + 1,
        };

        return {
          startTime,
          stats: {
            ...newStats,
            accuracy: calculateAccuracy(newStats.correctChars, newStats.totalChars),
            wpm: calculateWPM(newStats.correctChars, timeElapsed),
          },
        };
      });
    },

    // 키 다운 이벤트 처리
    handleTypingKeyDown: (e: KeyboardEvent) => {
      const { words, currentIndex, updateStats, generateNewWords } = get();
      const layout = useLayoutStore.getState().layout;

      // 현재 입력 중인 단어
      const currentWord = words[currentIndex];
      if (!currentWord) return;

      // Backspace 키 처리
      if (e.key === 'Backspace') {
        e.preventDefault();

        // 현재 단어가 비어있고 이전 단어로 돌아갈 수 있는 경우
        if (currentWord.typed.length === 0 && currentIndex > 0) {
          set({ currentIndex: currentIndex - 1 });
          return;
        }

        // 현재 단어에서 마지막 글자 삭제
        if (currentWord.typed.length > 0) {
          set((state) => {
            const newWords = [...state.words];
            const updatedWord = { ...currentWord };
            updatedWord.typed = updatedWord.typed.slice(0, -1);
            updatedWord.isCorrect = updatedWord.typed === updatedWord.word;
            newWords[currentIndex] = updatedWord;
            return { words: newWords };
          });
        }
        return;
      }

      // 스페이스 키 처리 (다음 단어로 이동)
      if (e.key === ' ') {
        e.preventDefault();

        const isWordComplete = currentWord.typed.length === currentWord.word.length;

        if (isWordComplete && currentWord.isCorrect) {
          // 마지막 단어인 경우 새 단어 목록 생성
          if (currentIndex === words.length - 1) {
            generateNewWords();
          } else {
            // 다음 단어로 이동
            set({ currentIndex: currentIndex + 1 });
          }
        }
        return;
      }

      // 일반 문자 키 처리
      if (e.key.length === 1) {
        e.preventDefault();

        // 현재 레이아웃에 맞게 문자 매핑
        const mappedChar = getCharacterFromKeyCode(e.code, layout, e.shiftKey);
        if (!mappedChar) return;

        set((state) => {
          const newWords = [...state.words];
          const currentWord = { ...newWords[currentIndex] };

          // 글자 추가
          const newTyped = currentWord.typed + mappedChar;

          // 최대 길이 초과하면 무시
          if (!currentWord.word || newTyped.length > currentWord.word.length) {
            return state;
          }

          // 단어 상태 업데이트
          currentWord.typed = newTyped;
          currentWord.isCorrect = currentWord.word.startsWith(newTyped);
          newWords[currentIndex] = currentWord;

          // 통계 업데이트를 위한 정타 여부 확인
          const isCharCorrect = currentWord.word[currentWord.typed.length - 1] === mappedChar;

          // 비동기적으로 상태 업데이트 (get()으로 호출)
          setTimeout(() => updateStats(isCharCorrect), 0);

          return { words: newWords };
        });
      }
    },

    // 이전 단어의 글자 색상 결정
    getPreviousWordColor: (wordState: WordState, charIndex: number): ColorClass => {
      const typedChar = wordState.typed[charIndex];
      const targetChar = wordState.word[charIndex];

      if (typedChar === undefined) return CHARACTER_COLORS.PENDING;
      return typedChar === targetChar ? CHARACTER_COLORS.CORRECT : CHARACTER_COLORS.INCORRECT;
    },

    // 현재 입력 중인 단어의 글자 색상 결정
    getCurrentCharacterColor: (typedChar: string | undefined, targetChar: string): ColorClass => {
      if (typedChar === undefined) return CHARACTER_COLORS.PENDING;
      return typedChar === targetChar ? CHARACTER_COLORS.CORRECT : CHARACTER_COLORS.INCORRECT;
    },

    // 글자 색상 결정 통합 함수
    getCharacterColor: (
      wordState: WordState,
      index: number,
      charIndex: number,
      targetChar: string
    ): ColorClass => {
      const { currentIndex, getPreviousWordColor, getCurrentCharacterColor } = get();

      if (index === currentIndex) {
        return getCurrentCharacterColor(wordState.typed[charIndex], targetChar);
      }
      if (index < currentIndex) {
        return getPreviousWordColor(wordState, charIndex);
      }
      return CHARACTER_COLORS.PENDING;
    },

    // 키보드 이벤트 리스너 등록 및 핸들러 설정
    registerKeyboardListeners: () => {
      const { handleTypingKeyDown } = get();

      // 키보드 스토어에 타이핑 핸들러 설정
      useKeyboardStore.getState().setOnKeyPress(undefined);

      // 직접 이벤트 리스너 등록
      const handleKeyDown = (e: KeyboardEvent) => handleTypingKeyDown(e);
      const handleKeyPress = (e: KeyboardEvent) => e.preventDefault();

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keypress', handleKeyPress);

      // 클린업 함수 저장
      cleanupFunction = () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keypress', handleKeyPress);
      };
    },

    // 이벤트 리스너 정리
    cleanup: () => {
      if (cleanupFunction) {
        cleanupFunction();
        cleanupFunction = null;
      }
    },
  };
});
