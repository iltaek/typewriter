import { getCharacterFromKeyCode } from '@/lib/keyboard';
import { type LayoutType } from '@/types/keyboard.types';
import { type WordState } from '@/types/word.types';

/**
 * 타이핑 연습에서 키보드 이벤트를 처리하는 액션 함수들
 *
 * 이 모듈은 다음과 같은 키보드 이벤트를 처리합니다:
 * - 단축키 (Ctrl/Cmd + R, N, Escape)
 * - Backspace (문자 삭제 및 이전 단어 이동)
 * - Space (다음 단어 이동)
 * - 일반 문자 입력 (타이핑)
 */

/**
 * 타이핑 스토어 상태의 일부분 타입
 */
interface TypingState {
  words: WordState[];
  currentIndex: number;
}

/**
 * 타이핑 액션에 필요한 상태 및 액션 함수들의 인터페이스
 */
export interface TypingActionContext {
  words: WordState[];
  currentIndex: number;
  setState: (updater: (state: TypingState) => Partial<TypingState>) => void;
  updateStats: (isCharCorrect: boolean) => void;
  generateNewWords: () => void;
}

/**
 * 키보드 단축키를 처리하는 함수
 * @param e - 키보드 이벤트
 * @param generateNewWords - 새 단어 생성 함수
 * @returns 단축키 처리 여부
 */
export function handleShortcutKeys(e: KeyboardEvent, generateNewWords: () => void): boolean {
  // 키보드 단축키 처리 (Ctrl/Cmd + 키)
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'r':
        e.preventDefault();
        generateNewWords();
        return true;
      case 'n':
        e.preventDefault();
        generateNewWords();
        return true;
      default:
        return true; // 다른 단축키는 무시하고 처리 완료로 표시
    }
  }

  // Escape 키로 재시작
  if (e.key === 'Escape') {
    e.preventDefault();
    generateNewWords();
    return true;
  }

  return false; // 단축키가 아님
}

/**
 * Backspace 키 처리 함수
 * @param e - 키보드 이벤트
 * @param context - 타이핑 액션 컨텍스트
 * @returns 처리 완료 여부
 */
export function handleBackspace(e: KeyboardEvent, context: TypingActionContext): boolean {
  if (e.key !== 'Backspace') return false;

  e.preventDefault();
  const { words, currentIndex, setState } = context;
  const currentWord = words[currentIndex];

  if (!currentWord) return true;

  // 현재 단어가 비어있고 이전 단어로 돌아갈 수 있는 경우
  if (currentWord.typed.length === 0 && currentIndex > 0) {
    setState(() => ({ currentIndex: currentIndex - 1 }));
    return true;
  }

  // 현재 단어에서 마지막 글자 삭제
  if (currentWord.typed.length > 0) {
    setState((state) => {
      const newWords = [...state.words];
      const updatedWord = { ...currentWord };
      updatedWord.typed = updatedWord.typed.slice(0, -1);
      updatedWord.isCorrect = updatedWord.typed === updatedWord.word;
      newWords[currentIndex] = updatedWord;
      return { words: newWords };
    });
  }

  return true;
}

/**
 * Space 키 처리 함수 (다음 단어로 이동)
 * @param e - 키보드 이벤트
 * @param context - 타이핑 액션 컨텍스트
 * @returns 처리 완료 여부
 */
export function handleSpace(e: KeyboardEvent, context: TypingActionContext): boolean {
  if (e.key !== ' ') return false;

  e.preventDefault();
  const { words, currentIndex, setState, generateNewWords } = context;
  const currentWord = words[currentIndex];

  if (!currentWord) return true;

  const isWordComplete = currentWord.typed.length === currentWord.word.length;

  if (isWordComplete && currentWord.isCorrect) {
    // 마지막 단어인 경우 새 단어 목록 생성
    if (currentIndex === words.length - 1) {
      generateNewWords();
    } else {
      // 다음 단어로 이동
      setState(() => ({ currentIndex: currentIndex + 1 }));
    }
  }

  return true;
}

/**
 * 일반 문자 입력 처리 함수
 * @param e - 키보드 이벤트
 * @param layout - 현재 키보드 레이아웃
 * @param context - 타이핑 액션 컨텍스트
 * @returns 처리 완료 여부
 */
export function handleCharacterInput(
  e: KeyboardEvent,
  layout: LayoutType,
  context: TypingActionContext,
): boolean {
  // 일반 문자 키 처리
  if (e.key.length !== 1) return false;

  e.preventDefault();
  const { words, currentIndex, setState, updateStats } = context;
  const currentWord = words[currentIndex];

  if (!currentWord) return true;

  // 현재 레이아웃에 맞게 문자 매핑
  const mappedChar = getCharacterFromKeyCode(e.code, layout, e.shiftKey);
  if (!mappedChar) return true;

  setState((state) => {
    const newWords = [...state.words];
    const currentWordCopy = { ...newWords[currentIndex] };

    // 글자 추가
    const newTyped = currentWordCopy.typed + mappedChar;

    // 최대 길이 초과하면 무시
    if (!currentWordCopy.word || newTyped.length > currentWordCopy.word.length) {
      return state;
    }

    // 단어 상태 업데이트
    currentWordCopy.typed = newTyped;
    currentWordCopy.isCorrect = currentWordCopy.word.startsWith(newTyped);
    newWords[currentIndex] = currentWordCopy;

    // 통계 업데이트를 위한 정타 여부 확인
    const isCharCorrect = currentWordCopy.word[currentWordCopy.typed.length - 1] === mappedChar;

    // 비동기적으로 상태 업데이트
    setTimeout(() => updateStats(isCharCorrect), 0);

    return { words: newWords };
  });

  return true;
}

/**
 * 메인 키보드 이벤트 처리 함수
 * 모든 키 이벤트를 적절한 핸들러로 라우팅
 * @param e - 키보드 이벤트
 * @param layout - 현재 키보드 레이아웃
 * @param context - 타이핑 액션 컨텍스트
 */
export function handleTypingKeyDown(
  e: KeyboardEvent,
  layout: LayoutType,
  context: TypingActionContext,
): void {
  // 1. 단축키 처리
  if (handleShortcutKeys(e, context.generateNewWords)) {
    return;
  }

  // 2. Backspace 처리
  if (handleBackspace(e, context)) {
    return;
  }

  // 3. Space 처리
  if (handleSpace(e, context)) {
    return;
  }

  // 4. 일반 문자 처리
  handleCharacterInput(e, layout, context);
}
