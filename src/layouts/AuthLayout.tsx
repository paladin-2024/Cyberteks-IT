import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex relative flex-col justify-between bg-[#080f2a] p-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-red/10 rounded-full blur-3xl" />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3">
          <img
            src="/assets/logo-round.png"
            alt="CyberteksIT"
            className="w-10 h-10 object-contain"
          />
        </Link>

        {/* Center quote */}
        <div className="relative">
          <div className="text-6xl text-white/10 font-display font-bold leading-none mb-4">&ldquo;</div>
          <p className="text-white/80 text-lg leading-relaxed font-medium max-w-sm">
            Empowering Uganda&apos;s next generation of ICT professionals — one lesson at a time.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">CyberteksIT LMS</p>
              <p className="text-white/50 text-xs">Learning Management System</p>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative grid grid-cols-3 gap-6">
          {[
            { value: '3,000+', label: 'Graduates' },
            { value: '7',      label: 'Programs' },
            { value: '98%',    label: 'Completion Rate' },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-10">
            <img
              src="/assets/logo-round.png"
              alt="CyberteksIT"
              className="w-9 h-9 object-contain"
            />
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
