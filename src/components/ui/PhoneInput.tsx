import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Country = { code: string; name: string; dial: string; flag: string };

export const COUNTRIES: Country[] = [
  // East Africa first
  { code: 'UG', name: 'Uganda',           dial: '+256', flag: '🇺🇬' },
  { code: 'KE', name: 'Kenya',            dial: '+254', flag: '🇰🇪' },
  { code: 'TZ', name: 'Tanzania',         dial: '+255', flag: '🇹🇿' },
  { code: 'RW', name: 'Rwanda',           dial: '+250', flag: '🇷🇼' },
  { code: 'BI', name: 'Burundi',          dial: '+257', flag: '🇧🇮' },
  { code: 'SS', name: 'South Sudan',      dial: '+211', flag: '🇸🇸' },
  { code: 'ET', name: 'Ethiopia',         dial: '+251', flag: '🇪🇹' },
  // Rest of Africa
  { code: 'NG', name: 'Nigeria',          dial: '+234', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana',            dial: '+233', flag: '🇬🇭' },
  { code: 'ZA', name: 'South Africa',     dial: '+27',  flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt',            dial: '+20',  flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco',          dial: '+212', flag: '🇲🇦' },
  { code: 'SN', name: 'Senegal',          dial: '+221', flag: '🇸🇳' },
  { code: 'CD', name: 'DR Congo',         dial: '+243', flag: '🇨🇩' },
  { code: 'CM', name: 'Cameroon',         dial: '+237', flag: '🇨🇲' },
  // International
  { code: 'GB', name: 'United Kingdom',   dial: '+44',  flag: '🇬🇧' },
  { code: 'US', name: 'United States',    dial: '+1',   flag: '🇺🇸' },
  { code: 'CA', name: 'Canada',           dial: '+1',   flag: '🇨🇦' },
  { code: 'AE', name: 'UAE',              dial: '+971', flag: '🇦🇪' },
  { code: 'IN', name: 'India',            dial: '+91',  flag: '🇮🇳' },
  { code: 'CN', name: 'China',            dial: '+86',  flag: '🇨🇳' },
  { code: 'DE', name: 'Germany',          dial: '+49',  flag: '🇩🇪' },
  { code: 'FR', name: 'France',           dial: '+33',  flag: '🇫🇷' },
  { code: 'AU', name: 'Australia',        dial: '+61',  flag: '🇦🇺' },
];

interface PhoneInputProps {
  value: string;
  onChange: (full: string, number: string, country: Country) => void;
  placeholder?: string;
  className?: string;
}

export default function PhoneInput({ value, onChange, placeholder = '700 000 000', className }: PhoneInputProps) {
  const [selected, setSelected] = useState<Country>(COUNTRIES[0]); // Uganda default
  const [number, setNumber]     = useState('');
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState('');
  const dropRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync if parent provides a value (e.g. on reset)
  useEffect(() => {
    if (!value) { setNumber(''); }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false); setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.dial.includes(query) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  );

  const pick = (c: Country) => {
    setSelected(c); setOpen(false); setQuery('');
    onChange(`${c.dial}${number}`, number, c);
  };

  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s\-]/g, '');
    setNumber(raw);
    onChange(`${selected.dial}${raw}`, raw, selected);
  };

  return (
    <div className={cn('relative flex rounded-xl border border-gray-200 bg-white overflow-visible', className)} ref={dropRef}>
      {/* Country selector */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2.5 border-r border-gray-200 bg-gray-50/80 hover:bg-gray-100 transition-colors shrink-0',
          'text-sm font-medium text-gray-700 rounded-l-xl',
          open && 'bg-gray-100',
        )}
      >
        <span className="text-lg leading-none">{selected.flag}</span>
        <span className="text-gray-500">{selected.dial}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {/* Number input */}
      <input
        type="tel"
        value={number}
        onChange={handleNumber}
        placeholder={placeholder}
        className="flex-1 px-3 py-2.5 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400 rounded-r-xl focus:ring-0"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search country…"
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
          {/* List */}
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">No results</div>
            ) : filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => pick(c)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors',
                  selected.code === c.code && 'bg-primary-blue/5 text-primary-blue font-semibold',
                )}
              >
                <span className="text-lg leading-none w-6 text-center">{c.flag}</span>
                <span className="flex-1 text-gray-700 truncate">{c.name}</span>
                <span className="text-gray-400 text-xs font-mono">{c.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
