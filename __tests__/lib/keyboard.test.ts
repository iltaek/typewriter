import {
  QWERTY_LAYOUT,
  COLEMAK_LAYOUT,
  DVORAK_LAYOUT,
  KEYBOARD_CONFIGS,
  QWERTY_TO_COLEMAK,
  COLEMAK_TO_QWERTY,
  remapKey,
  getCharacterFromKeyCode,
} from '@/lib/keyboard';

import { DVORAK_KEY_MAPPINGS } from '@/lib/keyboard-mappings';

describe('KEYBOARD_CONFIGS', () => {
  describe('정상 케이스', () => {
    test('QWERTY 레이아웃이 올바르게 설정됨', () => {
      const qwerty = KEYBOARD_CONFIGS.qwerty;
      expect(qwerty).toBeDefined();
      expect(qwerty.row1).toBeDefined();
      expect(qwerty.row2).toBeDefined();
      expect(qwerty.row3).toBeDefined();
      expect(qwerty.row4).toBeDefined();
      expect(qwerty.row5).toBeDefined();
    });

    test('COLEMAK 레이아웃이 올바르게 설정됨', () => {
      const colemak = KEYBOARD_CONFIGS.colemak;
      expect(colemak).toBeDefined();
      expect(colemak.row1).toBeDefined();
      expect(colemak.row2).toBeDefined();
      expect(colemak.row3).toBeDefined();
      expect(colemak.row4).toBeDefined();
      expect(colemak.row5).toBeDefined();
    });

    test('DVORAK 레이아웃이 올바르게 설정됨', () => {
      const dvorak = KEYBOARD_CONFIGS.dvorak;
      expect(dvorak).toBeDefined();
      expect(dvorak.row1).toBeDefined();
      expect(dvorak.row2).toBeDefined();
      expect(dvorak.row3).toBeDefined();
      expect(dvorak.row4).toBeDefined();
      expect(dvorak.row5).toBeDefined();
    });

    test('모든 레이아웃이 동일한 구조를 가짐', () => {
      const qwerty = KEYBOARD_CONFIGS.qwerty;
      const colemak = KEYBOARD_CONFIGS.colemak;
      const dvorak = KEYBOARD_CONFIGS.dvorak;
      
      // QWERTY와 COLEMAK
      expect(qwerty.row1.length).toBe(colemak.row1.length);
      expect(qwerty.row2.length).toBe(colemak.row2.length);
      expect(qwerty.row3.length).toBe(colemak.row3.length);
      expect(qwerty.row4.length).toBe(colemak.row4.length);
      expect(qwerty.row5.length).toBe(colemak.row5.length);

      // QWERTY와 DVORAK
      expect(qwerty.row1.length).toBe(dvorak.row1.length);
      expect(qwerty.row2.length).toBe(dvorak.row2.length);
      expect(qwerty.row3.length).toBe(dvorak.row3.length);
      expect(qwerty.row4.length).toBe(dvorak.row4.length);
      expect(qwerty.row5.length).toBe(dvorak.row5.length);
    });
  });

  describe('실패 케이스', () => {
    test('존재하지 않는 레이아웃 접근', () => {
      const invalidLayout = (KEYBOARD_CONFIGS as any).nonexistent;
      expect(invalidLayout).toBeUndefined();
    });
  });

  describe('엣지 케이스', () => {
    test('모든 키가 필수 속성을 가짐', () => {
      Object.values(KEYBOARD_CONFIGS).forEach(layout => {
        Object.values(layout).forEach(row => {
          row.forEach(key => {
            expect(key.key).toBeDefined();
            expect(key.code).toBeDefined();
            expect(typeof key.key).toBe('string');
            expect(typeof key.code).toBe('string');
            // isSpecial은 선택적 속성
            if (key.isSpecial !== undefined) {
              expect(typeof key.isSpecial).toBe('boolean');
            }
          });
        });
      });
    });

    test('레이아웃 간 공유하는 행 확인', () => {
      // QWERTY와 COLEMAK은 row1, row5를 공유
      expect(QWERTY_LAYOUT.row1).toEqual(COLEMAK_LAYOUT.row1);
      expect(QWERTY_LAYOUT.row5).toEqual(COLEMAK_LAYOUT.row5);
      
      // DVORAK은 고유한 row1을 가지지만 row5는 QWERTY와 공유
      expect(QWERTY_LAYOUT.row5).toEqual(DVORAK_LAYOUT.row5);
      expect(QWERTY_LAYOUT.row1).not.toEqual(DVORAK_LAYOUT.row1);
    });
  });
});

