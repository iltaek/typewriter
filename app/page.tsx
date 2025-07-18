import TypingPractice from '@/components/typing-practice';
import { getRandomWords } from '@/lib/words';
import { WORDS_COUNT } from '@/types/typing.types';

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
