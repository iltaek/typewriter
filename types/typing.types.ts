/**
 * 타이핑 관련 타입 정의
 */

// 타이핑 통계 인터페이스
export interface TypingStats {
  accuracy: number;
  wpm: number;
  correctChars: number;
  totalChars: number;
}

// 타이핑 연습에 사용할 단어 수 상수
export const WORDS_COUNT = 10;