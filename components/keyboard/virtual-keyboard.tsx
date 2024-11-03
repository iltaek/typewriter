'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { KEYBOARD_CONFIGS, remapKey, type KeyboardKey, type LayoutType } from '@/lib/keyboard';

interface VirtualKeyboardProps {
  layout: LayoutType;
}

export function VirtualKeyboard({ layout }: VirtualKeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const currentConfig = KEYBOARD_CONFIGS[layout];

  const handleKeyEvent = useCallback(
    (e: KeyboardEvent, action: 'press' | 'release') => {
      const mappedKeyCode = remapKey(e.code, 'qwerty', layout);

      const isSpecialKey = Object.values(currentConfig).some((row) =>
        row.some((key: KeyboardKey) => key.code === mappedKeyCode && key.isSpecial)
      );

      if (!isSpecialKey) {
        setPressedKeys((prev) => {
          const next = new Set(prev);
          if (action === 'press') {
            next.add(mappedKeyCode);
          } else {
            next.delete(mappedKeyCode);
          }
          return next;
        });
      }
    },
    [currentConfig, layout]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyEvent(e, 'press');
    const handleKeyUp = (e: KeyboardEvent) => handleKeyEvent(e, 'release');

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyEvent]);

  const rows = Object.entries(currentConfig);

  return (
    <div className="mx-auto w-fit space-y-1 rounded-lg border bg-card p-3 shadow-sm">
      {rows.map(([rowKey, keys]) => (
        <div key={rowKey} className="flex gap-1">
          {keys.map((keyData) => (
            <div
              key={keyData.code}
              className={cn(
                'h-10 w-10 rounded-md border border-gray-200 px-2 text-center text-sm',
                'flex items-center justify-center transition-colors duration-100',
                keyData.width,
                pressedKeys.has(keyData.code)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-accent hover:text-accent-foreground',
                keyData.isSpecial ? 'text-xs text-muted-foreground' : 'text-sm'
              )}
            >
              {keyData.key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
