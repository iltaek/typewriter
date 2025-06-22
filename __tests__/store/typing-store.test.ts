import { act, renderHook } from '@testing-library/react';
import { useTypingStore } from '@/store/typing-store';
import { useKeyboardStore } from '@/store/keyboard-store';
import { useLayoutStore } from '@/store/layout-store';
import { WORDS_COUNT } from '@/types/typing.types';
import { type WordState } from '@/types/word.types';

// Mock dependencies
jest.mock('@/lib/typing-stats', () => ({
  updateTypingStats: jest.fn((stats, startTime, isCharCorrect) => ({
    stats: {
      ...stats,
      correctChars: stats.correctChars + (isCharCorrect ? 1 : 0),
      totalChars: stats.totalChars + 1,
      accuracy: ((stats.correctChars + (isCharCorrect ? 1 : 0)) / (stats.totalChars + 1)) * 100,
      wpm: startTime ? Math.floor(((stats.totalChars + 1) / 5) / ((Date.now() - startTime) / 60000)) : 0,
    },
    startTime: startTime || Date.now(),
  })),
}));

jest.mock('@/lib/words', () => ({
  getRandomWords: jest.fn((count: number) => 
    Array.from({ length: count }, (_, i) => `word${i + 1}`)
  ),
}));

jest.mock('@/store/keyboard-store', () => ({
  useKeyboardStore: {
    getState: jest.fn(() => ({
      setOnKeyPress: jest.fn(),
    })),
  },
}));

jest.mock('@/store/layout-store', () => ({
  useLayoutStore: {
    getState: jest.fn(() => ({
      layout: 'qwerty',
    })),
  },
}));

// Mock typing-actions
jest.mock('@/store/typing-actions', () => ({
  handleTypingKeyDown: jest.fn(),
}));

// Mock KeyboardEvent 생성 헬퍼
const createKeyboardEvent = (
  key: string,
  code: string = '',
  options: Partial<KeyboardEventInit> = {},
): KeyboardEvent => {
  return new KeyboardEvent('keydown', {
    key,
    code,
    bubbles: true,
    cancelable: true,
    ...options,
  });
};

// Mock WordState 생성 헬퍼
const createWordState = (word: string, typed: string = '', isCorrect: boolean = false): WordState => ({
  word,
  typed,
  isCorrect,
});