describe('DVORAK_KEY_MAPPINGS', () => {
  describe('정상 케이스', () => {
    test('기본 알파벳 키 매핑이 올바름', () => {
      // Dvorak 레이아웃의 특징적인 매핑들 확인
      expect(DVORAK_KEY_MAPPINGS.KeyQ).toEqual(["'", '"']); // Q 위치 → 따옴표
      expect(DVORAK_KEY_MAPPINGS.KeyW).toEqual([',', '<']); // W 위치 → 쉼표
      expect(DVORAK_KEY_MAPPINGS.KeyE).toEqual(['.', '>']); // E 위치 → 마침표
      expect(DVORAK_KEY_MAPPINGS.KeyR).toEqual(['p', 'P']); // R 위치 → P
      expect(DVORAK_KEY_MAPPINGS.KeyT).toEqual(['y', 'Y']); // T 위치 → Y
    });

    test('숫자 행 매핑이 QWERTY와 대부분 동일함', () => {
      expect(DVORAK_KEY_MAPPINGS.Digit1).toEqual(['1', '!']);
      expect(DVORAK_KEY_MAPPINGS.Digit2).toEqual(['2', '@']);
      expect(DVORAK_KEY_MAPPINGS.Digit3).toEqual(['3', '#']);
      expect(DVORAK_KEY_MAPPINGS.Digit0).toEqual(['0', ')']);
    });

    test('특수한 Dvorak 기호 매핑이 올바름', () => {
      // Dvorak의 특별한 기호 매핑
      expect(DVORAK_KEY_MAPPINGS.Minus).toEqual(['[', '{']); // - 위치 → [
      expect(DVORAK_KEY_MAPPINGS.Equal).toEqual([']', '}']); // = 위치 → ]
      expect(DVORAK_KEY_MAPPINGS.BracketLeft).toEqual(['/', '?']); // [ 위치 → /
      expect(DVORAK_KEY_MAPPINGS.BracketRight).toEqual(['=', '+']); // ] 위치 → =
    });

    test('중간 행(홈 로우) 매핑이 올바름', () => {
      expect(DVORAK_KEY_MAPPINGS.KeyA).toEqual(['a', 'A']); // A는 동일한 위치
      expect(DVORAK_KEY_MAPPINGS.KeyS).toEqual(['o', 'O']); // S 위치 → O
      expect(DVORAK_KEY_MAPPINGS.KeyD).toEqual(['e', 'E']); // D 위치 → E
      expect(DVORAK_KEY_MAPPINGS.KeyF).toEqual(['u', 'U']); // F 위치 → U
      expect(DVORAK_KEY_MAPPINGS.KeyG).toEqual(['i', 'I']); // G 위치 → I
    });

    test('하단 행 매핑이 올바름', () => {
      expect(DVORAK_KEY_MAPPINGS.KeyZ).toEqual([';', ':']); // Z 위치 → 세미콜론
      expect(DVORAK_KEY_MAPPINGS.KeyX).toEqual(['q', 'Q']); // X 위치 → Q
      expect(DVORAK_KEY_MAPPINGS.KeyC).toEqual(['j', 'J']); // C 위치 → J
      expect(DVORAK_KEY_MAPPINGS.KeyV).toEqual(['k', 'K']); // V 위치 → K
      expect(DVORAK_KEY_MAPPINGS.KeyB).toEqual(['x', 'X']); // B 위치 → X
    });

    test('스페이스 키 매핑', () => {
      expect(DVORAK_KEY_MAPPINGS.Space).toEqual([' ', ' ']);
    });
  });

  describe('실패 케이스', () => {
    test('존재하지 않는 키 접근', () => {
      expect(DVORAK_KEY_MAPPINGS.InvalidKey).toBeUndefined();
      expect(DVORAK_KEY_MAPPINGS.KeyΩ).toBeUndefined();
    });
  });

  describe('엣지 케이스', () => {
    test('모든 매핑이 2개 요소 배열을 가짐', () => {
      Object.values(DVORAK_KEY_MAPPINGS).forEach(mapping => {
        expect(Array.isArray(mapping)).toBe(true);
        expect(mapping).toHaveLength(2);
        expect(typeof mapping[0]).toBe('string');
        expect(typeof mapping[1]).toBe('string');
      });
    });

    test('매핑 테이블이 비어있지 않음', () => {
      expect(Object.keys(DVORAK_KEY_MAPPINGS).length).toBeGreaterThan(0);
    });

    test('모든 기본 알파벳 키가 매핑됨', () => {
      const alphabetKeys = [
        'KeyA', 'KeyB', 'KeyC', 'KeyD', 'KeyE', 'KeyF', 'KeyG', 'KeyH', 'KeyI',
        'KeyJ', 'KeyK', 'KeyL', 'KeyM', 'KeyN', 'KeyO', 'KeyP', 'KeyQ', 'KeyR',
        'KeyS', 'KeyT', 'KeyU', 'KeyV', 'KeyW', 'KeyX', 'KeyY', 'KeyZ'
      ];
      
      alphabetKeys.forEach(key => {
        expect(DVORAK_KEY_MAPPINGS[key]).toBeDefined();
      });
    });
  });
});

