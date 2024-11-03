'use client';

import { WordDisplay } from '@/components/typing/word-display';
import { VirtualKeyboard } from '@/components/keyboard';
import { LayoutSelector } from '@/components/layout-selector';
import { useState } from 'react';
import type { LayoutType } from '@/lib/keyboard';

export default function Home() {
  const [layout, setLayout] = useState<LayoutType>('qwerty');

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-between p-4">
      <div className="flex-1" />

      <div className="mb-16">
        <WordDisplay layout={layout} />
      </div>

      <div className="w-full max-w-5xl space-y-4">
        <LayoutSelector currentLayout={layout} onLayoutChange={setLayout} />
        <VirtualKeyboard layout={layout} />
      </div>
    </main>
  );
}
