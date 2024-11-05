import { type TypingStats } from '@/lib/typing-stats';

interface TypingStatsDisplayProps {
  stats: TypingStats;
}

export function TypingStatsDisplay({ stats }: TypingStatsDisplayProps) {
  return (
    <div className="flex gap-4 text-sm text-muted-foreground">
      <div>
        <span className="font-semibold">WPM:</span> {Math.round(stats.wpm)}
      </div>
      <div>
        <span className="font-semibold">Accuracy:</span> {Math.round(stats.accuracy)}%
      </div>
    </div>
  );
}
