import { DEFAULT_MESSAGE_SETTINGS } from '../domain/template';
import type { MessageSettings } from '../domain/types';

const STORAGE_KEY = 'adrianadigital:message-settings:v1';

/**
 * Loads persisted greeting and farewell settings from localStorage, falling back to defaults.
 */
export function loadMessageSettings(storage: Storage | undefined = getSafeStorage()): MessageSettings {
  if (!storage) {
    return { ...DEFAULT_MESSAGE_SETTINGS };
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_MESSAGE_SETTINGS };
    }
    const parsed = JSON.parse(raw) as Partial<MessageSettings>;
    return {
      greeting:
        typeof parsed.greeting === 'string' && parsed.greeting.trim().length > 0
          ? parsed.greeting
          : DEFAULT_MESSAGE_SETTINGS.greeting,
      farewell:
        typeof parsed.farewell === 'string' && parsed.farewell.trim().length > 0
          ? parsed.farewell
          : DEFAULT_MESSAGE_SETTINGS.farewell,
    };
  } catch {
    return { ...DEFAULT_MESSAGE_SETTINGS };
  }
}

/**
 * Saves greeting and farewell settings to localStorage.
 */
export function saveMessageSettings(
  settings: MessageSettings,
  storage: Storage | undefined = getSafeStorage()
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

/**
 * Resets message settings in localStorage back to defaults.
 */
export function resetMessageSettings(
  storage: Storage | undefined = getSafeStorage()
): MessageSettings {
  const defaults = { ...DEFAULT_MESSAGE_SETTINGS };
  saveMessageSettings(defaults, storage);
  return defaults;
}

function getSafeStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}
