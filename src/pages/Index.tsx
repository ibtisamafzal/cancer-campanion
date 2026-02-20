import { Link } from "react-router-dom";
import { FileSearch, FlaskConical, Pill, ArrowRight, Heart, Shield, Users, Activity, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

const tools = [
  {
    path: "/scan-reader",
    icon: FileSearch,
    title: "ScanReader",
    subtitle: "Pathology & Imaging Explainer",
    description:
      "Upload your radiology or pathology report and get a plain-English explanation of what it means — plus the right questions to ask your oncologist.",
    color: "bg-blue-500",
  },
  {
    path: "/trial-finder",
    icon: FlaskConical,
    title: "TrialFinder",
    subtitle: "Clinical Trial Matcher",
    description:
      "Find clinical trials that match your diagnosis, stage, and treatment history. We explain eligibility in language you can understand.",
    color: "bg-emerald-500",
  },
  {
    path: "/treatment-navigator",
    icon: Pill,
    title: "TreatmentNavigator",
    subtitle: "Drug & Side Effect Companion",
    description:
      "Enter your chemo regimen and get a day-by-day guide of what to expect, how to manage side effects, and when to call your doctor.",
    color: "bg-amber-500",
  },
];

const chartData = [
  { day: "S", value: 65 },
  { day: "M", value: 80 },
  { day: "T", value: 55 },
  { day: "W", value: 90 },
  { day: "T", value: 70 },
  { day: "F", value: 85 },
  { day: "S", value: 60 },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />

        <div className="container relative py-24 md:py-36 lg:py-44">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary border border-primary/20">
              <Heart className="h-4 w-4" />
              AI-Powered Oncology Support
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-foreground tracking-tight">
              We Take Care Of{" "}
              <span className="text-primary relative">
                Your Health
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From scan to clarity — AI that translates your reports, finds matching trials, and guides you through treatment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/scan-reader">
                <Button size="lg" className="gap-2 text-base px-10 h-14 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/trial-finder">
                <Button size="lg" variant="outline" className="gap-2 text-base px-10 h-14 rounded-2xl border-border/80">
                  Find Trials
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Stats Grid — Medrotic-inspired */}
      <section className="container -mt-6 relative z-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: Visual highlight card */}
          <div className="card-elevated p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-primary/[0.03] to-transparent min-h-[340px]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Why CancerCompanion</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                Empowering Patients With{" "}
                <span className="text-primary">AI-Driven</span> Clarity
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                We bridge the gap between complex medical reports and patient understanding, powered by cutting-edge medical AI models.
              </p>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-10 w-10 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white ${
                    ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500"][i]
                  }`}>
                    {["S", "M", "A", "K"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-foreground">50k+</p>
                <p className="text-xs text-muted-foreground">Patient Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right: Healthcare Statistics chart card */}
          <div className="card-elevated p-8 md:p-10 min-h-[340px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-xl font-bold text-foreground">Healthcare Statistics</h3>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 rounded-full px-3 py-1">
                <TrendingUp className="h-3 w-3" /> +24%
              </span>
            </div>
            <div className="text-center mt-4 mb-2">
              <p className="font-serif text-5xl font-bold text-foreground">12,450</p>
              <p className="text-sm text-muted-foreground mt-1">Active Patients This Month</p>
            </div>
            <div className="flex-1 mt-4 min-h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="20%">
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 4, 4]}>
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 3 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.25)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom row of small stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {[
            { label: "Reports Analyzed", value: "10k+", icon: Activity },
            { label: "Trials Matched", value: "5k+", icon: FlaskConical },
            { label: "Patient Rating", value: "4.9", icon: Star },
            { label: "Users Helped", value: "8k+", icon: Users },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-elevated p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-foreground leading-none">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services / Tools */}
      <section className="container pb-20 md:pb-28">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Our Services</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold">
            Here's What Makes Us Different
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
            Each tool is designed for a different stage of your cancer care journey.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.path} to={tool.path} className="group">
                <div className="card-elevated p-8 h-full flex flex-col gap-5">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${tool.color} text-white shadow-lg`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground">{tool.title}</h3>
                    <p className="text-sm text-primary font-semibold mt-1">{tool.subtitle}</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all pt-2">
                    Try it now <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust */}
      <section className="border-t bg-muted/30">
        <div className="container py-14 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            <span className="font-semibold text-sm uppercase tracking-wider">Trusted & Secure</span>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Powered by MedGemma & TxGemma medical AI models. Your data is never stored or shared. Built with privacy at its core.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
