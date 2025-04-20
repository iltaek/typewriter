import * as React from 'react';

import { cn } from '@/lib/utils';
import { type KeyboardKey } from '@/schemas/keyboard.schema';

/** 키 코드별 너비 클래스를 정의하는 상수 */
const KEY_WIDTH_CLASSES: Record<string, string> = {
  Backspace: 'w-[88px]',
  Tab: 'w-[87px]',
  CapsLock: 'w-[105px]',
  Enter: 'w-[104px]',
  ShiftLeft: 'w-[134px]',
  ShiftRight: 'w-[134px]',
  ControlLeft: 'w-[68px]',
  ControlRight: 'w-[68px]',
  AltLeft: 'w-[68px]',
  AltRight: 'w-[68px]',
  MetaLeft: 'w-[68px]',
  MetaRight: 'w-[68px]',
  Space: 'w-[400px]',
  DEFAULT: 'w-[58px]', // 기본 너비
};

/**
 * 가상 키보드의 개별 키 컴포넌트 Props 인터페이스입니다.
 */
interface KeyProps {
  /** 해당 키의 데이터 (표시될 문자, 코드, 특수키 여부 등) */
  keyData: KeyboardKey;
  /** 해당 키가 현재 눌려있는지 여부 */
  isPressed: boolean;
  /** 테스트나 특정 식별을 위한 데이터 속성 (선택적) */
  'data-code'?: string;
}

/**
 * 키 데이터(KeyboardKey)를 기반으로 해당 키의 Tailwind CSS 너비 클래스를 반환하는 헬퍼 함수입니다.
 * @param keyData - 너비를 결정할 키의 데이터
 * @returns 키 너비에 해당하는 Tailwind CSS 클래스 문자열
 */
function getKeyWidthClass(keyData: KeyboardKey): string {
  // 상수 객체에서 키 코드에 해당하는 너비 클래스를 찾거나, 없으면 기본값 반환
  return KEY_WIDTH_CLASSES[keyData.code] ?? KEY_WIDTH_CLASSES.DEFAULT;
}

/**
 * 가상 키보드의 개별 키를 렌더링하는 컴포넌트입니다.
 * 키 데이터와 눌림 상태에 따라 스타일이 변경됩니다.
 * React.memo를 사용하여 Props가 변경되지 않으면 리렌더링을 방지합니다.
 * @param keyData - 해당 키의 데이터 객체
 * @param isPressed - 해당 키의 눌림 상태
 * @param dataCode - data-code 속성에 할당될 값 (선택적)
 */
export const Key = React.memo(function Key({
  keyData,
  isPressed,
  'data-code': dataCode,
}: KeyProps) {
  return (
    <div
      data-code={dataCode} // 데이터 속성 설정
      className={cn(
        // 기본 키 스타일
        'h-14 rounded-md border border-gray-200 px-2 text-center',
        'flex items-center justify-center transition-colors duration-100',
        // 키 코드에 따른 너비 클래스 적용 (상수 사용)
        getKeyWidthClass(keyData),
        // 눌림 상태에 따른 스타일 변경
        isPressed
          ? 'bg-primary text-primary-foreground' // 눌렸을 때
          : 'bg-background hover:bg-accent hover:text-accent-foreground', // 기본 상태
        // 특수 키 여부에 따른 스타일 변경
        keyData.isSpecial ? 'text-xs text-muted-foreground' : 'text-sm font-medium',
      )}
    >
      {/* 키에 표시될 문자 */} {keyData.key}
    </div>
  );
});

// React 개발자 도구에서 표시될 이름 설정
Key.displayName = 'Key';
