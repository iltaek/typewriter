/**
 * 단어 관련 타입 정의
 */

// 단어 상태 인터페이스
export interface WordState {
  word: string;
  typed: string;
  isCorrect: boolean;
}
