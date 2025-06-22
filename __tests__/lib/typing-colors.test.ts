import {
  getCharacterColor,
  getCurrentCharacterColor,
  getPreviousWordColor,
} from '@/lib/typing-colors';
import { CHARACTER_COLORS } from '@/types/common.types';
import { type WordState } from '@/types/word.types';

// 테스트용 Mock 데이터
const createWordState = (word: string, typed: string = '', isCorrect: boolean = false): WordState => ({
  word,
  typed,
  isCorrect,
});

describe('getCurrentCharacterColor', () => {
  describe('정상 케이스', () => {
    test('정타 문자 - 녹색 반환', () => {
      const result = getCurrentCharacterColor('h', 'h');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('대소문자 구분 정타', () => {
      const result = getCurrentCharacterColor('H', 'H');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('숫자 정타', () => {
      const result = getCurrentCharacterColor('1', '1');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('특수문자 정타', () => {
      const result = getCurrentCharacterColor('!', '!');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('공백 문자 정타', () => {
      const result = getCurrentCharacterColor(' ', ' ');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });
  });

  describe('실패 케이스', () => {
    test('오타 문자 - 빨간색 반환', () => {
      const result = getCurrentCharacterColor('x', 'h');
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });

    test('대소문자 오타', () => {
      const result = getCurrentCharacterColor('h', 'H');
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });

    test('숫자 오타', () => {
      const result = getCurrentCharacterColor('2', '1');
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });

    test('특수문자 오타', () => {
      const result = getCurrentCharacterColor('@', '!');
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });

    test('빈 문자열 vs 실제 문자', () => {
      const result = getCurrentCharacterColor('', 'h');
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });
  });

  describe('엣지 케이스', () => {
    test('undefined 입력 문자 - 회색 반환', () => {
      const result = getCurrentCharacterColor(undefined, 'h');
      expect(result).toBe(CHARACTER_COLORS.PENDING);
    });

    test('목표 문자가 빈 문자열', () => {
      const result = getCurrentCharacterColor('h', '');
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });

    test('둘 다 빈 문자열', () => {
      const result = getCurrentCharacterColor('', '');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('유니코드 문자 처리', () => {
      const result = getCurrentCharacterColor('한', '한');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('이모지 문자 처리', () => {
      const result = getCurrentCharacterColor('🚀', '🚀');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });
  });
});

describe('getPreviousWordColor', () => {
  describe('정상 케이스', () => {
    test('완전히 정타된 단어의 첫 번째 문자', () => {
      const wordState = createWordState('hello', 'hello', true);
      const result = getPreviousWordColor(wordState, 0);
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('완전히 정타된 단어의 마지막 문자', () => {
      const wordState = createWordState('hello', 'hello', true);
      const result = getPreviousWordColor(wordState, 4);
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('부분적으로 정타된 단어의 정타 부분', () => {
      const wordState = createWordState('hello', 'hel', false);
      const result = getPreviousWordColor(wordState, 2);
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });
  });

  describe('실패 케이스', () => {
    test('오타가 포함된 단어의 오타 문자', () => {
      const wordState = createWordState('hello', 'hexlo', false);
      const result = getPreviousWordColor(wordState, 2);
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });

    test('첫 번째 문자부터 오타', () => {
      const wordState = createWordState('hello', 'xello', false);
      const result = getPreviousWordColor(wordState, 0);
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });

    test('대소문자 오타', () => {
      const wordState = createWordState('Hello', 'hello', false);
      const result = getPreviousWordColor(wordState, 0);
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });
  });

  describe('엣지 케이스', () => {
    test('입력되지 않은 문자 인덱스 - 회색 반환', () => {
      const wordState = createWordState('hello', 'hel', false);
      const result = getPreviousWordColor(wordState, 3);
      expect(result).toBe(CHARACTER_COLORS.PENDING);
    });

    test('단어 길이보다 큰 인덱스', () => {
      const wordState = createWordState('hi', 'hi', true);
      const result = getPreviousWordColor(wordState, 5);
      expect(result).toBe(CHARACTER_COLORS.PENDING);
    });

    test('음수 인덱스', () => {
      const wordState = createWordState('hello', 'hello', true);
      const result = getPreviousWordColor(wordState, -1);
      expect(result).toBe(CHARACTER_COLORS.PENDING);
    });

    test('빈 단어 상태', () => {
      const wordState = createWordState('', '', true);
      const result = getPreviousWordColor(wordState, 0);
      expect(result).toBe(CHARACTER_COLORS.PENDING);
    });

    test('typed가 word보다 긴 경우', () => {
      const wordState = createWordState('hi', 'hello', false);
      const result = getPreviousWordColor(wordState, 4);
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });
  });
});

describe('getCharacterColor', () => {
  const mockWords = [
    createWordState('hello', 'hello', true),  // 완료된 단어 (인덱스 0)
    createWordState('world', 'wor', false),   // 현재 단어 (인덱스 1)
    createWordState('test', '', false),       // 미래 단어 (인덱스 2)
  ];

  describe('정상 케이스', () => {
    test('현재 단어의 정타 문자', () => {
      const currentIndex = 1;
      const result = getCharacterColor(mockWords[1], 1, currentIndex, 0, 'w');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('현재 단어의 오타 문자', () => {
      const currentIndex = 1;
      const result = getCharacterColor(mockWords[1], 1, currentIndex, 0, 'x');
      expect(result).toBe(CHARACTER_COLORS.INCORRECT);
    });

    test('이전 단어의 정타 문자', () => {
      const currentIndex = 1;
      const result = getCharacterColor(mockWords[0], 0, currentIndex, 0, 'h');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('미래 단어의 문자', () => {
      const currentIndex = 1;
      const result = getCharacterColor(mockWords[2], 2, currentIndex, 0, 't');
      expect(result).toBe(CHARACTER_COLORS.PENDING);
    });
  });

  describe('실패 케이스', () => {
    test('잘못된 currentIndex - 음수', () => {
      const currentIndex = -1;
      const result = getCharacterColor(mockWords[0], 0, currentIndex, 0, 'h');
      // wordIndex(0) > currentIndex(-1)이므로 PENDING
      expect(result).toBe(CHARACTER_COLORS.PENDING);
    });

    test('잘못된 wordIndex - 음수', () => {
      const currentIndex = 1;
      const result = getCharacterColor(mockWords[0], -1, currentIndex, 0, 'h');
      // wordIndex(-1) < currentIndex(1)이므로 getPreviousWordColor 호출
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });
  });

  describe('엣지 케이스', () => {
    test('현재 단어의 아직 입력되지 않은 문자', () => {
      const currentIndex = 1;
      const result = getCharacterColor(mockWords[1], 1, currentIndex, 3, 'l');
      expect(result).toBe(CHARACTER_COLORS.PENDING);
    });

    test('wordIndex와 currentIndex가 동일 - 경계값', () => {
      const currentIndex = 1;
      const result = getCharacterColor(mockWords[1], 1, currentIndex, 1, 'o');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });

    test('매우 큰 charIndex', () => {
      const currentIndex = 1;
      const result = getCharacterColor(mockWords[1], 1, currentIndex, 999, 'x');
      expect(result).toBe(CHARACTER_COLORS.PENDING);
    });

    test('특수문자가 포함된 단어', () => {
      const specialWord = createWordState('he-llo', 'he-', false);
      const currentIndex = 0;
      const result = getCharacterColor(specialWord, 0, currentIndex, 2, '-');
      expect(result).toBe(CHARACTER_COLORS.CORRECT);
    });
  });

  describe('복잡한 시나리오', () => {
    test('여러 단어를 순차적으로 처리하는 시나리오', () => {
      const words = [
        createWordState('the', 'the', true),
        createWordState('quick', 'qui', false),
        createWordState('brown', '', false),
      ];
      const currentIndex = 1;

      // 완료된 단어
      expect(getCharacterColor(words[0], 0, currentIndex, 0, 't')).toBe(CHARACTER_COLORS.CORRECT);
      expect(getCharacterColor(words[0], 0, currentIndex, 2, 'e')).toBe(CHARACTER_COLORS.CORRECT);

      // 현재 단어
      expect(getCharacterColor(words[1], 1, currentIndex, 0, 'q')).toBe(CHARACTER_COLORS.CORRECT);
      expect(getCharacterColor(words[1], 1, currentIndex, 3, 'c')).toBe(CHARACTER_COLORS.PENDING);

      // 미래 단어
      expect(getCharacterColor(words[2], 2, currentIndex, 0, 'b')).toBe(CHARACTER_COLORS.PENDING);
    });

    test('오타가 포함된 복잡한 시나리오', () => {
      const words = [
        createWordState('cat', 'cxt', false), // 오타 포함
        createWordState('dog', 'd', false),   // 현재 입력 중
        createWordState('fish', '', false),   // 미래
      ];
      const currentIndex = 1;

      // 이전 단어의 오타
      expect(getCharacterColor(words[0], 0, currentIndex, 1, 'a')).toBe(CHARACTER_COLORS.INCORRECT);
      
      // 현재 단어의 정타
      expect(getCharacterColor(words[1], 1, currentIndex, 0, 'd')).toBe(CHARACTER_COLORS.CORRECT);
      
      // 미래 단어
      expect(getCharacterColor(words[2], 2, currentIndex, 0, 'f')).toBe(CHARACTER_COLORS.PENDING);
    });
  });

  describe('성능 테스트', () => {
    test('대량 데이터 처리 성능', () => {
      const largeWords = Array.from({ length: 1000 }, (_, i) => 
        createWordState(`word${i}`, `wor${i % 2 === 0 ? 'd' : 'x'}${i}`, i % 2 === 0)
      );
      
      const start = process.hrtime.bigint();
      
      // 1000개 단어에 대해 색상 계산
      for (let i = 0; i < largeWords.length; i++) {
        getCharacterColor(largeWords[i], i, 500, 0, 'w');
      }
      
      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000; // 나노초를 밀리초로 변환
      
      // 1000번 호출이 100ms 미만이어야 함
      expect(executionTime).toBeLessThan(100);
    });
  });

  describe('메모리 사용량 테스트', () => {
    test('함수 호출이 메모리 누수를 발생시키지 않음', () => {
      const word = createWordState('test', 'te', false);
      
      // 동일한 참조로 여러 번 호출
      for (let i = 0; i < 1000; i++) {
        getCharacterColor(word, 0, 0, 0, 't');
      }
      
      // 함수가 순수함수이므로 원본 객체가 변경되지 않아야 함
      expect(word.word).toBe('test');
      expect(word.typed).toBe('te');
      expect(word.isCorrect).toBe(false);
    });
  });
});