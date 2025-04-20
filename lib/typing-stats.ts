import { type TypingStats } from '@/schemas/typing.schema';

export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars === 0) return 0;
  return (correctChars / totalChars) * 100;
}

export function calculateWPM(correctChars: number, timeInSeconds: number): number {
  if (timeInSeconds === 0) return 0;
  // WPM = (타자수 / 5) / 시간(분)
  const minutes = timeInSeconds / 60;
  return Math.round(correctChars / 5 / minutes);
}
