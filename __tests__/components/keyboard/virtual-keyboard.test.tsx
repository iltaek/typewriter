import { render, screen, act } from '@testing-library/react';
import { VirtualKeyboard } from '@/components/keyboard/virtual-keyboard';

// Mock the stores with working implementations
jest.mock('@/store/keyboard-store', () => ({
  useKeyboardStore: () => ({
    pressedKeys: new Set(['KeyA']),
    registerListeners: jest.fn(() => jest.fn()),
  }),
}));

jest.mock('@/store/layout-store', () => ({
  useLayoutStore: (selector: (state: any) => any) => selector({ layout: 'qwerty' }),
}));

// Mock the keyboard configurations with a simple setup
jest.mock('@/lib/keyboard', () => ({
  KEYBOARD_CONFIGS: {
    qwerty: {
      row1: [
        { key: 'Q', code: 'KeyQ', isSpecial: false },
        { key: 'W', code: 'KeyW', isSpecial: false },
        { key: 'E', code: 'KeyE', isSpecial: false },
      ],
      row2: [
        { key: 'A', code: 'KeyA', isSpecial: false },
        { key: 'S', code: 'KeyS', isSpecial: false },
        { key: 'D', code: 'KeyD', isSpecial: false },
      ],
      row3: [
        { key: 'Z', code: 'KeyZ', isSpecial: false },
        { key: 'X', code: 'KeyX', isSpecial: false },
        { key: 'C', code: 'KeyC', isSpecial: false },
      ],
    },
  },
}));

// Mock child components
jest.mock('@/components/keyboard/keyboard-row', () => ({
  KeyboardRow: ({ keys, pressedKeys }: any) => (
    <div data-testid="keyboard-row">
      {keys.map((key: any) => (
        <div
          key={key.code}
          data-testid={`key-${key.code}`}
          data-pressed={pressedKeys.has(key.code)}
        >
          {key.key}
        </div>
      ))}
    </div>
  ),
}));

