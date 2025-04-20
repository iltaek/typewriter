'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from './button';

/**
 * 라이트 모드, 다크 모드, 시스템 설정을 전환하는 버튼 컴포넌트입니다.
 * 현재 테마에 따라 해(Sun), 달(Moon), 모니터(Monitor) 아이콘을 표시합니다.
 * @param className - 버튼에 추가할 Tailwind CSS 클래스 (위치 지정 등)
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getNextTheme = () => {
    if (theme === 'system') return 'light';
    if (theme === 'light') return 'dark';
    return 'system';
  };

  if (!mounted) {
    return <Button variant="ghost" size="icon" className={cn('opacity-0', className)} disabled />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={() => setTheme(getNextTheme())}
      aria-label={`Switch to ${getNextTheme()} mode`}
    >
      <Sun
        className={cn(
          'h-[1.2rem] w-[1.2rem] transition-all',
          resolvedTheme === 'light' && theme === 'light'
            ? 'rotate-0 scale-100'
            : 'rotate-90 scale-0',
        )}
      />
      <Moon
        className={cn(
          'absolute h-[1.2rem] w-[1.2rem] transition-all',
          resolvedTheme === 'dark' && theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0',
        )}
      />
      <Monitor
        className={cn(
          'absolute h-[1.2rem] w-[1.2rem] transition-all',
          theme === 'system' ? 'rotate-0 scale-100' : 'rotate-90 scale-0',
        )}
      />
      <span className="sr-only">Toggle theme (currently {theme})</span>
    </Button>
  );
}
