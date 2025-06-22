# TypeWriter Application Specification

## 개요

TypeWriter는 타이핑 연습을 위한 웹 애플리케이션입니다. 실시간 통계 표시, 가상 키보드, 다양한 키보드 레이아웃 지원 등의 기능을 제공합니다.

## 기술 스택

- **Frontend Framework**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: TailwindCSS + shadcn/ui
- **상태 관리**: Zustand
- **검증**: Zod
- **테마**: next-themes
- **개발 도구**: ESLint, Prettier

## 아키텍처 구조

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  Layout (theme provider, theme switch)                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Home Page                            │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │              TypingPractice                         │ │ │
│  │  │                                                     │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │ │ │
│  │  │  │ WordDisplay │  │LayoutSelect │  │VirtualKeyboard│ │ │ │
│  │  │  │             │  │             │  │              │ │ │ │
│  │  │  │┌───────────┐│  └─────────────┘  │┌────────────┐│ │ │ │
│  │  │  ││TypingStats││                   ││KeyboardRow ││ │ │ │
│  │  │  │└───────────┘│                   │└────────────┘│ │ │ │
│  │  │  └─────────────┘                   └──────────────┘ │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   Zustand Store │
                              ├─────────────────┤
                              │ TypingStore     │
                              │ KeyboardStore   │
                              │ LayoutStore     │
                              └─────────────────┘
                                       │
                              ┌─────────────────┐
                              │    Schemas      │
                              ├─────────────────┤
                              │ typing.schema   │
                              │ keyboard.schema │
                              │ word.schema     │
                              │ common.schema   │
                              └─────────────────┘
```

## 디렉토리 구조

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃 (테마 프로바이더)
│   ├── page.tsx           # 홈 페이지
│   └── globals.css        # 글로벌 스타일
├── components/             # React 컴포넌트
│   ├── typing/            # 타이핑 관련 컴포넌트
│   │   ├── word-display.tsx    # 단어 표시 및 입력 처리
│   │   ├── typing-stats.tsx    # 타이핑 통계 표시
│   │   └── word.tsx           # 개별 단어 컴포넌트
│   ├── keyboard/          # 가상 키보드 관련
│   │   ├── virtual-keyboard.tsx # 가상 키보드 메인
│   │   ├── keyboard-row.tsx     # 키보드 행
│   │   └── key.tsx             # 개별 키
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── providers/         # Context 프로바이더
│   ├── typing-practice.tsx # 메인 타이핑 연습 컴포넌트
│   └── layout-selector.tsx # 레이아웃 선택 컴포넌트
├── store/                  # Zustand 상태 관리
│   ├── typing-store.ts    # 타이핑 상태 및 로직
│   ├── keyboard-store.ts  # 키보드 입력 상태
│   └── layout-store.ts    # 키보드 레이아웃 상태
├── schemas/               # Zod 스키마 정의
│   ├── typing.schema.ts   # 타이핑 관련 타입
│   ├── keyboard.schema.ts # 키보드 관련 타입
│   ├── word.schema.ts     # 단어 상태 타입
│   └── common.schema.ts   # 공통 타입 (색상 등)
├── lib/                   # 비즈니스 로직 및 유틸리티
│   ├── keyboard.ts        # 키보드 레이아웃 설정
│   ├── keyboard-mappings.ts # 키 매핑 데이터
│   ├── typing-stats.ts    # 통계 계산 로직
│   ├── words.ts          # 단어 관련 유틸리티
│   └── utils.ts          # 공통 유틸리티
├── data/                  # 정적 데이터
│   └── words.json        # 타이핑 연습용 단어 목록
└── hooks/                 # 커스텀 React 훅 (현재 비어있음)
```

## 핵심 기능

### 1. 타이핑 연습 시스템

**담당 컴포넌트**: `WordDisplay`, `TypingPractice`
**상태 관리**: `TypingStore`

- 랜덤 단어 10개 표시
- 실시간 입력 처리 및 색상 피드백
  - 🟢 정타: 초록색
  - 🔴 오타: 빨간색
  - ⚪ 미입력: 회색
