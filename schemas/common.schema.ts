import { z } from 'zod';

/**
 * 여러 도메인에서 공통으로 사용하는 스키마 정의
 */

// 색상 클래스 스키마
export const colorClassSchema = z.enum([
  'text-green-500', // 정답
  'text-red-500', // 오답
  'text-gray-400', // 대기 중
]);

// 상수 값 정의
export const CHARACTER_COLORS = {
  CORRECT: 'text-green-500' as const,
  INCORRECT: 'text-red-500' as const,
  PENDING: 'text-gray-400' as const,
};

// 타입 추론
export type ColorClass = z.infer<typeof colorClassSchema>;

// 타이핑 액션 타입 스키마
export const typingActionTypeSchema = z.enum([
  'TYPE_CHARACTER',
  'DELETE_CHARACTER',
  'NEXT_WORD',
  'RESET_WORDS',
  'GENERATE_NEW_WORDS',
]);

export type TypingActionType = z.infer<typeof typingActionTypeSchema>;

// 상수 값으로 정의
export const TYPING_ACTION_TYPES = {
  TYPE_CHARACTER: 'TYPE_CHARACTER' as const,
  DELETE_CHARACTER: 'DELETE_CHARACTER' as const,
  NEXT_WORD: 'NEXT_WORD' as const,
  RESET_WORDS: 'RESET_WORDS' as const,
  GENERATE_NEW_WORDS: 'GENERATE_NEW_WORDS' as const,
};
