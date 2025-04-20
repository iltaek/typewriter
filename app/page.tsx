import { getRandomWords } from '@/lib/words';
import TypingPractice from '@/components/typing-practice';

const WORDS_COUNT = 10;

export default function Home() {
  const initialWords = getRandomWords(WORDS_COUNT);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto p-4">
        <TypingPractice initialWords={initialWords} />
      </div>
    </main>
  );
}
