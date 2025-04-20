import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// cva를 사용하여 버튼의 다양한 스타일 variant 정의
const buttonVariants = cva(
  // 기본 버튼 스타일
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      // 버튼 종류 (variant)
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      // 버튼 크기 (size)
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    // 기본 variant 설정
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// 버튼 컴포넌트 Props 인터페이스
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 자식 요소를 버튼으로 렌더링할지 여부 (Radix Slot 사용) */
  asChild?: boolean;
}

/**
 * ShadCN UI의 Button 컴포넌트입니다.
 * 다양한 variant와 size를 가지며, `asChild` prop을 통해 유연한 사용이 가능합니다.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // asChild prop이 true이면 Slot 컴포넌트 사용, 아니면 기본 button 태그 사용
    const Comp = asChild ? Slot : 'button';
    return (
      // cva로 정의된 스타일에 추가 className을 적용하여 렌더링
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
// React 개발자 도구에서 표시될 이름 설정
Button.displayName = 'Button';

// Button 컴포넌트와 variant 정의를 export
export { Button, buttonVariants };
