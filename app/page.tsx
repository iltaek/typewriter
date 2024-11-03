import { VirtualKeyboard } from '@/components/virtual-keyboard';

export default function Home() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-between p-4">
      {/* 기사 내용이 들어갈 자리 */}
      <div className="flex-1" />

      {/* 가상 키보드 */}
      <div className="w-full max-w-5xl">
        <VirtualKeyboard />
      </div>
    </main>
  );
}
