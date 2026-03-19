import { useState, useEffect } from 'react';

/**
 * Returns true only after the component has mounted on the client.
 * Use this to avoid hydration mismatches when reading from localStorage,
 * window, or other browser-only APIs.
 *
 * Example:
 *   const mounted = useMounted();
 *   if (!mounted) return null;
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
