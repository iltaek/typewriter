import { create } from 'zustand';

import { getCharacterFromKeyCode } from '@/lib/keyboard';
import { calculateAccuracy, calculateWPM } from '@/lib/typing-stats';
import { getRandomWords } from '@/lib/words';
import { type ColorClass, CHARACTER_COLORS } from '@/schemas/common.schema';
import { type TypingStats, WORDS_COUNT } from '@/schemas/typing.schema';
import { type WordState } from '@/schemas/word.schema';

import { useKeyboardStore } from './keyboard-store';
import { useLayoutStore } from './layout-store';

/**
 * 타이핑 연습 애플리케이션의 상태 관리를 위한 Zustand 스토어 인터페이스
 *
 * 이 인터페이스는 다음과 같은 기능을 포함합니다:
 * - 타이핑할 단어들의 상태 관리
 * - 현재 입력 중인 단어의 인덱스 추적
 * - 타이핑 통계 (WPM, 정확도) 계산 및 저장
 * - 키보드 이벤트 처리 및 문자 입력 관리
 * - 색상 피드백을 위한 문자 상태 계산
 */
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
  /**
   * 키보드 이벤트를 처리하여 타이핑 입력을 관리하는 함수
   * - Backspace: 문자 삭제 및 이전 단어로 이동
   * - Space: 다음 단어로 이동 또는 새 단어 세트 생성
   * - 일반 문자: 현재 단어에 문자 추가 및 정확성 검사
   * - 단축키: Ctrl+R, Ctrl+N, Escape로 재시작
   * @param e - 키보드 이벤트 객체
   */
  handleTypingKeyDown: (e: KeyboardEvent) => void;

  /**
   * 새로운 단어 목록을 생성하고 타이핑 상태를 초기화하는 함수
   * - WORDS_COUNT 개수만큼 랜덤 단어 선택
   * - 모든 통계 초기화 (WPM, 정확도, 시작 시간)
   * - 현재 인덱스를 0으로 리셋
   */
  generateNewWords: () => void;

  /**
   * 서버에서 생성된 초기 단어 목록을 설정하는 함수
   * 주로 컴포넌트 마운트 시 사용됨
   * @param words - 초기 단어 배열
   */
  setInitialWords: (words: string[]) => void;

  /**
   * 타이핑 통계를 업데이트하는 함수
   * - 정타/오타 개수 계산
   * - WPM (Words Per Minute) 계산
   * - 정확도 (Accuracy) 계산
   * @param isCharCorrect - 입력한 문자가 정확한지 여부
   */
  updateStats: (isCharCorrect: boolean) => void;

  /**
   * 이미 타이핑이 완료된 단어의 문자 색상을 결정하는 함수
   * @param wordState - 단어 상태 객체
   * @param charIndex - 문자 인덱스
   * @returns 문자에 적용할 색상 클래스
   */
  getPreviousWordColor: (wordState: WordState, charIndex: number) => ColorClass;

  /**
   * 현재 입력 중인 단어의 문자 색상을 결정하는 함수
   * @param typedChar - 사용자가 입력한 문자
   * @param targetChar - 목표 문자
   * @returns 문자에 적용할 색상 클래스
   */
  getCurrentCharacterColor: (typedChar: string | undefined, targetChar: string) => ColorClass;

  /**
   * 문자의 상태에 따라 적절한 색상을 계산하는 통합 함수
   * - 현재 단어: getCurrentCharacterColor 사용
   * - 이전 단어: getPreviousWordColor 사용
   * - 다음 단어: PENDING 색상 사용
   * @param wordState - 단어 상태 객체
   * @param index - 단어 인덱스
   * @param charIndex - 문자 인덱스
   * @param targetChar - 목표 문자
   * @returns 문자에 적용할 색상 클래스
   */
  getCharacterColor: (
    wordState: WordState,
    index: number,
    charIndex: number,
    targetChar: string,
  ) => ColorClass;

  /**
   * 키보드 이벤트 리스너를 등록하는 함수
   * - 기존 리스너가 있다면 먼저 정리
   * - window에 keydown, keypress 이벤트 리스너 등록
   * - cleanup 함수를 스토어에 저장
   */
  registerKeyboardListeners: () => void;

  /**
   * 등록된 이벤트 리스너를 정리하는 함수
   * 컴포넌트 언마운트 시 메모리 누수 방지를 위해 호출
   */
  cleanup: () => void;
}

export const useTypingStore = create<TypingState>()((set, get) => {
  // 클린업 함수 참조를 안전하게 저장하기 위한 변수
  let currentCleanupFunction: (() => void) | null = null;

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
      const { layout } = useLayoutStore.getState();

      // 키보드 단축키 처리 (Ctrl/Cmd + 키)
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'r':
            e.preventDefault();
            generateNewWords();
            return;
          case 'n':
            e.preventDefault();
            generateNewWords();
            return;
          default:
            return;
        }
      }

      // Escape 키로 재시작
      if (e.key === 'Escape') {
        e.preventDefault();
        generateNewWords();
        return;
      }

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
      targetChar: string,
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

      // 기존 리스너가 있다면 먼저 정리
      if (currentCleanupFunction) {
        currentCleanupFunction();
        currentCleanupFunction = null;
      }

      // 키보드 스토어에 타이핑 핸들러 설정
      useKeyboardStore.getState().setOnKeyPress(undefined);

      // 직접 이벤트 리스너 등록
      const handleKeyDown = (e: KeyboardEvent) => handleTypingKeyDown(e);
      const handleKeyPress = (e: KeyboardEvent) => e.preventDefault();

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keypress', handleKeyPress);

      // cleanup 함수를 로컬 변수에 저장 (상태 업데이트 없이)
      currentCleanupFunction = () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keypress', handleKeyPress);
        currentCleanupFunction = null;
      };
    },

    // 이벤트 리스너 정리
    cleanup: () => {
      if (currentCleanupFunction) {
        currentCleanupFunction();
        currentCleanupFunction = null;
      }
    },
  };
});
