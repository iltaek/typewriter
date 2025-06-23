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

/**
 * Dvorak 키 매핑 테이블
 * - Key: 물리적 키 코드 (예: KeyE, Digit1)
 * - Value: [일반 문자, Shift + 문자] 배열
 * - 물리적 키 위치에서 Dvorak 레이아웃의 문자로 직접 매핑
 */
export const DVORAK_KEY_MAPPINGS: Record<string, [string, string]> = {
  // 숫자 행 (QWERTY와 동일)
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
  Minus: ['[', '{'],
  Equal: [']', '}'],

  // 상단 행 (Dvorak 배치)
  KeyQ: ["'", '"'],  // Q 위치 → 따옴표
  KeyW: [',', '<'],  // W 위치 → 쉼표
  KeyE: ['.', '>'],  // E 위치 → 마침표
  KeyR: ['p', 'P'],  // R 위치 → P
  KeyT: ['y', 'Y'],  // T 위치 → Y
  KeyY: ['f', 'F'],  // Y 위치 → F
  KeyU: ['g', 'G'],  // U 위치 → G
  KeyI: ['c', 'C'],  // I 위치 → C
  KeyO: ['r', 'R'],  // O 위치 → R
  KeyP: ['l', 'L'],  // P 위치 → L
  BracketLeft: ['/', '?'],
  BracketRight: ['=', '+'],
  Backslash: ['\\', '|'],

  // 중간 행 (Dvorak 배치)
  KeyA: ['a', 'A'],  // A 위치 → A (동일)
  KeyS: ['o', 'O'],  // S 위치 → O
  KeyD: ['e', 'E'],  // D 위치 → E
  KeyF: ['u', 'U'],  // F 위치 → U
  KeyG: ['i', 'I'],  // G 위치 → I
  KeyH: ['d', 'D'],  // H 위치 → D
  KeyJ: ['h', 'H'],  // J 위치 → H
  KeyK: ['t', 'T'],  // K 위치 → T
  KeyL: ['n', 'N'],  // L 위치 → N
  Semicolon: ['s', 'S'],  // ; 위치 → S
  Quote: ['-', '_'],
  
  // 하단 행 (Dvorak 배치)
  KeyZ: [';', ':'],  // Z 위치 → 세미콜론
  KeyX: ['q', 'Q'],  // X 위치 → Q
  KeyC: ['j', 'J'],  // C 위치 → J
  KeyV: ['k', 'K'],  // V 위치 → K
  KeyB: ['x', 'X'],  // B 위치 → X
  KeyN: ['b', 'B'],  // N 위치 → B
  KeyM: ['m', 'M'],  // M 위치 → M (동일)
  Comma: ['w', 'W'],  // , 위치 → W
  Period: ['v', 'V'], // . 위치 → V
  Slash: ['z', 'Z'],  // / 위치 → Z

  Space: [' ', ' '],
};
