import { create } from 'zustand';

import { remapKey, getCharacterFromKeyCode } from '@/lib/keyboard';

import { useLayoutStore } from './layout-store';

// 키보드 스토어 상태 인터페이스
interface KeyboardState {
  // 현재 눌린 키들의 집합
  pressedKeys: Set<string>;
  // 키 이벤트 처리 함수
  handleKeyDown: (e: KeyboardEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
  // 키보드 이벤트 리스너 등록 함수
  registerListeners: () => () => void;
  // 키 입력 핸들러(옵션)
  onKeyPress?: (char: string) => void;
  // 키 입력 핸들러 설정 함수
  setOnKeyPress: (callback?: (char: string) => void) => void;
}

export const useKeyboardStore = create<KeyboardState>()((set, get) => ({
  // 초기 상태: 눌린 키 없음
  pressedKeys: new Set<string>(),
  onKeyPress: undefined,

  // 키 입력 핸들러 설정
  setOnKeyPress: (callback) => set({ onKeyPress: callback }),

  // 키 다운 이벤트 처리
  handleKeyDown: (e: KeyboardEvent) => {
    // 현재 선택된 레이아웃 가져오기
    const { layout } = useLayoutStore.getState();

    // 특수 키 조합 무시 (Alt, Ctrl, Meta(Command))
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    // 물리적 키 코드를 현재 레이아웃에 맞게 변환
    const mappedKeyCode = remapKey(e.code, 'qwerty', layout);

    // 일반 문자 키인 경우 콜백 호출
    if (e.key.length === 1) {
      const { onKeyPress } = get();

      if (layout === 'qwerty') {
        onKeyPress?.(e.key);
      } else {
        const char = getCharacterFromKeyCode(mappedKeyCode, layout, e.shiftKey);
        if (char) onKeyPress?.(char);
      }
    }

    // 눌린 키 상태 업데이트
    set((state) => {
      const newPressedKeys = new Set(state.pressedKeys);
      newPressedKeys.add(mappedKeyCode);
      return { pressedKeys: newPressedKeys };
    });
  },

  // 키 업 이벤트 처리
  handleKeyUp: (e: KeyboardEvent) => {
    // 현재 선택된 레이아웃 가져오기
    const { layout } = useLayoutStore.getState();

    // 물리적 키 코드를 현재 레이아웃에 맞게 변환
    const mappedKeyCode = remapKey(e.code, 'qwerty', layout);

    // 눌린 키 상태에서 제거
    set((state) => {
      const newPressedKeys = new Set(state.pressedKeys);
      newPressedKeys.delete(mappedKeyCode);
      return { pressedKeys: newPressedKeys };
    });
  },

  // 키보드 이벤트 리스너 등록 및 해제 함수
  registerListeners: () => {
    const { handleKeyDown, handleKeyUp } = get();

    // 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 클린업 함수 반환: 컴포넌트 언마운트 시 호출됨
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  },
}));
