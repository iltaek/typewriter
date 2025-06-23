import wordsData from '@/data/words.json';

/**
 * 타이핑 연습용 단어 목록
 * JSON 파일에서 불러온 9,366개의 연습용 단어들
 */
export const PRACTICE_WORDS = wordsData as readonly string[];

/**
 * 무작위로 n개의 단어를 선택하는 유틸리티 함수
 * @param count - 선택할 단어의 개수
 * @returns 중복 없이 무작위로 선택된 단어 배열
 */
export const getRandomWords = (count: number): string[] => {
  const words = [...PRACTICE_WORDS];
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    result.push(words[randomIndex]);
    // 선택된 단어는 제거하여 중복 방지
    words.splice(randomIndex, 1);
  }

  return result;
};
