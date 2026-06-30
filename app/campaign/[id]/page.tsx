'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import CampaignBrief from '@/components/CampaignBrief'
import { Button } from '@/components/ui/button'
import { getCampaigns, deleteCampaign } from '@/lib/utils'
import type { Campaign } from '@/lib/types'

export default function CampaignPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    const campaigns = getCampaigns() as Campaign[]
    const found = campaigns.find((c) => c.id === id) ?? null
    if (found) {
      setCampaign(found)
    } else {
      setNotFound(true)
    }
    setLoading(false)
  }, [id])

  const handleDelete = () => {
    if (!campaign) return
    if (!confirm('Delete this campaign brief?')) return
    deleteCampaign(campaign.id)
    router.push('/history')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  if (notFound || !campaign) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <p className="text-zinc-500 mb-6">This campaign brief could not be found.</p>
          <Link href="/history">
            <Button variant="outline">View All Campaigns</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      {/* Sub-nav */}
      <div className="border-b border-zinc-800 bg-zinc-950 print:hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-11 items-center justify-between">
            <Link
              href="/history"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Campaigns
            </Link>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <CampaignBrief campaign={campaign} onUpdate={setCampaign} />
    </div>
  )
}
