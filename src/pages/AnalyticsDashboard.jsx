import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Reveal, SplitText } from "../motion";

// Sample data — this page is a layout demo, not real visitor analytics.
const trafficData = [
  { name: "Mon", views: 400, visitors: 240 },
  { name: "Tue", views: 300, visitors: 139 },
  { name: "Wed", views: 520, visitors: 380 },
  { name: "Thu", views: 450, visitors: 290 },
  { name: "Fri", views: 600, visitors: 480 },
  { name: "Sat", views: 350, visitors: 210 },
  { name: "Sun", views: 420, visitors: 300 },
];

const sourceData = [
  { name: "GitHub Profile", value: 450 },
  { name: "LinkedIn", value: 300 },
  { name: "Direct", value: 200 },
  { name: "Google Search", value: 150 },
];

const KPIS = [
  { label: "Total visitors", value: "2,481", change: "+12%" },
  { label: "Page views", value: "14,290", change: "+24%" },
  { label: "Project clicks", value: "842", change: "+18%" },
  { label: "GitHub referrals", value: "450", change: "+5%" },
];

// Chart chrome reads the live theme tokens, so both themes recolor for free.
const AXIS_TICK = { fontSize: 12, fill: "rgb(var(--ink-dim))" };
const TOOLTIP = {
  contentStyle: {
    backgroundColor: "rgb(var(--panel))",
    border: "1px solid rgb(var(--line))",
    borderRadius: 8,
    color: "rgb(var(--ink))",
  },
  labelStyle: { color: "rgb(var(--ink-dim))" },
  itemStyle: { color: "rgb(var(--ink))" },
};

const AnalyticsDashboard = () => {
  return (
    <div className="shell pb-[clamp(5rem,12vh,9rem)] pt-[calc(var(--nav-h)+clamp(3rem,10vh,7rem))]">
      <header className="max-w-5xl">
        <Reveal variant="fade">
          <p className="hud">
            (Analytics) — <span className="text-accent-ink">Demo data</span>
          </p>
        </Reveal>
        <Reveal variant="lines" className="mt-6">
          <SplitText as="h1" text="Analytics" className="text-display text-ink" />
        </Reveal>
        <Reveal variant="rise" delay={0.2}>
          <p className="mt-8 max-w-2xl text-lede text-ink-dim">
            A preview of the portfolio traffic dashboard. Every number below is sample data,
            not real visitor metrics.
          </p>
        </Reveal>
      </header>

      <Reveal
        as="dl"
        variant="rise"
        className="mt-[clamp(4rem,10vh,7rem)] grid grid-cols-2 border-y border-line lg:grid-cols-4">
        {KPIS.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col gap-3 py-6 pr-6 ${i % 2 ? "border-l border-line pl-6" : ""} ${
              i > 1 ? "border-t border-line lg:border-t-0" : ""
            } ${i === 2 ? "lg:border-l lg:pl-6" : ""}`}>
            <dt className="hud">{stat.label}</dt>
            <dd className="flex items-baseline gap-3">
              <span className="text-4xl font-semibold tracking-tight tabular-nums text-ink">
                {stat.value}
              </span>
              <span className="hud tabular-nums text-accent-ink">{stat.change}</span>
            </dd>
          </div>
        ))}
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Reveal as="section" variant="rise" className="panel flex h-[400px] flex-col p-6 lg:col-span-2">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold text-ink">Traffic</h2>
            <p className="hud">Last 7 days · views</p>
          </div>
          <div className="min-h-0 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgb(var(--line))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK} />
                <Tooltip {...TOOLTIP} cursor={{ stroke: "rgb(var(--line))" }} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="rgb(var(--signal))"
                  strokeWidth={2}
                  fill="rgb(var(--signal))"
                  fillOpacity={0.08}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        <Reveal as="section" variant="rise" delay={0.08} className="panel flex h-[400px] flex-col p-6">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold text-ink">Top sources</h2>
            <p className="hud">Visits</p>
          </div>
          <div className="min-h-0 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="rgb(var(--line))" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ ...AXIS_TICK, fill: "rgb(var(--ink))" }}
                  width={90}
                />
                <Tooltip {...TOOLTIP} cursor={{ fill: "rgb(var(--line) / 0.5)" }} />
                <Bar dataKey="value" fill="rgb(var(--signal))" radius={[0, 2, 2, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      </div>

      <Reveal
        as="section"
        variant="rise"
        className="mt-8 grid gap-4 border-t border-line pt-8 md:grid-cols-12 md:gap-8">
        <h2 className="text-lg font-semibold text-ink md:col-span-3">Global reach</h2>
        <p className="text-ink-dim md:col-span-9">
          Visitors from 42 different countries this month. Top regions: United States, Nepal,
          India, United Kingdom.
        </p>
      </Reveal>
    </div>
  );
};

export default AnalyticsDashboard;