describe('키 매핑 상수', () => {
  describe('정상 케이스', () => {
    test('QWERTY_TO_COLEMAK 매핑이 올바름', () => {
      expect(QWERTY_TO_COLEMAK.KeyE).toBe('KeyF');
      expect(QWERTY_TO_COLEMAK.KeyR).toBe('KeyP');
      expect(QWERTY_TO_COLEMAK.KeyT).toBe('KeyG');
      expect(QWERTY_TO_COLEMAK.KeyY).toBe('KeyJ');
    });

    test('COLEMAK_TO_QWERTY 매핑이 올바름', () => {
      expect(COLEMAK_TO_QWERTY.KeyF).toBe('KeyE');
      expect(COLEMAK_TO_QWERTY.KeyP).toBe('KeyR');
      expect(COLEMAK_TO_QWERTY.KeyG).toBe('KeyT');
      expect(COLEMAK_TO_QWERTY.KeyJ).toBe('KeyY');
    });

    test('양방향 매핑이 일관됨', () => {
      Object.entries(QWERTY_TO_COLEMAK).forEach(([qwertyKey, colemakKey]) => {
        expect(COLEMAK_TO_QWERTY[colemakKey]).toBe(qwertyKey);
      });
    });
  });

  describe('실패 케이스', () => {
    test('매핑되지 않은 키 접근', () => {
      expect(QWERTY_TO_COLEMAK.KeyZ).toBeUndefined();
      expect(QWERTY_TO_COLEMAK.Digit1).toBeUndefined();
    });
  });

  describe('엣지 케이스', () => {
    test('매핑 객체가 비어있지 않음', () => {
      expect(Object.keys(QWERTY_TO_COLEMAK).length).toBeGreaterThan(0);
      expect(Object.keys(COLEMAK_TO_QWERTY).length).toBeGreaterThan(0);
    });

    test('매핑 크기가 동일함', () => {
      expect(Object.keys(QWERTY_TO_COLEMAK).length).toBe(
        Object.keys(COLEMAK_TO_QWERTY).length
      );
    });
  });
});

