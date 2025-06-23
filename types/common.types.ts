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
