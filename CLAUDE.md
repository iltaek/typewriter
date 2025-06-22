# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeWriter is a Next.js 14 typing practice application built with TypeScript, TailwindCSS, and shadcn/ui components. It features real-time typing statistics, virtual keyboard display, and theme switching.

## Essential Commands

### Development

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # ESLint checking
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check Prettier formatting
```

### Component Management

```bash
npx shadcn@latest add [componentName]  # Add shadcn/ui components
```

## Architecture

### State Management

- **Zustand stores** in `/store/` directory:
  - `typing-store.ts` - Main typing practice state
  - `keyboard-store.ts` - Virtual keyboard state
  - `layout-store.ts` - Keyboard layout management

### Key Directories

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
  - `components/ui/` - shadcn/ui components
  - `components/typing/` - Typing practice components
  - `components/keyboard/` - Virtual keyboard components
- `lib/` - Business logic and utilities
- `hooks/` - Custom React hooks
- `schemas/` - Zod validation schemas (use instead of separate type files)

### Type Safety

- Use **Zod schemas** for type definitions in `/schemas/` directory
- All components must use TypeScript
- Schema validation is required for data structures

### Component Standards

- **Always use shadcn/ui components** when available
- Install with: `npx shadcn@latest add [componentName]`
- Components should be memoized for performance when appropriate
- Follow existing patterns in `/components/` directory

### Next.js Guidelines

- Use **Server Actions** for simple CRUD operations
- Use **API Routes** for complex business logic, external API calls, or authentication
- No `src/` directory - files are in project root

### Package Manager

- Use **npm** (not yarn, pnpm, or bun)

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

## Development Notes

### Project Structure

- No `src/` directory structure
- Page-specific components go in route folders (e.g., `app/dashboard/DashboardStats.tsx`)
- Reusable components go in `/components/`
- Schema definitions use Zod in `/schemas/` directory

### Code Style

- ESLint with Airbnb style guide
- Prettier with 2-space indentation, single quotes
- 100 character line width
- Import ordering rules enforced

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
