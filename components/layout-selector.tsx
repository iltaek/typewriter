'use client';

import React from 'react';
import { type LayoutType } from '@/lib/keyboard';

interface LayoutSelectorProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export function LayoutSelector({ currentLayout, onLayoutChange }: LayoutSelectorProps) {
  const layouts: { value: LayoutType; label: string }[] = [
    { value: 'qwerty', label: 'QWERTY' },
    { value: 'colemak', label: 'Colemak' },
  ];

  return (
    <div className="flex justify-center gap-4">
      {layouts.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onLayoutChange(value)}
          className={`px-4 py-2 rounded-md ${
            currentLayout === value ? 'bg-primary text-primary-foreground' : 'bg-secondary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
