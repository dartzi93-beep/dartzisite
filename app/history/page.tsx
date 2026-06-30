'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Star, Trash2, Clock, ExternalLink } from 'lucide-react'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCampaigns, deleteCampaign, saveCampaign, formatDate } from '@/lib/utils'
import type { Campaign } from '@/lib/types'

export default function HistoryPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCampaigns(getCampaigns() as Campaign[])
    setLoaded(true)
  }, [])

  const toggleFavorite = (id: string) => {
    const updated = campaigns.map((c) => {
      if (c.id !== id) return c
      const next = { ...c, isFavorite: !c.isFavorite }
      saveCampaign(next)
      return next
    })
    setCampaigns(updated)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this campaign brief?')) return
    deleteCampaign(id)
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
  }

  const favorites = campaigns.filter((c) => c.isFavorite)
  const rest = campaigns.filter((c) => !c.isFavorite)

  if (!loaded) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 mb-1">Campaign History</h1>
            <p className="text-sm text-zinc-500">
              {campaigns.length === 0 ? 'No campaigns yet' : `${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''} saved locally`}
            </p>
          </div>
          <Link href="/campaign">
            <Button variant="primary" size="sm">
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Campaign
            </Button>
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-dashed border-zinc-800">
            <Clock className="h-10 w-10 text-zinc-700 mb-4" />
            <p className="text-zinc-500 mb-2">No campaigns generated yet</p>
            <p className="text-sm text-zinc-600 mb-6">Create your first campaign brief to get started</p>
            <Link href="/campaign">
              <Button variant="outline">Create Campaign</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {favorites.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  Favorites
                </h2>
                <CampaignGrid
                  campaigns={favorites}
                  onToggleFavorite={toggleFavorite}
                  onDelete={handleDelete}
                />
              </section>
            )}

            {rest.length > 0 && (
              <section>
                {favorites.length > 0 && (
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">All Campaigns</h2>
                )}
                <CampaignGrid
                  campaigns={rest}
                  onToggleFavorite={toggleFavorite}
                  onDelete={handleDelete}
                />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function CampaignGrid({
  campaigns,
  onToggleFavorite,
  onDelete,
}: {
  campaigns: Campaign[]
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0">
              <Link
                href={`/campaign/${campaign.id}`}
                className="text-sm font-semibold text-zinc-100 hover:text-blue-400 transition-colors line-clamp-1"
              >
                {campaign.name}
              </Link>
              <p className="text-xs text-zinc-500 mt-0.5">{formatDate(campaign.createdAt)}</p>
            </div>
            <div className="flex items-center gap-1 ml-3 shrink-0">
              <button
                onClick={() => onToggleFavorite(campaign.id)}
                className="p-1.5 rounded-md text-zinc-600 hover:text-amber-400 transition-colors"
              >
                <Star className={`h-3.5 w-3.5 ${campaign.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
              <button
                onClick={() => onDelete(campaign.id)}
                className="p-1.5 rounded-md text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <Badge variant="blue">{campaign.input.sport}</Badge>
            <Badge variant="default">{campaign.input.budget}</Badge>
            <Badge variant="default">{campaign.input.objective}</Badge>
          </div>

          <Link
            href={`/campaign/${campaign.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-blue-400 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Open brief
          </Link>
        </div>
      ))}
    </div>
  )
}
