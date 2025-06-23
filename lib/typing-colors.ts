import { type ColorClass, CHARACTER_COLORS } from '@/types/common.types';
import { type WordState } from '@/types/word.types';

/**
 * 타이핑 연습에서 문자의 상태에 따른 색상을 결정하는 유틸리티 함수들
 *
 * 이 모듈은 다음과 같은 색상 상태를 관리합니다:
 * - CORRECT: 정확히 입력된 문자 (녹색)
 * - INCORRECT: 잘못 입력된 문자 (빨간색)
 * - PENDING: 아직 입력되지 않은 문자 (회색)
 */

/**
 * 이미 타이핑이 완료된 단어의 문자 색상을 결정하는 함수
 * @param wordState - 단어 상태 객체
 * @param charIndex - 문자 인덱스
 * @returns 문자에 적용할 색상 클래스
 */
export const getPreviousWordColor = (wordState: WordState, charIndex: number): ColorClass => {
  const typedChar = wordState.typed[charIndex];
  const targetChar = wordState.word[charIndex];

  if (typedChar === undefined) return CHARACTER_COLORS.PENDING;
  return typedChar === targetChar ? CHARACTER_COLORS.CORRECT : CHARACTER_COLORS.INCORRECT;
};

/**
 * 현재 입력 중인 단어의 문자 색상을 결정하는 함수
 * @param typedChar - 사용자가 입력한 문자
 * @param targetChar - 목표 문자
 * @returns 문자에 적용할 색상 클래스
 */
export const getCurrentCharacterColor = (
  typedChar: string | undefined,
  targetChar: string,
): ColorClass => {
  if (typedChar === undefined) return CHARACTER_COLORS.PENDING;
  return typedChar === targetChar ? CHARACTER_COLORS.CORRECT : CHARACTER_COLORS.INCORRECT;
};

/**
 * 문자의 상태에 따라 적절한 색상을 계산하는 통합 함수
 * - 현재 단어: getCurrentCharacterColor 사용
 * - 이전 단어: getPreviousWordColor 사용
 * - 다음 단어: PENDING 색상 사용
 * @param wordState - 단어 상태 객체
 * @param wordIndex - 단어 인덱스
 * @param currentIndex - 현재 입력 중인 단어 인덱스
 * @param charIndex - 문자 인덱스
 * @param targetChar - 목표 문자
 * @returns 문자에 적용할 색상 클래스
 */
export const getCharacterColor = (
  wordState: WordState,
  wordIndex: number,
  currentIndex: number,
  charIndex: number,
  targetChar: string,
): ColorClass => {
  if (wordIndex === currentIndex) {
    return getCurrentCharacterColor(wordState.typed[charIndex], targetChar);
  }
  if (wordIndex < currentIndex) {
    return getPreviousWordColor(wordState, charIndex);
  }
  return CHARACTER_COLORS.PENDING;
};
