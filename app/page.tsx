import Link from 'next/link'
import { ArrowRight, FileText, Zap, Users, TrendingUp, Clock, BarChart2 } from 'lucide-react'
import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="relative max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            AI-Powered Sports Marketing Intelligence
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-100 leading-[1.1] tracking-tight">
            Generate Professional<br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Sports Marketing
            </span>
            <br />
            Campaign Briefs
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Turn a brand objective into a complete athlete partnership strategy using AI.
            The same quality your agency would charge six figures to produce.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/campaign"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
            >
              Create Campaign
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Clock className="h-4 w-4" />
              View History
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-900 py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3">
              A complete strategy, not a summary
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Every brief includes 12 fully developed sections ready to present to a client or internal stakeholder.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 mb-3">
                  <f.icon className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-900 py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">Ready to build your brief?</h2>
          <p className="text-zinc-400 mb-8">Takes about 30 seconds to fill in. Brief is ready in under a minute.</p>
          <Link
            href="/campaign"
            className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Create Campaign
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-8 px-4">
        <div className="mx-auto max-w-7xl text-center text-xs text-zinc-600">
          Campaign Brief Generator
        </div>
      </footer>
    </div>
  )
}

const FEATURES = [
  {
    icon: FileText,
    title: 'Executive Summary',
    description: 'Challenge, opportunity, and recommendation structured for executive review.',
  },
  {
    icon: Users,
    title: '5 Athlete Recommendations',
    description: 'Specific athletes with audience overlap, brand alignment, and partnership tier.',
  },
  {
    icon: Zap,
    title: 'Campaign Concept',
    description: 'A single campaign idea with a memorable name, insight, and consumer rationale.',
  },
  {
    icon: TrendingUp,
    title: 'Omnichannel Activation Plan',
    description: 'Ten channels covered: social, video, events, retail, PR, digital, and more.',
  },
  {
    icon: BarChart2,
    title: 'KPIs & Budget Allocation',
    description: 'Specific numeric targets and percentage-based budget breakdowns.',
  },
  {
    icon: Clock,
    title: 'Campaign Timeline',
    description: 'Phased timeline from pre-launch through measurement with activity breakdowns.',
  },
]
