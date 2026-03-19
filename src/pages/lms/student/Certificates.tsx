import { Award, Download, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const certificates = [
  {
    id: '1',
    title: 'IT Support & Networking',
    issueDate: 'February 20, 2026',
    credentialId: 'CYB-2026-IT-0042',
    instructor: 'Dr. James Kiprotich',
    hours: 48,
  },
];

const inProgressCourses = [
  { title: 'Web Development Fundamentals',       progress: 72 },
  { title: 'Data Analysis with Excel & Python',  progress: 25 },
];

export default function CertificatesPage() {
  const { t } = useLanguage();
  const d = t.lms.student.certificates;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{d.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {certificates.length} {certificates.length !== 1 ? d.earnedPlural : d.earned}
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-heading font-semibold text-foreground mb-1">{d.noCerts}</p>
          <p className="text-sm text-muted-foreground">{d.noCertsSubtitle}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="bg-primary-blue px-6 py-8 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-white/10" />
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full border border-white/10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-amber-300" />
                    <span className="text-white/70 text-xs font-medium uppercase tracking-wider">{d.completion}</span>
                  </div>
                  <h2 className="font-heading text-xl font-bold text-white mb-1">{cert.title}</h2>
                  <p className="text-white/70 text-sm">{d.issuedBy} · {cert.issueDate}</p>
                </div>
              </div>

              <div className="px-6 py-5">
                <div className="grid sm:grid-cols-3 gap-4 mb-5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{d.credentialId}</p>
                    <p className="text-sm font-mono font-semibold text-foreground">{cert.credentialId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{d.instructor}</p>
                    <p className="text-sm font-semibold text-foreground">{cert.instructor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{d.courseHours}</p>
                    <p className="text-sm font-semibold text-foreground">{cert.hours} hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-900 transition-all">
                    <Download className="w-4 h-4" /> {d.downloadPdf}
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm font-semibold rounded-xl text-muted-foreground hover:bg-muted/50 transition-all">
                    <ExternalLink className="w-4 h-4" /> {d.share}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-muted/40 border border-border rounded-2xl p-5">
        <h3 className="font-heading font-semibold text-foreground mb-1 text-sm">{d.inProgress}</h3>
        <p className="text-xs text-muted-foreground mb-3">{d.inProgressSubtitle}</p>
        <div className="space-y-2">
          {inProgressCourses.map((c) => (
            <div key={c.title} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground font-medium">{c.title}</span>
                  <span className="text-xs text-muted-foreground">{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary-blue" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
