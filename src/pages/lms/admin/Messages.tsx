import { useState, useEffect, useRef } from 'react';
import { Search, Send, MessageSquare, Plus, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUnread } from '@/context/UnreadContext';
import { api } from '@/lib/api';

interface OtherUser { id: string; name: string | null; image: string | null; role: string; }
interface Conversation {
  id: string;
  otherUser: OtherUser | null;
  lastMessage: { content: string; createdAt: string } | null;
  unreadCount: number;
  updatedAt: string;
}
interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: { id: string; name: string | null; image: string | null };
}

function initials(name: string | null) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'short' });
}

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const { refreshUnread } = useUnread();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<OtherUser[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    api.get<{ conversations: Conversation[] }>('/messages/conversations')
      .then(({ conversations }) => setConversations(conversations))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeId) return;
    api.get<{ messages: Message[] }>(`/messages/conversations/${activeId}`)
      .then(({ messages }) => {
        setMessages(messages);
        setConversations((prev) =>
          prev.map((c) => (c.id === activeId ? { ...c, unreadCount: 0 } : c))
        );
      });
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !activeId || sending) return;
    setSending(true);
    try {
      const { message } = await api.post<{ message: Message }>(
        `/messages/conversations/${activeId}/messages`,
        { content: text.trim() }
      );
      setMessages((prev) => [...prev, message]);
      setText('');
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, lastMessage: { content: message.content, createdAt: message.createdAt }, updatedAt: message.createdAt }
            : c
        )
      );
      refreshUnread();
    } finally {
      setSending(false);
    }
  };

  const startNewChat = async (targetUser: OtherUser) => {
    setShowNewChat(false);
    const { conversationId } = await api.post<{ conversationId: string }>(
      '/messages/conversations',
      { receiverId: targetUser.id }
    );
    const existing = conversations.find((c) => c.id === conversationId);
    if (!existing) {
      const newConv: Conversation = {
        id: conversationId,
        otherUser: targetUser,
        lastMessage: null,
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };
      setConversations((prev) => [newConv, ...prev]);
    }
    setActiveId(conversationId);
  };

  const openNewChat = async () => {
    setShowNewChat(true);
    if (availableUsers.length === 0) {
      const { users } = await api.get<{ users: OtherUser[] }>('/messages/users');
      setAvailableUsers(users);
    }
  };

  const filtered = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">Communicate with teachers and students</p>
        </div>
        <button
          onClick={openNewChat}
          className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Message
        </button>
      </div>

      {/* New Message modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">New Message</h2>
              <button onClick={() => setShowNewChat(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {availableUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
              ) : availableUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => startNewChat(u)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-blue flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{initials(u.name)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{u.role.toLowerCase()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden flex h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-muted shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 bg-muted rounded w-3/4" />
                      <div className="h-2 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            ) : filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-border/50 transition-colors text-left ${
                  conv.id === activeId ? 'bg-primary-blue/5 border-l-2 border-l-primary-blue' : 'hover:bg-muted/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary-blue flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{initials(conv.otherUser?.name ?? null)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold text-foreground truncate">{conv.otherUser?.name ?? 'Unknown'}</p>
                    {conv.lastMessage && (
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">{timeLabel(conv.lastMessage.createdAt)}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 capitalize">{conv.otherUser?.role?.toLowerCase()}</p>
                  {conv.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.content}</p>
                  )}
                </div>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-primary-red rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {activeConv ? (
          <div className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-blue flex items-center justify-center">
                <span className="text-white text-xs font-bold">{initials(activeConv.otherUser?.name ?? null)}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{activeConv.otherUser?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{activeConv.otherUser?.role?.toLowerCase()}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">No messages yet. Say hello!</p>
                </div>
              ) : messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                      isMe
                        ? 'bg-primary-blue text-white rounded-2xl rounded-br-md'
                        : 'bg-muted text-foreground rounded-2xl rounded-bl-md'
                    } px-4 py-2.5`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-muted-foreground'}`}>
                        {timeLabel(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center gap-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim() || sending}
                  className="w-10 h-10 bg-primary-blue text-white rounded-xl flex items-center justify-center hover:bg-blue-900 transition-colors shrink-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="w-14 h-14 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-foreground mb-1">Your messages</p>
            <p className="text-sm text-muted-foreground mb-4">Select a conversation or start a new message</p>
            <button
              onClick={openNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
