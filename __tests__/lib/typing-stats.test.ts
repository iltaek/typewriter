import { calculateWPM, calculateAccuracy, updateTypingStats } from '@/lib/typing-stats';
import { type TypingStats } from '@/types/typing.types';

describe('calculateWPM', () => {
  describe('정상 케이스', () => {
    test('표준 타이핑 속도 계산 - 60초에 100자', () => {
      // 100문자를 60초에 입력 = 20 WPM (100/5/1분)
      expect(calculateWPM(100, 60)).toBe(20);
    });

    test('빠른 타이핑 속도 계산 - 30초에 150자', () => {
      // 150문자를 30초에 입력 = 60 WPM (150/5/0.5분)
      expect(calculateWPM(150, 30)).toBe(60);
    });

    test('느린 타이핑 속도 계산 - 120초에 100자', () => {
      // 100문자를 120초에 입력 = 10 WPM (100/5/2분)
      expect(calculateWPM(100, 120)).toBe(10);
    });
  });

  describe('실패 케이스', () => {
    test('음수 문자 수 입력 시 음수 결과 반환', () => {
      // 현재 구현은 음수 검증 없이 계산을 수행함
      expect(calculateWPM(-10, 60)).toBe(-2); // (-10/5)/1 = -2
    });

    test('음수 시간 입력 시 음수 결과 반환', () => {
      // 현재 구현은 음수 검증 없이 계산을 수행함
      expect(calculateWPM(100, -60)).toBe(-20); // (100/5)/(-1) = -20
    });

    test('둘 다 음수인 경우 양수 결과 반환', () => {
      // 음수 / 음수 = 양수
      expect(calculateWPM(-50, -30)).toBe(20); // (-50/5)/(-0.5) = 20
    });
  });

  describe('엣지 케이스', () => {
    test('0초 입력 시 0 반환 (0으로 나누기 방지)', () => {
      expect(calculateWPM(100, 0)).toBe(0);
    });

    test('0문자 입력 시 0 반환', () => {
      expect(calculateWPM(0, 60)).toBe(0);
    });

    test('매우 큰 숫자 처리', () => {
      // 999995문자를 1초에 입력 = (999995/5)/(1/60) = 11999940
      const result = calculateWPM(999995, 1);
      expect(result).toBe(11999940);
    });

    test('소수점 시간 처리', () => {
      // 100문자를 30.5초에 입력 = 약 39.34 WPM
      expect(calculateWPM(100, 30.5)).toBe(39);
    });
  });
});

describe('calculateAccuracy', () => {
  describe('정상 케이스', () => {
    test('50% 정확도 계산', () => {
      expect(calculateAccuracy(50, 100)).toBe(50);
    });

    test('100% 정확도 계산', () => {
      expect(calculateAccuracy(100, 100)).toBe(100);
    });

    test('소수점 포함 정확도 계산', () => {
      // 67문자 정타 / 100문자 총입력 = 67%
      expect(calculateAccuracy(67, 100)).toBe(67);
    });
  });

  describe('실패 케이스', () => {
    test('음수 정타 수 처리', () => {
      expect(calculateAccuracy(-10, 100)).toBe(-10);
    });

    test('음수 총 문자 수 처리', () => {
      expect(calculateAccuracy(50, -100)).toBe(-50);
    });

    test('정타 수가 총 문자 수보다 큰 경우', () => {
      // 이론적으로는 불가능하지만 데이터 오류 시 발생 가능
      expect(calculateAccuracy(150, 100)).toBe(150);
    });
  });

  describe('엣지 케이스', () => {
    test('0으로 나누기 방지 - 총 문자 수가 0', () => {
      expect(calculateAccuracy(10, 0)).toBe(0);
    });

    test('둘 다 0인 경우', () => {
      expect(calculateAccuracy(0, 0)).toBe(0);
    });

    test('매우 작은 정확도 계산', () => {
      // 1문자 정타 / 1000문자 총입력 = 0.1%
      expect(calculateAccuracy(1, 1000)).toBe(0.1);
    });

    test('소수점 결과 처리', () => {
      // 1문자 정타 / 3문자 총입력 = 33.333...%
      expect(calculateAccuracy(1, 3)).toBeCloseTo(33.33, 2);
    });
  });
});

