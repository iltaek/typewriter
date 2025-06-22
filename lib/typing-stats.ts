import { type TypingStats } from '@/types/typing.types';

/**
 * 타이핑 통계를 계산하는 유틸리티 함수들
 *
 * 이 모듈은 다음과 같은 통계를 계산합니다:
 * - 정확도 (Accuracy): 정타율 백분율
 * - WPM (Words Per Minute): 분당 단어 수
 * - 통계 업데이트: 실시간 통계 계산
 */

/**
 * 정확도를 백분율로 계산하는 함수
 * @param correctChars - 정확히 입력된 문자 수
 * @param totalChars - 전체 입력된 문자 수
 * @returns 정확도 백분율 (0-100)
 */
export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars === 0) return 0;
  return (correctChars / totalChars) * 100;
}

/**
 * WPM(Words Per Minute)을 계산하는 함수
 * @param correctChars - 정확히 입력된 문자 수
 * @param timeInSeconds - 경과 시간 (초)
 * @returns 분당 단어 수
 */
export function calculateWPM(correctChars: number, timeInSeconds: number): number {
  if (timeInSeconds === 0) return 0;
  // WPM = (타자수 / 5) / 시간(분)
  const minutes = timeInSeconds / 60;
  return Math.round(correctChars / 5 / minutes);
}

/**
 * 타이핑 통계를 업데이트하는 함수
 * @param currentStats - 현재 통계 상태
 * @param startTime - 타이핑 시작 시간 (밀리초)
 * @param isCharCorrect - 현재 입력 문자가 정확한지 여부
 * @returns 업데이트된 통계와 시작 시간
 */
export function updateTypingStats(
  currentStats: TypingStats,
  startTime: number | null,
  isCharCorrect: boolean,
): { stats: TypingStats; startTime: number } {
  // 첫 입력인 경우 시작 시간 기록
  const recordedStartTime = startTime || Date.now();
  const timeElapsed = (Date.now() - recordedStartTime) / 1000;

  const newStats = {
    ...currentStats,
    correctChars: currentStats.correctChars + (isCharCorrect ? 1 : 0),
    totalChars: currentStats.totalChars + 1,
  };

  return {
    startTime: recordedStartTime,
    stats: {
      ...newStats,
      accuracy: calculateAccuracy(newStats.correctChars, newStats.totalChars),
      wpm: calculateWPM(newStats.correctChars, timeElapsed),
    },
  };
}
