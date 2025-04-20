'use client';

import { useEffect, Fragment } from 'react';
import { cn } from '@/lib/utils';
import { type LayoutType } from '@/lib/keyboard';
import { useTyping } from '@/hooks/use-typing';
import { TypingStatsDisplay } from './typing-stats';

/**
 * 타이핑 연습 단어 표시 영역의 Props 인터페이스입니다.
 */
interface WordDisplayProps {
  /** 현재 선택된 키보드 레이아웃 */
  layout: LayoutType;
  /** 서버에서 생성된 초기 단어 목록 */
  initialWords: string[];
}

/**
 * 타이핑 연습을 위한 단어 목록을 표시하고 사용자 입력을 처리하는 메인 컴포넌트입니다.
 * `useTyping` 훅을 사용하여 타이핑 상태 관리 및 로직을 처리합니다.
 * @param layout - 현재 선택된 키보드 레이아웃 (입력 처리 시 사용됨)
 * @param initialWords - 표시할 초기 단어 목록
 */
export function WordDisplay({ layout, initialWords }: WordDisplayProps) {
  // useTyping 훅에 initialWords 전달
  const {
    words, // 표시할 단어 상태 배열
    currentIndex, // 현재 입력 중인 단어 인덱스
    stats, // 타이핑 통계 (WPM, 정확도 등)
    handleKeyDown, // 키 입력 처리 함수
    getCharacterColor, // 글자 색상 결정 함수
  } = useTyping({ initialWords });

  // 이벤트 리스너 등록 및 해제
  useEffect(() => {
    // 실제 키보드 입력 이벤트 핸들러
    const handleKeyDownEvent = (e: KeyboardEvent) => handleKeyDown(e, layout);
    // keypress 이벤트 기본 동작 방지 (필요성 재검토)
    const handleKeyPress = (e: KeyboardEvent) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDownEvent);
    window.addEventListener('keypress', handleKeyPress);

    // 클린업 함수: 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyDown, layout]);

  // 단어 데이터가 없으면 로딩 상태 또는 null 반환
  if (!words) return null; // 초기 상태가 [] 이므로 이 조건은 항상 false일 수 있음. 로딩 상태 분리 고려.

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* 타이핑 통계 표시 컴포넌트 */} <TypingStatsDisplay stats={stats} />
      {/* 단어 목록 표시 영역 */}
      <div className="flex flex-wrap justify-center gap-x-1 max-w-3xl">
        {/* 단어 배열 순회 */}
        {words.map((wordState, index) => (
          // 각 단어와 구분자를 Fragment로 묶음
          <Fragment key={index}>
            {/* 개별 단어 컨테이너 */}
            <div
              className={cn(
                'text-2xl font-mono transition-all duration-200 px-1',
                // 현재 입력 중인 단어는 강조 (크기 확대)
                index === currentIndex ? 'scale-110' : 'scale-100 opacity-50'
              )}
            >
              {/* 단어 내 글자들을 순회하며 span으로 렌더링 */}
              {wordState.word.split('').map((targetChar, charIndex) => (
                <span
                  // key prop 수정: charIndex 사용 (단어 내에서는 고유)
                  key={charIndex}
                  className={cn(
                    'transition-colors duration-150',
                    // 글자 상태(정타, 오타, 입력 전)에 따라 색상 적용
                    getCharacterColor(wordState, index, charIndex, targetChar)
                  )}
                >
                  {targetChar}
                </span>
              ))}
            </div>
            {/* 단어 사이 구분자 (마지막 단어 뒤에는 표시 안 함) */}
            {index < words.length - 1 && (
              <span className="text-2xl font-mono text-gray-200">·</span>
            )}
          </Fragment>
        ))}
      </div>
      {/* 현재 진행 상태 (현재 단어 인덱스 / 전체 단어 수) */}
      <div className="text-sm text-gray-500">
        {currentIndex + 1} / {words.length}
      </div>
    </div>
  );
}
