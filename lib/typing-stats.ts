export interface TypingStats {
  accuracy: number; // 정확도 (%)
  wpm: number; // 분당 단어 수 (WPM)
  correctChars: number; // 올바르게 입력한 문자 수
  totalChars: number; // 전체 입력한 문자 수
  startTime?: number; // 타이핑 시작 시간
}

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
