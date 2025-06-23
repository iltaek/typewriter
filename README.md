# TypeWriter

실시간 타이핑 연습을 위한 웹 애플리케이션입니다. 정확한 타이핑 피드백과 통계를 제공하여 타이핑 실력 향상을 도와줍니다.

## 주요 기능

- 🎯 **실시간 타이핑 연습**: 랜덤 단어로 구성된 타이핑 연습
- 📊 **실시간 통계**: WPM(분당 타수)과 정확도 실시간 계산
- ⌨️ **가상 키보드**: 물리적 키보드와 동기화된 시각적 피드백
- 🔤 **다중 레이아웃**: QWERTY, Dvorak, Colemak 키보드 레이아웃 지원
- 🎨 **색상 피드백**: 정타(초록), 오타(빨강), 미입력(회색) 실시간 표시
- ⚡ **키보드 단축키**: Escape, Ctrl+R, Ctrl+N으로 빠른 재시작
- 🌙 **다크모드**: 라이트/다크 테마 지원
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 경험

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript
- **스타일링**: TailwindCSS, shadcn/ui
- **상태 관리**: Zustand
- **테마**: next-themes
- **테스트**: Jest, React Testing Library (397개 테스트, 86.6% 커버리지)

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

## 개발 명령어

```bash
npm run dev         # 개발 서버 시작
npm run build       # 프로덕션 빌드
npm run start       # 프로덕션 서버 시작
npm run lint        # ESLint 실행
npm run format      # Prettier 포맷팅
npm run test        # 테스트 실행
npm run test:coverage # 커버리지 포함 테스트
```

## 프로젝트 구조

```
├── app/                    # Next.js App Router
├── components/             # React 컴포넌트
│   ├── typing/            # 타이핑 관련 컴포넌트
│   ├── keyboard/          # 가상 키보드 컴포넌트
│   └── ui/                # shadcn/ui 컴포넌트
├── store/                 # Zustand 상태 관리
├── lib/                   # 비즈니스 로직 및 유틸리티
├── types/                 # TypeScript 타입 정의
├── data/                  # 정적 데이터 (단어 목록)
└── docs/                  # 프로젝트 문서
    ├── product/           # 제품 스펙 문서
    ├── engineering/       # 엔지니어링 문서
    └── assets/           # 이미지 자료
```

## 사용법

1. **타이핑 시작**: 화면에 표시된 단어를 타이핑하세요
2. **실시간 피드백**: 올바른 글자는 초록색, 틀린 글자는 빨간색으로 표시
3. **통계 확인**: 우상단에서 WPM과 정확도를 실시간으로 확인
4. **레이아웃 변경**: 하단에서 키보드 레이아웃 선택 가능
5. **재시작**: Escape 키 또는 Ctrl+R로 새로운 단어 세트 시작

## 기여하기

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'feat: add amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 라이선스

MIT License

## 문서

- [제품 스펙](./docs/product/current-spec.md) - 애플리케이션 아키텍처 및 기능 명세
- [리팩토링 계획](./docs/engineering/refactoring-plan.md) - 코드 개선 히스토리
- [테스트 계획](./docs/engineering/test-plan.md) - 테스트 전략 및 결과
- [개발 가이드](./CLAUDE.md) - Claude Code 작업을 위한 개발 가이드

---

**TypeWriter로 타이핑 실력을 향상시켜보세요! ⌨️✨**
