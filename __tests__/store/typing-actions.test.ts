import {
  handleShortcutKeys,
  handleBackspace,
  handleSpace,
  handleCharacterInput,
  handleTypingKeyDown,
  type TypingActionContext,
} from '@/store/typing-actions';
import { type WordState } from '@/types/word.types';
import { type LayoutType } from '@/types/keyboard.types';

// Mock the keyboard module at the top level
jest.mock('@/lib/keyboard', () => ({
  getCharacterFromKeyCode: jest.fn(),
}));

// Mock 키보드 이벤트 생성 헬퍼
const createKeyboardEvent = (
  key: string,
  code: string = '',
  options: Partial<KeyboardEventInit> = {},
): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', {
    key,
    code,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  
  // preventDefault 모킹
  jest.spyOn(event, 'preventDefault');
  
  return event;
};

// Mock WordState 생성 헬퍼
const createWordState = (word: string, typed: string = '', isCorrect: boolean = false): WordState => ({
  word,
  typed,
  isCorrect,
});

// Mock TypingActionContext 생성 헬퍼
const createMockContext = (
  words: WordState[] = [createWordState('test', 'te')],
  currentIndex: number = 0,
): TypingActionContext => {
  const setState = jest.fn();
  const updateStats = jest.fn();
  const generateNewWords = jest.fn();

  return {
    words,
    currentIndex,
    setState,
    updateStats,
    generateNewWords,
  };
};

// Get the mocked function
const mockGetCharacterFromKeyCode = require('@/lib/keyboard').getCharacterFromKeyCode as jest.Mock;