describe('updateTypingStats', () => {
  const baseStats: TypingStats = {
    accuracy: 0,
    wpm: 0,
    correctChars: 0,
    totalChars: 0,
  };

  describe('정상 케이스', () => {
    test('정타 입력 시 통계 업데이트', () => {
      const mockStartTime = Date.now() - 60000; // 1분 전
      const result = updateTypingStats(baseStats, mockStartTime, true);

      expect(result.stats.correctChars).toBe(1);
      expect(result.stats.totalChars).toBe(1);
      expect(result.stats.accuracy).toBe(100);
      // 1글자, 60초 = (1/5)/1분 = 0.2 -> Math.round(0.2) = 0
      expect(result.stats.wpm).toBe(0);
      expect(result.startTime).toBe(mockStartTime);
    });

    test('오타 입력 시 통계 업데이트', () => {
      const mockStartTime = Date.now() - 30000; // 30초 전
      const result = updateTypingStats(baseStats, mockStartTime, false);

      expect(result.stats.correctChars).toBe(0);
      expect(result.stats.totalChars).toBe(1);
      expect(result.stats.accuracy).toBe(0);
      expect(result.stats.wpm).toBe(0);
      expect(result.startTime).toBe(mockStartTime);
    });

    test('기존 통계에 누적 업데이트', () => {
      const existingStats: TypingStats = {
        accuracy: 50,
        wpm: 20,
        correctChars: 10,
        totalChars: 20,
      };
      const mockStartTime = Date.now() - 60000;
      const result = updateTypingStats(existingStats, mockStartTime, true);

      expect(result.stats.correctChars).toBe(11);
      expect(result.stats.totalChars).toBe(21);
      expect(result.stats.accuracy).toBeCloseTo(52.38, 1); // 11/21 * 100
    });
  });

  describe('실패 케이스', () => {
    test('잘못된 시작 시간 처리', () => {
      const futureTime = Date.now() + 60000; // 미래 시간
      const result = updateTypingStats(baseStats, futureTime, true);

      // 음수 시간이더라도 계산 진행 (실제 구현 확인 필요)
      expect(result.stats.totalChars).toBe(1);
      expect(result.startTime).toBe(futureTime);
    });
  });

  describe('엣지 케이스', () => {
    test('시작 시간이 null일 때 현재 시간으로 설정', () => {
      const beforeTest = Date.now();
      const result = updateTypingStats(baseStats, null, true);
      const afterTest = Date.now();

      expect(result.startTime).toBeGreaterThanOrEqual(beforeTest);
      expect(result.startTime).toBeLessThanOrEqual(afterTest);
      expect(result.stats.totalChars).toBe(1);
    });

    test('시작 시간과 현재 시간이 동일한 경우 (0초)', () => {
      const currentTime = Date.now();
      const result = updateTypingStats(baseStats, currentTime, true);

      expect(result.stats.wpm).toBe(0); // 0초이므로 WPM은 0
      expect(result.stats.accuracy).toBe(100);
      expect(result.stats.totalChars).toBe(1);
    });

    test('매우 큰 통계 값 처리', () => {
      const largeStats: TypingStats = {
        accuracy: 95,
        wpm: 150,
        correctChars: 9999,
        totalChars: 10000,
      };
      const mockStartTime = Date.now() - 60000;
      const result = updateTypingStats(largeStats, mockStartTime, true);

      expect(result.stats.correctChars).toBe(10000);
      expect(result.stats.totalChars).toBe(10001);
      expect(result.stats.accuracy).toBeCloseTo(99.99, 2);
    });
  });

  describe('성능 테스트', () => {
    test('함수 실행 시간이 적절한 범위 내', () => {
      const start = process.hrtime.bigint();
      
      // 100번 연속 실행
      for (let i = 0; i < 100; i++) {
        updateTypingStats(baseStats, Date.now() - 60000, Math.random() > 0.5);
      }
      
      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000; // 나노초를 밀리초로 변환
      
      // 100번 실행이 100ms 미만이어야 함 (평균 1ms 미만)
      expect(executionTime).toBeLessThan(100);
    });
  });
});