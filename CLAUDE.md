# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeWriter is a typing practice web application built with Next.js 14, TypeScript, TailwindCSS, and Zustand. It features real-time typing statistics, virtual keyboard visualization, and support for multiple keyboard layouts (QWERTY, Dvorak, Colemak).

## Development Commands

### Build and Development

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code linting
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Package Management

- Use `npm` as the package manager (not yarn or pnpm)
- Use `npx shadcn@latest add [componentName]` to add ShadCN UI components

## Architecture Overview

The application follows a modular architecture with clear separation of concerns:

### State Management (Zustand)

- **TypingStore** (store/typing-store.ts): Manages typing state, word progression, statistics, and keyboard event handling
- **KeyboardStore** (store/keyboard-store.ts): Tracks pressed keys and visual keyboard state
- **LayoutStore** (store/layout-store.ts): Manages keyboard layout selection

### Core Components

- **TypingPractice** (components/typing-practice.tsx): Main container component
- **WordDisplay** (components/typing/word-display.tsx): Displays words and handles typing input with real-time color feedback
- **VirtualKeyboard** (components/keyboard/virtual-keyboard.tsx): Visual keyboard that syncs with physical input
- **LayoutSelector** (components/layout-selector.tsx): Keyboard layout switcher

### Utility Libraries

- **lib/typing-stats.ts**: WPM and accuracy calculations
- **lib/words.ts**: Word generation and management
- **lib/keyboard.ts**: Keyboard layout definitions and mappings
- **lib/typing-colors.ts**: Character color feedback logic

### Type System

Types are organized in the types/ directory:

- **typing.types.ts**: Typing statistics and word count constants
- **word.types.ts**: Word state and character status
- **keyboard.types.ts**: Keyboard layouts and key mappings
- **common.types.ts**: Shared utility types

## Key Architectural Patterns

### Event Flow

1. User keyboard input → KeyboardStore.handleKeyDown()
2. TypingStore.handleTypingKeyDown() processes input
3. Character mapping via LayoutStore.layout
4. Word state update and statistics calculation
5. Component re-rendering with visual feedback

### Color Feedback System

Characters are colored in real-time:

- Green: Correct input
- Red: Incorrect input
- Gray: Not yet typed

### Statistics Calculation

- **WPM**: (correct characters / 5) / time in minutes
- **Accuracy**: (correct characters / total characters) × 100

## Development Guidelines

### Component Creation

- Prioritize ShadCN UI components for all UI elements
- Use TypeScript for all components and logic
- Follow existing patterns for store integration

### Code Style

- Korean comments in code for context
- Comprehensive JSDoc documentation for functions
- Descriptive variable and function names
- Consistent file organization following existing structure

### Git Commit Convention

Follow conventional commit format:

```text
<type>: <subject>

<body>
```

Types: feat, fix, docs, style, refactor, test, chore

## Testing and Quality

- Run `npm run lint` before committing code
- Ensure TypeScript compilation with `npm run build`
- Use strict TypeScript configuration for type safety
- Follow prettier formatting rules

## Key Features to Understand

1. **Real-time Typing**: Character-by-character input processing with immediate visual feedback
2. **Statistics**: Live WPM and accuracy calculation during typing
3. **Virtual Keyboard**: Physical keyboard state visualization with layout switching
4. **Word Management**: Random word generation and progression through word sets
5. **Theme System**: Dark/light mode support via next-themes

## Store Integration Patterns

When working with stores:

- Use Zustand's getState() for cross-store communication
- Register/cleanup event listeners properly in typing store
- Update statistics after each character input
- Handle keyboard layout changes affecting key mappings

## Development Philosophy

### 코드 개선 및 최적화 원칙

- **Over Engineering 방지**: 불필요한 복잡성을 피하고 단순함을 유지
- **과도한 최적화 주의**: 실제 성능 문제가 확인되기 전까지는 성급한 최적화 지양
- **필요에 의한 개선**: 명확한 문제나 요구사항이 있을 때만 리팩토링 수행
- **점진적 개선**: 한 번에 모든 것을 바꾸기보다는 작은 단위로 개선
- **가독성 우선**: 성능보다는 코드의 가독성과 유지보수성을 우선 고려
- **검증된 패턴 사용**: 새로운 패턴이나 아키텍처 도입 시 충분한 검토 필요

### 새 기능 개발 시 고려사항

- **MVP 원칙**: 최소 기능부터 구현 후 필요에 따라 확장
- **기존 패턴 활용**: 새로운 아키텍처보다는 기존 코드베이스의 패턴 활용
- **단순한 해결책 우선**: 복잡한 솔루션보다는 단순하고 명확한 해결책 선택

## 언어 사용 규칙

### 문서 및 커뮤니케이션

- **모든 답변과 문서 작성은 한글로 작성**
- 코드 주석, README, 문서화는 한글 사용
- 사용자와의 모든 커뮤니케이션은 한글로 진행

### 프로덕트 내 텍스트

- **사용자에게 보이는 모든 UI 텍스트는 영어로 작성**
- 버튼, 라벨, 메시지, 상태 텍스트 등은 영어 사용
- 예시: "Loading...", "Submit", "Error", "Success", "Try Again"
- 로딩 상태, 에러 메시지, 알림 등 모든 사용자 인터페이스 요소는 영어