- 단어 완성 시 자동 다음 단어 이동
- 모든 단어 완성 시 새 단어 세트 생성

### 2. 실시간 통계

**담당 컴포넌트**: `TypingStatsDisplay`
**계산 로직**: `lib/typing-stats.ts`

- **WPM (Words Per Minute)**: 분당 타이핑 속도
- **정확도**: 정타율 백분율
- **정타/총입력**: 문자 단위 통계

### 3. 가상 키보드

**담당 컴포넌트**: `VirtualKeyboard`, `KeyboardRow`, `Key`
**상태 관리**: `KeyboardStore`

- 실시간 키 눌림 상태 시각화
- 다중 키보드 레이아웃 지원 (QWERTY, Dvorak, Colemak)
- 물리적 키보드와 동기화

### 4. 키보드 레이아웃 지원

**담당 컴포넌트**: `LayoutSelector`
**상태 관리**: `LayoutStore`
**매핑 로직**: `lib/keyboard.ts`, `lib/keyboard-mappings.ts`

지원 레이아웃:

- QWERTY (기본)
- Dvorak
- Colemak

## 상태 관리 구조

### TypingStore

```typescript
interface TypingState {
  words: WordState[]           // 타이핑할 단어들
  currentIndex: number         // 현재 단어 인덱스
  stats: TypingStats          // 타이핑 통계
  startTime: number | null    // 시작 시간

  // 액션들
  handleTypingKeyDown: (e: KeyboardEvent) => void
  generateNewWords: () => void
  updateStats: (isCharCorrect: boolean) => void
  getCharacterColor: (...) => ColorClass
  // ... 기타 액션들
}
```

### KeyboardStore

```typescript
interface KeyboardState {
  pressedKeys: Set<string>; // 현재 눌린 키들
  handleKeyDown: (e: KeyboardEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
  onKeyPress?: (char: string) => void;
}
```

### LayoutStore

```typescript
interface LayoutState {
  layout: LayoutType; // 현재 키보드 레이아웃
  setLayout: (layout: LayoutType) => void;
}
```

## 데이터 플로우

```
1. 사용자 키 입력
        ↓
2. KeyboardStore.handleKeyDown()
        ↓
3. TypingStore.handleTypingKeyDown()
        ↓
4. 문자 매핑 (LayoutStore.layout 참조)
        ↓
5. 단어 상태 업데이트 (WordState)
        ↓
6. 통계 업데이트 (TypingStats)
        ↓
7. 화면 리렌더링 (색상 변경, 통계 표시)
```

## 성능 최적화

1. **React.memo**: `VirtualKeyboard`, `TypingStatsDisplay` 등 메모이제이션
2. **Zustand**: 필요한 상태만 구독하여 불필요한 리렌더링 방지
3. **이벤트 리스너 관리**: 컴포넌트 언마운트 시 정리
4. **색상 계산 최적화**: 조건부 렌더링으로 성능 향상

## 키보드 단축키

- `Escape` / `Ctrl+R` / `Ctrl+N`: 새로운 단어 세트 생성
- `Backspace`: 문자 삭제 및 이전 단어 이동
- `Space`: 다음 단어로 이동

## 스키마 기반 타입 안전성

모든 데이터 구조는 Zod 스키마로 정의되어 런타임 타입 안전성을 보장합니다:

- `TypingStats`: 타이핑 통계
- `WordState`: 단어 상태
- `KeyboardLayout`: 키보드 레이아웃
- `ColorClass`: 문자 색상 상태

## 테마 시스템

- **라이브러리**: next-themes
- **지원 테마**: Light, Dark, System
- **위치**: 우상단 고정 테마 스위치

## 접근성 (Accessibility)

- ARIA 라벨 및 역할 정의
- 키보드 탐색 지원
- 스크린 리더 호환성
- 시맨틱 HTML 구조

---

이 문서는 TypeWriter 애플리케이션의 전체 아키텍처와 구현 세부사항을 다룹니다. 각 컴포넌트와 스토어는 단일 책임 원칙을 따르며, 확장 가능한 구조로 설계되었습니다.
