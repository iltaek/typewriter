'use client';

import * as React from 'react';
import { KEYBOARD_CONFIGS, remapKey, type KeyboardKey, type LayoutType } from '@/lib/keyboard';
import { KeyboardRow } from './keyboard-row';

interface VirtualKeyboardProps {
  layout: LayoutType;
}

export function VirtualKeyboard({ layout }: VirtualKeyboardProps) {
  const [pressedKeys, setPressedKeys] = React.useState<Set<string>>(new Set());
  const currentConfig = KEYBOARD_CONFIGS[layout];

  const handleKeyEvent = React.useCallback(
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

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyEvent(e, 'press');
    const handleKeyUp = (e: KeyboardEvent) => handleKeyEvent(e, 'release');

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyEvent]);

  return (
    <div className="mx-auto w-fit space-y-1.5 rounded-lg border bg-card p-4 shadow-sm">
      {Object.entries(currentConfig).map(([rowKey, keys]) => (
        <KeyboardRow key={rowKey} keys={keys} pressedKeys={pressedKeys} />
      ))}
    </div>
  );
}
