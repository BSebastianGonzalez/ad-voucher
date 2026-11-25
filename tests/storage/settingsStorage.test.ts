import { describe, expect, it } from 'vitest';
import { DEFAULT_MESSAGE_SETTINGS } from '../../src/domain/template';
import {
  loadMessageSettings,
  resetMessageSettings,
  saveMessageSettings,
} from '../../src/storage/settingsStorage';

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}

describe('settingsStorage', () => {
  it('returns defaults when storage is empty or unavailable', () => {
    expect(loadMessageSettings(undefined)).toEqual(DEFAULT_MESSAGE_SETTINGS);
    expect(loadMessageSettings(createMemoryStorage())).toEqual(DEFAULT_MESSAGE_SETTINGS);
  });

  it('persists and resets greeting and farewell', () => {
    const storage = createMemoryStorage();
    saveMessageSettings({ greeting: 'Hola', farewell: 'Chao' }, storage);
    expect(loadMessageSettings(storage)).toEqual({ greeting: 'Hola', farewell: 'Chao' });

    const reset = resetMessageSettings(storage);
    expect(reset).toEqual(DEFAULT_MESSAGE_SETTINGS);
    expect(loadMessageSettings(storage)).toEqual(DEFAULT_MESSAGE_SETTINGS);
  });
});
