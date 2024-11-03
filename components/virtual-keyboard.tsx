'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LAYOUTS, mapKeyCode, type KeyboardKey, type LayoutType } from '@/lib/keyboard';

interface VirtualKeyboardProps {
  layout: LayoutType;
}

export function VirtualKeyboard({ layout }: VirtualKeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const currentLayout = LAYOUTS[layout];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mappedKeyCode = mapKeyCode(e.code, 'qwerty', layout);

      const isSpecialKey = Object.values(currentLayout).some((row) =>
        row.some((key) => key.code === mappedKeyCode && key.isSpecial)
      );

      if (!isSpecialKey) {
        setPressedKeys((prev) => new Set([...prev, mappedKeyCode]));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const mappedKeyCode = mapKeyCode(e.code, 'qwerty', layout);

      const isSpecialKey = Object.values(currentLayout).some((row) =>
        row.some((key) => key.code === mappedKeyCode && key.isSpecial)
      );

      if (!isSpecialKey) {
        setPressedKeys((prev) => {
          const next = new Set(prev);
          next.delete(mappedKeyCode);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentLayout, layout]);

  const renderKey = (keyData: KeyboardKey) => {
    const isPressed = pressedKeys.has(keyData.code);

    return (
      <div
        key={keyData.code}
        className={cn(
          'h-10 w-10 rounded-md border border-gray-200 px-2 text-center text-sm',
          'flex items-center justify-center transition-colors duration-100',
          keyData.width,
          isPressed
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-accent hover:text-accent-foreground',
          keyData.isSpecial ? 'text-xs text-muted-foreground' : 'text-sm'
        )}
      >
        {keyData.key}
      </div>
    );
  };

  return (
    <div className="mx-auto w-fit space-y-1 rounded-lg border bg-card p-3 shadow-sm">
      {Object.entries(currentLayout).map(([rowKey, row]) => (
        <div key={rowKey} className="flex gap-1">
          {row.map(renderKey)}
        </div>
      ))}
    </div>
  );
}
