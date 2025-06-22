import { render, screen } from '@testing-library/react';
import { TypingStatsDisplay } from '@/components/typing/typing-stats';
import { type TypingStats } from '@/types/typing.types';

describe('TypingStatsDisplay', () => {
  describe('정상 케이스', () => {
    test('기본 통계 표시', () => {
      const stats: TypingStats = {
        wpm: 45.7,
        accuracy: 89.3,
        correctChars: 89,
        totalChars: 100,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.getByText('WPM:')).toBeInTheDocument();
      expect(screen.getByText('46')).toBeInTheDocument(); // Math.round(45.7)
      expect(screen.getByText('Accuracy:')).toBeInTheDocument();
      expect(screen.getByText('89%')).toBeInTheDocument(); // Math.round(89.3)
    });

    test('높은 수치의 통계 표시', () => {
      const stats: TypingStats = {
        wpm: 120.9,
        accuracy: 99.8,
        correctChars: 998,
        totalChars: 1000,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.getByText('121')).toBeInTheDocument(); // Math.round(120.9)
      expect(screen.getByText('100%')).toBeInTheDocument(); // Math.round(99.8)
    });

    test('소수점 값의 올바른 반올림', () => {
      const stats: TypingStats = {
        wpm: 67.4, // 반내림
        accuracy: 85.6, // 반올림
        correctChars: 85,
        totalChars: 100,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.getByText('67')).toBeInTheDocument(); // 67.4 → 67
      expect(screen.getByText('86%')).toBeInTheDocument(); // 85.6 → 86
    });
  });

  describe('경계값 케이스', () => {
    test('0 값 처리', () => {
      const stats: TypingStats = {
        wpm: 0,
        accuracy: 0,
        correctChars: 0,
        totalChars: 0,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.getByText('WPM:')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Accuracy:')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    test('매우 작은 값 처리', () => {
      const stats: TypingStats = {
        wpm: 0.1,
        accuracy: 0.9,
        correctChars: 1,
        totalChars: 100,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.getByText('0')).toBeInTheDocument(); // Math.round(0.1)
      expect(screen.getByText('1%')).toBeInTheDocument(); // Math.round(0.9)
    });

    test('정확히 0.5인 값의 반올림', () => {
      const stats: TypingStats = {
        wpm: 45.5,
        accuracy: 87.5,
        correctChars: 87,
        totalChars: 100,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.getByText('46')).toBeInTheDocument(); // Math.round(45.5) = 46
      expect(screen.getByText('88%')).toBeInTheDocument(); // Math.round(87.5) = 88
    });
  });

  describe('엣지 케이스', () => {
    test('음수 값 처리', () => {
      const stats: TypingStats = {
        wpm: -5,
        accuracy: -10,
        correctChars: 0,
        totalChars: 0,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.getByText('-5')).toBeInTheDocument();
      expect(screen.getByText('-10%')).toBeInTheDocument();
    });

    test('매우 큰 값 처리', () => {
      const stats: TypingStats = {
        wpm: 9999.9,
        accuracy: 999.9,
        correctChars: 999999,
        totalChars: 1000000,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.getByText('10000')).toBeInTheDocument(); // Math.round(9999.9)
      expect(screen.getByText('1000%')).toBeInTheDocument(); // Math.round(999.9)
    });

    test('NaN 값 처리', () => {
      const stats: TypingStats = {
        wpm: NaN,
        accuracy: NaN,
        correctChars: 0,
        totalChars: 0,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      // Math.round(NaN)은 NaN을 반환하고, 이는 문자열로 변환 시 'NaN'이 됨
      expect(screen.getByText('NaN')).toBeInTheDocument();
    });

    test('Infinity 값 처리', () => {
      const stats: TypingStats = {
        wpm: Infinity,
        accuracy: -Infinity,
        correctChars: 0,
        totalChars: 0,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.getByText('Infinity')).toBeInTheDocument();
      expect(screen.getByText('-Infinity%')).toBeInTheDocument();
    });
  });

  describe('레이아웃 및 스타일링', () => {
    test('올바른 CSS 클래스 적용', () => {
      const stats: TypingStats = {
        wpm: 50,
        accuracy: 90,
        correctChars: 90,
        totalChars: 100,
      };

      const { container } = render(<TypingStatsDisplay stats={stats} />);
      
      const wrapper = container.firstChild as Element;
      expect(wrapper).toHaveClass('flex', 'gap-4', 'text-sm', 'text-muted-foreground');
    });

    test('WPM과 Accuracy 라벨이 굵게 표시됨', () => {
      const stats: TypingStats = {
        wpm: 50,
        accuracy: 90,
        correctChars: 90,
        totalChars: 100,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      const wpmLabel = screen.getByText('WPM:');
      const accuracyLabel = screen.getByText('Accuracy:');
      
      expect(wpmLabel).toHaveClass('font-semibold');
      expect(accuracyLabel).toHaveClass('font-semibold');
    });

    test('두 개의 div가 렌더링됨', () => {
      const stats: TypingStats = {
        wpm: 50,
        accuracy: 90,
        correctChars: 90,
        totalChars: 100,
      };

      const { container } = render(<TypingStatsDisplay stats={stats} />);
      
      const wrapper = container.firstChild as Element;
      const childDivs = wrapper.querySelectorAll('div');
      expect(childDivs).toHaveLength(2); // WPM div + Accuracy div
    });
  });

  describe('접근성', () => {
    test('텍스트 콘텐츠가 스크린 리더에서 읽기 쉬움', () => {
      const stats: TypingStats = {
        wpm: 75,
        accuracy: 95,
        correctChars: 95,
        totalChars: 100,
      };

      const { container } = render(<TypingStatsDisplay stats={stats} />);
      
      // 스크린 리더가 "WPM: 75"와 "Accuracy: 95%" 형태로 읽을 수 있도록 구성됨
      expect(container.textContent).toContain('WPM: 75');
      expect(container.textContent).toContain('Accuracy: 95%');
      
      // 각 레이블과 값이 올바르게 표시됨
      expect(screen.getByText('WPM:')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('Accuracy:')).toBeInTheDocument();
      expect(screen.getByText('95%')).toBeInTheDocument();
    });

    test('의미 있는 정보가 모두 텍스트로 제공됨', () => {
      const stats: TypingStats = {
        wpm: 60,
        accuracy: 88,
        correctChars: 88,
        totalChars: 100,
      };

      const { container } = render(<TypingStatsDisplay stats={stats} />);
      
      // 모든 중요한 정보가 텍스트로 표현되어 있음
      expect(container.textContent).toContain('WPM: 60');
      expect(container.textContent).toContain('Accuracy: 88%');
    });
  });

  describe('다양한 stats 속성 조합', () => {
    test('correctChars와 totalChars는 표시되지 않음', () => {
      const stats: TypingStats = {
        wpm: 50,
        accuracy: 90,
        correctChars: 450, // 큰 값이지만 화면에 표시되지 않음
        totalChars: 500,  // 큰 값이지만 화면에 표시되지 않음
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.queryByText('450')).not.toBeInTheDocument();
      expect(screen.queryByText('500')).not.toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument(); // WPM만 표시
      expect(screen.getByText('90%')).toBeInTheDocument(); // Accuracy만 표시
    });

    test('실제 타이핑 진행 중 시나리오', () => {
      const stats: TypingStats = {
        wpm: 42.3,
        accuracy: 87.6,
        correctChars: 123,
        totalChars: 140,
      };

      render(<TypingStatsDisplay stats={stats} />);
      
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('88%')).toBeInTheDocument();
    });
  });

  describe('props 변경', () => {
    test('stats prop 변경 시 올바르게 리렌더링', () => {
      const initialStats: TypingStats = {
        wpm: 30,
        accuracy: 80,
        correctChars: 80,
        totalChars: 100,
      };

      const { rerender } = render(<TypingStatsDisplay stats={initialStats} />);
      
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();

      const updatedStats: TypingStats = {
        wpm: 45,
        accuracy: 92,
        correctChars: 92,
        totalChars: 100,
      };

      rerender(<TypingStatsDisplay stats={updatedStats} />);
      
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByText('92%')).toBeInTheDocument();
      expect(screen.queryByText('30')).not.toBeInTheDocument();
      expect(screen.queryByText('80%')).not.toBeInTheDocument();
    });
  });

  describe('성능', () => {
    test('컴포넌트가 빠르게 렌더링됨', () => {
      const stats: TypingStats = {
        wpm: 50,
        accuracy: 90,
        correctChars: 90,
        totalChars: 100,
      };

      const start = performance.now();
      render(<TypingStatsDisplay stats={stats} />);
      const end = performance.now();
      
      const renderTime = end - start;
      // 간단한 컴포넌트이므로 10ms 미만이어야 함
      expect(renderTime).toBeLessThan(10);
    });

    test('동일한 stats로 여러 번 렌더링해도 성능 이슈 없음', () => {
      const stats: TypingStats = {
        wpm: 50,
        accuracy: 90,
        correctChars: 90,
        totalChars: 100,
      };

      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        const { unmount } = render(<TypingStatsDisplay stats={stats} />);
        unmount();
      }
      
      const end = performance.now();
      const totalTime = end - start;
      
      // 100번 렌더링이 500ms 미만이어야 함
      expect(totalTime).toBeLessThan(500);
    });
  });
});