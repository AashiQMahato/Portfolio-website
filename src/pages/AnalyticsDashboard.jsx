import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, Eye, MousePointerClick, TrendingUp, Globe2, ShieldCheck, Github } from 'lucide-react';
import { ScrollReveal } from '../components/ui';

// Mock Data
const trafficData = [
  { name: 'Mon', views: 400, visitors: 240 },
  { name: 'Tue', views: 300, visitors: 139 },
  { name: 'Wed', views: 520, visitors: 380 },
  { name: 'Thu', views: 450, visitors: 290 },
  { name: 'Fri', views: 600, visitors: 480 },
  { name: 'Sat', views: 350, visitors: 210 },
  { name: 'Sun', views: 420, visitors: 300 },
];

const sourceData = [
  { name: 'GitHub Profile', value: 450 },
  { name: 'LinkedIn', value: 300 },
  { name: 'Direct', value: 200 },
  { name: 'Google Search', value: 150 },
];

const AnalyticsDashboard = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl section-padding pt-28">
        {/* Header */}
        <ScrollReveal className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-border pb-8">
          <div>
            <h1 className="text-3xl font-bold font-display flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" /> Analytics
            </h1>
            <p className="text-muted-foreground mt-2">Portfolio traffic and engagement metrics</p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/60 backdrop-blur text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-green-500" /> Powered by privacy-first mock analytics
          </div>
        </ScrollReveal>

        {/* Top KPIs */}
        <ScrollReveal delay={0.1}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Visitors', value: '2,481', change: '+12%', icon: Users },
              { label: 'Page Views', value: '14,290', change: '+24%', icon: Eye },
              { label: 'Project Clicks', value: '842', change: '+18%', icon: MousePointerClick },
              { label: 'GitHub Referrals', value: '450', change: '+5%', icon: Github },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border bg-card/40 hover:bg-card/60 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* Traffic Area Chart */}
          <ScrollReveal delay={0.2} className="lg:col-span-2">
            <div className="p-6 rounded-2xl border border-border bg-card/40 h-[400px] flex flex-col">
              <h2 className="text-lg font-bold font-display mb-6">Traffic (Last 7 Days)</h2>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="rgb(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ScrollReveal>

          {/* Sources Bar Chart */}
          <ScrollReveal delay={0.3}>
            <div className="p-6 rounded-2xl border border-border bg-card/40 h-[400px] flex flex-col">
              <h2 className="text-lg font-bold font-display mb-6">Top Sources</h2>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} width={90} />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                    <Bar dataKey="value" fill="rgb(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Global Reach */}
        <ScrollReveal delay={0.4}>
          <div className="p-6 rounded-2xl border border-border bg-card/40 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Globe2 className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold font-display mb-2">Global Reach</h2>
              <p className="text-muted-foreground text-sm">Visitors from 42 different countries this month. Top regions: United States, Nepal, India, United Kingdom.</p>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;