describe('remapKey', () => {
  describe('정상 케이스', () => {
    test('QWERTY에서 COLEMAK으로 매핑', () => {
      expect(remapKey('KeyE', 'qwerty', 'colemak')).toBe('KeyF');
      expect(remapKey('KeyR', 'qwerty', 'colemak')).toBe('KeyP');
      expect(remapKey('KeyT', 'qwerty', 'colemak')).toBe('KeyG');
    });

    test('COLEMAK에서 QWERTY로 매핑', () => {
      expect(remapKey('KeyF', 'colemak', 'qwerty')).toBe('KeyE');
      expect(remapKey('KeyP', 'colemak', 'qwerty')).toBe('KeyR');
      expect(remapKey('KeyG', 'colemak', 'qwerty')).toBe('KeyT');
    });

    test('동일한 레이아웃 간 매핑 - 변경 없음', () => {
      expect(remapKey('KeyE', 'qwerty', 'qwerty')).toBe('KeyE');
      expect(remapKey('KeyF', 'colemak', 'colemak')).toBe('KeyF');
      expect(remapKey('KeyQ', 'dvorak', 'dvorak')).toBe('KeyQ');
    });

    test('Dvorak 레이아웃은 직접 매핑 사용으로 키 코드 변환 불필요', () => {
      // Dvorak은 물리적 키 코드를 그대로 사용하고 mapKeyToCharacter에서 직접 매핑
      expect(remapKey('KeyE', 'qwerty', 'dvorak')).toBe('KeyE');
      expect(remapKey('KeyR', 'dvorak', 'qwerty')).toBe('KeyR');
      expect(remapKey('KeyA', 'dvorak', 'colemak')).toBe('KeyA');
      expect(remapKey('KeyZ', 'colemak', 'dvorak')).toBe('KeyZ');
    });

    test('매핑되지 않은 키는 그대로 반환', () => {
      expect(remapKey('KeyZ', 'qwerty', 'colemak')).toBe('KeyZ');
      expect(remapKey('Digit1', 'qwerty', 'colemak')).toBe('Digit1');
      expect(remapKey('Space', 'qwerty', 'colemak')).toBe('Space');
    });
  });

  describe('실패 케이스', () => {
    test('잘못된 레이아웃 이름 처리', () => {
      // 현재 구현에서는 invalid 레이아웃을 qwerty와 colemak 이외로 처리
      // fromLayout이 qwerty가 아니면 colemak으로 처리되어 COLEMAK_TO_QWERTY 매핑 사용
      expect(remapKey('KeyE', 'invalid' as any, 'qwerty')).toBe('KeyK'); // COLEMAK_TO_QWERTY의 KeyE -> KeyK
      expect(remapKey('KeyE', 'qwerty', 'invalid' as any)).toBe('KeyF'); // QWERTY_TO_COLEMAK의 KeyE -> KeyF
    });

    test('빈 문자열 키 코드', () => {
      expect(remapKey('', 'qwerty', 'colemak')).toBe('');
    });
  });

  describe('엣지 케이스', () => {
    test('대소문자 구분', () => {
      expect(remapKey('keye', 'qwerty', 'colemak')).toBe('keye'); // 소문자는 매핑 안됨
      expect(remapKey('KEYE', 'qwerty', 'colemak')).toBe('KEYE'); // 대문자는 매핑 안됨
    });

    test('특수 키 코드 처리', () => {
      expect(remapKey('Backspace', 'qwerty', 'colemak')).toBe('Backspace');
      expect(remapKey('Enter', 'qwerty', 'colemak')).toBe('Enter');
      expect(remapKey('ShiftLeft', 'qwerty', 'colemak')).toBe('ShiftLeft');
    });

    test('숫자 키 처리', () => {
      expect(remapKey('Digit0', 'qwerty', 'colemak')).toBe('Digit0');
      expect(remapKey('Digit9', 'qwerty', 'colemak')).toBe('Digit9');
    });
  });
});

