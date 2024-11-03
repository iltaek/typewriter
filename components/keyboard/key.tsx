import React from 'react';
import { cn } from '@/lib/utils';
import { type KeyboardKey } from '@/lib/keyboard';

interface KeyProps {
  keyData: KeyboardKey;
  isPressed: boolean;
}

export function Key({ keyData, isPressed }: KeyProps) {
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
