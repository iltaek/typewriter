// 타이핑 관련 상수 및 타입 정의

// 타이핑 연습에 사용할 기본 단어 수
export const WORDS_COUNT = 10;

// 글자 색상 클래스 타입
export type ColorClass = 'text-green-500' | 'text-red-500' | 'text-gray-400';

// 글자 색상 상수
export const CharacterColors = {
  CORRECT: 'text-green-500',
  INCORRECT: 'text-red-500',
  PENDING: 'text-gray-400',
} as const;

// 타이핑 액션 타입
export enum TypingActionType {
  TYPE_CHARACTER = 'TYPE_CHARACTER',
  DELETE_CHARACTER = 'DELETE_CHARACTER',
  NEXT_WORD = 'NEXT_WORD',
  RESET_WORDS = 'RESET_WORDS',
  GENERATE_NEW_WORDS = 'GENERATE_NEW_WORDS',
}
