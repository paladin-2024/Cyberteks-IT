import { Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsPage() {
  const { t } = useLanguage();
  const d = t.lms.admin.settings;

  const fields = [
    { label: d.platformName,  value: 'Cyberteks-IT LMS' },
    { label: d.supportEmail,  value: 'support@cyberteks-it.com' },
    { label: d.timezone,      value: 'Africa/Kampala (UTC+3)' },
    { label: d.language,      value: 'English' },
  ];

  const notificationToggles = [
    { label: d.newApplication,  desc: d.newApplicationDesc,  enabled: true },
    { label: d.invoicePaid,     desc: d.invoicePaidDesc,     enabled: true },
    { label: d.newEnrollment,   desc: d.newEnrollmentDesc,   enabled: false },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{d.subtitle}</p>
      </div>

      {/* Platform info */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-foreground">{d.platformInfo}</h2>
        {fields.map((field) => (
          <div key={field.label} className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{field.label}</label>
            <input
              defaultValue={field.value}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
            />
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-heading font-semibold text-foreground">{d.notifications}</h2>
        {notificationToggles.map((item) => (
          <label key={item.label} className="flex items-center justify-between cursor-pointer gap-4">
            <div>
              <p className="text-sm text-foreground font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <div className={`w-10 h-6 rounded-full relative transition-colors shrink-0 ${item.enabled ? 'bg-primary-blue' : 'bg-muted'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-card rounded-full shadow transition-all ${item.enabled ? 'left-5' : 'left-1'}`} />
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-900 transition-all">
          <Save className="w-4 h-4" /> {d.save}
        </button>
      </div>
    </div>
  );
}
