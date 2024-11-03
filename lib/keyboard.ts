export type KeyboardKey = {
  key: string;
  code: string;
  width?: string;
  isSpecial?: boolean;
};

export type KeyboardLayout = {
  row1: KeyboardKey[];
  row2: KeyboardKey[];
  row3: KeyboardKey[];
  row4: KeyboardKey[];
  row5: KeyboardKey[];
};

export const QWERTY_LAYOUT: KeyboardLayout = {
  row1: [
    { key: '`', code: 'Backquote' },
    { key: '1', code: 'Digit1' },
    { key: '2', code: 'Digit2' },
    { key: '3', code: 'Digit3' },
    { key: '4', code: 'Digit4' },
    { key: '5', code: 'Digit5' },
    { key: '6', code: 'Digit6' },
    { key: '7', code: 'Digit7' },
    { key: '8', code: 'Digit8' },
    { key: '9', code: 'Digit9' },
    { key: '0', code: 'Digit0' },
    { key: '-', code: 'Minus' },
    { key: '=', code: 'Equal' },
    { key: 'Backspace', code: 'Backspace', width: 'w-[2rem]', isSpecial: true },
  ],
  row2: [
    { key: 'Tab', code: 'Tab', width: 'w-[1.5rem]', isSpecial: true },
    { key: 'Q', code: 'KeyQ' },
    { key: 'W', code: 'KeyW' },
    { key: 'E', code: 'KeyE' },
    { key: 'R', code: 'KeyR' },
    { key: 'T', code: 'KeyT' },
    { key: 'Y', code: 'KeyY' },
    { key: 'U', code: 'KeyU' },
    { key: 'I', code: 'KeyI' },
    { key: 'O', code: 'KeyO' },
    { key: 'P', code: 'KeyP' },
    { key: '[', code: 'BracketLeft' },
    { key: ']', code: 'BracketRight' },
    { key: '\\', code: 'Backslash', width: 'w-[1.5rem]' },
  ],
  row3: [
    { key: 'Caps', code: 'CapsLock', width: 'w-[1.75rem]', isSpecial: true },
    { key: 'A', code: 'KeyA' },
    { key: 'S', code: 'KeyS' },
    { key: 'D', code: 'KeyD' },
    { key: 'F', code: 'KeyF' },
    { key: 'G', code: 'KeyG' },
    { key: 'H', code: 'KeyH' },
    { key: 'J', code: 'KeyJ' },
    { key: 'K', code: 'KeyK' },
    { key: 'L', code: 'KeyL' },
    { key: ';', code: 'Semicolon' },
    { key: "'", code: 'Quote' },
    { key: 'Enter', code: 'Enter', width: 'w-[2.25rem]', isSpecial: true },
  ],
  row4: [
    { key: 'Shift', code: 'ShiftLeft', width: 'w-[2.25rem]', isSpecial: true },
    { key: 'Z', code: 'KeyZ' },
    { key: 'X', code: 'KeyX' },
    { key: 'C', code: 'KeyC' },
    { key: 'V', code: 'KeyV' },
    { key: 'B', code: 'KeyB' },
    { key: 'N', code: 'KeyN' },
    { key: 'M', code: 'KeyM' },
    { key: ',', code: 'Comma' },
    { key: '.', code: 'Period' },
    { key: '/', code: 'Slash' },
    { key: 'Shift', code: 'ShiftRight', width: 'w-[2.75rem]', isSpecial: true },
  ],
  row5: [
    { key: 'Ctrl', code: 'ControlLeft', width: 'w-[1.25rem]', isSpecial: true },
    { key: 'Alt', code: 'AltLeft', width: 'w-[1.25rem]', isSpecial: true },
    { key: 'Meta', code: 'MetaLeft', width: 'w-[1.25rem]', isSpecial: true },
    { key: 'Space', code: 'Space', width: 'w-[6.25rem]', isSpecial: true },
    { key: 'Meta', code: 'MetaRight', width: 'w-[1.25rem]', isSpecial: true },
    { key: 'Alt', code: 'AltRight', width: 'w-[1.25rem]', isSpecial: true },
    { key: 'Ctrl', code: 'ControlRight', width: 'w-[1.25rem]', isSpecial: true },
    { key: 'Fn', code: 'Fn', width: 'w-[1.25rem]', isSpecial: true },
  ],
};

