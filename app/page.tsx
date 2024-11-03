'use client';

import { useState } from 'react';
import { WordDisplay } from '@/components/typing/word-display';
import { VirtualKeyboard } from '@/components/keyboard';
import { LayoutSelector } from '@/components/layout-selector';
import type { LayoutType } from '@/lib/keyboard';

export default function Home() {
  const [layout, setLayout] = useState<LayoutType>('qwerty');

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center gap-16">
          {/* 타이핑 영역 */}
          <div className="w-full max-w-3xl">
            <WordDisplay layout={layout} />
          </div>

          {/* 키보드 영역 */}
          <div className="w-full max-w-5xl space-y-4">
            <LayoutSelector currentLayout={layout} onLayoutChange={setLayout} />
            <VirtualKeyboard layout={layout} />
          </div>
        </div>
      </div>
    </main>
  );
}