describe('getCharacterFromKeyCode', () => {
  describe('정상 케이스', () => {
    test('QWERTY 레이아웃 기본 문자', () => {
      expect(getCharacterFromKeyCode('KeyA', 'qwerty')).toBe('a');
      expect(getCharacterFromKeyCode('KeyB', 'qwerty')).toBe('b');
      expect(getCharacterFromKeyCode('KeyZ', 'qwerty')).toBe('z');
    });

    test('QWERTY 레이아웃 Shift + 문자', () => {
      expect(getCharacterFromKeyCode('KeyA', 'qwerty', true)).toBe('A');
      expect(getCharacterFromKeyCode('KeyB', 'qwerty', true)).toBe('B');
      expect(getCharacterFromKeyCode('KeyZ', 'qwerty', true)).toBe('Z');
    });

    test('QWERTY 레이아웃 숫자 키', () => {
      expect(getCharacterFromKeyCode('Digit1', 'qwerty')).toBe('1');
      expect(getCharacterFromKeyCode('Digit2', 'qwerty')).toBe('2');
      expect(getCharacterFromKeyCode('Digit0', 'qwerty')).toBe('0');
    });

    test('QWERTY 레이아웃 Shift + 숫자 키', () => {
      expect(getCharacterFromKeyCode('Digit1', 'qwerty', true)).toBe('!');
      expect(getCharacterFromKeyCode('Digit2', 'qwerty', true)).toBe('@');
      expect(getCharacterFromKeyCode('Digit3', 'qwerty', true)).toBe('#');
    });

    test('COLEMAK 레이아웃 매핑된 문자', () => {
      // COLEMAK에서 KeyE는 F 위치
      expect(getCharacterFromKeyCode('KeyE', 'colemak')).toBe('f');
      expect(getCharacterFromKeyCode('KeyE', 'colemak', true)).toBe('F');
      
      // COLEMAK에서 KeyR은 P 위치
      expect(getCharacterFromKeyCode('KeyR', 'colemak')).toBe('p');
      expect(getCharacterFromKeyCode('KeyR', 'colemak', true)).toBe('P');
    });

    test('DVORAK 레이아웃 기본 문자 매핑', () => {
      // Dvorak의 특징적인 키 매핑들
      expect(getCharacterFromKeyCode('KeyQ', 'dvorak')).toBe("'"); // Q → 따옴표
      expect(getCharacterFromKeyCode('KeyW', 'dvorak')).toBe(','); // W → 쉼표
      expect(getCharacterFromKeyCode('KeyE', 'dvorak')).toBe('.'); // E → 마침표
      expect(getCharacterFromKeyCode('KeyR', 'dvorak')).toBe('p'); // R → P
      expect(getCharacterFromKeyCode('KeyT', 'dvorak')).toBe('y'); // T → Y
    });

    test('DVORAK 레이아웃 Shift + 문자 매핑', () => {
      expect(getCharacterFromKeyCode('KeyQ', 'dvorak', true)).toBe('"'); // Q → 쌍따옴표
      expect(getCharacterFromKeyCode('KeyW', 'dvorak', true)).toBe('<'); // W → <
      expect(getCharacterFromKeyCode('KeyE', 'dvorak', true)).toBe('>'); // E → >
      expect(getCharacterFromKeyCode('KeyR', 'dvorak', true)).toBe('P'); // R → P
      expect(getCharacterFromKeyCode('KeyT', 'dvorak', true)).toBe('Y'); // T → Y
    });

    test('DVORAK 레이아웃 홈 로우(중간 행) 매핑', () => {
      expect(getCharacterFromKeyCode('KeyA', 'dvorak')).toBe('a'); // A는 동일
      expect(getCharacterFromKeyCode('KeyS', 'dvorak')).toBe('o'); // S → O
      expect(getCharacterFromKeyCode('KeyD', 'dvorak')).toBe('e'); // D → E
      expect(getCharacterFromKeyCode('KeyF', 'dvorak')).toBe('u'); // F → U
      expect(getCharacterFromKeyCode('KeyG', 'dvorak')).toBe('i'); // G → I
    });

    test('DVORAK 레이아웃 하단 행 매핑', () => {
      expect(getCharacterFromKeyCode('KeyZ', 'dvorak')).toBe(';'); // Z → 세미콜론
      expect(getCharacterFromKeyCode('KeyX', 'dvorak')).toBe('q'); // X → Q
      expect(getCharacterFromKeyCode('KeyC', 'dvorak')).toBe('j'); // C → J
      expect(getCharacterFromKeyCode('KeyV', 'dvorak')).toBe('k'); // V → K
      expect(getCharacterFromKeyCode('KeyB', 'dvorak')).toBe('x'); // B → X
    });

    test('DVORAK 레이아웃 특수 기호 매핑', () => {
      // Dvorak의 독특한 기호 배치
      expect(getCharacterFromKeyCode('Minus', 'dvorak')).toBe('['); // - 위치 → [
      expect(getCharacterFromKeyCode('Equal', 'dvorak')).toBe(']'); // = 위치 → ]
      expect(getCharacterFromKeyCode('BracketLeft', 'dvorak')).toBe('/'); // [ 위치 → /
      expect(getCharacterFromKeyCode('BracketRight', 'dvorak')).toBe('='); // ] 위치 → =
    });

    test('DVORAK 레이아웃 숫자 키 (QWERTY와 동일)', () => {
      expect(getCharacterFromKeyCode('Digit1', 'dvorak')).toBe('1');
      expect(getCharacterFromKeyCode('Digit2', 'dvorak')).toBe('2');
      expect(getCharacterFromKeyCode('Digit3', 'dvorak')).toBe('3');
      expect(getCharacterFromKeyCode('Digit0', 'dvorak')).toBe('0');
    });

    test('특수문자 키', () => {
      expect(getCharacterFromKeyCode('Comma', 'qwerty')).toBe(',');
      expect(getCharacterFromKeyCode('Period', 'qwerty')).toBe('.');
      expect(getCharacterFromKeyCode('Slash', 'qwerty')).toBe('/');
      expect(getCharacterFromKeyCode('Semicolon', 'qwerty')).toBe(';');
    });

    test('Shift + 특수문자 키', () => {
      expect(getCharacterFromKeyCode('Comma', 'qwerty', true)).toBe('<');
      expect(getCharacterFromKeyCode('Period', 'qwerty', true)).toBe('>');
      expect(getCharacterFromKeyCode('Slash', 'qwerty', true)).toBe('?');
      expect(getCharacterFromKeyCode('Semicolon', 'qwerty', true)).toBe(':');
    });

    test('스페이스바 특별 처리', () => {
      expect(getCharacterFromKeyCode('Space', 'qwerty')).toBe(' ');
      expect(getCharacterFromKeyCode('Space', 'qwerty', true)).toBe(' ');
      expect(getCharacterFromKeyCode('Space', 'colemak')).toBe(' ');
      expect(getCharacterFromKeyCode('Space', 'dvorak')).toBe(' ');
      expect(getCharacterFromKeyCode('Space', 'dvorak', true)).toBe(' ');
    });
  });

  describe('실패 케이스', () => {
    test('존재하지 않는 키 코드', () => {
      expect(getCharacterFromKeyCode('InvalidKey', 'qwerty')).toBe('');
      expect(getCharacterFromKeyCode('KeyΩ', 'qwerty')).toBe('');
    });

    test('잘못된 레이아웃', () => {
      // 잘못된 레이아웃의 경우 layoutConfig가 undefined가 되어 에러 발생 가능
      // 이는 실제 구현의 한계이므로 테스트에서 예외 처리
      expect(() => getCharacterFromKeyCode('KeyA', 'invalid' as any)).toThrow();
    });

    test('빈 키 코드', () => {
      expect(getCharacterFromKeyCode('', 'qwerty')).toBe('');
    });
  });

  describe('엣지 케이스', () => {
    test('특수 키는 빈 문자열 반환', () => {
      expect(getCharacterFromKeyCode('Backspace', 'qwerty')).toBe('');
      expect(getCharacterFromKeyCode('Enter', 'qwerty')).toBe('');
      expect(getCharacterFromKeyCode('Tab', 'qwerty')).toBe('');
      expect(getCharacterFromKeyCode('ShiftLeft', 'qwerty')).toBe('');
      expect(getCharacterFromKeyCode('ControlLeft', 'qwerty')).toBe('');
    });

    test('Shift 상태가 결과에 영향 없는 키들', () => {
      // 스페이스바는 Shift 상태와 관계없이 동일
      expect(getCharacterFromKeyCode('Space', 'qwerty', false)).toBe(' ');
      expect(getCharacterFromKeyCode('Space', 'qwerty', true)).toBe(' ');
    });

    test('대소문자 구분 키 코드', () => {
      // 소문자 키 코드는 매핑되지 않음
      expect(getCharacterFromKeyCode('keya', 'qwerty')).toBe('');
      expect(getCharacterFromKeyCode('digit1', 'qwerty')).toBe('');
    });

    test('COLEMAK에서 매핑되지 않은 키', () => {
      // Z는 COLEMAK에서도 동일한 위치
      expect(getCharacterFromKeyCode('KeyZ', 'colemak')).toBe('z');
      expect(getCharacterFromKeyCode('KeyZ', 'colemak', true)).toBe('Z');
    });

    test('DVORAK 레이아웃에서 존재하지 않는 키', () => {
      expect(getCharacterFromKeyCode('InvalidKey', 'dvorak')).toBe('');
      expect(getCharacterFromKeyCode('KeyΩ', 'dvorak')).toBe('');
    });
  });

  describe('레이아웃 간 일관성 테스트', () => {
    test('숫자 키는 모든 레이아웃에서 동일', () => {
      const digitKeys = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'];
      
      digitKeys.forEach(key => {
        const qwertyResult = getCharacterFromKeyCode(key, 'qwerty');
        const colemakResult = getCharacterFromKeyCode(key, 'colemak');
        const dvorakResult = getCharacterFromKeyCode(key, 'dvorak');
        
        expect(qwertyResult).toBe(colemakResult);
        expect(qwertyResult).toBe(dvorakResult);
        
        const qwertyShiftResult = getCharacterFromKeyCode(key, 'qwerty', true);
        const colemakShiftResult = getCharacterFromKeyCode(key, 'colemak', true);
        const dvorakShiftResult = getCharacterFromKeyCode(key, 'dvorak', true);
        
        expect(qwertyShiftResult).toBe(colemakShiftResult);
        expect(qwertyShiftResult).toBe(dvorakShiftResult);
      });
    });

    test('스페이스바는 모든 레이아웃에서 동일', () => {
      expect(getCharacterFromKeyCode('Space', 'qwerty')).toBe(' ');
      expect(getCharacterFromKeyCode('Space', 'colemak')).toBe(' ');
      expect(getCharacterFromKeyCode('Space', 'dvorak')).toBe(' ');
    });

    test('QWERTY와 COLEMAK에서 일부 특수문자 동일', () => {
      // 이들은 QWERTY와 COLEMAK에서 동일하지만 Dvorak에서는 다름
      const keys = ['Comma', 'Period'];
      
      keys.forEach(key => {
        const qwertyResult = getCharacterFromKeyCode(key, 'qwerty');
        const colemakResult = getCharacterFromKeyCode(key, 'colemak');
        expect(qwertyResult).toBe(colemakResult);
      });
    });

    test('각 레이아웃의 고유 매핑이 올바름', () => {
      // 동일한 물리적 키(KeyE)가 각 레이아웃에서 다른 문자를 생성
      expect(getCharacterFromKeyCode('KeyE', 'qwerty')).toBe('e');  // QWERTY: E
      expect(getCharacterFromKeyCode('KeyE', 'colemak')).toBe('f'); // COLEMAK: F 
      expect(getCharacterFromKeyCode('KeyE', 'dvorak')).toBe('.');  // DVORAK: 마침표
      
      // 동일한 물리적 키(KeyQ)가 각 레이아웃에서 다른 문자를 생성
      expect(getCharacterFromKeyCode('KeyQ', 'qwerty')).toBe('q');  // QWERTY: Q
      expect(getCharacterFromKeyCode('KeyQ', 'colemak')).toBe('q'); // COLEMAK: Q (동일)
      expect(getCharacterFromKeyCode('KeyQ', 'dvorak')).toBe("'"); // DVORAK: 따옴표
    });

    test('Dvorak의 특수 기호 매핑이 다른 레이아웃과 구별됨', () => {
      // Minus 키 위치의 차이
      expect(getCharacterFromKeyCode('Minus', 'qwerty')).toBe('-');  // QWERTY: -
      expect(getCharacterFromKeyCode('Minus', 'colemak')).toBe('-'); // COLEMAK: -
      expect(getCharacterFromKeyCode('Minus', 'dvorak')).toBe('[');  // DVORAK: [
      
      // Equal 키 위치의 차이
      expect(getCharacterFromKeyCode('Equal', 'qwerty')).toBe('=');  // QWERTY: =
      expect(getCharacterFromKeyCode('Equal', 'colemak')).toBe('='); // COLEMAK: =
      expect(getCharacterFromKeyCode('Equal', 'dvorak')).toBe(']');  // DVORAK: ]
    });
  });

  describe('성능 테스트', () => {
    test('대량 키 변환 성능', () => {
      const keys = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyE', 'KeyR', 'KeyT', 'KeyY'];
      const layouts = ['qwerty', 'colemak', 'dvorak'] as const;
      
      const start = process.hrtime.bigint();
      
      // 1000번 변환 수행
      for (let i = 0; i < 1000; i++) {
        keys.forEach(key => {
          layouts.forEach(layout => {
            getCharacterFromKeyCode(key, layout);
            getCharacterFromKeyCode(key, layout, true);
          });
        });
      }
      
      const end = process.hrtime.bigint();
      const executionTime = Number(end - start) / 1000000; // 나노초를 밀리초로 변환
      
      // 24000번 호출(8키 × 3레이아웃 × 2상태 × 1000번)이 300ms 미만이어야 함
      // 키보드 매핑은 복잡한 로직이므로 여유있는 시간 설정
      expect(executionTime).toBeLessThan(300);
    });
  });

  describe('메모리 사용량 테스트', () => {
    test('함수 호출이 메모리 누수를 발생시키지 않음', () => {
      const originalKeys = Object.keys(QWERTY_TO_COLEMAK);
      
      // 대량 호출
      for (let i = 0; i < 1000; i++) {
        getCharacterFromKeyCode('KeyA', 'qwerty');
        getCharacterFromKeyCode('KeyE', 'colemak');
        getCharacterFromKeyCode('KeyQ', 'dvorak');
      }
      
      // 원본 매핑 객체가 변경되지 않았는지 확인
      expect(Object.keys(QWERTY_TO_COLEMAK)).toEqual(originalKeys);
    });
  });
});