'use client';

import { Fragment, useEffect } from 'react';

import { cn } from '@/lib/utils';
import { useTypingStore } from '@/store/typing-store';

import { TypingStatsDisplay } from './typing-stats';

/**
 * 타이핑 연습 단어 표시 영역의 Props 인터페이스입니다.
 */
interface WordDisplayProps {
  /** 서버에서 생성된 초기 단어 목록 (빈 배열이나 undefined 불허) */
  initialWords: readonly string[];
}

/**
 * 타이핑 연습을 위한 단어 목록을 표시하고 사용자 입력을 처리하는 메인 컴포넌트입니다.
 * Zustand 스토어를 사용하여 타이핑 상태 관리 및 로직을 처리합니다.
 * @param initialWords - 표시할 초기 단어 목록
 */
export function WordDisplay({ initialWords }: WordDisplayProps) {
  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    words,
    currentIndex,
    stats,
    getCharacterColor,
    setInitialWords,
    registerKeyboardListeners,
    cleanup,
  } = useTypingStore();

  // 컴포넌트 마운트 시 초기 단어 목록 설정
  useEffect(() => {
    // 초기 단어 목록 설정
    setInitialWords([...initialWords]);

    // 이벤트 리스너 등록
    registerKeyboardListeners();

    // 클린업 함수 반환
    return cleanup;
  }, [initialWords, setInitialWords, registerKeyboardListeners, cleanup]);

  // 단어 데이터가 없으면 로딩 상태 또는 null 반환
  if (!words.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading words...</p>
      </div>
    );
  }

  // 에러 상태 체크
  if (!initialWords.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error: No words provided</p>
      </div>
    );
  }

  return (
    <main
      className="flex flex-col items-center justify-center space-y-4 sm:space-y-8 px-4 py-8"
      role="main"
      aria-label="Typing Practice Application"
    >
      {/* 타이핑 통계 표시 컴포넌트 */}
      <TypingStatsDisplay stats={stats} />

      {/* 키보드 단축키 안내 */}
      <div className="text-xs sm:text-sm text-gray-500 text-center px-2">
        <p className="hidden sm:block">
          Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Escape</kbd> or{' '}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+R</kbd> to restart
        </p>
        <p className="sm:hidden">
          Tap <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">ESC</kbd> to restart
        </p>
      </div>

      {/* 단어 목록 표시 영역 */}
      <section
        className="flex flex-wrap justify-center gap-x-1 max-w-3xl px-2"
        aria-label="Typing Exercise Text"
        aria-live="polite"
        aria-describedby="typing-instructions"
      >
        {/* 단어 배열 순회 */}
        {words.map((wordState, index) => (
          // 각 단어와 구분자를 Fragment로 묶음
          <Fragment key={index}>
            {/* 개별 단어 컨테이너 */}
            <div
              className={cn(
                'text-lg sm:text-2xl font-mono transition-all duration-200 px-1',
                // 현재 입력 중인 단어는 강조 (크기 확대)
                index === currentIndex ? 'scale-110' : 'scale-100 opacity-50',
              )}
            >
              {/* 단어 내 글자들을 순회하며 span으로 렌더링 */}
              {wordState.word.split('').map((targetChar, charIndex) => (
                <span
                  key={charIndex}
                  className={cn(
                    'transition-colors duration-150',
                    // 글자 상태(정타, 오타, 입력 전)에 따라 색상 적용
                    getCharacterColor(wordState, index, charIndex, targetChar),
                  )}
                >
                  {targetChar}
                </span>
              ))}
            </div>
            {/* 단어 사이 구분자 (마지막 단어 뒤에는 표시 안 함) */}
            {index < words.length - 1 && (
              <span className="text-lg sm:text-2xl font-mono text-gray-200">·</span>
            )}
          </Fragment>
        ))}
      </section>

      {/* 접근성을 위한 설명 텍스트 */}
      <div id="typing-instructions" className="sr-only">
        Type the words shown above. Correctly typed characters appear in green, incorrect ones in
        red. Use backspace to correct mistakes. Press space to move to the next word.
      </div>

      {/* 현재 진행 상태 (현재 단어 인덱스 / 전체 단어 수) */}
      <div
        className="text-sm text-gray-500"
        role="status"
        aria-label={`Progress: word ${currentIndex + 1} of ${words.length}`}
      >
        {currentIndex + 1} / {words.length}
      </div>
    </main>
  );
}
