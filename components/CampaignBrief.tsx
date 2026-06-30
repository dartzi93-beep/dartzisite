'use client'
import { useState, useCallback } from 'react'
import {
  Download, Copy, Check, Star, Printer, RefreshCw,
  ChevronDown, ChevronRight, AlertTriangle, TrendingUp,
  Users, Lightbulb, Calendar, Target, DollarSign, BarChart2
} from 'lucide-react'
import { cn, saveCampaign } from '@/lib/utils'
import type { Campaign, CampaignBriefData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BriefSection from '@/components/BriefSection'

interface Props {
  campaign: Campaign
  onUpdate: (updated: Campaign) => void
}

const TIER_COLORS: Record<string, 'blue' | 'green' | 'yellow' | 'purple'> = {
  'Tier 1': 'blue',
  'Tier 2': 'green',
  'Tier 3': 'yellow',
}

function tierColor(tier: string): 'blue' | 'green' | 'yellow' | 'purple' {
  for (const [key, val] of Object.entries(TIER_COLORS)) {
    if (tier.includes(key)) return val
  }
  return 'purple'
}

export default function CampaignBrief({ campaign, onUpdate }: Props) {
  const { brief, input } = campaign
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState<string | null>(null)

  const update = useCallback((patch: Partial<Campaign>) => {
    const updated = { ...campaign, ...patch, updatedAt: new Date().toISOString() }
    saveCampaign(updated)
    onUpdate(updated)
  }, [campaign, onUpdate])

  const updateBrief = useCallback((patch: Partial<CampaignBriefData>) => {
    update({ brief: { ...brief, ...patch } })
  }, [brief, update])

  const toggleFavorite = () => update({ isFavorite: !campaign.isFavorite })

  const copyAll = async () => {
    const el = document.getElementById('campaign-brief-body')
    if (!el) return
    await navigator.clipboard.writeText(el.innerText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => window.print()

  const regenerateSection = async (section: keyof CampaignBriefData) => {
    setRegenerating(section as string)
    try {
      const res = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, section, currentBrief: brief }),
      })
      if (!res.ok) throw new Error('Regeneration failed')
      const { data } = await res.json()
      updateBrief({ [section]: data })
    } catch (err) {
      console.error('Regenerate error:', err)
    } finally {
      setRegenerating(null)
    }
  }

  const totalBudget = brief.budgetAllocation?.reduce((s, i) => s + i.percentage, 0) ?? 0

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Action bar */}
      <div className="sticky top-14 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md print:hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-sm font-semibold text-zinc-100 truncate">{campaign.name}</h1>
              <Badge variant={campaign.isFavorite ? 'yellow' : 'default'} className="shrink-0">
                {input.budget}
              </Badge>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={toggleFavorite} title="Favorite">
                <Star className={cn('h-4 w-4', campaign.isFavorite ? 'fill-amber-400 text-amber-400' : '')} />
              </Button>
              <Button variant="ghost" size="sm" onClick={copyAll}>
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy All'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePrint}>
                <Printer className="h-3.5 w-3.5 mr-1" />
                Print / PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Brief body */}
      <div id="campaign-brief-body" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Cover */}
        <div className="print:block">
          <div className="text-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Sports Marketing Campaign Brief
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 text-center mb-2">
            {campaign.name}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="blue">{input.sport}</Badge>
            <Badge variant="default">{input.objective}</Badge>
            <Badge variant="green">{input.budget}</Badge>
            {input.athleteType && <Badge variant="purple">{input.athleteType}</Badge>}
          </div>
        </div>

        <div className="w-full h-px bg-zinc-800" />

        {/* Executive Summary */}
        <BriefSection
          id="exec-summary"
          title="Executive Summary"
          onRegenerate={() => regenerateSection('executiveSummary')}
          regenerating={regenerating === 'executiveSummary'}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'The Challenge', text: brief.executiveSummary?.challenge },
              { label: 'The Opportunity', text: brief.executiveSummary?.opportunity },
              { label: 'The Recommendation', text: brief.executiveSummary?.recommendation },
            ].map(({ label, text }) => (
              <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">{label}</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* Campaign Objectives */}
        <BriefSection
          id="objectives"
          title="Campaign Objectives"
          onRegenerate={() => regenerateSection('campaignObjectives')}
          regenerating={regenerating === 'campaignObjectives'}
        >
          <div className="space-y-2">
            {brief.campaignObjectives?.map((obj, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-zinc-300">{obj}</p>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* Target Audience */}
        <BriefSection
          id="audience"
          title="Target Audience"
          onRegenerate={() => regenerateSection('targetAudience')}
          regenerating={regenerating === 'targetAudience'}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Users, label: 'Demographics', text: brief.targetAudience?.demographics },
              { icon: Lightbulb, label: 'Psychographics', text: brief.targetAudience?.psychographics },
              { icon: TrendingUp, label: 'Consumer Behavior', text: brief.targetAudience?.consumerBehavior },
              { icon: BarChart2, label: 'Sports Fan Insights', text: brief.targetAudience?.sportsFanInsights },
            ].map(({ icon: Icon, label, text }) => (
              <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-blue-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* Athlete Recommendations */}
        <BriefSection
          id="athletes"
          title="Athlete Recommendations"
          onRegenerate={() => regenerateSection('athleteRecommendations')}
          regenerating={regenerating === 'athleteRecommendations'}
        >
          <div className="space-y-4">
            {brief.athleteRecommendations?.map((athlete, i) => (
              <AthleteCard key={i} athlete={athlete} index={i} />
            ))}
          </div>
        </BriefSection>

        {/* Campaign Concept */}
        <BriefSection
          id="concept"
          title="Campaign Concept"
          onRegenerate={() => regenerateSection('campaignConcept')}
          regenerating={regenerating === 'campaignConcept'}
        >
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Campaign Name</p>
            <h3 className="text-3xl font-bold text-zinc-100 mb-6">{brief.campaignConcept?.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">The Insight</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{brief.campaignConcept?.insight}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Why Consumers Care</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{brief.campaignConcept?.whyConsumersCare}</p>
              </div>
            </div>
          </div>
        </BriefSection>

        {/* Activation Plan */}
        <BriefSection
          id="activation"
          title="Activation Plan"
          onRegenerate={() => regenerateSection('activationPlan')}
          regenerating={regenerating === 'activationPlan'}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brief.activationPlan && Object.entries(brief.activationPlan).map(([key, val]) => (
              <div key={key} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">{val}</p>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* Content Ideas */}
        <BriefSection
          id="content"
          title="Content Ideas"
          onRegenerate={() => regenerateSection('contentIdeas')}
          regenerating={regenerating === 'contentIdeas'}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {brief.contentIdeas?.map((idea, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                <span className="text-xs font-bold text-zinc-600 mt-0.5 w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-sm text-zinc-300 leading-relaxed">{idea}</p>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* KPIs */}
        <BriefSection
          id="kpis"
          title="Key Performance Indicators"
          onRegenerate={() => regenerateSection('kpis')}
          regenerating={regenerating === 'kpis'}
        >
          <div className="overflow-hidden rounded-lg border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Metric</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Target</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden sm:table-cell">Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {brief.kpis?.map((kpi, i) => (
                  <tr key={i} className="bg-zinc-900/20 hover:bg-zinc-900/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-200">{kpi.metric}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-blue-400">{kpi.target}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">{kpi.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BriefSection>

        {/* Budget Allocation */}
        <BriefSection
          id="budget"
          title="Budget Allocation"
          onRegenerate={() => regenerateSection('budgetAllocation')}
          regenerating={regenerating === 'budgetAllocation'}
        >
          <div className="space-y-3">
            {brief.budgetAllocation?.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-zinc-200">{item.category}</span>
                    <span className="text-xs text-zinc-500 hidden sm:block">{item.notes}</span>
                  </div>
                  <span className="text-sm font-semibold text-zinc-300 tabular-nums">{item.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                    style={{ width: `${(item.percentage / Math.max(totalBudget, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {totalBudget !== 100 && (
              <p className="text-xs text-amber-400 mt-2">Note: allocations sum to {totalBudget}%</p>
            )}
          </div>
        </BriefSection>

        {/* Timeline */}
        <BriefSection
          id="timeline"
          title="Campaign Timeline"
          onRegenerate={() => regenerateSection('timeline')}
          regenerating={regenerating === 'timeline'}
        >
          <div className="space-y-4">
            {brief.timeline?.map((phase, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/10 text-xs font-bold text-blue-400">
                    {i + 1}
                  </div>
                  {i < (brief.timeline?.length ?? 0) - 1 && (
                    <div className="mt-1 w-0.5 flex-1 bg-zinc-800" />
                  )}
                </div>
                <div className="pb-4 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-zinc-200">{phase.phase}</h4>
                    <Badge variant="default">{phase.duration}</Badge>
                  </div>
                  <ul className="space-y-1">
                    {phase.activities?.map((act, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-zinc-400">
                        <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-zinc-600" />
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* Risks */}
        <BriefSection
          id="risks"
          title="Risk Assessment"
          onRegenerate={() => regenerateSection('risks')}
          regenerating={regenerating === 'risks'}
        >
          <div className="space-y-3">
            {brief.risks?.map((item, i) => (
              <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200 mb-1">{item.risk}</p>
                    <p className="text-sm text-zinc-400">
                      <span className="text-emerald-400 font-medium">Mitigation: </span>
                      {item.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* Why It Will Work */}
        <BriefSection
          id="why"
          title="Why This Will Work"
          onRegenerate={() => regenerateSection('whyItWillWork')}
          regenerating={regenerating === 'whyItWillWork'}
          editableText={typeof brief.whyItWillWork === 'string' ? brief.whyItWillWork : ''}
          onSaveEdit={(text) => updateBrief({ whyItWillWork: text })}
        >
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <p className="text-base text-zinc-300 leading-relaxed">{brief.whyItWillWork}</p>
          </div>
        </BriefSection>

      </div>

      {/* Print styles injected via style tag */}
      <style>{`
        @media print {
          .no-print, header, nav { display: none !important; }
          body { background: white !important; color: black !important; }
          #campaign-brief-body { padding: 0 !important; }
          .rounded-xl, .rounded-lg { border: 1px solid #e5e7eb !important; background: #f9fafb !important; }
          h2, h3, h4 { color: black !important; }
          p, li, td { color: #374151 !important; }
        }
      `}</style>
    </div>
  )
}

function AthleteCard({ athlete, index }: { athlete: Campaign['brief']['athleteRecommendations'][0]; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/60 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
            {index + 1}
          </span>
          <div>
            <span className="text-sm font-semibold text-zinc-100">{athlete.name}</span>
            <span className="text-xs text-zinc-500 ml-2">{athlete.sport}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={tierColor(athlete.partnershipTier)}>{athlete.partnershipTier}</Badge>
          {expanded ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-zinc-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Why They Fit', text: athlete.whyTheyFit },
            { label: 'Audience Overlap', text: athlete.audienceOverlap },
            { label: 'Brand Alignment', text: athlete.brandAlignment },
            { label: 'Activation Role', text: athlete.activationRole },
          ].map(({ label, text }) => (
            <div key={label}>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">{label}</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
            </div>
          ))}
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">Risks</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{athlete.risks}</p>
          </div>
        </div>
      )}
    </div>
  )
}
