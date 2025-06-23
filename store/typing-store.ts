import { create } from 'zustand';

import { updateTypingStats } from '@/lib/typing-stats';
import { getRandomWords } from '@/lib/words';
import { type TypingStats, WORDS_COUNT } from '@/types/typing.types';
import { type WordState } from '@/types/word.types';

import { useKeyboardStore } from './keyboard-store';
import { useLayoutStore } from './layout-store';
import { handleTypingKeyDown as processTypingKeyDown } from './typing-actions';

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
        const result = updateTypingStats(state.stats, state.startTime, isCharCorrect);
        return result;
      });
    },

    // 키 다운 이벤트 처리
    handleTypingKeyDown: (e: KeyboardEvent) => {
      const { words, currentIndex, updateStats, generateNewWords } = get();
      const { layout } = useLayoutStore.getState();

      processTypingKeyDown(e, layout, {
        words,
        currentIndex,
        setState: set,
        updateStats,
        generateNewWords,
      });
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
