'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import type { CampaignInput } from '@/lib/types'
import { SPORTS, ATHLETE_TYPES, OBJECTIVES, BUDGETS } from '@/lib/types'
import { generateId, saveCampaign } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const EMPTY_FORM: CampaignInput = {
  brandName: '',
  industry: '',
  objective: '',
  budget: '',
  targetAudience: '',
  geography: '',
  sport: '',
  athleteType: '',
  additionalNotes: '',
}

export default function CampaignForm() {
  const router = useRouter()
  const [form, setForm] = useState<CampaignInput>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const set = (field: keyof CampaignInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const isValid = form.brandName.trim() && form.industry.trim() &&
    form.objective && form.budget && form.sport && form.athleteType

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return

    setLoading(true)
    setError(null)
    setProgress(5)

    const ticker = setInterval(() => {
      setProgress((p) => {
        if (p >= 85) return p
        return p + Math.random() * 3
      })
    }, 800)

    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: form }),
      })

      clearInterval(ticker)

      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg || 'Generation failed')
      }

      setProgress(95)
      const { brief } = await res.json()

      const campaign = {
        id: generateId(),
        name: `${form.brandName} — ${form.sport}`,
        input: form,
        brief,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
      }

      saveCampaign(campaign)
      setProgress(100)
      router.push(`/campaign/${campaign.id}`)
    } catch (err) {
      clearInterval(ticker)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
      setProgress(0)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="relative mb-8">
          <div className="h-16 w-16 rounded-full border-4 border-zinc-800" />
          <div
            className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
          />
        </div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">Building your campaign brief</h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-xs">
          Analyzing brand fit, evaluating athlete partnerships, and structuring your strategy...
        </p>
        <div className="w-64">
          <div className="flex justify-between text-xs text-zinc-500 mb-2">
            <span>Generating</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-zinc-800">
            <div
              className="h-1 rounded-full bg-blue-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="mt-6 text-xs text-zinc-600">This takes 20–40 seconds</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Brand & Industry */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Brand Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brandName">Brand Name *</Label>
            <Input
              id="brandName"
              placeholder="e.g. Nike, Gatorade, Chase Bank"
              value={form.brandName}
              onChange={set('brandName')}
              required
            />
          </div>
          <div>
            <Label htmlFor="industry">Industry *</Label>
            <Input
              id="industry"
              placeholder="e.g. Sportswear, Financial Services, Beverages"
              value={form.industry}
              onChange={set('industry')}
              required
            />
          </div>
        </div>
      </section>

      {/* Campaign Strategy */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Campaign Strategy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="objective">Campaign Objective *</Label>
            <Select
              id="objective"
              placeholder="Select an objective"
              value={form.objective}
              onChange={set('objective')}
              required
            >
              {OBJECTIVES.map((o) => (
                <option key={o} value={o} className="bg-zinc-900">
                  {o}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="budget">Budget *</Label>
            <Select
              id="budget"
              placeholder="Select a budget range"
              value={form.budget}
              onChange={set('budget')}
              required
            >
              {BUDGETS.map((b) => (
                <option key={b} value={b} className="bg-zinc-900">
                  {b}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      {/* Audience & Geography */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Audience
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g. Men 18-34, college-educated, urban"
              value={form.targetAudience}
              onChange={set('targetAudience')}
            />
          </div>
          <div>
            <Label htmlFor="geography">Geography</Label>
            <Input
              id="geography"
              placeholder="e.g. United States, Northeast, Global"
              value={form.geography}
              onChange={set('geography')}
            />
          </div>
        </div>
      </section>

      {/* Sport & Athlete */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Sports Partnership
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sport">Sport *</Label>
            <Select
              id="sport"
              placeholder="Select a sport"
              value={form.sport}
              onChange={set('sport')}
              required
            >
              {SPORTS.map((s) => (
                <option key={s} value={s} className="bg-zinc-900">
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="athleteType">Target Athlete Type *</Label>
            <Select
              id="athleteType"
              placeholder="Select athlete type"
              value={form.athleteType}
              onChange={set('athleteType')}
              required
            >
              {ATHLETE_TYPES.map((a) => (
                <option key={a} value={a} className="bg-zinc-900">
                  {a}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      {/* Additional Notes */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Additional Context
        </h2>
        <div>
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Any specific requirements, exclusions, tone preferences, competitive context, or prior campaign learnings..."
            value={form.additionalNotes}
            onChange={set('additionalNotes')}
            rows={4}
          />
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isValid || loading}
          className="min-w-[180px]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Brief
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