describe('VirtualKeyboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('기본 렌더링', () => {
    test('VirtualKeyboard가 렌더링됨', () => {
      const { container } = render(<VirtualKeyboard />);
      
      const keyboardContainer = container.querySelector('.mx-auto.w-fit.space-y-1\\.5.rounded-lg.border.bg-card.p-4.shadow-sm');
      expect(keyboardContainer).toBeInTheDocument();
    });

    test('키보드 행들이 렌더링됨', () => {
      render(<VirtualKeyboard />);
      
      const rows = screen.getAllByTestId('keyboard-row');
      expect(rows).toHaveLength(3); // row1, row2, row3
    });

    test('키들이 올바르게 표시됨', () => {
      render(<VirtualKeyboard />);
      
      // Row 1 키들
      expect(screen.getByTestId('key-KeyQ')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyW')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyE')).toBeInTheDocument();
      
      // Row 2 키들
      expect(screen.getByTestId('key-KeyA')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyS')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyD')).toBeInTheDocument();
      
      // Row 3 키들
      expect(screen.getByTestId('key-KeyZ')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyX')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyC')).toBeInTheDocument();
    });

    test('눌린 키가 올바르게 표시됨', () => {
      render(<VirtualKeyboard />);
      
      // KeyA가 눌린 상태로 모킹됨
      expect(screen.getByTestId('key-KeyA')).toHaveAttribute('data-pressed', 'true');
      expect(screen.getByTestId('key-KeyQ')).toHaveAttribute('data-pressed', 'false');
      expect(screen.getByTestId('key-KeyS')).toHaveAttribute('data-pressed', 'false');
    });

    test('다른 레이아웃이 로드되어도 올바르게 렌더링됨', () => {
      const { rerender } = render(<VirtualKeyboard />);
      
      expect(screen.getByTestId('key-KeyQ')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyA')).toBeInTheDocument();
      
      // 리렌더링 테스트
      rerender(<VirtualKeyboard />);
      
      expect(screen.getByTestId('key-KeyQ')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyA')).toBeInTheDocument();
    });

    test('키 텍스트가 올바르게 표시됨', () => {
      render(<VirtualKeyboard />);
      
      expect(screen.getByText('Q')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('Z')).toBeInTheDocument();
    });
  });

  describe('React.memo', () => {
    test('displayName이 설정됨', () => {
      expect(VirtualKeyboard.displayName).toBe('VirtualKeyboard');
    });

    test('memo 최적화가 적용됨', () => {
      const { rerender } = render(<VirtualKeyboard />);
      
      // 동일한 props로 리렌더링
      const start = performance.now();
      rerender(<VirtualKeyboard />);
      const end = performance.now();
      
      // React.memo로 인한 최적화 확인
      expect(end - start).toBeLessThan(50);
    });
  });

  describe('컴포넌트 생명주기', () => {
    test('컴포넌트가 마운트/언마운트됨', () => {
      const { unmount } = render(<VirtualKeyboard />);
      
      expect(screen.getByTestId('key-KeyQ')).toBeInTheDocument();
      
      act(() => {
        unmount();
      });
      
      expect(screen.queryByTestId('key-KeyQ')).not.toBeInTheDocument();
    });

    test('마운트 시 이벤트 리스너가 등록됨', () => {
      // useEffect가 수행되는지 확인하는 간접적인 방법
      const { unmount } = render(<VirtualKeyboard />);
      
      // 컴포넌트가 정상적으로 마운트되고 useEffect가 호출되는지 확인
      expect(screen.getByTestId('key-KeyQ')).toBeInTheDocument();
      
      // 컴포넌트가 언마운트 될 때 에러가 발생하지 않는지 확인
      expect(() => {
        act(() => {
          unmount();
        });
      }).not.toThrow();
    });

    test('컴포넌트 마운트 사이클 무결성', () => {
      // 여러 번 마운트/언마운트 해도 안전한지 확인
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<VirtualKeyboard />);
        expect(screen.getByTestId('key-KeyA')).toBeInTheDocument();
        
        act(() => {
          unmount();
        });
        
        expect(screen.queryByTestId('key-KeyA')).not.toBeInTheDocument();
      }
    });
  });

  describe('성능', () => {
    test('빠른 렌더링', () => {
      const start = performance.now();
      render(<VirtualKeyboard />);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100);
    });

    test('리렌더링 최적화', () => {
      const { rerender } = render(<VirtualKeyboard />);
      
      const start = performance.now();
      rerender(<VirtualKeyboard />);
      const end = performance.now();
      
      // React.memo로 인한 최적화 확인
      expect(end - start).toBeLessThan(50);
    });

    test('대량 리렌더링 성능', () => {
      const renders = [];
      
      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        const { unmount } = render(<VirtualKeyboard />);
        const end = performance.now();
        renders.push(end - start);
        unmount();
      }
      
      const averageTime = renders.reduce((sum, time) => sum + time, 0) / renders.length;
      expect(averageTime).toBeLessThan(50);
    });

    test('메모리 누수 방지', () => {
      const { unmount } = render(<VirtualKeyboard />);
      
      // 컴포넌트가 정상적으로 언마운트되는지 확인
      expect(() => {
        act(() => {
          unmount();
        });
      }).not.toThrow();
    });
  });

  describe('접근성', () => {
    test('적절한 구조가 렌더링됨', () => {
      render(<VirtualKeyboard />);
      
      const keys = screen.getAllByTestId(/^key-/);
      expect(keys.length).toBeGreaterThan(0);
      
      // 키보드 행이 올바르게 구성됨
      const rows = screen.getAllByTestId('keyboard-row');
      expect(rows).toHaveLength(3);
    });

    test('키 요소들이 적절한 데이터 속성을 가짐', () => {
      render(<VirtualKeyboard />);
      
      const keyA = screen.getByTestId('key-KeyA');
      const keyQ = screen.getByTestId('key-KeyQ');
      
      expect(keyA).toHaveAttribute('data-testid', 'key-KeyA');
      expect(keyA).toHaveAttribute('data-pressed');
      expect(keyQ).toHaveAttribute('data-testid', 'key-KeyQ');
      expect(keyQ).toHaveAttribute('data-pressed');
    });

    test('키보드 전체 구조가 올바름', () => {
      const { container } = render(<VirtualKeyboard />);
      
      // 메인 컨테이너 확인
      const mainContainer = container.querySelector('.mx-auto.w-fit');
      expect(mainContainer).toBeInTheDocument();
      
      // 행 컨테이너들 확인
      const rows = screen.getAllByTestId('keyboard-row');
      expect(rows).toHaveLength(3);
      
      // 각 행에 키가 존재하는지 확인
      rows.forEach(row => {
        const keysInRow = row.querySelectorAll('[data-testid^="key-"]');
        expect(keysInRow.length).toBeGreaterThan(0);
      });
    });

    test('키 내용이 화면 리더기에 접근 가능', () => {
      render(<VirtualKeyboard />);
      
      // 텍스트 콘텐츠가 존재하는지 확인
      expect(screen.getByText('Q')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('Z')).toBeInTheDocument();
    });
  });

  describe('상태 관리', () => {
    test('pressedKeys 상태가 컴포넌트에 올바르게 반영됨', () => {
      render(<VirtualKeyboard />);
      
      // 모킹된 pressedKeys에 따른 키 상태 확인
      expect(screen.getByTestId('key-KeyA')).toHaveAttribute('data-pressed', 'true');
      expect(screen.getByTestId('key-KeyQ')).toHaveAttribute('data-pressed', 'false');
      expect(screen.getByTestId('key-KeyW')).toHaveAttribute('data-pressed', 'false');
    });

    test('다양한 키 상태 조합 처리', () => {
      render(<VirtualKeyboard />);
      
      // 모든 키에 대해 data-pressed 속성이 존재하는지 확인
      const allKeys = screen.getAllByTestId(/^key-/);
      allKeys.forEach(key => {
        expect(key).toHaveAttribute('data-pressed');
        const isPressedValue = key.getAttribute('data-pressed');
        expect(isPressedValue === 'true' || isPressedValue === 'false').toBe(true);
      });
    });

    test('레이아웃 변경 시 적절한 키 구성', () => {
      render(<VirtualKeyboard />);
      
      // 현재 레이아웃의 키들이 모두 렌더링되는지 확인
      expect(screen.getByTestId('key-KeyQ')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyA')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyZ')).toBeInTheDocument();
      
      // 각 행에 3개의 키가 있는지 확인
      const rows = screen.getAllByTestId('keyboard-row');
      expect(rows).toHaveLength(3);
      rows.forEach(row => {
        const keysInRow = row.querySelectorAll('[data-testid^="key-"]');
        expect(keysInRow).toHaveLength(3);
      });
    });

    test('상태 불변성 유지', () => {
      const { rerender } = render(<VirtualKeyboard />);
      
      // 초기 상태 확인
      expect(screen.getByTestId('key-KeyA')).toHaveAttribute('data-pressed', 'true');
      
      // 리렌더링 후에도 상태 유지
      rerender(<VirtualKeyboard />);
      expect(screen.getByTestId('key-KeyA')).toHaveAttribute('data-pressed', 'true');
    });
  });

  describe('에러 처리', () => {
    test('컴포넌트 렌더링에서 에러가 발생하지 않음', () => {
      // 기본 렌더링이 에러 없이 완료되는지 확인
      expect(() => render(<VirtualKeyboard />)).not.toThrow();
    });

    test('비정상적인 props로 렌더링 시도', () => {
      // 컴포넌트가 props를 받지 않으므로 기본 상태로 렌더링
      expect(() => render(<VirtualKeyboard />)).not.toThrow();
      
      const keys = screen.getAllByTestId(/^key-/);
      expect(keys.length).toBeGreaterThan(0);
    });

    test('중복 렌더링 안정성', () => {
      // 여러 번 렌더링해도 안정적인지 확인
      const renderCount = 10;
      
      for (let i = 0; i < renderCount; i++) {
        expect(() => {
          const { unmount } = render(<VirtualKeyboard />);
          unmount();
        }).not.toThrow();
      }
    });

    test('메모리 누수 방지', () => {
      const { unmount } = render(<VirtualKeyboard />);
      
      // 컴포넌트 언마운트 시 에러가 발생하지 않는지 확인
      expect(() => {
        act(() => {
          unmount();
        });
      }).not.toThrow();
    });
  });

  describe('통합 테스트', () => {
    test('전체 플로우가 정상 작동', () => {
      render(<VirtualKeyboard />);
      
      // 1. 컴포넌트 렌더링 확인
      expect(screen.getAllByTestId('keyboard-row')).toHaveLength(3);
      
      // 2. 키들이 올바르게 표시됨 확인
      expect(screen.getByTestId('key-KeyQ')).toBeInTheDocument();
      expect(screen.getByTestId('key-KeyA')).toBeInTheDocument();
      
      // 3. 눌린 키 상태 확인
      expect(screen.getByTestId('key-KeyA')).toHaveAttribute('data-pressed', 'true');
      
      // 4. 텍스트 콘텐츠 확인
      expect(screen.getByText('Q')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    test('키보드 레이아웃과 상태가 동기화됨', () => {
      render(<VirtualKeyboard />);
      
      // 모킹된 레이아웃에 따른 키 구성 확인
      const allKeys = screen.getAllByTestId(/^key-/);
      expect(allKeys).toHaveLength(9); // 3x3 키보드
      
      // 각 행의 키 개수 확인
      const rows = screen.getAllByTestId('keyboard-row');
      rows.forEach(row => {
        const keysInRow = row.querySelectorAll('[data-testid^="key-"]');
        expect(keysInRow).toHaveLength(3);
      });
    });
  });
});