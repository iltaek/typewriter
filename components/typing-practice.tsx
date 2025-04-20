'use client';

import { VirtualKeyboard } from '@/components/keyboard';
import { LayoutSelector } from '@/components/layout-selector';
import { WordDisplay } from '@/components/typing/word-display';

interface TypingPracticeProps {
  initialWords: string[];
}

/**
 * 타이핑 연습 UI 전체를 관리하는 클라이언트 컴포넌트입니다.
 * Zustand 스토어를 사용하여 상태를 관리하고,
 * WordDisplay, LayoutSelector, VirtualKeyboard 컴포넌트를 렌더링합니다.
 * @param initialWords - 서버에서 생성된 초기 단어 목록
 */
export default function TypingPractice({ initialWords }: TypingPracticeProps) {
  return (
    <div className="flex flex-col items-center gap-16">
      {/* 타이핑 영역 */}
      <div className="w-full max-w-3xl">
        <WordDisplay initialWords={initialWords} />
      </div>

      {/* 키보드 영역 */}
      <div className="w-full max-w-5xl space-y-4">
        <LayoutSelector />
        <VirtualKeyboard />
      </div>
    </div>
  );
}
