export type KeyboardKey = {
  key: string;
  code: string;
  width?: string; // 특수 키의 너비를 위한 속성
  isSpecial?: boolean; // Shift, Enter 등 특수 키 여부
};

export const KEYBOARD_LAYOUT = {
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

export const isSpecialKey = (key: string) => {
  return Object.values(KEYBOARD_LAYOUT).some((row) =>
    row.some((k) => k.code === key && k.isSpecial)
  );
};
