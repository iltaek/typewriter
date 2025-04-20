'use client';

import React from 'react';
import { type LayoutType } from '@/lib/keyboard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * 키보드 레이아웃(QWERTY, Colemak 등)을 선택하는 버튼 그룹을 표시하는 컴포넌트입니다.
 * 사용자가 레이아웃을 선택하면 `onLayoutChange` 콜백 함수를 호출합니다.
 */
interface LayoutSelectorProps {
  /** 현재 선택된 키보드 레이아웃 */
  currentLayout: LayoutType;
  /** 레이아웃 변경 시 호출될 콜백 함수 */
  onLayoutChange: (layout: LayoutType) => void;
}

/** 사용 가능한 키보드 레이아웃 목록 */
const LAYOUTS: { value: LayoutType; label: string }[] = [
  { value: 'qwerty', label: 'QWERTY' },
  { value: 'colemak', label: 'Colemak' },
];

export function LayoutSelector({ currentLayout, onLayoutChange }: LayoutSelectorProps) {
  // 레이아웃 목록을 상수로 분리하여 컴포넌트 외부에서 정의합니다. (개선 예정)
  // const layouts: { value: LayoutType; label: string }[] = [
  //   { value: 'qwerty', label: 'QWERTY' },
  //   { value: 'colemak', label: 'Colemak' },
  // ];

  return (
    <div className="flex justify-center gap-4">
      {LAYOUTS.map(({ value, label }) => {
        const isSelected = currentLayout === value;
        return (
          <Button
            key={value}
            variant={isSelected ? 'default' : 'secondary'}
            onClick={() => onLayoutChange(value)}
            aria-pressed={isSelected}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
