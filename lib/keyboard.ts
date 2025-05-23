import { type KeyboardLayout, type KeyMap, type LayoutType } from '@/schemas/keyboard.schema';

// QWERTY 레이아웃 정의
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
    { key: 'Backspace', code: 'Backspace', isSpecial: true },
  ],
  row2: [
    { key: 'Tab', code: 'Tab', isSpecial: true },
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
    { key: '\\', code: 'Backslash' },
  ],
  row3: [
    { key: 'Caps', code: 'CapsLock', isSpecial: true },
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
    { key: 'Enter', code: 'Enter', isSpecial: true },
  ],
  row4: [
    { key: 'Shift', code: 'ShiftLeft', isSpecial: true },
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
    { key: 'Shift', code: 'ShiftRight', isSpecial: true },
  ],
  row5: [
    { key: 'Ctrl', code: 'ControlLeft', isSpecial: true },
    { key: 'Alt', code: 'AltLeft', isSpecial: true },
    { key: 'Meta', code: 'MetaLeft', isSpecial: true },
    { key: 'Space', code: 'Space' },
    { key: 'Alt', code: 'AltRight', isSpecial: true },
    { key: 'Meta', code: 'MetaRight', isSpecial: true },
    { key: 'Fn', code: 'FnRight', isSpecial: true },
    { key: 'Ctrl', code: 'ControlRight', isSpecial: true },
  ],
};

// Colemak 레이아웃 정의
export const COLEMAK_LAYOUT: KeyboardLayout = {
  row1: QWERTY_LAYOUT.row1,
  row2: [
    { key: 'Tab', code: 'Tab', isSpecial: true },
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
    { key: 'Caps', code: 'CapsLock', isSpecial: true },
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
    { key: 'Enter', code: 'Enter', isSpecial: true },
  ],
  row4: [
    { key: 'Shift', code: 'ShiftLeft', isSpecial: true },
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
    { key: 'Shift', code: 'ShiftRight', isSpecial: true },
  ],
  row5: QWERTY_LAYOUT.row5,
};

// 키보드 설정
export const KEYBOARD_CONFIGS: Record<LayoutType, KeyboardLayout> = {
  qwerty: QWERTY_LAYOUT,
  colemak: COLEMAK_LAYOUT,
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
  Object.entries(QWERTY_TO_COLEMAK).map(([key, value]) => [value, key]),
);

// 키 매핑 함수
export const remapKey = (code: string, fromLayout: LayoutType, toLayout: LayoutType): string => {
  if (fromLayout === toLayout) return code;

  const mapping = fromLayout === 'qwerty' ? QWERTY_TO_COLEMAK : COLEMAK_TO_QWERTY;
  return mapping[code] || code;
};

// 키 코드에 해당하는 문자 반환 (수정됨)
export const getCharacterFromKeyCode = (
  code: string, // 물리적 키 코드 (예: KeyE)
  layout: LayoutType,
  isShift: boolean = false,
): string => {
  // QWERTY 기준 키 매핑 (확장됨) - 논리적 키 코드 -> 문자 매핑으로 사용
  const qwertyKeyMappings: Record<string, [string, string]> = {
    Backquote: ['`', '~'],
    Digit1: ['1', '!'],
    Digit2: ['2', '@'],
    Digit3: ['3', '#'],
    Digit4: ['4', '$'],
    Digit5: ['5', '%'],
    Digit6: ['6', '^'],
    Digit7: ['7', '&'],
    Digit8: ['8', '*'],
    Digit9: ['9', '('],
    Digit0: ['0', ')'],
    Minus: ['-', '_'],
    Equal: ['=', '+'],
    BracketLeft: ['[', '{'],
    BracketRight: [']', '}'],
    Backslash: ['\\', '|'],
    Semicolon: [';', ':'],
    Quote: ["'", '"'],
    Comma: [',', '<'],
    Period: ['.', '>'],
    Slash: ['/', '?'],
    Space: [' ', ' '],
    KeyA: ['a', 'A'],
    KeyB: ['b', 'B'],
    KeyC: ['c', 'C'],
    KeyD: ['d', 'D'],
    KeyE: ['e', 'E'],
    KeyF: ['f', 'F'],
    KeyG: ['g', 'G'],
    KeyH: ['h', 'H'],
    KeyI: ['i', 'I'],
    KeyJ: ['j', 'J'],
    KeyK: ['k', 'K'],
    KeyL: ['l', 'L'],
    KeyM: ['m', 'M'],
    KeyN: ['n', 'N'],
    KeyO: ['o', 'O'],
    KeyP: ['p', 'P'],
    KeyQ: ['q', 'Q'],
    KeyR: ['r', 'R'],
    KeyS: ['s', 'S'],
    KeyT: ['t', 'T'],
    KeyU: ['u', 'U'],
    KeyV: ['v', 'V'],
    KeyW: ['w', 'W'],
    KeyX: ['x', 'X'],
    KeyY: ['y', 'Y'],
    KeyZ: ['z', 'Z'],
  };

  // 1. 물리적으로 눌린 키가 특수 키인지 확인
  const layoutConfig = KEYBOARD_CONFIGS[layout];

  // for...of 구문을 find 메서드로 리팩토링
  const physicalKeyData = Object.values(layoutConfig)
    .flatMap((row) => row)
    .find((key) => key.code === code);

  // 특수 키(Shift, Ctrl 등)이면 빈 문자열 반환 (스페이스는 제외)
  if (physicalKeyData?.isSpecial) {
    return '';
  }
  // 스페이스바는 여기서 처리
  if (code === 'Space') return ' ';

  // 2. 선택된 레이아웃의 논리적 키 코드 결정
  const logicalCode = layout === 'colemak' ? remapKey(code, 'qwerty', 'colemak') : code;

  // 3. 논리적 키 코드를 사용하여 문자 매핑 찾기
  const keyMapEntry = qwertyKeyMappings[logicalCode];

  // 4. 매핑된 문자가 없으면 빈 문자열 반환
  if (!keyMapEntry) {
    return '';
  }

  // 5. Shift 상태에 따라 올바른 문자 반환
  return keyMapEntry[isShift ? 1 : 0];
};
