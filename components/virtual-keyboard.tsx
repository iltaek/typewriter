'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { KEYBOARD_CONFIGS, remapKey, type KeyboardKey, type LayoutType } from '@/lib/keyboard';

interface KeyProps {
  keyData: KeyboardKey;
  isPressed: boolean;
}

function Key({ keyData, isPressed }: KeyProps) {
  return (
    <div
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
}

interface KeyboardRowProps {
  keys: KeyboardKey[];
  pressedKeys: Set<string>;
}

function KeyboardRow({ keys, pressedKeys }: KeyboardRowProps) {
  return (
    <div className="flex gap-1">
      {keys.map((keyData) => (
        <Key key={keyData.code} keyData={keyData} isPressed={pressedKeys.has(keyData.code)} />
      ))}
    </div>
  );
}

interface VirtualKeyboardProps {
  layout: LayoutType;
}

export function VirtualKeyboard({ layout }: VirtualKeyboardProps) {
  const [pressedKeys, setPressedKeys] = React.useState<Set<string>>(new Set());
  const currentConfig = KEYBOARD_CONFIGS[layout];

  const handleKeyEvent = React.useCallback(
    (e: KeyboardEvent, action: 'press' | 'release') => {
      const mappedKeyCode = remapKey(e.code, 'qwerty', layout);
      const isSpecialKey = Object.values(currentConfig).some((row: KeyboardKey[]) =>
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
    <div className="mx-auto w-fit space-y-1 rounded-lg border bg-card p-3 shadow-sm">
      {Object.entries(currentConfig).map(([rowKey, keys]) => (
        <div key={rowKey} className="flex gap-1">
          {keys.map((keyData) => (
            <div
              key={keyData.code}
              data-code={keyData.code}
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
