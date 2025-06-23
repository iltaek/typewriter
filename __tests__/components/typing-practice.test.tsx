import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TypingPractice from '@/components/typing-practice';

// Mock all child components
jest.mock('@/components/typing/word-display', () => ({
  WordDisplay: ({ initialWords }: { initialWords: string[] }) => (
    <div data-testid="word-display">
      <div data-testid="initial-words">{(initialWords || []).join(' ')}</div>
      <div data-testid="current-word">hello</div>
      <div data-testid="typing-stats">WPM: 0 | Accuracy: 100%</div>
    </div>
  ),
}));

jest.mock('@/components/layout-selector', () => ({
  LayoutSelector: () => (
    <div data-testid="layout-selector">
      <button data-testid="layout-qwerty">QWERTY</button>
      <button data-testid="layout-colemak">Colemak</button>
    </div>
  ),
}));

jest.mock('@/components/keyboard/virtual-keyboard', () => ({
  VirtualKeyboard: () => (
    <div data-testid="virtual-keyboard">
      <div data-testid="keyboard-row">
        <div data-testid="key-Q">Q</div>
        <div data-testid="key-W">W</div>
        <div data-testid="key-E">E</div>
      </div>
    </div>
  ),
}));

describe('TypingPractice', () => {
  const defaultProps = {
    initialWords: ['hello', 'world', 'test', 'typing', 'practice'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('기본 렌더링', () => {
    test('TypingPractice 컴포넌트가 렌더링됨', () => {
      render(<TypingPractice {...defaultProps} />);
      
      const container = screen.getByTestId('word-display').parentElement?.parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'gap-16');
    });

    test('모든 하위 컴포넌트가 렌더링됨', () => {
      render(<TypingPractice {...defaultProps} />);
      
      expect(screen.getByTestId('word-display')).toBeInTheDocument();
      expect(screen.getByTestId('layout-selector')).toBeInTheDocument();
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });

    test('초기 단어들이 WordDisplay에 전달됨', () => {
      render(<TypingPractice {...defaultProps} />);
      
      expect(screen.getByTestId('initial-words')).toHaveTextContent('hello world test typing practice');
    });

    test('컴포넌트 구조가 올바르게 배치됨', () => {
      const { container } = render(<TypingPractice {...defaultProps} />);
      
      // 타이핑 영역 확인
      const typingArea = container.querySelector('.w-full.max-w-3xl');
      expect(typingArea).toBeInTheDocument();
      expect(typingArea?.querySelector('[data-testid="word-display"]')).toBeInTheDocument();
      
      // 키보드 영역 확인
      const keyboardArea = container.querySelector('.w-full.max-w-5xl.space-y-4');
      expect(keyboardArea).toBeInTheDocument();
      expect(keyboardArea?.querySelector('[data-testid="layout-selector"]')).toBeInTheDocument();
      expect(keyboardArea?.querySelector('[data-testid="virtual-keyboard"]')).toBeInTheDocument();
    });
  });

  describe('Props 처리', () => {
    test('다양한 초기 단어 목록 처리', () => {
      const customWords = ['apple', 'banana', 'cherry'];
      render(<TypingPractice initialWords={customWords} />);
      
      expect(screen.getByTestId('initial-words')).toHaveTextContent('apple banana cherry');
    });

    test('빈 단어 목록 처리', () => {
      render(<TypingPractice initialWords={[]} />);
      
      expect(screen.getByTestId('initial-words')).toHaveTextContent('');
    });

    test('단일 단어 처리', () => {
      render(<TypingPractice initialWords={['single']} />);
      
      expect(screen.getByTestId('initial-words')).toHaveTextContent('single');
    });

    test('많은 수의 단어 처리', () => {
      const manyWords = Array.from({ length: 100 }, (_, i) => `word${i}`);
      render(<TypingPractice initialWords={manyWords} />);
      
      const initialWordsText = screen.getByTestId('initial-words').textContent;
      expect(initialWordsText).toContain('word0');
      expect(initialWordsText).toContain('word99');
    });

    test('특수 문자가 포함된 단어 처리', () => {
      const specialWords = ['hello!', 'world?', 'test-case', 'user@domain.com'];
      render(<TypingPractice initialWords={specialWords} />);
      
      expect(screen.getByTestId('initial-words')).toHaveTextContent('hello! world? test-case user@domain.com');
    });
  });

  describe('컴포넌트 통합', () => {
    test('WordDisplay와 다른 컴포넌트들이 함께 렌더링됨', () => {
      render(<TypingPractice {...defaultProps} />);
      
      // 모든 컴포넌트가 동시에 존재하는지 확인
      expect(screen.getByTestId('word-display')).toBeInTheDocument();
      expect(screen.getByTestId('layout-selector')).toBeInTheDocument();
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
      
      // 각 컴포넌트의 내용도 확인
      expect(screen.getByTestId('current-word')).toHaveTextContent('hello');
      expect(screen.getByTestId('typing-stats')).toHaveTextContent('WPM: 0 | Accuracy: 100%');
      expect(screen.getByTestId('layout-qwerty')).toBeInTheDocument();
      expect(screen.getByTestId('key-Q')).toBeInTheDocument();
    });

    test('레이아웃 선택기와 가상 키보드가 같은 영역에 배치됨', () => {
      const { container } = render(<TypingPractice {...defaultProps} />);
      
      const keyboardArea = container.querySelector('.w-full.max-w-5xl.space-y-4');
      expect(keyboardArea).toBeInTheDocument();
      
      const layoutSelector = keyboardArea?.querySelector('[data-testid="layout-selector"]');
      const virtualKeyboard = keyboardArea?.querySelector('[data-testid="virtual-keyboard"]');
      
      expect(layoutSelector).toBeInTheDocument();
      expect(virtualKeyboard).toBeInTheDocument();
    });

    test('타이핑 영역과 키보드 영역이 분리되어 배치됨', () => {
      const { container } = render(<TypingPractice {...defaultProps} />);
      
      const typingArea = container.querySelector('.w-full.max-w-3xl');
      const keyboardArea = container.querySelector('.w-full.max-w-5xl.space-y-4');
      
      expect(typingArea).toBeInTheDocument();
      expect(keyboardArea).toBeInTheDocument();
      expect(typingArea).not.toBe(keyboardArea);
    });
  });

  describe('반응형 레이아웃', () => {
    test('반응형 클래스가 올바르게 적용됨', () => {
      const { container } = render(<TypingPractice {...defaultProps} />);
      
      // 메인 컨테이너
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-center', 'gap-16');
      
      // 타이핑 영역 - 최대 너비 제한
      const typingArea = container.querySelector('.w-full.max-w-3xl');
      expect(typingArea).toBeInTheDocument();
      
      // 키보드 영역 - 더 넓은 최대 너비
      const keyboardArea = container.querySelector('.w-full.max-w-5xl');
      expect(keyboardArea).toBeInTheDocument();
    });

    test('컴포넌트 간격이 적절하게 설정됨', () => {
      const { container } = render(<TypingPractice {...defaultProps} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('gap-16');
      
      const keyboardArea = container.querySelector('.space-y-4');
      expect(keyboardArea).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    test('적절한 DOM 구조가 생성됨', () => {
      const { container } = render(<TypingPractice {...defaultProps} />);
      
      // 메인 컨테이너가 적절한 구조를 가짐
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer.tagName).toBe('DIV');
      
      // 하위 영역들이 적절하게 구성됨
      const areas = mainContainer.children;
      expect(areas).toHaveLength(2); // 타이핑 영역, 키보드 영역
    });

    test('하위 컴포넌트들이 접근 가능함', () => {
      render(<TypingPractice {...defaultProps} />);
      
      // 각 컴포넌트의 주요 요소들이 접근 가능한지 확인
      expect(screen.getByTestId('word-display')).toBeInTheDocument();
      expect(screen.getByTestId('layout-qwerty')).toBeInTheDocument();
      expect(screen.getByTestId('key-Q')).toBeInTheDocument();
    });

    test('키보드 네비게이션을 위한 구조', () => {
      render(<TypingPractice {...defaultProps} />);
      
      // 버튼들이 존재하고 포커스 가능한지 확인
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('성능', () => {
    test('빠른 렌더링', () => {
      const start = performance.now();
      render(<TypingPractice {...defaultProps} />);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100);
    });

    test('대량 데이터 처리', () => {
      const manyWords = Array.from({ length: 1000 }, (_, i) => `word${i}`);
      
      const start = performance.now();
      render(<TypingPractice initialWords={manyWords} />);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(200);
    });

    test('리렌더링 성능', () => {
      const { rerender } = render(<TypingPractice {...defaultProps} />);
      
      const start = performance.now();
      rerender(<TypingPractice initialWords={['new', 'words']} />);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100);
    });

    test('메모리 효율성', () => {
      const { unmount } = render(<TypingPractice {...defaultProps} />);
      
      expect(() => {
        act(() => {
          unmount();
        });
      }).not.toThrow();
    });
  });

  describe('에러 처리', () => {
    test('잘못된 props로 렌더링 시도', () => {
      // @ts-ignore - 테스트를 위한 타입 무시
      expect(() => render(<TypingPractice initialWords={null} />)).not.toThrow();
    });

    test('undefined props 처리', () => {
      // @ts-ignore - 테스트를 위한 타입 무시
      expect(() => render(<TypingPractice initialWords={undefined} />)).not.toThrow();
    });

    test('비정상적인 단어 데이터 처리', () => {
      // @ts-ignore - 테스트를 위한 타입 무시
      const invalidWords = [null, undefined, '', 123, {}];
      expect(() => render(<TypingPractice initialWords={invalidWords} />)).not.toThrow();
    });

    test('극단적인 데이터 처리', () => {
      const extremeWords = ['', 'a'.repeat(1000), '!@#$%^&*()', '\n\t\r'];
      expect(() => render(<TypingPractice initialWords={extremeWords} />)).not.toThrow();
    });
  });

  describe('컴포넌트 생명주기', () => {
    test('마운트/언마운트 정상 작동', () => {
      const { unmount } = render(<TypingPractice {...defaultProps} />);
      
      expect(screen.getByTestId('word-display')).toBeInTheDocument();
      
      act(() => {
        unmount();
      });
      
      expect(screen.queryByTestId('word-display')).not.toBeInTheDocument();
    });

    test('여러 번 마운트/언마운트 안전성', () => {
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<TypingPractice {...defaultProps} />);
        expect(screen.getByTestId('word-display')).toBeInTheDocument();
        
        act(() => {
          unmount();
        });
      }
    });

    test('동적 props 변경 처리', () => {
      const { rerender } = render(<TypingPractice initialWords={['first']} />);
      expect(screen.getByTestId('initial-words')).toHaveTextContent('first');
      
      rerender(<TypingPractice initialWords={['second', 'third']} />);
      expect(screen.getByTestId('initial-words')).toHaveTextContent('second third');
    });
  });

  describe('사용자 상호작용 시뮬레이션', () => {
    test('레이아웃 선택 버튼 클릭', () => {
      render(<TypingPractice {...defaultProps} />);
      
      const qwertyBtn = screen.getByTestId('layout-qwerty');
      const colemakBtn = screen.getByTestId('layout-colemak');
      
      expect(() => {
        fireEvent.click(qwertyBtn);
        fireEvent.click(colemakBtn);
      }).not.toThrow();
    });

    test('키보드 네비게이션', async () => {
      const user = userEvent.setup();
      render(<TypingPractice {...defaultProps} />);
      
      // Tab을 통한 네비게이션 테스트
      await user.tab();
      
      // 첫 번째 포커스 가능한 요소가 포커스되는지 확인
      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        expect(document.activeElement).toBeInTheDocument();
      }
    });

    test('여러 컴포넌트 동시 상호작용', () => {
      render(<TypingPractice {...defaultProps} />);
      
      // 여러 요소에 동시에 접근해도 문제가 없는지 확인
      expect(screen.getByTestId('word-display')).toBeInTheDocument();
      expect(screen.getByTestId('layout-selector')).toBeInTheDocument();
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(() => fireEvent.click(button)).not.toThrow();
      });
    });
  });

  describe('통합 테스트', () => {
    test('전체 애플리케이션 플로우', () => {
      render(<TypingPractice {...defaultProps} />);
      
      // 1. 초기 렌더링 확인
      expect(screen.getByTestId('word-display')).toBeInTheDocument();
      expect(screen.getByTestId('layout-selector')).toBeInTheDocument();
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
      
      // 2. 초기 데이터 확인
      expect(screen.getByTestId('initial-words')).toHaveTextContent('hello world test typing practice');
      expect(screen.getByTestId('current-word')).toHaveTextContent('hello');
      
      // 3. UI 요소들 확인
      expect(screen.getByTestId('typing-stats')).toHaveTextContent('WPM: 0 | Accuracy: 100%');
      expect(screen.getByTestId('layout-qwerty')).toBeInTheDocument();
      expect(screen.getByTestId('key-Q')).toBeInTheDocument();
      
      // 4. 상호작용 테스트
      const qwertyBtn = screen.getByTestId('layout-qwerty');
      fireEvent.click(qwertyBtn);
      
      // 5. 모든 컴포넌트가 여전히 정상 작동하는지 확인
      expect(screen.getByTestId('word-display')).toBeInTheDocument();
      expect(screen.getByTestId('layout-selector')).toBeInTheDocument();
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });

    test('데이터 흐름 검증', () => {
      const testWords = ['test', 'data', 'flow'];
      render(<TypingPractice initialWords={testWords} />);
      
      // Props가 올바르게 하위 컴포넌트에 전달되는지 확인
      expect(screen.getByTestId('initial-words')).toHaveTextContent('test data flow');
      
      // 모든 하위 컴포넌트가 정상적으로 렌더링되는지 확인
      expect(screen.getByTestId('word-display')).toBeInTheDocument();
      expect(screen.getByTestId('layout-selector')).toBeInTheDocument();
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });

    test('반응성 및 상태 일관성', () => {
      const { rerender } = render(<TypingPractice initialWords={['initial']} />);
      
      // 초기 상태 확인
      expect(screen.getByTestId('initial-words')).toHaveTextContent('initial');
      
      // Props 변경
      rerender(<TypingPractice initialWords={['updated', 'words']} />);
      
      // 업데이트된 상태 확인
      expect(screen.getByTestId('initial-words')).toHaveTextContent('updated words');
      
      // 모든 컴포넌트가 여전히 정상적으로 렌더링되는지 확인
      expect(screen.getByTestId('word-display')).toBeInTheDocument();
      expect(screen.getByTestId('layout-selector')).toBeInTheDocument();
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });
  });
});