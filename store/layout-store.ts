import { create } from 'zustand';

import { type LayoutType } from '@/types/keyboard.types';

// 레이아웃 스토어 상태 인터페이스
interface LayoutState {
  // 현재 선택된 키보드 레이아웃
  layout: LayoutType;
  // 키보드 레이아웃 변경 액션
  setLayout: (layout: LayoutType) => void;
}

// 레이아웃 스토어 생성
export const useLayoutStore = create<LayoutState>()((set) => ({
  // 초기 레이아웃 설정 (qwerty가 기본값)
  layout: 'qwerty',

  // 레이아웃 변경 액션
  setLayout: (layout) => set({ layout }),
}));
