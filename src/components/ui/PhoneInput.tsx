import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Country = { code: string; name: string; dial: string; flag: string };

export const COUNTRIES: Country[] = [
  // East Africa first
  { code: 'UG', name: 'Uganda',                    dial: '+256', flag: '🇺🇬' },
  { code: 'KE', name: 'Kenya',                     dial: '+254', flag: '🇰🇪' },
  { code: 'TZ', name: 'Tanzania',                  dial: '+255', flag: '🇹🇿' },
  { code: 'RW', name: 'Rwanda',                    dial: '+250', flag: '🇷🇼' },
  { code: 'BI', name: 'Burundi',                   dial: '+257', flag: '🇧🇮' },
  { code: 'SS', name: 'South Sudan',               dial: '+211', flag: '🇸🇸' },
  { code: 'ET', name: 'Ethiopia',                  dial: '+251', flag: '🇪🇹' },
  // Rest of Africa
  { code: 'DZ', name: 'Algeria',                   dial: '+213', flag: '🇩🇿' },
  { code: 'AO', name: 'Angola',                    dial: '+244', flag: '🇦🇴' },
  { code: 'BJ', name: 'Benin',                     dial: '+229', flag: '🇧🇯' },
  { code: 'BW', name: 'Botswana',                  dial: '+267', flag: '🇧🇼' },
  { code: 'BF', name: 'Burkina Faso',              dial: '+226', flag: '🇧🇫' },
  { code: 'CM', name: 'Cameroon',                  dial: '+237', flag: '🇨🇲' },
  { code: 'CV', name: 'Cape Verde',                dial: '+238', flag: '🇨🇻' },
  { code: 'CF', name: 'Central African Republic',  dial: '+236', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad',                      dial: '+235', flag: '🇹🇩' },
  { code: 'KM', name: 'Comoros',                   dial: '+269', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo',                     dial: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'DR Congo',                  dial: '+243', flag: '🇨🇩' },
  { code: 'CI', name: 'Ivory Coast',               dial: '+225', flag: '🇨🇮' },
  { code: 'DJ', name: 'Djibouti',                  dial: '+253', flag: '🇩🇯' },
  { code: 'EG', name: 'Egypt',                     dial: '+20',  flag: '🇪🇬' },
  { code: 'GQ', name: 'Equatorial Guinea',         dial: '+240', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritrea',                   dial: '+291', flag: '🇪🇷' },
  { code: 'SZ', name: 'Eswatini',                  dial: '+268', flag: '🇸🇿' },
  { code: 'GA', name: 'Gabon',                     dial: '+241', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambia',                    dial: '+220', flag: '🇬🇲' },
  { code: 'GH', name: 'Ghana',                     dial: '+233', flag: '🇬🇭' },
  { code: 'GN', name: 'Guinea',                    dial: '+224', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau',             dial: '+245', flag: '🇬🇼' },
  { code: 'LS', name: 'Lesotho',                   dial: '+266', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia',                   dial: '+231', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya',                     dial: '+218', flag: '🇱🇾' },
  { code: 'MG', name: 'Madagascar',                dial: '+261', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi',                    dial: '+265', flag: '🇲🇼' },
  { code: 'ML', name: 'Mali',                      dial: '+223', flag: '🇲🇱' },
  { code: 'MR', name: 'Mauritania',                dial: '+222', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauritius',                 dial: '+230', flag: '🇲🇺' },
  { code: 'MA', name: 'Morocco',                   dial: '+212', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique',                dial: '+258', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibia',                   dial: '+264', flag: '🇳🇦' },
  { code: 'NE', name: 'Niger',                     dial: '+227', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria',                   dial: '+234', flag: '🇳🇬' },
  { code: 'ST', name: 'Sao Tome and Principe',     dial: '+239', flag: '🇸🇹' },
  { code: 'SN', name: 'Senegal',                   dial: '+221', flag: '🇸🇳' },
  { code: 'SC', name: 'Seychelles',                dial: '+248', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone',              dial: '+232', flag: '🇸🇱' },
  { code: 'SO', name: 'Somalia',                   dial: '+252', flag: '🇸🇴' },
  { code: 'ZA', name: 'South Africa',              dial: '+27',  flag: '🇿🇦' },
  { code: 'SD', name: 'Sudan',                     dial: '+249', flag: '🇸🇩' },
  { code: 'TG', name: 'Togo',                      dial: '+228', flag: '🇹🇬' },
  { code: 'TN', name: 'Tunisia',                   dial: '+216', flag: '🇹🇳' },
  { code: 'ZM', name: 'Zambia',                    dial: '+260', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe',                  dial: '+263', flag: '🇿🇼' },
  // Europe
  { code: 'AL', name: 'Albania',                   dial: '+355', flag: '🇦🇱' },
  { code: 'AM', name: 'Armenia',                   dial: '+374', flag: '🇦🇲' },
  { code: 'AT', name: 'Austria',                   dial: '+43',  flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaijan',                dial: '+994', flag: '🇦🇿' },
  { code: 'BY', name: 'Belarus',                   dial: '+375', flag: '🇧🇾' },
  { code: 'BE', name: 'Belgium',                   dial: '+32',  flag: '🇧🇪' },
  { code: 'BA', name: 'Bosnia and Herzegovina',    dial: '+387', flag: '🇧🇦' },
  { code: 'BG', name: 'Bulgaria',                  dial: '+359', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatia',                   dial: '+385', flag: '🇭🇷' },
  { code: 'CY', name: 'Cyprus',                    dial: '+357', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic',            dial: '+420', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark',                   dial: '+45',  flag: '🇩🇰' },
  { code: 'EE', name: 'Estonia',                   dial: '+372', flag: '🇪🇪' },
  { code: 'FI', name: 'Finland',                   dial: '+358', flag: '🇫🇮' },
  { code: 'FR', name: 'France',                    dial: '+33',  flag: '🇫🇷' },
  { code: 'GE', name: 'Georgia',                   dial: '+995', flag: '🇬🇪' },
  { code: 'DE', name: 'Germany',                   dial: '+49',  flag: '🇩🇪' },
  { code: 'GR', name: 'Greece',                    dial: '+30',  flag: '🇬🇷' },
  { code: 'HU', name: 'Hungary',                   dial: '+36',  flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland',                   dial: '+354', flag: '🇮🇸' },
  { code: 'IE', name: 'Ireland',                   dial: '+353', flag: '🇮🇪' },
  { code: 'IT', name: 'Italy',                     dial: '+39',  flag: '🇮🇹' },
  { code: 'XK', name: 'Kosovo',                    dial: '+383', flag: '🇽🇰' },
  { code: 'LV', name: 'Latvia',                    dial: '+371', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania',                 dial: '+370', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg',                dial: '+352', flag: '🇱🇺' },
  { code: 'MT', name: 'Malta',                     dial: '+356', flag: '🇲🇹' },
  { code: 'MD', name: 'Moldova',                   dial: '+373', flag: '🇲🇩' },
  { code: 'ME', name: 'Montenegro',                dial: '+382', flag: '🇲🇪' },
  { code: 'NL', name: 'Netherlands',               dial: '+31',  flag: '🇳🇱' },
  { code: 'MK', name: 'North Macedonia',           dial: '+389', flag: '🇲🇰' },
  { code: 'NO', name: 'Norway',                    dial: '+47',  flag: '🇳🇴' },
  { code: 'PL', name: 'Poland',                    dial: '+48',  flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal',                  dial: '+351', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania',                   dial: '+40',  flag: '🇷🇴' },
  { code: 'RU', name: 'Russia',                    dial: '+7',   flag: '🇷🇺' },
  { code: 'RS', name: 'Serbia',                    dial: '+381', flag: '🇷🇸' },
  { code: 'SK', name: 'Slovakia',                  dial: '+421', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia',                  dial: '+386', flag: '🇸🇮' },
  { code: 'ES', name: 'Spain',                     dial: '+34',  flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden',                    dial: '+46',  flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland',               dial: '+41',  flag: '🇨🇭' },
  { code: 'UA', name: 'Ukraine',                   dial: '+380', flag: '🇺🇦' },
  { code: 'GB', name: 'United Kingdom',            dial: '+44',  flag: '🇬🇧' },
  // Americas
  { code: 'AR', name: 'Argentina',                 dial: '+54',  flag: '🇦🇷' },
  { code: 'BO', name: 'Bolivia',                   dial: '+591', flag: '🇧🇴' },
  { code: 'BR', name: 'Brazil',                    dial: '+55',  flag: '🇧🇷' },
  { code: 'CA', name: 'Canada',                    dial: '+1',   flag: '🇨🇦' },
  { code: 'CL', name: 'Chile',                     dial: '+56',  flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia',                  dial: '+57',  flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica',                dial: '+506', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba',                      dial: '+53',  flag: '🇨🇺' },
  { code: 'DO', name: 'Dominican Republic',        dial: '+1',   flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador',                   dial: '+593', flag: '🇪🇨' },
  { code: 'SV', name: 'El Salvador',               dial: '+503', flag: '🇸🇻' },
  { code: 'GT', name: 'Guatemala',                 dial: '+502', flag: '🇬🇹' },
  { code: 'HT', name: 'Haiti',                     dial: '+509', flag: '🇭🇹' },
  { code: 'HN', name: 'Honduras',                  dial: '+504', flag: '🇭🇳' },
  { code: 'JM', name: 'Jamaica',                   dial: '+1',   flag: '🇯🇲' },
  { code: 'MX', name: 'Mexico',                    dial: '+52',  flag: '🇲🇽' },
  { code: 'NI', name: 'Nicaragua',                 dial: '+505', flag: '🇳🇮' },
  { code: 'PA', name: 'Panama',                    dial: '+507', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay',                  dial: '+595', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru',                      dial: '+51',  flag: '🇵🇪' },
  { code: 'TT', name: 'Trinidad and Tobago',       dial: '+1',   flag: '🇹🇹' },
  { code: 'US', name: 'United States',             dial: '+1',   flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay',                   dial: '+598', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela',                 dial: '+58',  flag: '🇻🇪' },
  // Asia & Middle East
  { code: 'AF', name: 'Afghanistan',               dial: '+93',  flag: '🇦🇫' },
  { code: 'BH', name: 'Bahrain',                   dial: '+973', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh',                dial: '+880', flag: '🇧🇩' },
  { code: 'BN', name: 'Brunei',                    dial: '+673', flag: '🇧🇳' },
  { code: 'KH', name: 'Cambodia',                  dial: '+855', flag: '🇰🇭' },
  { code: 'CN', name: 'China',                     dial: '+86',  flag: '🇨🇳' },
  { code: 'HK', name: 'Hong Kong',                 dial: '+852', flag: '🇭🇰' },
  { code: 'IN', name: 'India',                     dial: '+91',  flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia',                 dial: '+62',  flag: '🇮🇩' },
  { code: 'IR', name: 'Iran',                      dial: '+98',  flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq',                      dial: '+964', flag: '🇮🇶' },
  { code: 'IL', name: 'Israel',                    dial: '+972', flag: '🇮🇱' },
  { code: 'JP', name: 'Japan',                     dial: '+81',  flag: '🇯🇵' },
  { code: 'JO', name: 'Jordan',                    dial: '+962', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan',                dial: '+7',   flag: '🇰🇿' },
  { code: 'KW', name: 'Kuwait',                    dial: '+965', flag: '🇰🇼' },
  { code: 'KG', name: 'Kyrgyzstan',                dial: '+996', flag: '🇰🇬' },
  { code: 'LA', name: 'Laos',                      dial: '+856', flag: '🇱🇦' },
  { code: 'LB', name: 'Lebanon',                   dial: '+961', flag: '🇱🇧' },
  { code: 'MY', name: 'Malaysia',                  dial: '+60',  flag: '🇲🇾' },
  { code: 'MV', name: 'Maldives',                  dial: '+960', flag: '🇲🇻' },
  { code: 'MN', name: 'Mongolia',                  dial: '+976', flag: '🇲🇳' },
  { code: 'MM', name: 'Myanmar',                   dial: '+95',  flag: '🇲🇲' },
  { code: 'NP', name: 'Nepal',                     dial: '+977', flag: '🇳🇵' },
  { code: 'KP', name: 'North Korea',               dial: '+850', flag: '🇰🇵' },
  { code: 'OM', name: 'Oman',                      dial: '+968', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan',                  dial: '+92',  flag: '🇵🇰' },
  { code: 'PS', name: 'Palestine',                 dial: '+970', flag: '🇵🇸' },
  { code: 'PH', name: 'Philippines',               dial: '+63',  flag: '🇵🇭' },
  { code: 'QA', name: 'Qatar',                     dial: '+974', flag: '🇶🇦' },
  { code: 'SA', name: 'Saudi Arabia',              dial: '+966', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore',                 dial: '+65',  flag: '🇸🇬' },
  { code: 'KR', name: 'South Korea',               dial: '+82',  flag: '🇰🇷' },
  { code: 'LK', name: 'Sri Lanka',                 dial: '+94',  flag: '🇱🇰' },
  { code: 'SY', name: 'Syria',                     dial: '+963', flag: '🇸🇾' },
  { code: 'TW', name: 'Taiwan',                    dial: '+886', flag: '🇹🇼' },
  { code: 'TJ', name: 'Tajikistan',                dial: '+992', flag: '🇹🇯' },
  { code: 'TH', name: 'Thailand',                  dial: '+66',  flag: '🇹🇭' },
  { code: 'TL', name: 'Timor-Leste',               dial: '+670', flag: '🇹🇱' },
  { code: 'TR', name: 'Turkey',                    dial: '+90',  flag: '🇹🇷' },
  { code: 'TM', name: 'Turkmenistan',              dial: '+993', flag: '🇹🇲' },
  { code: 'AE', name: 'UAE',                       dial: '+971', flag: '🇦🇪' },
  { code: 'UZ', name: 'Uzbekistan',                dial: '+998', flag: '🇺🇿' },
  { code: 'VN', name: 'Vietnam',                   dial: '+84',  flag: '🇻🇳' },
  { code: 'YE', name: 'Yemen',                     dial: '+967', flag: '🇾🇪' },
  // Oceania
  { code: 'AU', name: 'Australia',                 dial: '+61',  flag: '🇦🇺' },
  { code: 'FJ', name: 'Fiji',                      dial: '+679', flag: '🇫🇯' },
  { code: 'NZ', name: 'New Zealand',               dial: '+64',  flag: '🇳🇿' },
  { code: 'PG', name: 'Papua New Guinea',          dial: '+675', flag: '🇵🇬' },
  { code: 'WS', name: 'Samoa',                     dial: '+685', flag: '🇼🇸' },
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
