'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { KEYBOARD_CONFIGS } from '@/lib/keyboard';
import { useKeyboardStore } from '@/store/keyboard-store';
import { useLayoutStore } from '@/store/layout-store';

import { KeyboardRow } from './keyboard-row';

/**
 * 화면에 가상 키보드를 표시하고, 물리적 키보드 입력에 따라 해당 키의 눌림 상태를 시각적으로 반영하는 컴포넌트입니다.
 * React.memo를 사용하여 불필요한 리렌더링을 방지합니다.
 */
export const VirtualKeyboard = React.memo(function VirtualKeyboard() {
  // Zustand 스토어에서 상태 가져오기
  const layout = useLayoutStore((state) => state.layout);
  const { pressedKeys, registerListeners } = useKeyboardStore();

  // 현재 선택된 레이아웃에 해당하는 키보드 설정 가져오기
  const currentConfig = KEYBOARD_CONFIGS[layout];

  // 컴포넌트 마운트 시 키보드 이벤트 리스너 등록, 언마운트 시 제거
  useEffect(() => {
    // useKeyboardStore의 리스너 등록 함수 호출
    const cleanup = registerListeners();

    // 클린업 함수 반환
    return cleanup;
  }, [registerListeners]);

  return (
    <div className="mx-auto w-fit space-y-1.5 rounded-lg border bg-card p-4 shadow-sm">
      {/* 키보드 설정을 기반으로 각 행(KeyboardRow)을 렌더링 */}
      {Object.entries(currentConfig).map(([rowKey, keys]) => (
        <KeyboardRow key={rowKey} keys={keys} pressedKeys={pressedKeys} />
      ))}
    </div>
  );
});

// React 개발자 도구에서 표시될 이름 설정
VirtualKeyboard.displayName = 'VirtualKeyboard';
