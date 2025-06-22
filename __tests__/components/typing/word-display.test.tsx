import { render, screen, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import { WordDisplay } from '@/components/typing/word-display';
import { useTypingStore } from '@/store/typing-store';
import { type TypingStats } from '@/types/typing.types';
import { type WordState } from '@/types/word.types';

// Mock dependencies
jest.mock('@/store/typing-store');
jest.mock('@/components/typing/typing-stats', () => ({
  TypingStatsDisplay: ({ stats }: { stats: TypingStats }) => (
    <div data-testid="typing-stats">
      WPM: {Math.round(stats.wpm)} | Accuracy: {Math.round(stats.accuracy)}%
    </div>
  ),
}));

jest.mock('@/lib/typing-colors', () => ({
  getCharacterColor: jest.fn(
    (wordState: WordState, wordIndex: number, currentIndex: number, charIndex: number, targetChar: string) => {
      if (wordIndex < currentIndex) return 'text-green-500'; // 완료된 단어
      if (wordIndex === currentIndex) return 'text-blue-500'; // 현재 단어
      return 'text-gray-400'; // 미래 단어
    }
  ),
}));

// Mock store implementation
const mockTypingStore = {
  words: [] as WordState[],
  currentIndex: 0,
  stats: {
    accuracy: 0,
    wpm: 0,
    correctChars: 0,
    totalChars: 0,
  } as TypingStats,
  setInitialWords: jest.fn(),
  registerKeyboardListeners: jest.fn(),
  cleanup: jest.fn(),
};

const mockUseTypingStore = useTypingStore as jest.MockedFunction<typeof useTypingStore>;

describe('WordDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTypingStore.mockReturnValue(mockTypingStore);
  });

  describe('초기 상태', () => {
    test('빈 initialWords로 에러 상태 표시', () => {
      render(<WordDisplay initialWords={[]} />);
      
      expect(screen.getByText('Error: No words provided')).toBeInTheDocument();
      const errorContainer = screen.getByText('Error: No words provided');
      expect(errorContainer).toHaveClass('text-red-500');
    });

    test('initialWords가 있지만 스토어에 words가 없으면 로딩 상태 표시', () => {
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [],
      });

      render(<WordDisplay initialWords={['hello', 'world']} />);
      
      expect(screen.getByText(/Loading words.../)).toBeInTheDocument();
      expect(screen.getByText(/initialWords: 2/)).toBeInTheDocument();
    });

    test('정상적인 단어 목록이 있으면 컴포넌트 렌더링', () => {
      const words: WordState[] = [
        { word: 'hello', typed: '', isCorrect: false },
        { word: 'world', typed: '', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
        currentIndex: 0,
      });

      render(<WordDisplay initialWords={['hello', 'world']} />);
      
      // 개별 글자들이 span으로 분리되어 렌더링됨
      expect(screen.getByText('h')).toBeInTheDocument();
      expect(screen.getByText('e')).toBeInTheDocument();
      expect(screen.getByText('w')).toBeInTheDocument();
      expect(screen.getByText('d')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('컴포넌트 마운트', () => {
    test('setInitialWords가 올바른 인자로 호출됨', () => {
      const initialWords = ['test', 'words', 'array'];
      
      render(<WordDisplay initialWords={initialWords} />);
      
      expect(mockTypingStore.setInitialWords).toHaveBeenCalledWith(['test', 'words', 'array']);
      expect(mockTypingStore.setInitialWords).toHaveBeenCalledTimes(1);
    });

    test('키보드 리스너가 등록되고 cleanup이 반환됨', () => {
      render(<WordDisplay initialWords={['test']} />);
      
      expect(mockTypingStore.registerKeyboardListeners).toHaveBeenCalledTimes(1);
    });

    test('언마운트 시 cleanup 함수가 호출됨', () => {
      const { unmount } = render(<WordDisplay initialWords={['test']} />);
      
      act(() => {
        unmount();
      });
      
      expect(mockTypingStore.cleanup).toHaveBeenCalled();
    });
  });

  describe('단어 렌더링', () => {
    test('모든 단어가 올바르게 렌더링됨', () => {
      const words: WordState[] = [
        { word: 'the', typed: 'th', isCorrect: false },
        { word: 'quick', typed: '', isCorrect: false },
        { word: 'brown', typed: '', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
        currentIndex: 0,
      });

      render(<WordDisplay initialWords={['the', 'quick', 'brown']} />);
      
      // 단어의 개별 글자들이 렌더링되는지 확인
      expect(screen.getByText('t')).toBeInTheDocument();
      expect(screen.getByText('h')).toBeInTheDocument();
      expect(screen.getByText('e')).toBeInTheDocument();
      expect(screen.getByText('q')).toBeInTheDocument();
      expect(screen.getByText('u')).toBeInTheDocument();
      expect(screen.getByText('i')).toBeInTheDocument();
      expect(screen.getByText('c')).toBeInTheDocument();
      expect(screen.getByText('k')).toBeInTheDocument();
      expect(screen.getByText('b')).toBeInTheDocument();
      expect(screen.getByText('r')).toBeInTheDocument();
      expect(screen.getByText('o')).toBeInTheDocument();
      expect(screen.getByText('w')).toBeInTheDocument();
      expect(screen.getByText('n')).toBeInTheDocument();
    });

    test('현재 단어가 강조됨 (scale-110 클래스)', () => {
      const words: WordState[] = [
        { word: 'first', typed: '', isCorrect: false },
        { word: 'second', typed: '', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
        currentIndex: 1, // 두 번째 단어가 현재 단어
      });

      render(<WordDisplay initialWords={['first', 'second']} />);
      
      // 모든 단어 컨테이너 찾기
      const section = screen.getByLabelText('Typing Exercise Text');
      const wordContainers = section.querySelectorAll('div.font-mono');
      
      expect(wordContainers).toHaveLength(2);
      expect(wordContainers[0]).toHaveClass('scale-100', 'opacity-50');
      expect(wordContainers[1]).toHaveClass('scale-110');
    });

    test('단어 사이 구분자가 올바르게 표시됨', () => {
      const words: WordState[] = [
        { word: 'word1', typed: '', isCorrect: false },
        { word: 'word2', typed: '', isCorrect: false },
        { word: 'word3', typed: '', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
      });

      render(<WordDisplay initialWords={['word1', 'word2', 'word3']} />);
      
      const separators = screen.getAllByText('·');
      expect(separators).toHaveLength(2); // 3개 단어 사이에 2개 구분자
    });
  });

  describe('통계 표시', () => {
    test('TypingStatsDisplay가 올바른 stats로 렌더링됨', () => {
      const stats: TypingStats = {
        wpm: 45.7,
        accuracy: 89.3,
        correctChars: 89,
        totalChars: 100,
      };

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'test', typed: '', isCorrect: false }],
        stats,
      });

      render(<WordDisplay initialWords={['test']} />);
      
      expect(screen.getByTestId('typing-stats')).toBeInTheDocument();
      expect(screen.getByText('WPM: 46 | Accuracy: 89%')).toBeInTheDocument();
    });
  });

  describe('진행 상태 표시', () => {
    test('현재 진행 상태가 올바르게 표시됨', () => {
      const words: WordState[] = [
        { word: 'one', typed: '', isCorrect: false },
        { word: 'two', typed: '', isCorrect: false },
        { word: 'three', typed: '', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
        currentIndex: 1, // 2번째 단어 (0-indexed)
      });

      render(<WordDisplay initialWords={['one', 'two', 'three']} />);
      
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Progress: word 2 of 3'
      );
    });
  });

  describe('키보드 단축키 안내', () => {
    test('데스크톱용 단축키 안내가 표시됨', () => {
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'test', typed: '', isCorrect: false }],
      });

      render(<WordDisplay initialWords={['test']} />);
      
      expect(screen.getByText('Escape')).toBeInTheDocument();
      expect(screen.getByText('Ctrl+R')).toBeInTheDocument();
    });

    test('모바일용 단축키 안내가 있음', () => {
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'test', typed: '', isCorrect: false }],
      });

      render(<WordDisplay initialWords={['test']} />);
      
      expect(screen.getByText('ESC')).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    test('적절한 ARIA 속성들이 설정됨', () => {
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'test', typed: '', isCorrect: false }],
      });

      render(<WordDisplay initialWords={['test']} />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-label', 'Typing Practice Application');
      
      const section = screen.getByLabelText('Typing Exercise Text');
      expect(section).toHaveAttribute('aria-live', 'polite');
      expect(section).toHaveAttribute('aria-describedby', 'typing-instructions');
      
      expect(screen.getByText(/Type the words shown above/)).toBeInTheDocument();
    });

    test('스크린 리더용 설명이 있음', () => {
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'test', typed: '', isCorrect: false }],
      });

      render(<WordDisplay initialWords={['test']} />);
      
      const instructions = screen.getByText(/Type the words shown above/);
      expect(instructions.closest('div')).toHaveClass('sr-only');
      expect(instructions.closest('div')).toHaveAttribute('id', 'typing-instructions');
    });
  });

  describe('반응형 디자인', () => {
    test('반응형 클래스가 적용됨', () => {
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'test', typed: '', isCorrect: false }],
      });

      render(<WordDisplay initialWords={['test']} />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('space-y-4', 'sm:space-y-8', 'px-4', 'py-8');
      
      // 단어 컨테이너 찾기
      const section = screen.getByLabelText('Typing Exercise Text');
      const wordContainer = section.querySelector('div.font-mono');
      expect(wordContainer).toHaveClass('text-lg', 'sm:text-2xl');
    });
  });

  describe('Props 변경', () => {
    test('initialWords 변경 시 setInitialWords 재호출', () => {
      const { rerender } = render(<WordDisplay initialWords={['first']} />);
      
      expect(mockTypingStore.setInitialWords).toHaveBeenCalledWith(['first']);
      
      rerender(<WordDisplay initialWords={['second']} />);
      
      expect(mockTypingStore.setInitialWords).toHaveBeenCalledWith(['second']);
      expect(mockTypingStore.setInitialWords).toHaveBeenCalledTimes(2);
    });

    test('동일한 initialWords로는 재호출되지 않음', () => {
      const initialWords = ['same', 'words'];
      const { rerender } = render(<WordDisplay initialWords={initialWords} />);
      
      expect(mockTypingStore.setInitialWords).toHaveBeenCalledTimes(1);
      
      // 동일한 배열로 rerender
      rerender(<WordDisplay initialWords={initialWords} />);
      
      // useEffect dependency가 참조 동일성을 확인하므로 재호출되지 않음
      expect(mockTypingStore.setInitialWords).toHaveBeenCalledTimes(1);
    });
  });

  describe('에러 처리', () => {
    test('매우 긴 단어 목록도 처리 가능', () => {
      const longWordList = Array.from({ length: 100 }, (_, i) => `word${i}`);
      const longWords: WordState[] = longWordList.map(word => ({
        word,
        typed: '',
        isCorrect: false,
      }));

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: longWords,
        currentIndex: 50,
      });

      render(<WordDisplay initialWords={longWordList} />);
      
      expect(screen.getByText('51 / 100')).toBeInTheDocument();
      // 여러 위치에 'w'와 '0'이 있을 수 있으므로 getAllByText 사용
      const wChars = screen.getAllByText('w');
      const zeroChars = screen.getAllByText('0');
      expect(wChars.length).toBeGreaterThan(0);
      expect(zeroChars.length).toBeGreaterThan(0);
    });

    test('빈 문자열을 포함한 단어도 처리', () => {
      const words: WordState[] = [
        { word: '', typed: '', isCorrect: false },
        { word: 'normal', typed: '', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
      });

      render(<WordDisplay initialWords={['', 'normal']} />);
      
      // 개별 글자들이 렌더링됨
      expect(screen.getByText('n')).toBeInTheDocument();
      expect(screen.getByText('o')).toBeInTheDocument();
      expect(screen.getByText('r')).toBeInTheDocument();
      expect(screen.getByText('m')).toBeInTheDocument();
      expect(screen.getByText('a')).toBeInTheDocument();
      expect(screen.getByText('l')).toBeInTheDocument();
      // 빈 단어는 렌더링되지만 텍스트가 없음
    });
  });

  describe('성능', () => {
    test('컴포넌트가 빠르게 렌더링됨', () => {
      const start = performance.now();
      
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'test', typed: '', isCorrect: false }],
      });

      render(<WordDisplay initialWords={['test']} />);
      
      const end = performance.now();
      const renderTime = end - start;
      
      // 렌더링이 100ms 미만이어야 함
      expect(renderTime).toBeLessThan(100);
    });

    test('많은 단어가 있어도 메모리 누수가 없음', () => {
      const manyWords = Array.from({ length: 50 }, (_, i) => `word${i}`);
      const wordStates: WordState[] = manyWords.map(word => ({
        word,
        typed: '',
        isCorrect: false,
      }));

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: wordStates,
      });

      const { unmount, rerender } = render(<WordDisplay initialWords={manyWords} />);
      
      // 재렌더링
      rerender(<WordDisplay initialWords={manyWords} />);
      
      // cleanup 호출 확인
      unmount();
      expect(mockTypingStore.cleanup).toHaveBeenCalled();
    });
  });

  describe('색상 시스템', () => {
    test('getCharacterColor가 올바른 인자로 호출됨', () => {
      const { getCharacterColor } = require('@/lib/typing-colors');
      const words: WordState[] = [
        { word: 'hi', typed: 'h', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
        currentIndex: 0,
      });

      render(<WordDisplay initialWords={['hi']} />);
      
      // 각 글자에 대해 getCharacterColor가 호출됨
      expect(getCharacterColor).toHaveBeenCalledWith(
        words[0],
        0,
        0,
        0,
        'h'
      );
      expect(getCharacterColor).toHaveBeenCalledWith(
        words[0],
        0,
        0,
        1,
        'i'
      );
    });

    test('다양한 단어 상태에 따른 색상 적용', () => {
      const { getCharacterColor } = require('@/lib/typing-colors');
      getCharacterColor.mockImplementation((wordState, wordIndex, currentIndex, charIndex) => {
        if (wordIndex < currentIndex) return 'text-green-500';
        if (wordIndex === currentIndex) {
          if (charIndex < wordState.typed.length) {
            return wordState.typed[charIndex] === wordState.word[charIndex] 
              ? 'text-green-500' 
              : 'text-red-500';
          }
          return 'text-gray-400';
        }
        return 'text-gray-400';
      });

      const words: WordState[] = [
        { word: 'done', typed: 'done', isCorrect: true },
        { word: 'test', typed: 'tex', isCorrect: false },
        { word: 'next', typed: '', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
        currentIndex: 1,
      });

      render(<WordDisplay initialWords={['done', 'test', 'next']} />);
      
      // getCharacterColor가 각 글자에 대해 호출되었는지 확인
      expect(getCharacterColor).toHaveBeenCalled();
      
      // 각 단어의 글자 수를 기반으로 호출 횟수 확인
      const totalChars = words.reduce((sum, word) => sum + word.word.length, 0);
      expect(getCharacterColor).toHaveBeenCalledTimes(totalChars); // 4 + 4 + 4 = 12
    });
  });

  describe('특수 케이스', () => {
    test('특수 문자를 포함한 단어 렌더링', () => {
      const words: WordState[] = [
        { word: "it's", typed: '', isCorrect: false },
        { word: 'hello-world', typed: '', isCorrect: false },
        { word: '123', typed: '', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
        currentIndex: 0,
      });

      render(<WordDisplay initialWords={["it's", 'hello-world', '123']} />);
      
      expect(screen.getByText("'")).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('유니코드 문자 렌더링', () => {
      const words: WordState[] = [
        { word: 'café', typed: '', isCorrect: false },
        { word: 'naïve', typed: '', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
        currentIndex: 0,
      });

      render(<WordDisplay initialWords={['café', 'naïve']} />);
      
      expect(screen.getByText('é')).toBeInTheDocument();
      expect(screen.getByText('ï')).toBeInTheDocument();
    });

    test('모든 단어가 완료된 상태', () => {
      const words: WordState[] = [
        { word: 'all', typed: 'all', isCorrect: true },
        { word: 'done', typed: 'done', isCorrect: true },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
        currentIndex: 1,
        stats: {
          wpm: 60,
          accuracy: 100,
          correctChars: 7,
          totalChars: 7,
        },
      });

      render(<WordDisplay initialWords={['all', 'done']} />);
      
      expect(screen.getByText('2 / 2')).toBeInTheDocument();
      expect(screen.getByText('WPM: 60 | Accuracy: 100%')).toBeInTheDocument();
    });
  });

  describe('상태 변경 시나리오', () => {
    test('타이핑 중 상태 변경', () => {
      const { rerender } = render(<WordDisplay initialWords={['test']} />);
      
      // 초기 상태
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'test', typed: '', isCorrect: false }],
        currentIndex: 0,
      });
      
      rerender(<WordDisplay initialWords={['test']} />);
      expect(screen.getByText('1 / 1')).toBeInTheDocument();
      
      // 타이핑 진행 중
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'test', typed: 'te', isCorrect: false }],
        currentIndex: 0,
        stats: {
          wpm: 24,
          accuracy: 100,
          correctChars: 2,
          totalChars: 2,
        },
      });
      
      rerender(<WordDisplay initialWords={['test']} />);
      expect(screen.getByText('WPM: 24 | Accuracy: 100%')).toBeInTheDocument();
    });

    test('에러에서 정상 상태로 전환', () => {
      const { rerender } = render(<WordDisplay initialWords={[]} />);
      
      // 에러 상태
      expect(screen.getByText('Error: No words provided')).toBeInTheDocument();
      
      // 정상 상태로 전환
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'fixed', typed: '', isCorrect: false }],
        currentIndex: 0,
      });
      
      rerender(<WordDisplay initialWords={['fixed']} />);
      
      expect(screen.queryByText('Error: No words provided')).not.toBeInTheDocument();
      expect(screen.getByText('f')).toBeInTheDocument();
    });
  });

  describe('레이아웃 및 스타일', () => {
    test('구분자 스타일이 올바르게 적용됨', () => {
      const words: WordState[] = [
        { word: 'a', typed: '', isCorrect: false },
        { word: 'b', typed: '', isCorrect: false },
      ];

      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words,
      });

      render(<WordDisplay initialWords={['a', 'b']} />);
      
      const separator = screen.getByText('·');
      expect(separator).toHaveClass('text-lg', 'sm:text-2xl', 'font-mono', 'text-gray-200');
    });

    test('최대 너비 제한이 적용됨', () => {
      mockUseTypingStore.mockReturnValue({
        ...mockTypingStore,
        words: [{ word: 'test', typed: '', isCorrect: false }],
      });

      render(<WordDisplay initialWords={['test']} />);
      
      const section = screen.getByLabelText('Typing Exercise Text');
      expect(section).toHaveClass('max-w-3xl');
    });
  });
});