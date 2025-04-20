import { z } from 'zod';

/**
 * 타이핑 관련 타입과 스키마 정의
 */

// 타이핑 통계 스키마
export const typingStatsSchema = z.object({
  accuracy: z.number().min(0).max(100),
  wpm: z.number().min(0),
  correctChars: z.number().int().min(0),
  totalChars: z.number().int().min(0),
});

export type TypingStats = z.infer<typeof typingStatsSchema>;

// 타이핑 연습에 사용할 단어 수 상수
export const WORDS_COUNT = 10;

// 타이핑 상태 유효성 검증을 위한 스키마
export const typingStateValidatorSchema = z.object({
  words: z.array(
    z.object({
      word: z.string(),
      typed: z.string(),
      isCorrect: z.boolean(),
    })
  ),
  currentIndex: z.number().int().min(0),
  stats: typingStatsSchema,
  startTime: z.number().nullable(),
});

export type TypingState = z.infer<typeof typingStateValidatorSchema>;
