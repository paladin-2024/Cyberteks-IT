import { Search, UserPlus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const users = [
  { id: '1', name: 'Aisha Nakato',       email: 'aisha@email.com',   role: 'STUDENT',  status: 'Active',    joined: 'Jan 2026', courses: 3 },
  { id: '2', name: 'Dr. James Kiprotich',email: 'james@cyberteks.com',role: 'TEACHER',  status: 'Active',    joined: 'Nov 2025', courses: 4 },
  { id: '3', name: 'Grace Atuhaire',     email: 'grace@email.com',   role: 'STUDENT',  status: 'Active',    joined: 'Feb 2026', courses: 2 },
  { id: '4', name: 'Moses Ssemakula',    email: 'moses@email.com',   role: 'STUDENT',  status: 'Suspended', joined: 'Dec 2025', courses: 1 },
  { id: '5', name: 'Sarah Namugga',      email: 'sarah@cyberteks.com',role: 'TEACHER',  status: 'Active',    joined: 'Oct 2025', courses: 2 },
  { id: '6', name: 'Admin User',         email: 'admin@cyberteks.com',role: 'ADMIN',    status: 'Active',    joined: 'Sep 2025', courses: 0 },
];

const roleConfig: Record<string, string> = {
  ADMIN:   'bg-purple-100 text-purple-700',
  TEACHER: 'bg-blue-100 text-blue-700',
  STUDENT: 'bg-green-100 text-green-700',
};

export default function UsersPage() {
  const { t } = useLanguage();
  const d = t.lms.admin.users;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} {d.title.toLowerCase()}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-900 transition-all">
          <UserPlus className="w-4 h-4" /> {d.addUser}
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          placeholder={d.search}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
        />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">{d.name}</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">{d.role}</th>
                <th className="text-center px-5 py-3.5 text-muted-foreground font-semibold hidden md:table-cell">{d.courses}</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold hidden sm:table-cell">{d.joined}</th>
                <th className="text-left px-5 py-3.5 text-muted-foreground font-semibold">{d.status}</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-blue flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">
                          {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleConfig[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center text-muted-foreground hidden md:table-cell">{user.courses}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{user.joined}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'Active' ? t.lms.status.active : t.lms.status.suspended}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-xs font-semibold text-primary-blue hover:text-primary-red transition-colors">{t.lms.common.edit}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
