import { z } from 'zod';

/**
 * 단어 관련 타입과 스키마 정의
 */

// 단어 상태 스키마
export const wordStateSchema = z.object({
  word: z.string(),
  typed: z.string(),
  isCorrect: z.boolean(),
});

export type WordState = z.infer<typeof wordStateSchema>;

// 단어 유효성 검증 함수
export const validateWordState = (wordState: unknown): WordState => {
  return wordStateSchema.parse(wordState);
};

// 단어 배열 유효성 검증 함수
export const validateWordStates = (wordStates: unknown): WordState[] => {
  return z.array(wordStateSchema).parse(wordStates);
};
