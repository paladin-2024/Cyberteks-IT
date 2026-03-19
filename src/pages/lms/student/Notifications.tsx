import { Bell, CheckCheck, BookOpen, Award, MessageSquare, CreditCard, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const notifications = [
  { id: '1', type: 'COURSE',      title: 'New lesson available',                        body: 'Lesson 19 "Advanced JavaScript Patterns" has been published in Web Development Fundamentals.',           time: '2 hours ago',  read: false },
  { id: '2', type: 'MESSAGE',     title: 'New message from Dr. James Kiprotich',         body: 'Check the MDN docs for grid-template-columns — both fr and % work but fr is preferred.',              time: '5 hours ago',  read: false },
  { id: '3', type: 'GRADE',       title: 'Assignment graded',                            body: 'Your Python basics assignment has been graded. You scored 88/100. Great work!',                        time: 'Yesterday',    read: true },
  { id: '4', type: 'CERTIFICATE', title: 'Certificate issued',                           body: 'Congratulations! Your certificate for IT Support & Networking is ready to download.',                  time: '3 days ago',   read: true },
  { id: '5', type: 'INVOICE',     title: 'Invoice paid',                                 body: 'Payment of UGX 450,000 for Web Development Fundamentals has been confirmed.',                          time: '1 week ago',   read: true },
  { id: '6', type: 'INFO',        title: 'Scheduled maintenance',                        body: 'The platform will be unavailable on Sunday Mar 15 from 02:00–04:00 AM for scheduled maintenance.',    time: '1 week ago',   read: true },
];

const iconMap: Record<string, React.ReactNode> = {
  COURSE:      <BookOpen    className="w-4 h-4 text-primary-blue" />,
  MESSAGE:     <MessageSquare className="w-4 h-4 text-purple-500" />,
  GRADE:       <Award       className="w-4 h-4 text-amber-500" />,
  CERTIFICATE: <Award       className="w-4 h-4 text-green-500" />,
  INVOICE:     <CreditCard  className="w-4 h-4 text-emerald-500" />,
  INFO:        <Info        className="w-4 h-4 text-muted-foreground" />,
};

const bgMap: Record<string, string> = {
  COURSE:      'bg-primary-blue/10',
  MESSAGE:     'bg-purple-100',
  GRADE:       'bg-amber-100',
  CERTIFICATE: 'bg-green-100',
  INVOICE:     'bg-emerald-100',
  INFO:        'bg-muted',
};

export default function StudentNotificationsPage() {
  const { t } = useLanguage();
  const d = t.lms.student.notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} ${d.unread}` : d.allCaughtUp}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-blue hover:text-blue-900 transition-colors">
            <CheckCheck className="w-4 h-4" /> {d.markAllRead}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-heading font-semibold text-foreground mb-1">{d.noneTitle}</p>
          <p className="text-sm text-muted-foreground">{d.noneSubtitle}</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/30 ${
                !notif.read ? 'bg-primary-blue/5' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bgMap[notif.type]}`}>
                {iconMap[notif.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notif.title}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-primary-red" />}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
