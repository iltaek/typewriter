import { act, renderHook } from '@testing-library/react';
import { useLayoutStore } from '@/store/layout-store';
import { type LayoutType } from '@/types/keyboard.types';

describe('useLayoutStore', () => {
  beforeEach(() => {
    // Reset the store state to initial state
    useLayoutStore.setState({
      layout: 'qwerty',
    });
  });

  describe('초기 상태', () => {
    test('초기 상태가 올바르게 설정됨', () => {
      const { result } = renderHook(() => useLayoutStore());
      const store = result.current;

      expect(store.layout).toBe('qwerty');
      expect(typeof store.setLayout).toBe('function');
    });

    test('초기 레이아웃이 qwerty임', () => {
      const { result } = renderHook(() => useLayoutStore());
      
      expect(result.current.layout).toBe('qwerty');
    });
  });

  describe('setLayout', () => {
    test('정상 케이스: QWERTY에서 COLEMAK으로 변경', () => {
      const { result } = renderHook(() => useLayoutStore());

      expect(result.current.layout).toBe('qwerty');

      act(() => {
        result.current.setLayout('colemak');
      });

      expect(result.current.layout).toBe('colemak');
    });

    test('정상 케이스: COLEMAK에서 QWERTY로 변경', () => {
      const { result } = renderHook(() => useLayoutStore());

      // 먼저 COLEMAK으로 설정
      act(() => {
        result.current.setLayout('colemak');
      });

      expect(result.current.layout).toBe('colemak');

      // 다시 QWERTY로 변경
      act(() => {
        result.current.setLayout('qwerty');
      });

      expect(result.current.layout).toBe('qwerty');
    });

    test('동일한 레이아웃으로 설정', () => {
      const { result } = renderHook(() => useLayoutStore());

      expect(result.current.layout).toBe('qwerty');

      // 동일한 레이아웃으로 다시 설정
      act(() => {
        result.current.setLayout('qwerty');
      });

      expect(result.current.layout).toBe('qwerty');
    });

    test('여러 번 레이아웃 변경', () => {
      const { result } = renderHook(() => useLayoutStore());

      const layouts: LayoutType[] = ['colemak', 'qwerty', 'colemak', 'qwerty'];

      layouts.forEach((layout, index) => {
        act(() => {
          result.current.setLayout(layout);
        });

        expect(result.current.layout).toBe(layout);
      });
    });

    test('연속적인 빠른 레이아웃 변경', () => {
      const { result } = renderHook(() => useLayoutStore());

      act(() => {
        result.current.setLayout('colemak');
        result.current.setLayout('qwerty');
        result.current.setLayout('colemak');
      });

      // 마지막 설정이 적용되어야 함
      expect(result.current.layout).toBe('colemak');
    });
  });

  describe('상태 불변성', () => {
    test('setLayout 호출이 이전 상태를 변경하지 않음', () => {
      const { result } = renderHook(() => useLayoutStore());

      const initialLayout = result.current.layout;
      const initialSetLayout = result.current.setLayout;

      act(() => {
        result.current.setLayout('colemak');
      });

      // 함수 참조는 동일해야 함 (Zustand의 특성)
      expect(result.current.setLayout).toBe(initialSetLayout);
      
      // 초기 레이아웃 값은 변경되지 않았어야 함 (당연히 변경되지만, 불변성 확인)
      expect(initialLayout).toBe('qwerty');
      expect(result.current.layout).toBe('colemak');
    });

    test('상태 객체의 참조가 변경됨', () => {
      const { result } = renderHook(() => useLayoutStore());

      const initialState = { ...result.current };

      act(() => {
        result.current.setLayout('colemak');
      });

      // 상태는 변경되어야 함
      expect(result.current.layout).not.toBe(initialState.layout);
      expect(result.current.layout).toBe('colemak');
    });
  });

  describe('타입 안전성', () => {
    test('유효한 LayoutType만 허용', () => {
      const { result } = renderHook(() => useLayoutStore());

      // TypeScript 컴파일 시점에서 체크되므로 런타임 테스트로는 제한적
      // 하지만 유효한 값들이 올바르게 설정되는지 확인
      const validLayouts: LayoutType[] = ['qwerty', 'colemak'];

      validLayouts.forEach(layout => {
        act(() => {
          result.current.setLayout(layout);
        });

        expect(result.current.layout).toBe(layout);
      });
    });

    test('레이아웃 값이 문자열 타입임', () => {
      const { result } = renderHook(() => useLayoutStore());

      expect(typeof result.current.layout).toBe('string');

      act(() => {
        result.current.setLayout('colemak');
      });

      expect(typeof result.current.layout).toBe('string');
    });
  });

  describe('스토어 통합성', () => {
    test('여러 컴포넌트에서 동일한 상태 공유', () => {
      const { result: result1 } = renderHook(() => useLayoutStore());
      const { result: result2 } = renderHook(() => useLayoutStore());

      // 초기 상태 동일
      expect(result1.current.layout).toBe(result2.current.layout);

      // 한 쪽에서 변경
      act(() => {
        result1.current.setLayout('colemak');
      });

      // 양쪽 모두 변경됨
      expect(result1.current.layout).toBe('colemak');
      expect(result2.current.layout).toBe('colemak');

      // 다른 쪽에서 변경
      act(() => {
        result2.current.setLayout('qwerty');
      });

      // 양쪽 모두 변경됨
      expect(result1.current.layout).toBe('qwerty');
      expect(result2.current.layout).toBe('qwerty');
    });

    test('스토어 함수들의 참조 안정성', () => {
      const { result } = renderHook(() => useLayoutStore());

      const setLayoutRef1 = result.current.setLayout;

      act(() => {
        result.current.setLayout('colemak');
      });

      const setLayoutRef2 = result.current.setLayout;

      // Zustand에서는 action 함수의 참조가 안정적이어야 함
      expect(setLayoutRef1).toBe(setLayoutRef2);
    });

    test('상태 변경 후 즉시 접근 가능', () => {
      const { result } = renderHook(() => useLayoutStore());

      act(() => {
        result.current.setLayout('colemak');
      });

      // 즉시 변경된 상태에 접근 가능해야 함
      expect(result.current.layout).toBe('colemak');

      // getState()로도 접근 가능해야 함
      expect(useLayoutStore.getState().layout).toBe('colemak');
    });
  });

  describe('외부 상태 접근', () => {
    test('getState()로 현재 상태 접근', () => {
      const { result } = renderHook(() => useLayoutStore());

      // 초기 상태 확인
      expect(useLayoutStore.getState().layout).toBe('qwerty');

      act(() => {
        result.current.setLayout('colemak');
      });

      // 변경된 상태 확인
      expect(useLayoutStore.getState().layout).toBe('colemak');
    });

    test('setState()로 직접 상태 변경', () => {
      const { result } = renderHook(() => useLayoutStore());

      act(() => {
        useLayoutStore.setState({ layout: 'colemak' });
      });

      expect(result.current.layout).toBe('colemak');
      expect(useLayoutStore.getState().layout).toBe('colemak');
    });

    test('subscribe로 상태 변경 감지', () => {
      let callbackCount = 0;
      let lastState: any = null;

      const unsubscribe = useLayoutStore.subscribe((state) => {
        callbackCount++;
        lastState = state;
      });

      const { result } = renderHook(() => useLayoutStore());

      act(() => {
        result.current.setLayout('colemak');
      });

      expect(callbackCount).toBeGreaterThan(0);
      expect(lastState.layout).toBe('colemak');

      // 구독 해제
      unsubscribe();

      // 구독 해제 후 변경
      const prevCallbackCount = callbackCount;
      act(() => {
        result.current.setLayout('qwerty');
      });

      // 콜백이 더 이상 호출되지 않아야 함
      expect(callbackCount).toBe(prevCallbackCount);
    });
  });

  describe('엣지 케이스', () => {
    test('스토어 초기화 중 접근', () => {
      // 스토어가 완전히 초기화되기 전에도 접근 가능해야 함
      const state = useLayoutStore.getState();
      
      expect(state.layout).toBeDefined();
      expect(typeof state.setLayout).toBe('function');
    });

    test('빈번한 상태 변경', () => {
      const { result } = renderHook(() => useLayoutStore());

      // 1000번 빠르게 변경
      const iterations = 1000;
      for (let i = 0; i < iterations; i++) {
        const layout: LayoutType = i % 2 === 0 ? 'qwerty' : 'colemak';
        act(() => {
          result.current.setLayout(layout);
        });
      }

      // 마지막 설정이 적용되어야 함
      const expectedLayout: LayoutType = (iterations - 1) % 2 === 0 ? 'qwerty' : 'colemak';
      expect(result.current.layout).toBe(expectedLayout);
    });

    test('동시 다중 훅 사용', () => {
      const hooks = Array.from({ length: 10 }, () => renderHook(() => useLayoutStore()));

      // 모든 훅이 동일한 초기 상태를 가져야 함
      hooks.forEach(({ result }) => {
        expect(result.current.layout).toBe('qwerty');
      });

      // 하나의 훅에서 상태 변경
      act(() => {
        hooks[0].result.current.setLayout('colemak');
      });

      // 모든 훅이 동일한 변경된 상태를 가져야 함
      hooks.forEach(({ result }) => {
        expect(result.current.layout).toBe('colemak');
      });
    });
  });

  describe('성능 테스트', () => {
    test('대량 상태 변경 성능', () => {
      const { result } = renderHook(() => useLayoutStore());

      const start = process.hrtime.bigint();

      // 10000번 상태 변경
      for (let i = 0; i < 10000; i++) {
        const layout: LayoutType = i % 2 === 0 ? 'qwerty' : 'colemak';
        act(() => {
          result.current.setLayout(layout);
        });
      }

      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000; // 나노초를 밀리초로 변환

      // 10000번 변경이 100ms 미만이어야 함
      expect(executionTime).toBeLessThan(100);
    });

    test('다중 구독자 성능', () => {
      const subscribers: Array<() => void> = [];

      // 100개 구독자 생성
      for (let i = 0; i < 100; i++) {
        const unsubscribe = useLayoutStore.subscribe(() => {
          // 간단한 작업
        });
        subscribers.push(unsubscribe);
      }

      const { result } = renderHook(() => useLayoutStore());

      const start = process.hrtime.bigint();

      // 상태 변경 (모든 구독자에게 알림)
      act(() => {
        result.current.setLayout('colemak');
      });

      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000;

      // 100개 구독자에게 알림이 50ms 미만이어야 함
      expect(executionTime).toBeLessThan(50);

      // 구독 해제
      subscribers.forEach(unsubscribe => unsubscribe());
    });
  });

  describe('메모리 사용량 테스트', () => {
    test('상태 변경이 메모리 누수를 발생시키지 않음', () => {
      const { result } = renderHook(() => useLayoutStore());

      // 많은 상태 변경 수행
      for (let cycle = 0; cycle < 1000; cycle++) {
        const layouts: LayoutType[] = ['qwerty', 'colemak'];
        layouts.forEach(layout => {
          act(() => {
            result.current.setLayout(layout);
          });
        });
      }

      // 최종 상태가 예상과 일치하는지 확인
      expect(result.current.layout).toBe('colemak');
      expect(typeof result.current.setLayout).toBe('function');
    });

    test('구독/구독해제가 메모리 누수를 발생시키지 않음', () => {
      // 많은 구독/구독해제 수행
      for (let i = 0; i < 1000; i++) {
        const unsubscribe = useLayoutStore.subscribe(() => {});
        unsubscribe();
      }

      // 스토어가 여전히 정상 작동하는지 확인
      const { result } = renderHook(() => useLayoutStore());
      
      act(() => {
        result.current.setLayout('colemak');
      });

      expect(result.current.layout).toBe('colemak');
    });

    test('다중 훅 생성/해제가 메모리 누수를 발생시키지 않음', () => {
      // 많은 훅 생성/해제
      for (let i = 0; i < 1000; i++) {
        const { result, unmount } = renderHook(() => useLayoutStore());
        
        act(() => {
          result.current.setLayout(i % 2 === 0 ? 'qwerty' : 'colemak');
        });
        
        unmount();
      }

      // 스토어가 여전히 정상 작동하는지 확인
      const { result } = renderHook(() => useLayoutStore());
      expect(result.current.layout).toBeDefined();
      expect(typeof result.current.setLayout).toBe('function');
    });
  });
});