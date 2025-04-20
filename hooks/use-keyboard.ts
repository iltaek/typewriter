import { useState, useCallback, useEffect } from 'react';

import { remapKey, getCharacterFromKeyCode } from '@/lib/keyboard';
import { type LayoutType } from '@/schemas/keyboard.schema';

interface UseKeyboardProps {
  layout: LayoutType;
  onKeyPress?: (char: string) => void;
}

export function useKeyboard({ layout, onKeyPress }: UseKeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handleKeyEvent = useCallback(
    (e: KeyboardEvent, action: 'press' | 'release') => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      const mappedKeyCode = remapKey(e.code, 'qwerty', layout);

      if (action === 'press') {
        if (e.key.length === 1) {
          if (layout === 'qwerty') {
            onKeyPress?.(e.key);
          } else {
            const char = getCharacterFromKeyCode(mappedKeyCode, layout, e.shiftKey);
            if (char) onKeyPress?.(char);
          }
        }
      }

      setPressedKeys((prev) => {
        const next = new Set(prev);
        if (action === 'press') {
          next.add(mappedKeyCode);
        } else {
          next.delete(mappedKeyCode);
        }
        return next;
      });
    },
    [layout, onKeyPress]
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

  return { pressedKeys };
}
