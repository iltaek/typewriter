'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { isSpecialKey, KEYBOARD_LAYOUT, type KeyboardKey } from '@/lib/keyboard';

export function VirtualKeyboard() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSpecialKey(e.code)) {
        setPressedKeys((prev) => new Set([...prev, e.code]));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isSpecialKey(e.code)) {
        setPressedKeys((prev) => {
          const next = new Set(prev);
          next.delete(e.code);
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
  }, []);

  const getKeyWidth = (keyData: KeyboardKey) => {
    switch (keyData.code) {
      case 'Backspace':
        return 'w-[100px]';
      case 'Tab':
        return 'w-[100px]';
      case 'CapsLock':
        return 'w-[120px]';
      case 'Enter':
        return 'w-[120px]';
      case 'ShiftLeft':
      case 'ShiftRight':
        return 'w-[155px]';
      case 'ControlLeft':
      case 'ControlRight':
      case 'AltLeft':
      case 'AltRight':
      case 'MetaLeft':
      case 'MetaRight':
      case 'Fn':
        return 'w-[84px]';
      case 'Space':
        return 'w-[406px]';
      default:
        return 'w-[65px]';
    }
  };

  const renderKey = (keyData: KeyboardKey) => {
    const isPressed = pressedKeys.has(keyData.code);
    const width = getKeyWidth(keyData);

    return (
      <div
        key={keyData.code}
        className={cn(
          'rounded-md border border-gray-700 px-2 text-center',
          'flex items-center justify-center transition-all duration-100',
          width,
          'h-[60px]',
          isPressed
            ? 'bg-purple-600 text-white shadow-inner'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
          keyData.isSpecial ? 'text-sm' : 'text-base font-medium'
        )}
      >
        {keyData.key}
      </div>
    );
  };

  return (
    <div className="mx-auto w-fit space-y-2 rounded-lg bg-gray-900 p-6 shadow-lg">
      {Object.entries(KEYBOARD_LAYOUT).map(([rowKey, keys]) => (
        <div key={rowKey} className="flex gap-2">
          {keys.map(renderKey)}
        </div>
      ))}
    </div>
  );
}
