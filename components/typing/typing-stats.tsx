import { type TypingStats } from '@/schemas/typing.schema';

/**
 * 타이핑 통계 표시 컴포넌트의 Props 인터페이스입니다.
 */
interface TypingStatsDisplayProps {
  /** 표시할 타이핑 통계 데이터 (WPM, 정확도 등) */
  stats: TypingStats;
}

/**
 * 타이핑 통계(WPM, 정확도)를 화면에 표시하는 간단한 컴포넌트입니다.
 * @param stats - 표시할 TypingStats 객체
 */
export function TypingStatsDisplay({ stats }: TypingStatsDisplayProps) {
  return (
    // 통계를 가로로 나열하는 flex 컨테이너
    <div className="flex gap-4 text-sm text-muted-foreground">
      {/* WPM 표시 */}{' '}
      <div>
        <span className="font-semibold">WPM:</span> {Math.round(stats.wpm)}
      </div>
      {/* 정확도 표시 */}{' '}
      <div>
        <span className="font-semibold">Accuracy:</span> {Math.round(stats.accuracy)}%
      </div>
    </div>
  );
}
