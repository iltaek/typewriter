import * as React from 'react';
import { type KeyboardKey } from '@/lib/keyboard';
import { Key } from './key';

interface KeyboardRowProps {
  keys: KeyboardKey[];
  pressedKeys: Set<string>;
}

export function KeyboardRow({ keys, pressedKeys }: KeyboardRowProps) {
  return (
    <div className="flex gap-1">
      {keys.map((keyData) => (
        <Key
          key={keyData.code}
          keyData={keyData}
          isPressed={pressedKeys.has(keyData.code)}
          data-code={keyData.code}
        />
      ))}
    </div>
  );
}
