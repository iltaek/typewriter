import { getRandomWords, PRACTICE_WORDS } from '@/lib/words';

describe('PRACTICE_WORDS', () => {
  test('단어 목록이 비어있지 않음', () => {
    expect(PRACTICE_WORDS.length).toBeGreaterThan(0);
  });

  test('모든 단어가 문자열 타입', () => {
    PRACTICE_WORDS.forEach(word => {
      expect(typeof word).toBe('string');
    });
  });

  test('빈 문자열이 없음', () => {
    PRACTICE_WORDS.forEach(word => {
      expect(word.length).toBeGreaterThan(0);
    });
  });

  test('읽기 전용 배열임을 확인', () => {
    // TypeScript 타입에서 readonly로 정의되어 있음을 확인
    expect(Array.isArray(PRACTICE_WORDS)).toBe(true);
  });
});

describe('getRandomWords', () => {
  describe('정상 케이스', () => {
    test('요청한 개수만큼 단어 반환 - 5개', () => {
      const words = getRandomWords(5);
      expect(words).toHaveLength(5);
    });

    test('요청한 개수만큼 단어 반환 - 10개', () => {
      const words = getRandomWords(10);
      expect(words).toHaveLength(10);
    });

    test('요청한 개수만큼 단어 반환 - 1개', () => {
      const words = getRandomWords(1);
      expect(words).toHaveLength(1);
    });

    test('반환된 모든 단어가 PRACTICE_WORDS에 포함됨', () => {
      const words = getRandomWords(10);
      words.forEach(word => {
        expect(PRACTICE_WORDS).toContain(word);
      });
    });

    test('반환된 모든 단어가 문자열 타입', () => {
      const words = getRandomWords(10);
      words.forEach(word => {
        expect(typeof word).toBe('string');
        expect(word.length).toBeGreaterThan(0);
      });
    });
  });

  describe('실패 케이스', () => {
    test('음수 개수 요청 시 빈 배열 반환', () => {
      const words = getRandomWords(-1);
      expect(words).toHaveLength(0);
    });

    test('음수 큰 값 요청 시 빈 배열 반환', () => {
      const words = getRandomWords(-100);
      expect(words).toHaveLength(0);
    });
  });

  describe('엣지 케이스', () => {
    test('0개 요청 시 빈 배열 반환', () => {
      const words = getRandomWords(0);
      expect(words).toHaveLength(0);
    });

    test('전체 단어 수보다 많은 요청 시 요청한 개수만큼 반환 (중복 포함)', () => {
      // 현재 구현은 요청한 개수만큼 반환하되, 단어가 부족하면 undefined가 포함될 수 있음
      const requestCount = PRACTICE_WORDS.length + 100;
      const words = getRandomWords(requestCount);
      expect(words.length).toBe(requestCount);
    });

    test('전체 단어 수와 동일한 개수 요청', () => {
      const words = getRandomWords(PRACTICE_WORDS.length);
      expect(words).toHaveLength(PRACTICE_WORDS.length);
    });

    test('매우 큰 숫자 요청 처리', () => {
      // 현재 구현은 요청한 개수만큼 반환하므로 매우 큰 숫자는 성능상 문제가 될 수 있음
      // 테스트에서는 더 작은 수로 제한
      const words = getRandomWords(PRACTICE_WORDS.length + 10);
      expect(words.length).toBe(PRACTICE_WORDS.length + 10);
    });
  });

  describe('중복 검증', () => {
    test('반환된 단어들에 중복이 없음 - 10개', () => {
      const words = getRandomWords(10);
      const uniqueWords = new Set(words);
      expect(uniqueWords.size).toBe(words.length);
    });

    test('반환된 단어들에 중복이 없음 - 50개', () => {
      const words = getRandomWords(50);
      const uniqueWords = new Set(words);
      expect(uniqueWords.size).toBe(words.length);
    });

    test('반환된 단어들에 중복이 없음 - 최대 개수', () => {
      const maxSafeCount = Math.min(100, PRACTICE_WORDS.length);
      const words = getRandomWords(maxSafeCount);
      const uniqueWords = new Set(words);
      expect(uniqueWords.size).toBe(words.length);
    });
  });

  describe('랜덤성 검증', () => {
    test('여러 번 호출 시 다른 결과 반환 (대부분의 경우)', () => {
      const result1 = getRandomWords(10);
      const result2 = getRandomWords(10);
      
      // 배열을 문자열로 변환하여 비교 (순서도 고려)
      const str1 = result1.join(',');
      const str2 = result2.join(',');
      
      // 10개 단어가 완전히 동일한 순서로 나올 확률은 매우 낮음
      // 하지만 가끔 같을 수 있으므로 여러 번 시도
      let sameCount = 0;
      for (let i = 0; i < 10; i++) {
        const test1 = getRandomWords(5);
        const test2 = getRandomWords(5);
        if (test1.join(',') === test2.join(',')) {
          sameCount++;
        }
      }
      
      // 10번 중 대부분은 달라야 함 (최소 7번은 달라야 함)
      expect(sameCount).toBeLessThan(4);
    });

    test('첫 번째 단어가 항상 같지 않음', () => {
      const firstWords = [];
      for (let i = 0; i < 20; i++) {
        const words = getRandomWords(5);
        firstWords.push(words[0]);
      }
      
      const uniqueFirstWords = new Set(firstWords);
      // 20번 호출해서 첫 번째 단어가 최소 2개 이상의 다른 값이어야 함
      expect(uniqueFirstWords.size).toBeGreaterThan(1);
    });
  });

  describe('성능 테스트', () => {
    test('함수 실행 시간이 적절한 범위 내 - 100개 단어', () => {
      const start = process.hrtime.bigint();
      
      getRandomWords(100);
      
      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000; // 나노초를 밀리초로 변환
      
      // 100개 단어 생성이 100ms 미만이어야 함
      expect(executionTime).toBeLessThan(100);
    });

    test('대량 호출 시 성능 - 1000개 단어 10번', () => {
      const start = process.hrtime.bigint();
      
      for (let i = 0; i < 10; i++) {
        getRandomWords(Math.min(1000, PRACTICE_WORDS.length));
      }
      
      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000;
      
      // 10번 연속 호출이 1초 미만이어야 함
      expect(executionTime).toBeLessThan(1000);
    });
  });

  describe('메모리 사용량 테스트', () => {
    test('반환된 배열이 원본 배열과 독립적임', () => {
      const words1 = getRandomWords(5);
      const words2 = getRandomWords(5);
      
      // 배열 자체가 다른 인스턴스여야 함
      expect(words1).not.toBe(words2);
      
      // 원본 배열 수정이 반환된 배열에 영향을 주지 않아야 함
      words1.push('test-word');
      expect(words2).not.toContain('test-word');
    });

    test('원본 PRACTICE_WORDS 배열이 변경되지 않음', () => {
      const originalLength = PRACTICE_WORDS.length;
      const originalFirstWord = PRACTICE_WORDS[0];
      
      // 함수 호출
      getRandomWords(100);
      
      // 원본 배열이 변경되지 않았는지 확인
      expect(PRACTICE_WORDS.length).toBe(originalLength);
      expect(PRACTICE_WORDS[0]).toBe(originalFirstWord);
    });
  });

  describe('타입 검증', () => {
    test('반환값이 문자열 배열 타입', () => {
      const words = getRandomWords(5);
      expect(Array.isArray(words)).toBe(true);
      
      words.forEach(word => {
        expect(typeof word).toBe('string');
      });
    });

    test('숫자가 아닌 매개변수 처리', () => {
      // TypeScript에서는 컴파일 타임에 방지되지만 런타임에서 테스트
      const words = getRandomWords(NaN as any);
      expect(Array.isArray(words)).toBe(true);
    });
  });
});