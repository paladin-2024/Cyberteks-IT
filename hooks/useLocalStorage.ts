import { useState, useEffect } from 'react';

/**
 * A type-safe wrapper around localStorage that syncs state automatically.
 * Falls back gracefully if localStorage is unavailable (SSR / private mode).
 *
 * @param key          The localStorage key
 * @param initialValue The default value if nothing is stored yet
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // localStorage unavailable or JSON parse error — use initial value
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors (e.g. storage quota exceeded)
    }
  };

  return [storedValue, setValue];
}
