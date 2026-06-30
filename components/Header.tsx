'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Clock, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 group-hover:bg-blue-500 transition-colors">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-100">Campaign Brief</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-colors',
                pathname === '/'
                  ? 'text-zinc-100 bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              )}
            >
              Home
            </Link>
            <Link
              href="/history"
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5',
                pathname === '/history'
                  ? 'text-zinc-100 bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              History
            </Link>
          </nav>

          <Link href="/campaign">
            <Button size="sm" variant="primary" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
