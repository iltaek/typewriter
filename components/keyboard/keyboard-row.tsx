import * as React from 'react';
import { type KeyboardKey } from '@/lib/keyboard';
import { Key } from './key';

/**
 * 가상 키보드의 한 행에 대한 Props 인터페이스입니다.
 */
interface KeyboardRowProps {
  /** 해당 행에 포함될 키들의 데이터 배열 */
  keys: KeyboardKey[];
  /** 현재 눌려있는 모든 키의 코드(keyCode)를 담고 있는 Set */
  pressedKeys: Set<string>;
}

/**
 * 가상 키보드의 한 행을 렌더링하는 컴포넌트입니다.
 * 주어진 키 배열(`keys`)을 순회하며 각 키에 대해 `Key` 컴포넌트를 렌더링합니다.
 * React.memo를 사용하여 Props(keys, pressedKeys)가 변경되지 않으면 리렌더링을 방지합니다.
 * @param keys - 해당 행의 키 데이터 배열
 * @param pressedKeys - 현재 눌린 키들의 Set
 */
export const KeyboardRow = React.memo(function KeyboardRow({
  keys,
  pressedKeys,
}: KeyboardRowProps) {
  return (
    // 키들을 가로로 배열하는 flex 컨테이너
    <div className="flex gap-1">
      {/* 키 배열을 순회하며 Key 컴포넌트 렌더링 */}
      {keys.map((keyData) => (
        <Key
          // React 리스트 렌더링을 위한 고유 key prop (키 코드는 고유하다고 가정)
          key={keyData.code}
          // 개별 키 컴포넌트에 필요한 데이터 전달
          keyData={keyData}
          // 현재 키가 눌려있는지 여부를 pressedKeys Set으로 확인하여 전달
          isPressed={pressedKeys.has(keyData.code)}
          // data-code 속성 전달
          data-code={keyData.code}
        />
      ))}
    </div>
  );
});

// React 개발자 도구에서 표시될 이름 설정
KeyboardRow.displayName = 'KeyboardRow';
