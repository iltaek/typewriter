import { act, renderHook } from '@testing-library/react';
import { useKeyboardStore } from '@/store/keyboard-store';
import { useLayoutStore } from '@/store/layout-store';

// Mock dependencies
jest.mock('@/lib/keyboard', () => ({
  remapKey: jest.fn((code: string, from: string, to: string) => {
    // 간단한 모킹: qwerty에서 colemak으로 일부 키 매핑
    if (from === 'qwerty' && to === 'colemak') {
      const mapping: Record<string, string> = {
        'KeyE': 'KeyF',
        'KeyR': 'KeyP',
        'KeyT': 'KeyG',
      };
      return mapping[code] || code;
    }
    return code;
  }),
  getCharacterFromKeyCode: jest.fn((code: string, layout: string, shift: boolean) => {
    // 간단한 문자 매핑
    const baseMapping: Record<string, string> = {
      'KeyA': 'a',
      'KeyB': 'b',
      'KeyE': 'e',
      'KeyF': 'f',
      'KeyP': 'p',
      'KeyG': 'g',
      'Space': ' ',
    };
    
    const char = baseMapping[code];
    if (!char) return '';
    
    return shift ? char.toUpperCase() : char;
  }),
}));

jest.mock('@/store/layout-store', () => ({
  useLayoutStore: {
    getState: jest.fn(() => ({
      layout: 'qwerty',
    })),
  },
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

describe('useKeyboardStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the store state
    useKeyboardStore.setState({
      pressedKeys: new Set<string>(),
      onKeyPress: undefined,
    });
  });

  afterEach(() => {
    // Cleanup event listeners
    const { result } = renderHook(() => useKeyboardStore());
    const cleanup = result.current.registerListeners();
    cleanup();
  });

  describe('초기 상태', () => {
    test('초기 상태가 올바르게 설정됨', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const store = result.current;

      expect(store.pressedKeys).toEqual(new Set());
      expect(store.onKeyPress).toBeUndefined();
      expect(typeof store.handleKeyDown).toBe('function');
      expect(typeof store.handleKeyUp).toBe('function');
      expect(typeof store.registerListeners).toBe('function');
      expect(typeof store.setOnKeyPress).toBe('function');
    });

    test('pressedKeys가 Set 객체임', () => {
      const { result } = renderHook(() => useKeyboardStore());
      
      expect(result.current.pressedKeys).toBeInstanceOf(Set);
      expect(result.current.pressedKeys.size).toBe(0);
    });
  });

  describe('setOnKeyPress', () => {
    test('정상 케이스: 콜백 함수 설정', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();

      act(() => {
        result.current.setOnKeyPress(mockCallback);
      });

      expect(result.current.onKeyPress).toBe(mockCallback);
    });

    test('콜백 함수 제거 (undefined 설정)', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();

      // 먼저 콜백 설정
      act(() => {
        result.current.setOnKeyPress(mockCallback);
      });

      expect(result.current.onKeyPress).toBe(mockCallback);

      // 콜백 제거
      act(() => {
        result.current.setOnKeyPress(undefined);
      });

      expect(result.current.onKeyPress).toBeUndefined();
    });

    test('여러 번 콜백 변경', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      act(() => {
        result.current.setOnKeyPress(callback1);
      });
      expect(result.current.onKeyPress).toBe(callback1);

      act(() => {
        result.current.setOnKeyPress(callback2);
      });
      expect(result.current.onKeyPress).toBe(callback2);
    });
  });

  describe('handleKeyDown', () => {
    test('정상 케이스: 일반 문자 키 처리', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();
      const event = createKeyboardEvent('a', 'KeyA');

      act(() => {
        result.current.setOnKeyPress(mockCallback);
        result.current.handleKeyDown(event);
      });

      expect(mockCallback).toHaveBeenCalledWith('a');
      expect(result.current.pressedKeys).toContain('KeyA');
    });

    test('Shift 키와 함께 처리', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();
      const event = createKeyboardEvent('A', 'KeyA', { shiftKey: true });

      act(() => {
        result.current.setOnKeyPress(mockCallback);
        result.current.handleKeyDown(event);
      });

      expect(mockCallback).toHaveBeenCalledWith('A');
      expect(result.current.pressedKeys).toContain('KeyA');
    });

    test('특수 키 조합 무시 - Ctrl', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();
      const event = createKeyboardEvent('r', 'KeyR', { ctrlKey: true });

      act(() => {
        result.current.setOnKeyPress(mockCallback);
        result.current.handleKeyDown(event);
      });

      // Ctrl 조합은 무시되므로 콜백 호출되지 않고 pressedKeys도 업데이트되지 않음
      expect(mockCallback).not.toHaveBeenCalled();
      expect(result.current.pressedKeys.size).toBe(0);
    });

    test('특수 키 조합 무시 - Alt', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();
      const event = createKeyboardEvent('a', 'KeyA', { altKey: true });

      act(() => {
        result.current.setOnKeyPress(mockCallback);
        result.current.handleKeyDown(event);
      });

      expect(mockCallback).not.toHaveBeenCalled();
      expect(result.current.pressedKeys.size).toBe(0);
    });

    test('특수 키 조합 무시 - Meta (Command)', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();
      const event = createKeyboardEvent('a', 'KeyA', { metaKey: true });

      act(() => {
        result.current.setOnKeyPress(mockCallback);
        result.current.handleKeyDown(event);
      });

      expect(mockCallback).not.toHaveBeenCalled();
      expect(result.current.pressedKeys.size).toBe(0);
    });

    test('QWERTY 레이아웃에서 키 처리', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();
      const mockLayoutStore = useLayoutStore as jest.Mocked<typeof useLayoutStore>;

      mockLayoutStore.getState.mockReturnValue({ layout: 'qwerty' });

      const event = createKeyboardEvent('e', 'KeyE');

      act(() => {
        result.current.setOnKeyPress(mockCallback);
        result.current.handleKeyDown(event);
      });

      // QWERTY에서는 e.key 그대로 사용
      expect(mockCallback).toHaveBeenCalledWith('e');
    });

    test('COLEMAK 레이아웃에서 키 매핑 처리', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();
      const mockLayoutStore = useLayoutStore as jest.Mocked<typeof useLayoutStore>;

      mockLayoutStore.getState.mockReturnValue({ layout: 'colemak' });

      const event = createKeyboardEvent('e', 'KeyE');

      act(() => {
        result.current.setOnKeyPress(mockCallback);
        result.current.handleKeyDown(event);
      });

      // COLEMAK에서는 getCharacterFromKeyCode 사용 (remapKey: KeyE -> KeyF, KeyF -> f)
      expect(mockCallback).toHaveBeenCalledWith('f');
    });

    test('다중 문자 키는 콜백 호출 안함', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();
      const event = createKeyboardEvent('Enter', 'Enter');

      act(() => {
        result.current.setOnKeyPress(mockCallback);
        result.current.handleKeyDown(event);
      });

      // Enter는 길이가 1이 아니므로 콜백 호출되지 않음
      expect(mockCallback).not.toHaveBeenCalled();
      expect(result.current.pressedKeys).toContain('Enter');
    });

    test('콜백이 설정되지 않은 상태에서 키 처리', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const event = createKeyboardEvent('a', 'KeyA');

      act(() => {
        result.current.handleKeyDown(event);
      });

      // 에러가 발생하지 않아야 하고 pressedKeys는 업데이트됨
      expect(result.current.pressedKeys).toContain('KeyA');
    });

    test('매핑된 문자가 빈 문자열인 경우', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();
      const mockLayoutStore = useLayoutStore as jest.Mocked<typeof useLayoutStore>;

      mockLayoutStore.getState.mockReturnValue({ layout: 'colemak' });

      // getCharacterFromKeyCode가 빈 문자열 반환하도록 모킹
      require('@/lib/keyboard').getCharacterFromKeyCode.mockReturnValue('');

      const event = createKeyboardEvent('x', 'KeyX');

      act(() => {
        result.current.setOnKeyPress(mockCallback);
        result.current.handleKeyDown(event);
      });

      // 빈 문자열이므로 콜백 호출되지 않음
      expect(mockCallback).not.toHaveBeenCalled();
      expect(result.current.pressedKeys).toContain('KeyX');
    });

    test('여러 키 동시 처리', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const events = [
        createKeyboardEvent('a', 'KeyA'),
        createKeyboardEvent('s', 'KeyS'),
        createKeyboardEvent('d', 'KeyD'),
      ];

      events.forEach(event => {
        act(() => {
          result.current.handleKeyDown(event);
        });
      });

      expect(result.current.pressedKeys.size).toBe(3);
      expect(result.current.pressedKeys).toContain('KeyA');
      expect(result.current.pressedKeys).toContain('KeyS');
      expect(result.current.pressedKeys).toContain('KeyD');
    });
  });

  describe('handleKeyUp', () => {
    test('정상 케이스: 키 해제 처리', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const downEvent = createKeyboardEvent('a', 'KeyA');
      const upEvent = createKeyboardEvent('a', 'KeyA');

      // 키 누름
      act(() => {
        result.current.handleKeyDown(downEvent);
      });

      expect(result.current.pressedKeys).toContain('KeyA');

      // 키 해제
      act(() => {
        result.current.handleKeyUp(upEvent);
      });

      expect(result.current.pressedKeys).not.toContain('KeyA');
      expect(result.current.pressedKeys.size).toBe(0);
    });

    test('COLEMAK 레이아웃에서 키 매핑 해제', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockLayoutStore = useLayoutStore as jest.Mocked<typeof useLayoutStore>;

      mockLayoutStore.getState.mockReturnValue({ layout: 'colemak' });

      const downEvent = createKeyboardEvent('e', 'KeyE');
      const upEvent = createKeyboardEvent('e', 'KeyE');

      // 키 누름 (KeyE -> KeyF로 매핑됨)
      act(() => {
        result.current.handleKeyDown(downEvent);
      });

      expect(result.current.pressedKeys).toContain('KeyF');

      // 키 해제 (KeyE -> KeyF로 매핑되어 KeyF가 제거됨)
      act(() => {
        result.current.handleKeyUp(upEvent);
      });

      expect(result.current.pressedKeys).not.toContain('KeyF');
      expect(result.current.pressedKeys.size).toBe(0);
    });

    test('눌리지 않은 키 해제 시도', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const upEvent = createKeyboardEvent('a', 'KeyA');

      // 키를 누르지 않고 해제 시도
      act(() => {
        result.current.handleKeyUp(upEvent);
      });

      // 에러가 발생하지 않아야 함
      expect(result.current.pressedKeys.size).toBe(0);
    });

    test('여러 키 중 일부만 해제', () => {
      const { result } = renderHook(() => useKeyboardStore());

      // 여러 키 누름
      const keys = ['KeyA', 'KeyS', 'KeyD'];
      keys.forEach(code => {
        const event = createKeyboardEvent(code.slice(-1).toLowerCase(), code);
        act(() => {
          result.current.handleKeyDown(event);
        });
      });

      expect(result.current.pressedKeys.size).toBe(3);

      // 일부 키만 해제
      const upEvent = createKeyboardEvent('s', 'KeyS');
      act(() => {
        result.current.handleKeyUp(upEvent);
      });

      expect(result.current.pressedKeys.size).toBe(2);
      expect(result.current.pressedKeys).toContain('KeyA');
      expect(result.current.pressedKeys).not.toContain('KeyS');
      expect(result.current.pressedKeys).toContain('KeyD');
    });

    test('동일한 키 여러 번 해제', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const downEvent = createKeyboardEvent('a', 'KeyA');
      const upEvent = createKeyboardEvent('a', 'KeyA');

      // 키 누름
      act(() => {
        result.current.handleKeyDown(downEvent);
      });

      // 첫 번째 해제
      act(() => {
        result.current.handleKeyUp(upEvent);
      });

      expect(result.current.pressedKeys.size).toBe(0);

      // 두 번째 해제 (이미 해제된 상태)
      act(() => {
        result.current.handleKeyUp(upEvent);
      });

      // 에러 없이 빈 상태 유지
      expect(result.current.pressedKeys.size).toBe(0);
    });
  });

  describe('registerListeners', () => {
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
      const { result } = renderHook(() => useKeyboardStore());

      let cleanup: () => void;
      act(() => {
        cleanup = result.current.registerListeners();
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(typeof cleanup).toBe('function');
    });

    test('cleanup 함수 실행', () => {
      const { result } = renderHook(() => useKeyboardStore());

      let cleanup: () => void;
      act(() => {
        cleanup = result.current.registerListeners();
      });

      addEventListenerSpy.mockClear();

      // cleanup 실행
      act(() => {
        cleanup();
      });

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    test('등록된 keydown 리스너 동작 확인', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const mockCallback = jest.fn();

      act(() => {
        result.current.setOnKeyPress(mockCallback);
      });
      
      let cleanup: () => void;
      act(() => {
        cleanup = result.current.registerListeners();
      });

      // 등록된 keydown 핸들러 가져오기
      const keydownHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'keydown'
      )?.[1] as EventListener;

      expect(keydownHandler).toBeDefined();

      // keydown 이벤트 시뮬레이션
      const event = createKeyboardEvent('a', 'KeyA');
      act(() => {
        keydownHandler(event);
      });

      // 핸들러가 제대로 등록되었는지 확인 (콜백 호출은 별도 테스트에서)
      expect(result.current.pressedKeys).toContain('KeyA');
      
      // cleanup
      cleanup();
    });

    test('등록된 keyup 리스너 동작 확인', () => {
      const { result } = renderHook(() => useKeyboardStore());

      act(() => {
        result.current.registerListeners();
      });

      // 먼저 키 누름
      const downEvent = createKeyboardEvent('a', 'KeyA');
      act(() => {
        result.current.handleKeyDown(downEvent);
      });

      expect(result.current.pressedKeys).toContain('KeyA');

      // 등록된 keyup 핸들러 가져오기
      const keyupHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'keyup'
      )?.[1] as EventListener;

      expect(keyupHandler).toBeDefined();

      // keyup 이벤트 시뮬레이션
      const upEvent = createKeyboardEvent('a', 'KeyA');
      act(() => {
        keyupHandler(upEvent);
      });

      expect(result.current.pressedKeys).not.toContain('KeyA');
    });

    test('여러 번 등록/해제', () => {
      const { result } = renderHook(() => useKeyboardStore());

      // 첫 번째 등록
      let cleanup1: () => void;
      act(() => {
        cleanup1 = result.current.registerListeners();
      });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);

      // 첫 번째 해제
      act(() => {
        cleanup1();
      });

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);

      addEventListenerSpy.mockClear();
      removeEventListenerSpy.mockClear();

      // 두 번째 등록
      let cleanup2: () => void;
      act(() => {
        cleanup2 = result.current.registerListeners();
      });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);

      // 두 번째 해제
      act(() => {
        cleanup2();
      });

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('통합 시나리오', () => {
    test('키 누름과 해제 기본 플로우', () => {
      const { result } = renderHook(() => useKeyboardStore());

      // 키 누름 (KeyE는 remapKey에 의해 KeyF로 매핑됨)
      act(() => {
        result.current.handleKeyDown(createKeyboardEvent('h', 'KeyH'));
        result.current.handleKeyDown(createKeyboardEvent('e', 'KeyE'));
        result.current.handleKeyDown(createKeyboardEvent('l', 'KeyL'));
      });

      expect(result.current.pressedKeys.size).toBe(3);
      expect(result.current.pressedKeys).toContain('KeyH');
      expect(result.current.pressedKeys).toContain('KeyF'); // KeyE -> KeyF로 매핑됨
      expect(result.current.pressedKeys).toContain('KeyL');

      // 일부 키 해제 (KeyE는 KeyF로 매핑되어 KeyF가 제거됨)
      act(() => {
        result.current.handleKeyUp(createKeyboardEvent('e', 'KeyE'));
      });

      expect(result.current.pressedKeys.size).toBe(2);
      expect(result.current.pressedKeys).toContain('KeyH');
      expect(result.current.pressedKeys).toContain('KeyL');
      expect(result.current.pressedKeys).not.toContain('KeyF'); // KeyE는 KeyF로 매핑되었으므로 KeyF가 제거됨
    });

    test('특수 키 조합 무시 동작', () => {
      const { result } = renderHook(() => useKeyboardStore());

      // Ctrl+A (무시됨)
      act(() => {
        result.current.handleKeyDown(createKeyboardEvent('a', 'KeyA', { ctrlKey: true }));
      });

      expect(result.current.pressedKeys.size).toBe(0);

      // 일반 A (처리됨)
      act(() => {
        result.current.handleKeyDown(createKeyboardEvent('a', 'KeyA'));
      });

      expect(result.current.pressedKeys).toContain('KeyA');
      expect(result.current.pressedKeys.size).toBe(1);
    });

    test('이벤트 리스너 등록과 정리', () => {
      const { result } = renderHook(() => useKeyboardStore());

      let cleanup: () => void;
      act(() => {
        cleanup = result.current.registerListeners();
      });

      expect(typeof cleanup).toBe('function');

      // 정리 함수 실행
      act(() => {
        cleanup();
      });

      // 정리 후에도 스토어는 정상 작동해야 함
      act(() => {
        result.current.handleKeyDown(createKeyboardEvent('a', 'KeyA'));
      });

      expect(result.current.pressedKeys).toContain('KeyA');
    });
  });

  describe('성능 테스트', () => {
    test('대량 키 이벤트 처리 성능', () => {
      const { result } = renderHook(() => useKeyboardStore());
      const events = Array.from({ length: 1000 }, (_, i) => 
        createKeyboardEvent(String.fromCharCode(97 + (i % 26)), `Key${String.fromCharCode(65 + (i % 26))}`)
      );

      const start = process.hrtime.bigint();

      events.forEach(event => {
        act(() => {
          result.current.handleKeyDown(event);
        });
      });

      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000; // 나노초를 밀리초로 변환

      // 1000개 키 이벤트 처리가 100ms 미만이어야 함
      expect(executionTime).toBeLessThan(100);
    });

    test('Set 크기 증가에 따른 성능', () => {
      const { result } = renderHook(() => useKeyboardStore());

      const start = process.hrtime.bigint();

      // 100개 키를 동시에 누름 (실제로는 불가능하지만 테스트용)
      for (let i = 0; i < 100; i++) {
        const event = createKeyboardEvent(String.fromCharCode(97 + (i % 26)), `Key${i}`);
        act(() => {
          result.current.handleKeyDown(event);
        });
      }

      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000;

      expect(executionTime).toBeLessThan(50);
      expect(result.current.pressedKeys.size).toBe(100);
    });
  });

  describe('메모리 사용량 테스트', () => {
    test('키 상태 관리가 메모리 누수를 발생시키지 않음', () => {
      const { result } = renderHook(() => useKeyboardStore());

      // 많은 키를 누르고 해제하는 과정 반복
      for (let cycle = 0; cycle < 100; cycle++) {
        // 키 누름
        for (let i = 0; i < 10; i++) {
          const event = createKeyboardEvent(String.fromCharCode(97 + i), `Key${String.fromCharCode(65 + i)}`);
          act(() => {
            result.current.handleKeyDown(event);
          });
        }

        // 모든 키 해제
        for (let i = 0; i < 10; i++) {
          const event = createKeyboardEvent(String.fromCharCode(97 + i), `Key${String.fromCharCode(65 + i)}`);
          act(() => {
            result.current.handleKeyUp(event);
          });
        }
      }

      // 최종적으로 모든 키가 해제되어야 함
      expect(result.current.pressedKeys.size).toBe(0);
    });

    test('콜백 함수 참조가 메모리 누수를 발생시키지 않음', () => {
      const { result } = renderHook(() => useKeyboardStore());

      // 여러 콜백 함수를 설정하고 해제
      for (let i = 0; i < 100; i++) {
        const callback = jest.fn();
        act(() => {
          result.current.setOnKeyPress(callback);
        });
      }

      // 마지막에 undefined로 설정
      act(() => {
        result.current.setOnKeyPress(undefined);
      });

      expect(result.current.onKeyPress).toBeUndefined();
    });
  });
});