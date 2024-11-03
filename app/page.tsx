'use client';

import { useState } from 'react';
import { VirtualKeyboard } from '@/components/virtual-keyboard';
import type { LayoutType } from '@/lib/keyboard';

export default function Home() {
  const [layout, setLayout] = useState<LayoutType>('qwerty');

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-between p-4">
      <div className="flex-1" />

      <div className="w-full max-w-5xl space-y-4">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setLayout('qwerty')}
            className={`px-4 py-2 rounded-md ${
              layout === 'qwerty' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            QWERTY
          </button>
          <button
            onClick={() => setLayout('colemak')}
            className={`px-4 py-2 rounded-md ${
              layout === 'colemak' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            Colemak
          </button>
        </div>
        <VirtualKeyboard layout={layout} />
      </div>
    </main>
  );
}
