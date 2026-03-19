import { useState, useEffect } from 'react';

/**
 * Delays updating a value until the user stops typing.
 * Useful for search inputs to avoid firing a request on every keystroke.
 *
 * @param value  The raw value to debounce (e.g. the search input string)
 * @param delay  How many milliseconds to wait after the last change (default 400ms)
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