describe('handleShortcutKeys', () => {
  let generateNewWords: jest.Mock;

  beforeEach(() => {
    generateNewWords = jest.fn();
  });

  describe('정상 케이스', () => {
    test('Ctrl+R로 새 단어 생성', () => {
      const event = createKeyboardEvent('r', 'KeyR', { ctrlKey: true });
      
      const result = handleShortcutKeys(event, generateNewWords);
      
      expect(result).toBe(true);
      expect(generateNewWords).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('Cmd+R로 새 단어 생성 (Mac)', () => {
      const event = createKeyboardEvent('r', 'KeyR', { metaKey: true });
      
      const result = handleShortcutKeys(event, generateNewWords);
      
      expect(result).toBe(true);
      expect(generateNewWords).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('Ctrl+N으로 새 단어 생성', () => {
      const event = createKeyboardEvent('n', 'KeyN', { ctrlKey: true });
      
      const result = handleShortcutKeys(event, generateNewWords);
      
      expect(result).toBe(true);
      expect(generateNewWords).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('Escape로 새 단어 생성', () => {
      const event = createKeyboardEvent('Escape', 'Escape');
      
      const result = handleShortcutKeys(event, generateNewWords);
      
      expect(result).toBe(true);
      expect(generateNewWords).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('실패 케이스', () => {
    test('일반 문자 키는 단축키로 처리되지 않음', () => {
      const event = createKeyboardEvent('a', 'KeyA');
      
      const result = handleShortcutKeys(event, generateNewWords);
      
      expect(result).toBe(false);
      expect(generateNewWords).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});

describe('handleBackspace', () => {
  describe('정상 케이스', () => {
    test('현재 단어에서 마지막 글자 삭제', () => {
      const words = [createWordState('hello', 'hel')];
      const context = createMockContext(words, 0);
      const event = createKeyboardEvent('Backspace', 'Backspace');
      
      const result = handleBackspace(event, context);
      
      expect(result).toBe(true);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(context.setState).toHaveBeenCalledWith(expect.any(Function));
      
      // setState 호출 시 전달된 함수 테스트
      const stateUpdater = (context.setState as jest.Mock).mock.calls[0][0];
      const mockState = { words, currentIndex: 0 };
      const newState = stateUpdater(mockState);
      
      expect(newState.words[0].typed).toBe('he');
      expect(newState.words[0].isCorrect).toBe(false);
    });

    test('빈 단어에서 이전 단어로 이동', () => {
      const words = [
        createWordState('hello', 'hello', true),
        createWordState('world', ''),
      ];
      const context = createMockContext(words, 1);
      const event = createKeyboardEvent('Backspace', 'Backspace');
      
      const result = handleBackspace(event, context);
      
      expect(result).toBe(true);
      expect(context.setState).toHaveBeenCalledWith(expect.any(Function));
      
      const stateUpdater = (context.setState as jest.Mock).mock.calls[0][0];
      const newState = stateUpdater({ words, currentIndex: 1 });
      
      expect(newState.currentIndex).toBe(0);
    });
  });

  describe('실패 케이스', () => {
    test('Backspace가 아닌 키는 처리하지 않음', () => {
      const context = createMockContext();
      const event = createKeyboardEvent('a', 'KeyA');
      
      const result = handleBackspace(event, context);
      
      expect(result).toBe(false);
      expect(context.setState).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});

describe('handleSpace', () => {
  describe('정상 케이스', () => {
    test('완료된 단어에서 다음 단어로 이동', () => {
      const words = [
        createWordState('hello', 'hello', true),
        createWordState('world', ''),
      ];
      const context = createMockContext(words, 0);
      const event = createKeyboardEvent(' ', 'Space');
      
      const result = handleSpace(event, context);
      
      expect(result).toBe(true);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(context.setState).toHaveBeenCalledWith(expect.any(Function));
      
      const stateUpdater = (context.setState as jest.Mock).mock.calls[0][0];
      const newState = stateUpdater({ words, currentIndex: 0 });
      
      expect(newState.currentIndex).toBe(1);
    });

    test('마지막 단어 완료 시 새 단어 생성', () => {
      const words = [createWordState('hello', 'hello', true)];
      const context = createMockContext(words, 0);
      const event = createKeyboardEvent(' ', 'Space');
      
      const result = handleSpace(event, context);
      
      expect(result).toBe(true);
      expect(context.generateNewWords).toHaveBeenCalledTimes(1);
      expect(context.setState).not.toHaveBeenCalled();
    });
  });

  describe('실패 케이스', () => {
    test('Space가 아닌 키는 처리하지 않음', () => {
      const context = createMockContext();
      const event = createKeyboardEvent('a', 'KeyA');
      
      const result = handleSpace(event, context);
      
      expect(result).toBe(false);
      expect(context.setState).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});

describe('handleCharacterInput', () => {
  const layout: LayoutType = 'qwerty';

  beforeEach(() => {
    mockGetCharacterFromKeyCode.mockClear();
  });

  describe('정상 케이스', () => {
    test('정타 문자 입력', () => {
      const words = [createWordState('hello', 'h')];
      const context = createMockContext(words, 0);
      const event = createKeyboardEvent('e', 'KeyE');
      
      mockGetCharacterFromKeyCode.mockReturnValue('e');
      
      const result = handleCharacterInput(event, layout, context);
      
      expect(result).toBe(true);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(context.setState).toHaveBeenCalledWith(expect.any(Function));
      
      const stateUpdater = (context.setState as jest.Mock).mock.calls[0][0];
      const newState = stateUpdater({ words, currentIndex: 0 });
      
      expect(newState.words[0].typed).toBe('he');
      expect(newState.words[0].isCorrect).toBe(true);
    });

    test('Shift 키와 함께 대문자 입력', () => {
      const words = [createWordState('Hello', 'H')];
      const context = createMockContext(words, 0);
      const event = createKeyboardEvent('E', 'KeyE', { shiftKey: true });
      
      mockGetCharacterFromKeyCode.mockReturnValue('E');
      
      handleCharacterInput(event, layout, context);
      
      expect(mockGetCharacterFromKeyCode).toHaveBeenCalledWith('KeyE', layout, true);
    });
  });

  describe('실패 케이스', () => {
    test('다중 문자 키는 처리하지 않음', () => {
      const context = createMockContext();
      const event = createKeyboardEvent('Enter', 'Enter');
      
      const result = handleCharacterInput(event, layout, context);
      
      expect(result).toBe(false);
      expect(context.setState).not.toHaveBeenCalled();
    });

    test('매핑된 문자가 없으면 처리 종료', () => {
      const context = createMockContext();
      const event = createKeyboardEvent('a', 'KeyA');
      
      mockGetCharacterFromKeyCode.mockReturnValue('');
      
      const result = handleCharacterInput(event, layout, context);
      
      expect(result).toBe(true);
      expect(context.setState).not.toHaveBeenCalled();
    });
  });
});

describe('handleTypingKeyDown', () => {
  const layout: LayoutType = 'qwerty';

  beforeEach(() => {
    mockGetCharacterFromKeyCode.mockClear();
  });

  describe('정상 케이스', () => {
    test('단축키 우선 처리', () => {
      const context = createMockContext();
      const event = createKeyboardEvent('r', 'KeyR', { ctrlKey: true });
      
      handleTypingKeyDown(event, layout, context);
      
      expect(context.generateNewWords).toHaveBeenCalledTimes(1);
      expect(context.setState).not.toHaveBeenCalled();
    });

    test('Backspace 처리', () => {
      const words = [createWordState('hello', 'hel')];
      const context = createMockContext(words, 0);
      const event = createKeyboardEvent('Backspace', 'Backspace');
      
      handleTypingKeyDown(event, layout, context);
      
      expect(context.setState).toHaveBeenCalled();
    });

    test('일반 문자 처리', () => {
      const words = [createWordState('hello', 'h')];
      const context = createMockContext(words, 0);
      const event = createKeyboardEvent('e', 'KeyE');
      
      mockGetCharacterFromKeyCode.mockReturnValue('e');
      
      handleTypingKeyDown(event, layout, context);
      
      expect(context.setState).toHaveBeenCalled();
    });
  });
});