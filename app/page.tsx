// 'use client'; 제거

// import { useState } from 'react'; 제거
// import { WordDisplay } from '@/components/typing/word-display'; 제거
// import { VirtualKeyboard } from '@/components/keyboard'; 제거
// import { LayoutSelector } from '@/components/layout-selector'; 제거
// import type { LayoutType } from '@/lib/keyboard'; 제거

// 서버 로직 import
import { getRandomWords } from '@/lib/words';
import TypingPractice from '@/components/typing-practice'; // 새로 만든 클라이언트 컴포넌트 import

const WORDS_COUNT = 10; // 단어 개수 상수 정의

// 이제 Home 컴포넌트는 서버 컴포넌트입니다.
export default function Home() {
  // 서버에서 초기 단어 목록 생성
  const initialWords = getRandomWords(WORDS_COUNT);

  // 레이아웃 상태 관리 및 UI 렌더링은 클라이언트 컴포넌트에 위임
  // const [layout, setLayout] = useState<LayoutType>('qwerty'); 제거

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto p-4">
        {/* 클라이언트 컴포넌트에 초기 단어 목록 전달 */}
        <TypingPractice initialWords={initialWords} />
      </div>
    </main>
  );
}
