/**
 * 여러 도메인에서 공통으로 사용하는 타입 정의
 */

// 색상 클래스 타입
export type ColorClass = 'text-green-500' | 'text-red-500' | 'text-gray-400';

// 상수 값 정의
export const CHARACTER_COLORS = {
  CORRECT: 'text-green-500' as const,
  INCORRECT: 'text-red-500' as const,
  PENDING: 'text-gray-400' as const,
};

// 타이핑 액션 타입
export type TypingActionType =
  | 'TYPE_CHARACTER'
  | 'DELETE_CHARACTER'
  | 'NEXT_WORD'
  | 'RESET_WORDS'
  | 'GENERATE_NEW_WORDS';

// 상수 값으로 정의
export const TYPING_ACTION_TYPES = {
  TYPE_CHARACTER: 'TYPE_CHARACTER' as const,
  DELETE_CHARACTER: 'DELETE_CHARACTER' as const,
  NEXT_WORD: 'NEXT_WORD' as const,
  RESET_WORDS: 'RESET_WORDS' as const,
  GENERATE_NEW_WORDS: 'GENERATE_NEW_WORDS' as const,
};