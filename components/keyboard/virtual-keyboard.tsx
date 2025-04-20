'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { KEYBOARD_CONFIGS, remapKey, type KeyboardKey, type LayoutType } from '@/lib/keyboard';
import { KeyboardRow } from './keyboard-row';

/**
 * 가상 키보드 컴포넌트의 Props 인터페이스입니다.
 */
interface VirtualKeyboardProps {
  /** 표시할 키보드 레이아웃 타입 (예: 'qwerty', 'colemak') */
  layout: LayoutType;
}

/**
 * 화면에 가상 키보드를 표시하고, 물리적 키보드 입력에 따라 해당 키의 눌림 상태를 시각적으로 반영하는 컴포넌트입니다.
 * React.memo를 사용하여 Props(layout)가 변경되지 않으면 리렌더링을 방지합니다.
 * @param layout - 표시할 키보드 레이아웃 타입
 */
export const VirtualKeyboard = React.memo(function VirtualKeyboard({
  layout,
}: VirtualKeyboardProps) {
  // 눌린 키의 코드(keyCode)를 저장하는 Set 상태
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  // 현재 선택된 레이아웃에 해당하는 키보드 설정 가져오기
  const currentConfig = KEYBOARD_CONFIGS[layout];

  /**
   * 키보드 이벤트(keydown, keyup)를 처리하는 콜백 함수입니다.
   * 눌리거나 떼어진 키를 remapKey 함수를 통해 현재 레이아웃에 맞게 변환하고,
   * 특수 키가 아닌 경우 pressedKeys 상태를 업데이트합니다.
   * @param e - 키보드 이벤트 객체
   * @param action - 이벤트 타입 ('press' 또는 'release')
   */
  const handleKeyEvent = useCallback(
    (e: KeyboardEvent, action: 'press' | 'release') => {
      // 물리적 키 코드(e.code)를 현재 가상 키보드 레이아웃에 맞게 변환
      const mappedKeyCode = remapKey(e.code, 'qwerty', layout);

      // 변환된 키 코드가 특수 키(Shift, Ctrl 등)인지 확인
      const isSpecialKey = Object.values(currentConfig).some((row) =>
        row.some((key: KeyboardKey) => key.code === mappedKeyCode && key.isSpecial)
      );

      // 특수 키가 아닌 경우에만 상태 업데이트
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
    [currentConfig, layout] // currentConfig나 layout이 변경될 때만 함수 재생성
  );

  // 컴포넌트 마운트 시 window에 keydown/keyup 이벤트 리스너 등록, 언마운트 시 제거
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyEvent(e, 'press');
    const handleKeyUp = (e: KeyboardEvent) => handleKeyEvent(e, 'release');

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyEvent]); // handleKeyEvent 함수가 변경될 때만 effect 재실행

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
