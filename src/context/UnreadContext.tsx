import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface UnreadContextValue {
  unreadMessages: number;
  unreadNotifications: number;
  refreshUnread: () => void;
}

const UnreadContext = createContext<UnreadContextValue>({
  unreadMessages: 0,
  unreadNotifications: 0,
  refreshUnread: () => {},
});

export function UnreadProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCounts = useCallback(() => {
    if (!user) return;

    api.get<{ unreadMessages: number }>('/messages/unread-count')
      .then((data) => setUnreadMessages(data.unreadMessages ?? 0))
      .catch(() => null);

    api.get<{ unreadCount: number }>('/notifications')
      .then((data) => setUnreadNotifications(data.unreadCount ?? 0))
      .catch(() => null);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUnreadMessages(0);
      setUnreadNotifications(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    fetchCounts();
    intervalRef.current = setInterval(fetchCounts, 30_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user, fetchCounts]);

  return (
    <UnreadContext.Provider value={{ unreadMessages, unreadNotifications, refreshUnread: fetchCounts }}>
      {children}
    </UnreadContext.Provider>
  );
}

export function useUnread(): UnreadContextValue {
  return useContext(UnreadContext);
}
