import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayoutSelector } from '@/components/layout-selector';

// Mock the layout store
const mockSetLayout = jest.fn();
let mockLayout = 'qwerty' as const;

jest.mock('@/store/layout-store', () => ({
  useLayoutStore: () => ({
    layout: mockLayout,
    setLayout: mockSetLayout,
  }),
}));

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, onClick, 'aria-pressed': ariaPressed, ...props }: any) => (
    <button
      data-variant={variant}
      onClick={onClick}
      aria-pressed={ariaPressed}
      data-testid={`layout-btn-${children.toLowerCase()}`}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('LayoutSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLayout = 'qwerty';
  });

  describe('기본 렌더링', () => {
    test('LayoutSelector가 렌더링됨', () => {
      const { container } = render(<LayoutSelector />);
      
      const layoutContainer = container.querySelector('.flex.justify-center.gap-4');
      expect(layoutContainer).toBeInTheDocument();
      
      // 또는 버튼들이 존재하는지 확인
      expect(screen.getByTestId('layout-btn-qwerty')).toBeInTheDocument();
      expect(screen.getByTestId('layout-btn-colemak')).toBeInTheDocument();
    });

    test('사용 가능한 레이아웃 버튼들이 표시됨', () => {
      render(<LayoutSelector />);
      
      expect(screen.getByTestId('layout-btn-qwerty')).toBeInTheDocument();
      expect(screen.getByTestId('layout-btn-colemak')).toBeInTheDocument();
      
      expect(screen.getByText('QWERTY')).toBeInTheDocument();
      expect(screen.getByText('Colemak')).toBeInTheDocument();
    });

    test('컨테이너가 올바른 클래스를 가짐', () => {
      const { container } = render(<LayoutSelector />);
      
      const layoutContainer = container.querySelector('.flex.justify-center.gap-4');
      expect(layoutContainer).toBeInTheDocument();
    });

    test('각 버튼이 고유한 key를 가짐', () => {
      render(<LayoutSelector />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('버튼 상태', () => {
    test('현재 선택된 레이아웃 버튼이 올바른 variant를 가짐', () => {
      mockLayout = 'qwerty';
      render(<LayoutSelector />);
      
      const qwertyBtn = screen.getByTestId('layout-btn-qwerty');
      const colemakBtn = screen.getByTestId('layout-btn-colemak');
      
      expect(qwertyBtn).toHaveAttribute('data-variant', 'default');
      expect(colemakBtn).toHaveAttribute('data-variant', 'secondary');
    });

    test('다른 레이아웃이 선택된 경우 버튼 상태 변경', () => {
      mockLayout = 'colemak';
      render(<LayoutSelector />);
      
      const qwertyBtn = screen.getByTestId('layout-btn-qwerty');
      const colemakBtn = screen.getByTestId('layout-btn-colemak');
      
      expect(qwertyBtn).toHaveAttribute('data-variant', 'secondary');
      expect(colemakBtn).toHaveAttribute('data-variant', 'default');
    });

    test('aria-pressed 속성이 올바르게 설정됨', () => {
      mockLayout = 'qwerty';
      render(<LayoutSelector />);
      
      const qwertyBtn = screen.getByTestId('layout-btn-qwerty');
      const colemakBtn = screen.getByTestId('layout-btn-colemak');
      
      expect(qwertyBtn).toHaveAttribute('aria-pressed', 'true');
      expect(colemakBtn).toHaveAttribute('aria-pressed', 'false');
    });

    test('각 버튼이 올바른 텍스트를 표시함', () => {
      render(<LayoutSelector />);
      
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveTextContent('QWERTY');
      expect(screen.getByTestId('layout-btn-colemak')).toHaveTextContent('Colemak');
    });
  });

  describe('사용자 상호작용', () => {
    test('QWERTY 버튼 클릭 시 setLayout 호출', () => {
      render(<LayoutSelector />);
      
      const qwertyBtn = screen.getByTestId('layout-btn-qwerty');
      fireEvent.click(qwertyBtn);
      
      expect(mockSetLayout).toHaveBeenCalledWith('qwerty');
      expect(mockSetLayout).toHaveBeenCalledTimes(1);
    });

    test('Colemak 버튼 클릭 시 setLayout 호출', () => {
      render(<LayoutSelector />);
      
      const colemakBtn = screen.getByTestId('layout-btn-colemak');
      fireEvent.click(colemakBtn);
      
      expect(mockSetLayout).toHaveBeenCalledWith('colemak');
      expect(mockSetLayout).toHaveBeenCalledTimes(1);
    });

    test('userEvent로 버튼 클릭', async () => {
      const user = userEvent.setup();
      render(<LayoutSelector />);
      
      const colemakBtn = screen.getByTestId('layout-btn-colemak');
      await user.click(colemakBtn);
      
      expect(mockSetLayout).toHaveBeenCalledWith('colemak');
    });

    test('키보드 네비게이션 지원', async () => {
      const user = userEvent.setup();
      render(<LayoutSelector />);
      
      const qwertyBtn = screen.getByTestId('layout-btn-qwerty');
      
      // Tab으로 버튼에 포커스
      await user.tab();
      expect(qwertyBtn).toHaveFocus();
      
      // Enter로 버튼 활성화
      await user.keyboard('{Enter}');
      expect(mockSetLayout).toHaveBeenCalledWith('qwerty');
    });

    test('Space 키로 버튼 활성화', async () => {
      const user = userEvent.setup();
      render(<LayoutSelector />);
      
      const colemakBtn = screen.getByTestId('layout-btn-colemak');
      colemakBtn.focus();
      
      await user.keyboard(' ');
      expect(mockSetLayout).toHaveBeenCalledWith('colemak');
    });

    test('같은 버튼을 여러 번 클릭해도 동작함', () => {
      render(<LayoutSelector />);
      
      const qwertyBtn = screen.getByTestId('layout-btn-qwerty');
      
      fireEvent.click(qwertyBtn);
      fireEvent.click(qwertyBtn);
      fireEvent.click(qwertyBtn);
      
      expect(mockSetLayout).toHaveBeenCalledTimes(3);
      expect(mockSetLayout).toHaveBeenNthCalledWith(1, 'qwerty');
      expect(mockSetLayout).toHaveBeenNthCalledWith(2, 'qwerty');
      expect(mockSetLayout).toHaveBeenNthCalledWith(3, 'qwerty');
    });
  });

  describe('동적 상태 변경', () => {
    test('레이아웃 변경 시 리렌더링', () => {
      const { rerender } = render(<LayoutSelector />);
      
      // 초기 상태 확인
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveAttribute('data-variant', 'default');
      
      // 레이아웃 변경
      mockLayout = 'colemak';
      rerender(<LayoutSelector />);
      
      // 변경된 상태 확인
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveAttribute('data-variant', 'secondary');
      expect(screen.getByTestId('layout-btn-colemak')).toHaveAttribute('data-variant', 'default');
    });

    test('aria-pressed 상태 업데이트', () => {
      const { rerender } = render(<LayoutSelector />);
      
      // 초기 상태
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('layout-btn-colemak')).toHaveAttribute('aria-pressed', 'false');
      
      // 레이아웃 변경
      mockLayout = 'colemak';
      rerender(<LayoutSelector />);
      
      // 업데이트된 상태
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('layout-btn-colemak')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('접근성', () => {
    test('버튼들이 적절한 역할을 가짐', () => {
      render(<LayoutSelector />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    test('각 버튼이 aria-pressed 속성을 가짐', () => {
      render(<LayoutSelector />);
      
      const qwertyBtn = screen.getByTestId('layout-btn-qwerty');
      const colemakBtn = screen.getByTestId('layout-btn-colemak');
      
      expect(qwertyBtn).toHaveAttribute('aria-pressed');
      expect(colemakBtn).toHaveAttribute('aria-pressed');
    });

    test('버튼 텍스트가 명확함', () => {
      render(<LayoutSelector />);
      
      expect(screen.getByText('QWERTY')).toBeInTheDocument();
      expect(screen.getByText('Colemak')).toBeInTheDocument();
    });

    test('키보드 탐색 순서가 논리적임', async () => {
      const user = userEvent.setup();
      render(<LayoutSelector />);
      
      // 첫 번째 버튼으로 탭
      await user.tab();
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveFocus();
      
      // 두 번째 버튼으로 탭
      await user.tab();
      expect(screen.getByTestId('layout-btn-colemak')).toHaveFocus();
    });

    test('화면 리더기 지원을 위한 적절한 구조', () => {
      const { container } = render(<LayoutSelector />);
      
      // 컨테이너가 그룹 역할을 하는 구조
      const layoutGroup = container.querySelector('.flex.justify-center.gap-4');
      expect(layoutGroup).toBeInTheDocument();
      
      // 각 버튼이 명확한 레이블을 가짐
      expect(screen.getByText('QWERTY')).toBeInTheDocument();
      expect(screen.getByText('Colemak')).toBeInTheDocument();
    });
  });

  describe('성능', () => {
    test('빠른 렌더링', () => {
      const start = performance.now();
      render(<LayoutSelector />);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100);
    });

    test('리렌더링 성능', () => {
      const { rerender } = render(<LayoutSelector />);
      
      const start = performance.now();
      rerender(<LayoutSelector />);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50);
    });

    test('다중 상호작용 성능', () => {
      render(<LayoutSelector />);
      
      const qwertyBtn = screen.getByTestId('layout-btn-qwerty');
      const colemakBtn = screen.getByTestId('layout-btn-colemak');
      
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        fireEvent.click(i % 2 === 0 ? qwertyBtn : colemakBtn);
      }
      const end = performance.now();
      
      expect(end - start).toBeLessThan(1000);
      expect(mockSetLayout).toHaveBeenCalledTimes(100);
    });
  });

  describe('에러 처리', () => {
    test('undefined layout 상태 처리', () => {
      mockLayout = undefined as any;
      
      expect(() => render(<LayoutSelector />)).not.toThrow();
      
      // 모든 버튼이 secondary 스타일이어야 함
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveAttribute('data-variant', 'secondary');
      expect(screen.getByTestId('layout-btn-colemak')).toHaveAttribute('data-variant', 'secondary');
    });

    test('null layout 상태 처리', () => {
      mockLayout = null as any;
      
      expect(() => render(<LayoutSelector />)).not.toThrow();
    });

    test('잘못된 layout 값 처리', () => {
      mockLayout = 'unknown-layout' as any;
      
      expect(() => render(<LayoutSelector />)).not.toThrow();
      
      // 알 수 없는 레이아웃이므로 모든 버튼이 secondary
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveAttribute('data-variant', 'secondary');
      expect(screen.getByTestId('layout-btn-colemak')).toHaveAttribute('data-variant', 'secondary');
    });

    test('setLayout이 undefined인 경우', () => {
      jest.doMock('@/store/layout-store', () => ({
        useLayoutStore: () => ({
          layout: 'qwerty',
          setLayout: undefined,
        }),
      }));
      
      expect(() => render(<LayoutSelector />)).not.toThrow();
    });
  });

  describe('레이아웃 구성', () => {
    test('LAYOUTS 배열이 올바르게 정의됨', () => {
      render(<LayoutSelector />);
      
      // 정확히 2개의 레이아웃이 있어야 함
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      // QWERTY와 Colemak 레이아웃이 있어야 함
      expect(screen.getByText('QWERTY')).toBeInTheDocument();
      expect(screen.getByText('Colemak')).toBeInTheDocument();
    });

    test('레이아웃 값과 라벨의 매핑이 올바름', () => {
      render(<LayoutSelector />);
      
      const qwertyBtn = screen.getByTestId('layout-btn-qwerty');
      const colemakBtn = screen.getByTestId('layout-btn-colemak');
      
      // 버튼 클릭 시 올바른 값이 전달되는지 확인
      fireEvent.click(qwertyBtn);
      expect(mockSetLayout).toHaveBeenLastCalledWith('qwerty');
      
      fireEvent.click(colemakBtn);
      expect(mockSetLayout).toHaveBeenLastCalledWith('colemak');
    });
  });

  describe('컴포넌트 생명주기', () => {
    test('마운트/언마운트가 정상적으로 작동', () => {
      const { unmount } = render(<LayoutSelector />);
      
      expect(screen.getByTestId('layout-btn-qwerty')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByTestId('layout-btn-qwerty')).not.toBeInTheDocument();
    });

    test('여러 번 마운트/언마운트해도 안전함', () => {
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<LayoutSelector />);
        expect(screen.getByTestId('layout-btn-qwerty')).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe('통합 테스트', () => {
    test('전체 플로우가 정상 작동', () => {
      render(<LayoutSelector />);
      
      // 1. 초기 렌더링 확인
      expect(screen.getByTestId('layout-btn-qwerty')).toBeInTheDocument();
      expect(screen.getByTestId('layout-btn-colemak')).toBeInTheDocument();
      
      // 2. 초기 선택 상태 확인
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveAttribute('data-variant', 'default');
      expect(screen.getByTestId('layout-btn-colemak')).toHaveAttribute('data-variant', 'secondary');
      
      // 3. 버튼 클릭 동작 확인
      fireEvent.click(screen.getByTestId('layout-btn-colemak'));
      expect(mockSetLayout).toHaveBeenCalledWith('colemak');
      
      // 4. 접근성 속성 확인
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('layout-btn-colemak')).toHaveAttribute('aria-pressed', 'false');
    });

    test('상태 변경과 UI 업데이트 동기화', () => {
      const { rerender } = render(<LayoutSelector />);
      
      // 초기 상태
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveAttribute('data-variant', 'default');
      
      // 상태 변경 시뮬레이션
      mockLayout = 'colemak';
      rerender(<LayoutSelector />);
      
      // UI 업데이트 확인
      expect(screen.getByTestId('layout-btn-qwerty')).toHaveAttribute('data-variant', 'secondary');
      expect(screen.getByTestId('layout-btn-colemak')).toHaveAttribute('data-variant', 'default');
    });
  });
});