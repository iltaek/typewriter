'use client';

import React from 'react';
import { type LayoutType } from '@/schemas/keyboard.schema';
import { Button } from '@/components/ui/button';
import { useLayoutStore } from '@/store/layout-store';

/**
 * 키보드 레이아웃(QWERTY, Colemak 등)을 선택하는 버튼 그룹을 표시하는 컴포넌트입니다.
 * 사용자가 레이아웃을 선택하면 레이아웃 스토어의 setLayout을 호출합니다.
 */
export function LayoutSelector() {
  // Zustand 스토어에서 layout 상태와 setLayout 액션 가져오기
  const { layout, setLayout } = useLayoutStore();

  /** 사용 가능한 키보드 레이아웃 목록 */
  const LAYOUTS: { value: LayoutType; label: string }[] = [
    { value: 'qwerty', label: 'QWERTY' },
    { value: 'colemak', label: 'Colemak' },
  ];

  return (
    <div className="flex justify-center gap-4">
      {LAYOUTS.map(({ value, label }) => {
        const isSelected = layout === value;
        return (
          <Button
            key={value}
            variant={isSelected ? 'default' : 'secondary'}
            onClick={() => setLayout(value)}
            aria-pressed={isSelected}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
