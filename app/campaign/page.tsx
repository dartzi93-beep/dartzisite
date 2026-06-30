import Header from '@/components/Header'
import CampaignForm from '@/components/CampaignForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'New Campaign — Campaign Brief Generator',
}

export default function CampaignPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">New Campaign Brief</h1>
          <p className="text-sm text-zinc-400">
            Fill in your brand and campaign details. The AI will generate a complete strategy brief in under a minute.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8">
          <CampaignForm />
        </div>
      </main>
    </div>
  )
}