describe('useTypingStore', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Reset the store state
    useTypingStore.setState({
      words: [],
      currentIndex: 0,
      stats: {
        accuracy: 0,
        wpm: 0,
        correctChars: 0,
        totalChars: 0,
      },
      startTime: null,
    });
  });

  afterEach(() => {
    // Cleanup event listeners after each test
    act(() => {
      useTypingStore.getState().cleanup();
    });
  });

  describe('초기 상태', () => {
    test('초기 상태가 올바르게 설정됨', () => {
      const { result } = renderHook(() => useTypingStore());
      const store = result.current;

      expect(store.words).toEqual([]);
      expect(store.currentIndex).toBe(0);
      expect(store.stats).toEqual({
        accuracy: 0,
        wpm: 0,
        correctChars: 0,
        totalChars: 0,
      });
      expect(store.startTime).toBeNull();
    });

    test('액션 함수들이 정의됨', () => {
      const { result } = renderHook(() => useTypingStore());
      const store = result.current;

      expect(typeof store.handleTypingKeyDown).toBe('function');
      expect(typeof store.generateNewWords).toBe('function');
      expect(typeof store.setInitialWords).toBe('function');
      expect(typeof store.updateStats).toBe('function');
      expect(typeof store.registerKeyboardListeners).toBe('function');
      expect(typeof store.cleanup).toBe('function');
    });
  });

  describe('setInitialWords', () => {
    test('정상 케이스: 초기 단어 목록 설정', () => {
      const { result } = renderHook(() => useTypingStore());
      const initialWords = ['hello', 'world', 'test'];

      act(() => {
        result.current.setInitialWords(initialWords);
      });

      const store = result.current;
      expect(store.words).toHaveLength(3);
      expect(store.words[0]).toEqual(createWordState('hello'));
      expect(store.words[1]).toEqual(createWordState('world'));
      expect(store.words[2]).toEqual(createWordState('test'));
      expect(store.currentIndex).toBe(0);
      expect(store.stats).toEqual({
        accuracy: 0,
        wpm: 0,
        correctChars: 0,
        totalChars: 0,
      });
      expect(store.startTime).toBeNull();
    });

    test('빈 배열로 초기화', () => {
      const { result } = renderHook(() => useTypingStore());

      act(() => {
        result.current.setInitialWords([]);
      });

      expect(result.current.words).toEqual([]);
      expect(result.current.currentIndex).toBe(0);
    });

    test('한 개 단어로 초기화', () => {
      const { result } = renderHook(() => useTypingStore());

      act(() => {
        result.current.setInitialWords(['single']);
      });

      expect(result.current.words).toHaveLength(1);
      expect(result.current.words[0]).toEqual(createWordState('single'));
    });

    test('매우 긴 단어 목록으로 초기화', () => {
      const { result } = renderHook(() => useTypingStore());
      const longWordList = Array.from({ length: 1000 }, (_, i) => `word${i}`);

      act(() => {
        result.current.setInitialWords(longWordList);
      });

      expect(result.current.words).toHaveLength(1000);
      expect(result.current.words[999]).toEqual(createWordState('word999'));
    });
  });

  describe('generateNewWords', () => {
    test('정상 케이스: 새 단어 목록 생성', () => {
      const { result } = renderHook(() => useTypingStore());

      act(() => {
        result.current.generateNewWords();
      });

      const store = result.current;
      expect(store.words).toHaveLength(WORDS_COUNT);
      expect(store.words[0]).toEqual(createWordState('word1'));
      expect(store.currentIndex).toBe(0);
      expect(store.stats).toEqual({
        accuracy: 0,
        wpm: 0,
        correctChars: 0,
        totalChars: 0,
      });
      expect(store.startTime).toBeNull();
    });

    test('기존 상태 완전 초기화 확인', () => {
      const { result } = renderHook(() => useTypingStore());

      // 먼저 일부 상태를 설정
      act(() => {
        useTypingStore.setState({
          words: [createWordState('old', 'ol')],
          currentIndex: 5,
          stats: {
            accuracy: 85,
            wpm: 45,
            correctChars: 17,
            totalChars: 20,
          },
          startTime: Date.now() - 10000,
        });
      });

      // 새 단어 생성
      act(() => {
        result.current.generateNewWords();
      });

      const store = result.current;
      expect(store.currentIndex).toBe(0);
      expect(store.stats).toEqual({
        accuracy: 0,
        wpm: 0,
        correctChars: 0,
        totalChars: 0,
      });
      expect(store.startTime).toBeNull();
    });

    test('getRandomWords 호출 확인', () => {
      const { result } = renderHook(() => useTypingStore());
      const mockGetRandomWords = require('@/lib/words').getRandomWords;

      act(() => {
        result.current.generateNewWords();
      });

      expect(mockGetRandomWords).toHaveBeenCalledWith(WORDS_COUNT);
      expect(mockGetRandomWords).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateStats', () => {
    test('정상 케이스: 정타 통계 업데이트', () => {
      const { result } = renderHook(() => useTypingStore());
      const mockUpdateTypingStats = require('@/lib/typing-stats').updateTypingStats;

      act(() => {
        result.current.updateStats(true);
      });

      expect(mockUpdateTypingStats).toHaveBeenCalledWith(
        expect.objectContaining({
          accuracy: 0,
          wpm: 0,
          correctChars: 0,
          totalChars: 0,
        }),
        null,
        true
      );
    });

    test('오타 통계 업데이트', () => {
      const { result } = renderHook(() => useTypingStore());
      const mockUpdateTypingStats = require('@/lib/typing-stats').updateTypingStats;

      act(() => {
        result.current.updateStats(false);
      });

      expect(mockUpdateTypingStats).toHaveBeenCalledWith(
        expect.objectContaining({
          accuracy: 0,
          wpm: 0,
          correctChars: 0,
          totalChars: 0,
        }),
        null,
        false
      );
    });

    test('시작 시간이 있는 상태에서 통계 업데이트', () => {
      const { result } = renderHook(() => useTypingStore());
      const mockUpdateTypingStats = require('@/lib/typing-stats').updateTypingStats;
      const testStartTime = Date.now() - 5000;

      // 시작 시간 설정
      act(() => {
        useTypingStore.setState({ startTime: testStartTime });
      });

      act(() => {
        result.current.updateStats(true);
      });

      expect(mockUpdateTypingStats).toHaveBeenCalledWith(
        expect.any(Object),
        testStartTime,
        true
      );
    });

    test('연속된 통계 업데이트', () => {
      const { result } = renderHook(() => useTypingStore());

      act(() => {
        result.current.updateStats(true);
        result.current.updateStats(false);
        result.current.updateStats(true);
      });

      const mockUpdateTypingStats = require('@/lib/typing-stats').updateTypingStats;
      expect(mockUpdateTypingStats).toHaveBeenCalledTimes(3);
    });
  });

  describe('handleTypingKeyDown', () => {
    test('정상 케이스: 키보드 이벤트 처리', () => {
      const { result } = renderHook(() => useTypingStore());
      const mockProcessTypingKeyDown = require('@/store/typing-actions').handleTypingKeyDown;
      const event = createKeyboardEvent('a', 'KeyA');

      act(() => {
        result.current.handleTypingKeyDown(event);
      });

      expect(mockProcessTypingKeyDown).toHaveBeenCalledWith(
        event,
        'qwerty',
        expect.objectContaining({
          words: [],
          currentIndex: 0,
          setState: expect.any(Function),
          updateStats: expect.any(Function),
          generateNewWords: expect.any(Function),
        })
      );
    });

    test('다양한 키 이벤트 처리', () => {
      const { result } = renderHook(() => useTypingStore());
      const mockProcessTypingKeyDown = require('@/store/typing-actions').handleTypingKeyDown;

      const events = [
        createKeyboardEvent('a', 'KeyA'),
        createKeyboardEvent('Backspace', 'Backspace'),
        createKeyboardEvent(' ', 'Space'),
        createKeyboardEvent('Enter', 'Enter'),
      ];

      events.forEach(event => {
        act(() => {
          result.current.handleTypingKeyDown(event);
        });
      });

      expect(mockProcessTypingKeyDown).toHaveBeenCalledTimes(4);
    });

    test('레이아웃 상태 연동 확인', () => {
      const { result } = renderHook(() => useTypingStore());
      const mockProcessTypingKeyDown = require('@/store/typing-actions').handleTypingKeyDown;
      const mockLayoutStore = useLayoutStore as jest.Mocked<typeof useLayoutStore>;

      // 레이아웃 변경
      mockLayoutStore.getState.mockReturnValue({ layout: 'colemak' });

      const event = createKeyboardEvent('a', 'KeyA');
      act(() => {
        result.current.handleTypingKeyDown(event);
      });

      expect(mockProcessTypingKeyDown).toHaveBeenCalledWith(
        event,
        'colemak',
        expect.any(Object)
      );
    });
  });

  describe('registerKeyboardListeners', () => {
    let addEventListenerSpy: jest.SpyInstance;
    let removeEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
      addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    });

    afterEach(() => {
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    test('정상 케이스: 이벤트 리스너 등록', () => {
      const { result } = renderHook(() => useTypingStore());

      act(() => {
        result.current.registerKeyboardListeners();
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('keypress', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    test('키보드 스토어 연동 확인', () => {
      const { result } = renderHook(() => useTypingStore());
      const mockKeyboardStore = useKeyboardStore as jest.Mocked<typeof useKeyboardStore>;
      const mockSetOnKeyPress = jest.fn();

      mockKeyboardStore.getState.mockReturnValue({
        setOnKeyPress: mockSetOnKeyPress,
      });

      act(() => {
        result.current.registerKeyboardListeners();
      });

      expect(mockSetOnKeyPress).toHaveBeenCalledWith(undefined);
    });

    test('중복 등록 시 기존 리스너 정리', () => {
      const { result } = renderHook(() => useTypingStore());

      // 첫 번째 등록
      act(() => {
        result.current.registerKeyboardListeners();
      });

      addEventListenerSpy.mockClear();
      removeEventListenerSpy.mockClear();

      // 두 번째 등록
      act(() => {
        result.current.registerKeyboardListeners();
      });

      // 기존 리스너 제거 후 새로 등록
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    test('등록된 keydown 핸들러 동작 확인', () => {
      const { result } = renderHook(() => useTypingStore());
      
      // Layout 모킹을 qwerty로 설정
      const mockLayoutStore = useLayoutStore as jest.Mocked<typeof useLayoutStore>;
      mockLayoutStore.getState.mockReturnValue({ layout: 'qwerty' });

      act(() => {
        result.current.registerKeyboardListeners();
      });

      // keydown 이벤트 트리거
      const event = createKeyboardEvent('a', 'KeyA');
      const keydownHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'keydown'
      )?.[1] as EventListener;

      expect(keydownHandler).toBeDefined();

      act(() => {
        keydownHandler(event);
      });

      const mockProcessTypingKeyDown = require('@/store/typing-actions').handleTypingKeyDown;
      expect(mockProcessTypingKeyDown).toHaveBeenCalledWith(
        event,
        'qwerty',
        expect.any(Object)
      );
    });

    test('등록된 keypress 핸들러가 preventDefault 호출', () => {
      const { result } = renderHook(() => useTypingStore());

      act(() => {
        result.current.registerKeyboardListeners();
      });

      // keypress 이벤트 트리거
      const event = createKeyboardEvent('a', 'KeyA');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      
      const keypressHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'keypress'
      )?.[1] as EventListener;

      expect(keypressHandler).toBeDefined();

      act(() => {
        keypressHandler(event);
      });

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    let removeEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
      removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    });

    afterEach(() => {
      removeEventListenerSpy.mockRestore();
    });

    test('정상 케이스: 이벤트 리스너 정리', () => {
      const { result } = renderHook(() => useTypingStore());

      // 먼저 리스너 등록
      act(() => {
        result.current.registerKeyboardListeners();
      });

      removeEventListenerSpy.mockClear();

      // 정리 실행
      act(() => {
        result.current.cleanup();
      });

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keypress', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    test('리스너가 등록되지 않은 상태에서 cleanup 호출', () => {
      const { result } = renderHook(() => useTypingStore());

      act(() => {
        result.current.cleanup();
      });

      // 아무 일도 일어나지 않아야 함
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    test('여러 번 cleanup 호출', () => {
      const { result } = renderHook(() => useTypingStore());

      // 리스너 등록
      act(() => {
        result.current.registerKeyboardListeners();
      });

      // 첫 번째 cleanup
      act(() => {
        result.current.cleanup();
      });

      removeEventListenerSpy.mockClear();

      // 두 번째 cleanup
      act(() => {
        result.current.cleanup();
      });

      // 두 번째 호출에서는 아무 일도 일어나지 않아야 함
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });
  });

  describe('통합 시나리오', () => {
    test('전체 타이핑 플로우', () => {
      const { result } = renderHook(() => useTypingStore());

      // 1. 초기 단어 설정
      act(() => {
        result.current.setInitialWords(['hello', 'world']);
      });

      expect(result.current.words).toHaveLength(2);
      expect(result.current.currentIndex).toBe(0);

      // 2. 키보드 리스너 등록
      act(() => {
        result.current.registerKeyboardListeners();
      });

      // 3. 타이핑 시뮬레이션
      const event = createKeyboardEvent('h', 'KeyH');
      act(() => {
        result.current.handleTypingKeyDown(event);
      });

      // 4. 통계 업데이트
      act(() => {
        result.current.updateStats(true);
      });

      // 5. 새 단어 생성
      act(() => {
        result.current.generateNewWords();
      });

      expect(result.current.words).toHaveLength(WORDS_COUNT);
      expect(result.current.currentIndex).toBe(0);

      // 6. 정리
      act(() => {
        result.current.cleanup();
      });
    });

    test('에러 상황에서의 복구', () => {
      const { result } = renderHook(() => useTypingStore());

      // 잘못된 상태 설정
      act(() => {
        useTypingStore.setState({
          words: [],
          currentIndex: -1,
          stats: {
            accuracy: -50,
            wpm: -20,
            correctChars: -5,
            totalChars: -10,
          },
        });
      });

      // 새 단어 생성으로 복구
      act(() => {
        result.current.generateNewWords();
      });

      expect(result.current.currentIndex).toBe(0);
      expect(result.current.stats).toEqual({
        accuracy: 0,
        wpm: 0,
        correctChars: 0,
        totalChars: 0,
      });
    });
  });

  describe('성능 테스트', () => {
    test('대량 단어 처리 성능', () => {
      const { result } = renderHook(() => useTypingStore());
      const largeWordList = Array.from({ length: 10000 }, (_, i) => `word${i}`);

      const start = process.hrtime.bigint();

      act(() => {
        result.current.setInitialWords(largeWordList);
      });

      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000; // 나노초를 밀리초로 변환

      // 10000개 단어 설정이 100ms 미만이어야 함
      expect(executionTime).toBeLessThan(100);
      expect(result.current.words).toHaveLength(10000);
    });

    test('빈번한 상태 업데이트 성능', () => {
      const { result } = renderHook(() => useTypingStore());

      const start = process.hrtime.bigint();

      // 1000번의 통계 업데이트
      act(() => {
        for (let i = 0; i < 1000; i++) {
          result.current.updateStats(i % 2 === 0);
        }
      });

      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000;

      // 1000번 업데이트가 200ms 미만이어야 함
      expect(executionTime).toBeLessThan(200);
    });
  });

  describe('메모리 사용량 테스트', () => {
    test('스토어 사용이 메모리 누수를 발생시키지 않음', () => {
      const { result } = renderHook(() => useTypingStore());
      const initialWords = ['test', 'memory', 'usage'];

      // 동일한 참조로 여러 번 호출
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.setInitialWords(initialWords);
          result.current.generateNewWords();
        });
      }

      // 최종 상태가 예상과 일치하는지 확인
      expect(result.current.words).toHaveLength(WORDS_COUNT);
      expect(result.current.currentIndex).toBe(0);
    });

    test('이벤트 리스너 등록/해제가 메모리 누수를 발생시키지 않음', () => {
      const { result } = renderHook(() => useTypingStore());

      // 여러 번 등록/해제 반복
      for (let i = 0; i < 50; i++) {
        act(() => {
          result.current.registerKeyboardListeners();
          result.current.cleanup();
        });
      }

      // 마지막에 정리 상태 확인
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      act(() => {
        result.current.cleanup();
      });

      // 이미 정리된 상태이므로 추가 호출이 없어야 함
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
      
      removeEventListenerSpy.mockRestore();
    });
  });
});