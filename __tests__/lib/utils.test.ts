import { cn } from '@/lib/utils';

describe('cn (className utility)', () => {
  describe('정상 케이스', () => {
    test('단일 클래스명 처리', () => {
      expect(cn('text-red-500')).toBe('text-red-500');
    });

    test('여러 클래스명 병합', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    });

    test('조건부 클래스명 처리', () => {
      expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class');
      expect(cn('base-class', false && 'conditional-class')).toBe('base-class');
    });

    test('TailwindCSS 충돌 클래스 병합', () => {
      // twMerge가 동일한 속성의 클래스를 병합 (마지막 우선)
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
      expect(cn('p-4', 'px-2')).toBe('p-4 px-2'); // padding과 padding-x는 다르므로 유지
    });
  });

  describe('엣지 케이스', () => {
    test('빈 값 처리', () => {
      expect(cn()).toBe('');
      expect(cn('')).toBe('');
      expect(cn(null)).toBe('');
      expect(cn(undefined)).toBe('');
    });

    test('배열 형태 클래스명', () => {
      expect(cn(['text-red-500', 'bg-blue-500'])).toBe('text-red-500 bg-blue-500');
    });

    test('객체 형태 클래스명', () => {
      expect(cn({
        'text-red-500': true,
        'bg-blue-500': false,
        'p-4': true
      })).toBe('text-red-500 p-4');
    });

    test('혼합된 형태의 입력', () => {
      expect(cn(
        'base-class',
        ['array-class-1', 'array-class-2'],
        { 'object-class': true, 'false-class': false },
        'final-class'
      )).toBe('base-class array-class-1 array-class-2 object-class final-class');
    });

    test('중복 클래스명 제거', () => {
      expect(cn('text-red-500', 'text-red-500')).toBe('text-red-500');
    });
  });
});