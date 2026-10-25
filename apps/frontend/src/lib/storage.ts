/**
 * Safe Storage wrapper protecting against SecurityError:
 * "Failed to read the 'localStorage' property from 'Window': Access is denied for this document."
 * which happens in incognito mode, embedded iframes, or restrictive browser security settings.
 */

class FallbackMemoryStorage {
  private data: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.data[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.data[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.data[key];
  }
}

const fallbackStorage = new FallbackMemoryStorage();

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Storage access blocked by browser
    }
    return fallbackStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Storage access blocked by browser
    }
    fallbackStorage.setItem(key, value);
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // Storage access blocked by browser
    }
    fallbackStorage.removeItem(key);
  },
};

export function safeSetCookie(cookieString: string): void {
  try {
    if (typeof document !== 'undefined') {
      document.cookie = cookieString;
    }
  } catch {
    // Cookie access blocked
  }
}
