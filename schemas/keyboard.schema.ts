import { z } from 'zod';

/**
 * 키보드 관련 타입과 스키마 정의
 */

// 키보드 키 스키마
export const keyboardKeySchema = z.object({
  key: z.string(),
  code: z.string(),
  isSpecial: z.boolean().optional(),
});

// 레이아웃 타입 스키마
export const layoutTypeSchema = z.enum(['qwerty', 'colemak']);

// 키보드 레이아웃 스키마
export const keyboardLayoutSchema = z.object({
  row1: z.array(keyboardKeySchema),
  row2: z.array(keyboardKeySchema),
  row3: z.array(keyboardKeySchema),
  row4: z.array(keyboardKeySchema),
  row5: z.array(keyboardKeySchema),
});

// 키 맵 스키마
export const keyMapSchema = z.record(z.string(), z.string());

// 타입 추론
export type KeyboardKey = z.infer<typeof keyboardKeySchema>;
export type LayoutType = z.infer<typeof layoutTypeSchema>;
export type KeyboardLayout = z.infer<typeof keyboardLayoutSchema>;
export type KeyMap = z.infer<typeof keyMapSchema>;

// 키보드 상태 스키마
export const keyboardStateSchema = z.object({
  activeKeys: z.array(z.string()),
  shiftPressed: z.boolean(),
  capsLocked: z.boolean(),
});

export type KeyboardState = z.infer<typeof keyboardStateSchema>;
