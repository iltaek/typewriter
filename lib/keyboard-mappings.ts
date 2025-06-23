/**
 * 키보드 키 코드와 문자 간의 매핑 정의
 * QWERTY 레이아웃 기준으로 논리적 키 코드에서 실제 문자로 변환하는 매핑 테이블
 */

/**
 * QWERTY 키 매핑 테이블
 * - Key: 논리적 키 코드 (예: KeyE, Digit1)
 * - Value: [일반 문자, Shift + 문자] 배열
 */
export const QWERTY_KEY_MAPPINGS: Record<string, [string, string]> = {
  // 숫자 행
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

  // 기호 키
  BracketLeft: ['[', '{'],
  BracketRight: [']', '}'],
  Backslash: ['\\', '|'],
  Semicolon: [';', ':'],
  Quote: ["'", '"'],
  Comma: [',', '<'],
  Period: ['.', '>'],
  Slash: ['/', '?'],
  Space: [' ', ' '],

  // 알파벳 키
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
