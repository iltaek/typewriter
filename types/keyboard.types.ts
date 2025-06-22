/**
 * 키보드 관련 타입 정의
 */

// 키보드 키 인터페이스
export interface KeyboardKey {
  key: string;
  code: string;
  isSpecial?: boolean;
}

// 레이아웃 타입
export type LayoutType = 'qwerty' | 'colemak';

// 키보드 레이아웃 인터페이스
export interface KeyboardLayout {
  row1: KeyboardKey[];
  row2: KeyboardKey[];
  row3: KeyboardKey[];
  row4: KeyboardKey[];
  row5: KeyboardKey[];
}

// 키 맵 타입
export type KeyMap = Record<string, string>;