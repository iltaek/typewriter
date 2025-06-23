import { type KeyboardLayout, type KeyMap, type LayoutType } from '@/types/keyboard.types';

import { QWERTY_KEY_MAPPINGS, DVORAK_KEY_MAPPINGS } from './keyboard-mappings';

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

// Dvorak 레이아웃 정의
export const DVORAK_LAYOUT: KeyboardLayout = {
  row1: QWERTY_LAYOUT.row1, // 숫자 행은 동일
  row2: [
    { key: 'Tab', code: 'Tab', isSpecial: true },
    { key: "'", code: 'KeyQ' },
    { key: ',', code: 'KeyW' },
    { key: '.', code: 'KeyE' },
    { key: 'P', code: 'KeyR' },
    { key: 'Y', code: 'KeyT' },
    { key: 'F', code: 'KeyY' },
    { key: 'G', code: 'KeyU' },
    { key: 'C', code: 'KeyI' },
    { key: 'R', code: 'KeyO' },
    { key: 'L', code: 'KeyP' },
    { key: '/', code: 'BracketLeft' },
    { key: '=', code: 'BracketRight' },
    { key: '\\', code: 'Backslash' },
  ],
  row3: [
    { key: 'Caps', code: 'CapsLock', isSpecial: true },
    { key: 'A', code: 'KeyA' },
    { key: 'O', code: 'KeyS' },
    { key: 'E', code: 'KeyD' },
    { key: 'U', code: 'KeyF' },
    { key: 'I', code: 'KeyG' },
    { key: 'D', code: 'KeyH' },
    { key: 'H', code: 'KeyJ' },
    { key: 'T', code: 'KeyK' },
    { key: 'N', code: 'KeyL' },
    { key: 'S', code: 'Semicolon' },
    { key: '-', code: 'Quote' },
    { key: 'Enter', code: 'Enter', isSpecial: true },
  ],
  row4: [
    { key: 'Shift', code: 'ShiftLeft', isSpecial: true },
    { key: ';', code: 'KeyZ' },
    { key: 'Q', code: 'KeyX' },
    { key: 'J', code: 'KeyC' },
    { key: 'K', code: 'KeyV' },
    { key: 'X', code: 'KeyB' },
    { key: 'B', code: 'KeyN' },
    { key: 'M', code: 'KeyM' },
    { key: 'W', code: 'Comma' },
    { key: 'V', code: 'Period' },
    { key: 'Z', code: 'Slash' },
    { key: 'Shift', code: 'ShiftRight', isSpecial: true },
  ],
  row5: QWERTY_LAYOUT.row5,
};

// 키보드 설정
export const KEYBOARD_CONFIGS: Record<LayoutType, KeyboardLayout> = {
  qwerty: QWERTY_LAYOUT,
  dvorak: DVORAK_LAYOUT,
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

  // QWERTY와 Colemak 간 매핑
  if (fromLayout === 'qwerty' && toLayout === 'colemak') {
    return QWERTY_TO_COLEMAK[code] || code;
  }
  if (fromLayout === 'colemak' && toLayout === 'qwerty') {
    return COLEMAK_TO_QWERTY[code] || code;
  }

  // Dvorak은 직접 매핑을 사용하므로 키 코드 변환 불필요
  return code;
};

// 키 코드에 해당하는 문자 반환 (수정됨)
/**
 * 물리적 키 코드가 특수 키인지 확인하는 함수
 * @param code 물리적 키 코드 (예: KeyE, Escape)
 * @param layout 현재 키보드 레이아웃
 * @returns 특수 키이면 true, 일반 키이면 false
 */
const isSpecialKey = (code: string, layout: LayoutType): boolean => {
  const layoutConfig = KEYBOARD_CONFIGS[layout];

  const physicalKeyData = Object.values(layoutConfig)
    .flatMap((row) => row)
    .find((key) => key.code === code);

  return physicalKeyData?.isSpecial ?? false;
};

/**
 * 물리적 키 코드를 현재 레이아웃에 맞는 논리적 키 코드로 변환하는 함수
 * @param code 물리적 키 코드
 * @param layout 현재 키보드 레이아웃
 * @returns 논리적 키 코드
 */
const getLogicalKeyCode = (code: string, layout: LayoutType): string => {
  if (layout === 'colemak') {
    return remapKey(code, 'qwerty', 'colemak');
  }
  // Dvorak과 QWERTY는 물리적 키 코드를 그대로 사용
  return code;
};

/**
 * 논리적 키 코드와 Shift 상태를 기반으로 실제 문자를 반환하는 함수
 * @param logicalCode 논리적 키 코드
 * @param layout 현재 키보드 레이아웃 
 * @param isShift Shift 키가 눌렸는지 여부
 * @returns 해당하는 문자, 매핑이 없으면 빈 문자열
 */
const mapKeyToCharacter = (logicalCode: string, layout: LayoutType, isShift: boolean): string => {
  // Dvorak 레이아웃은 자체 매핑 테이블 사용
  if (layout === 'dvorak') {
    const keyMapEntry = DVORAK_KEY_MAPPINGS[logicalCode];
    if (!keyMapEntry) {
      return '';
    }
    return keyMapEntry[isShift ? 1 : 0];
  }
  
  // QWERTY 및 Colemak은 QWERTY 매핑 테이블 사용
  const keyMapEntry = QWERTY_KEY_MAPPINGS[logicalCode];
  if (!keyMapEntry) {
    return '';
  }
  return keyMapEntry[isShift ? 1 : 0];
};

/**
 * 물리적 키 코드를 현재 레이아웃과 Shift 상태에 따라 실제 문자로 변환하는 함수
 * @param code 물리적 키 코드 (예: KeyE, Digit1)
 * @param layout 현재 키보드 레이아웃 (qwerty, dvorak, colemak)
 * @param isShift Shift 키가 눌렸는지 여부
 * @returns 해당하는 문자, 특수 키이거나 매핑이 없으면 빈 문자열
 */
export const getCharacterFromKeyCode = (
  code: string,
  layout: LayoutType,
  isShift: boolean = false,
): string => {
  // 1. 특수 키 확인 (Shift, Ctrl, Tab 등)
  if (isSpecialKey(code, layout)) {
    return '';
  }

  // 2. 스페이스바 특별 처리
  if (code === 'Space') {
    return ' ';
  }

  // 3. 물리적 키 코드를 논리적 키 코드로 변환
  const logicalCode = getLogicalKeyCode(code, layout);

  // 4. 논리적 키 코드를 실제 문자로 매핑
  return mapKeyToCharacter(logicalCode, layout, isShift);
};
