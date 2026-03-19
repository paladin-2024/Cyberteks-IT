import * as React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number | string; color: string }>;
  label?: string;
  formatter?: (value: number | string, name: string) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-lg text-sm">
      {label && <p className="font-semibold text-foreground mb-2">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="capitalize">{entry.name}:</span>
          <span className="font-medium text-foreground">
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ChartContainer({
  children,
  className,
  height = 300,
}: {
  children: React.ReactNode;
  className?: string;
  height?: number;
}) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

export function ChartArea({
  data,
  dataKeys,
  xKey = 'name',
  formatter,
  className,
  height,
}: {
  data: Record<string, unknown>[];
  dataKeys: string[];
  xKey?: string;
  formatter?: (value: number | string, name: string) => string;
  className?: string;
  height?: number;
}) {
  return (
    <ChartContainer className={className} height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <defs>
          {dataKeys.map((key, i) => (
            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.2} />
              <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltipContent formatter={formatter} />} />
        {dataKeys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2}
            fill={`url(#gradient-${key})`}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

export function ChartBar({
  data,
  dataKeys,
  xKey = 'name',
  formatter,
  ugxFormat,
  className,
  height,
}: {
  data: Record<string, unknown>[];
  dataKeys: string[];
  xKey?: string;
  formatter?: (value: number | string, name: string) => string;
  ugxFormat?: boolean;
  className?: string;
  height?: number;
}) {
  const resolvedFormatter = formatter ?? (ugxFormat ? (v: number | string) => `UGX ${Number(v).toLocaleString()}` : undefined);
  return (
    <ChartContainer className={className} height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltipContent formatter={resolvedFormatter} />} />
        <Legend />
        {dataKeys.map((key, i) => (
          <Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[6, 6, 0, 0]} />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

export function ChartLine({
  data,
  dataKeys,
  xKey = 'name',
  formatter,
  className,
  height,
}: {
  data: Record<string, unknown>[];
  dataKeys: string[];
  xKey?: string;
  formatter?: (value: number | string, name: string) => string;
  className?: string;
  height?: number;
}) {
  return (
    <ChartContainer className={className} height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltipContent formatter={formatter} />} />
        <Legend />
        {dataKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS[i % CHART_COLORS.length], r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

export function ChartPie({
  data,
  nameKey = 'name',
  valueKey = 'value',
  donut = false,
  className,
  height,
}: {
  data: Record<string, unknown>[];
  nameKey?: string;
  valueKey?: string;
  donut?: boolean;
  className?: string;
  height?: number;
}) {
  return (
    <ChartContainer className={className} height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={donut ? '55%' : 0}
          outerRadius="80%"
          dataKey={valueKey}
          nameKey={nameKey}
          paddingAngle={3}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
}
