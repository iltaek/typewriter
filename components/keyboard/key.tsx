import * as React from 'react';
import { cn } from '@/lib/utils';
import { type KeyboardKey } from '@/lib/keyboard';

interface KeyProps {
  keyData: KeyboardKey;
  isPressed: boolean;
  'data-code'?: string;
}

export function Key({ keyData, isPressed, 'data-code': dataCode }: KeyProps) {
  return (
    <div
      data-code={dataCode}
      className={cn(
        'h-14 rounded-md border border-gray-200 px-2 text-center',
        'flex items-center justify-center transition-colors duration-100',
        getKeyWidth(keyData),
        isPressed
          ? 'bg-primary text-primary-foreground'
          : 'bg-background hover:bg-accent hover:text-accent-foreground',
        keyData.isSpecial ? 'text-xs text-muted-foreground' : 'text-sm font-medium'
      )}
    >
      {keyData.key}
    </div>
  );
}

function getKeyWidth(keyData: KeyboardKey): string {
  switch (keyData.code) {
    case 'Backspace':
      return 'w-[88px]';
    case 'Tab':
      return 'w-[87px]';
    case 'CapsLock':
      return 'w-[105px]';
    case 'Enter':
      return 'w-[104px]';
    case 'ShiftLeft':
      return 'w-[134px]';
    case 'ShiftRight':
      return 'w-[134px]';
    case 'ControlLeft':
    case 'ControlRight':
    case 'AltLeft':
    case 'AltRight':
    case 'MetaLeft':
    case 'MetaRight':
      return 'w-[68px]';
    case 'Space':
      return 'w-[400px]';
    default:
      return 'w-[58px]';
  }
}