export const COLEMAK_LAYOUT: KeyboardLayout = {
  row1: QWERTY_LAYOUT.row1,
  row2: [
    { key: 'Tab', code: 'Tab', width: 'w-16', isSpecial: true },
    { key: 'Q', code: 'KeyQ' },
    { key: 'W', code: 'KeyW' },
    { key: 'F', code: 'KeyF' },
    { key: 'P', code: 'KeyP' },
    { key: 'G', code: 'KeyG' },
    { key: 'J', code: 'KeyJ' },
    { key: 'L', code: 'KeyL' },
    { key: 'U', code: 'KeyU' },
    { key: 'Y', code: 'KeyY' },
    { key: ';', code: 'Semicolon' },
    { key: '[', code: 'BracketLeft' },
    { key: ']', code: 'BracketRight' },
    { key: '\\', code: 'Backslash' },
  ],
  row3: [
    { key: 'Caps', code: 'CapsLock', width: 'w-[4.5rem]', isSpecial: true },
    { key: 'A', code: 'KeyA' },
    { key: 'R', code: 'KeyR' },
    { key: 'S', code: 'KeyS' },
    { key: 'T', code: 'KeyT' },
    { key: 'D', code: 'KeyD' },
    { key: 'H', code: 'KeyH' },
    { key: 'N', code: 'KeyN' },
    { key: 'E', code: 'KeyE' },
    { key: 'I', code: 'KeyI' },
    { key: 'O', code: 'KeyO' },
    { key: "'", code: 'Quote' },
    { key: 'Enter', code: 'Enter', width: 'w-[4.5rem]', isSpecial: true },
  ],
  row4: [
    { key: 'Shift', code: 'ShiftLeft', width: 'w-[5.5rem]', isSpecial: true },
    { key: 'Z', code: 'KeyZ' },
    { key: 'X', code: 'KeyX' },
    { key: 'C', code: 'KeyC' },
    { key: 'V', code: 'KeyV' },
    { key: 'B', code: 'KeyB' },
    { key: 'K', code: 'KeyK' },
    { key: 'M', code: 'KeyM' },
    { key: ',', code: 'Comma' },
    { key: '.', code: 'Period' },
    { key: '/', code: 'Slash' },
    { key: 'Shift', code: 'ShiftRight', width: 'w-[5.5rem]', isSpecial: true },
  ],
  row5: QWERTY_LAYOUT.row5,
};

export type LayoutType = 'qwerty' | 'colemak';

export const LAYOUTS: Record<LayoutType, KeyboardLayout> = {
  qwerty: QWERTY_LAYOUT,
  colemak: COLEMAK_LAYOUT,
};

export const isSpecialKey = (key: string) => {
  return Object.values(LAYOUTS).some(
    (layout) =>
      layout.row1.some((k) => k.code === key && k.isSpecial) ||
      layout.row2.some((k) => k.code === key && k.isSpecial) ||
      layout.row3.some((k) => k.code === key && k.isSpecial) ||
      layout.row4.some((k) => k.code === key && k.isSpecial) ||
      layout.row5.some((k) => k.code === key && k.isSpecial)
  );
};

// 키 매핑을 위한 타입 정의
export type KeyMap = {
  [key: string]: string;
};

// QWERTY에서 Colemak으로의 매핑
export const QWERTY_TO_COLEMAK: KeyMap = {
  KeyE: 'KeyF',
  KeyR: 'KeyP',
  KeyT: 'KeyG',
  KeyY: 'KeyJ',
  KeyU: 'KeyL',
  KeyI: 'KeyU',
  KeyO: 'KeyY',
  KeyP: 'Semicolon',
  KeyS: 'KeyR',
  KeyD: 'KeyS',
  KeyF: 'KeyT',
  KeyG: 'KeyD',
  KeyJ: 'KeyN',
  KeyK: 'KeyE',
  KeyL: 'KeyI',
  Semicolon: 'KeyO',
  KeyN: 'KeyK',
};

// Colemak에서 QWERTY로의 매핑
export const COLEMAK_TO_QWERTY: KeyMap = Object.fromEntries(
  Object.entries(QWERTY_TO_COLEMAK).map(([key, value]) => [value, key])
);

// 현재 레이아웃에 따라 키 코드를 변환하는 함수
export const mapKeyCode = (
  keyCode: string,
  fromLayout: LayoutType,
  toLayout: LayoutType
): string => {
  if (fromLayout === toLayout) return keyCode;

  const mapping = fromLayout === 'qwerty' ? QWERTY_TO_COLEMAK : COLEMAK_TO_QWERTY;
  return mapping[keyCode] || keyCode;
};
