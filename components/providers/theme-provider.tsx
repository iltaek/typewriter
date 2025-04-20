'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

/**
 * `next-themes` 라이브러리의 `ThemeProvider`를 감싸는 래퍼 컴포넌트입니다.
 * 애플리케이션 전체에 테마(라이트/다크 모드) 기능을 제공합니다.
 * Props는 `next-themes`의 `ThemeProviderProps`를 그대로 받습니다.
 * @param children - ThemeProvider 내부에 렌더링될 자식 요소들
 * @param props - `next-themes`의 ThemeProvider에 전달될 나머지 Props
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // next-themes의 Provider를 사용하여 테마 컨텍스트 제공
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
