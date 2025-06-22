import { cn } from '@/lib/utils';
import { type WordState } from '@/types/word.types';

/**
 * 타이핑 연습에서 개별 단어를 표시하는 컴포넌트의 Props 인터페이스입니다.
 */
interface WordProps {
  /** 표시할 단어의 상태 정보 (단어, 입력된 글자, 정타 여부 등) */
  word: WordState;
  /** 현재 입력 중인 단어인지 여부 */
  isActive: boolean;
  /** 이전에 입력했던 단어인지 여부 */
  isPrevious: boolean;
}

/**
 * 타이핑 연습 화면에서 개별 단어를 시각적으로 표시하는 컴포넌트입니다.
 * 단어의 상태(활성, 이전, 완료) 및 글자별 입력 상태(정타, 오타, 미입력)에 따라 스타일이 동적으로 변경됩니다.
 * 참고: 현재 WordDisplay 컴포넌트 내부에 유사한 로직이 있어, 이 컴포넌트의 실제 사용 여부 확인 및 중복 제거가 필요할 수 있습니다.
 * @param word - 표시할 단어의 상태 객체
 * @param isActive - 현재 단어 활성화 여부
 * @param isPrevious - 이전 단어 여부
 */
export function Word({ word, isActive, isPrevious }: WordProps) {
  return (
    // 단어 컨테이너
    <div
      className={cn(
        // 기본 스타일 및 전환 효과
        'text-2xl font-mono transition-all duration-200 px-1',
        // 활성 상태에 따른 스타일 (크기, 투명도)
        isActive ? 'scale-110' : 'scale-100 opacity-50',
      )}
    >
      {/* 단어의 글자들을 순회하며 span으로 렌더링 */}
      {word.word.split('').map((char: string, charIndex: number) => (
        <span
          key={`${char}-${charIndex}`} // key prop 개선 필요 (charIndex 사용)
          className={cn(
            'transition-colors duration-150',
            // 글자 색상 결정 로직 (복잡하므로 헬퍼 함수 분리 및 테마 색상 사용 고려)
            isActive && // 현재 입력 중인 단어일 경우
              (word.typed[charIndex] === undefined // 아직 입력 안 된 글자
                ? 'text-gray-400' // 기본 색상 (테마의 muted-foreground 사용 고려)
                : word.typed[charIndex] === char // 입력된 글자가 정타일 경우
                  ? 'text-green-500' // 녹색 (테마의 primary 또는 success 색상 사용 고려)
                  : 'text-red-500'), // 입력된 글자가 오타일 경우 (테마의 destructive 색상 사용 고려)
            isPrevious && // 이전에 입력했던 단어일 경우
              (word.isCorrect ? 'text-green-500' : 'text-red-500'), // 단어 전체 정타/오타 여부에 따라 색상 적용
            !isActive && !isPrevious && 'text-gray-400', // 활성/이전 단어가 아닌 경우 기본 색상
          )}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
