import { Search, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const conversations = [
  { id: '1', name: 'Dr. James Kiprotich', avatar: 'JK', role: 'Instructor', last: 'Check the MDN docs for grid-template-columns.',        time: '10:25 AM',  unread: 0, active: true },
  { id: '2', name: 'Sarah Namugga',       avatar: 'SN', role: 'Instructor', last: 'Your assignment has been graded. Well done!',           time: 'Yesterday', unread: 1, active: false },
  { id: '3', name: 'Support Team',        avatar: 'ST', role: 'Support',    last: 'Your issue has been resolved.',                         time: 'Mon',       unread: 0, active: false },
];

const messages = [
  { id: '1', from: 'me',   text: 'Hi Dr. Kiprotich! I just finished lesson 8 and it was super clear.',                                           time: '10:15 AM' },
  { id: '2', from: 'them', text: 'Great to hear that, Aisha! Let me know if you have any questions.',                                             time: '10:18 AM' },
  { id: '3', from: 'me',   text: 'I do have one question — in the CSS grid exercise, should we use fr units or percentages?',                     time: '10:20 AM' },
  { id: '4', from: 'them', text: 'Both work, but fr units are preferred for responsive layouts. Check the MDN docs for grid-template-columns.',   time: '10:25 AM' },
];

export default function StudentMessagesPage() {
  const { t } = useLanguage();
  const d = t.lms.student.messages;

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{d.subtitle}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden flex h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <div className="w-72 border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder={d.search}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer border-b border-border/50 transition-colors ${
                  conv.active ? 'bg-primary-blue/5 border-l-2 border-l-primary-blue' : 'hover:bg-muted/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary-blue flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{conv.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold text-foreground truncate">{conv.name}</p>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5">{conv.role}</p>
                  <p className="text-xs text-muted-foreground truncate">{conv.last}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-primary-red rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1">
                    {conv.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-blue flex items-center justify-center">
              <span className="text-white text-xs font-bold">JK</span>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Dr. James Kiprotich</p>
              <p className="text-xs text-muted-foreground">Web Development · Instructor</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                  msg.from === 'me'
                    ? 'bg-primary-blue text-white rounded-2xl rounded-br-md'
                    : 'bg-muted text-foreground rounded-2xl rounded-bl-md'
                } px-4 py-2.5`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-blue-200' : 'text-muted-foreground'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-border">
            <div className="flex items-center gap-3">
              <input
                placeholder={d.placeholder}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
              />
              <button className="w-10 h-10 bg-primary-blue text-white rounded-xl flex items-center justify-center hover:bg-blue-900 transition-colors shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
