'use client'
import { useState } from 'react'
import { RefreshCw, Copy, Check, Edit2, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface BriefSectionProps {
  id: string
  title: string
  children: React.ReactNode
  onRegenerate?: () => Promise<void>
  regenerating?: boolean
  className?: string
  editableText?: string
  onSaveEdit?: (text: string) => void
  noPrint?: boolean
}

export default function BriefSection({
  id,
  title,
  children,
  onRegenerate,
  regenerating,
  className,
  editableText,
  onSaveEdit,
  noPrint,
}: BriefSectionProps) {
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(editableText || '')

  const handleCopy = async () => {
    const el = document.getElementById(`section-${id}`)
    if (!el) return
    await navigator.clipboard.writeText(el.innerText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    onSaveEdit?.(editValue)
    setEditing(false)
  }

  const handleEdit = () => {
    setEditValue(editableText || '')
    setEditing(true)
  }

  return (
    <div className={cn('group relative', noPrint && 'no-print', className)}>
      <div className="flex items-center justify-between mb-3 print:mb-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{title}</h2>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
          {editableText !== undefined && onSaveEdit && !editing && (
            <Button variant="ghost" size="icon" onClick={handleEdit} title="Edit section">
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          )}
          {editing && (
            <>
              <Button variant="ghost" size="icon" onClick={handleSave} title="Save edits">
                <Save className="h-3.5 w-3.5 text-blue-400" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setEditing(false)} title="Cancel">
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          {onRegenerate && !editing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRegenerate}
              disabled={regenerating}
              title="Regenerate section"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', regenerating && 'animate-spin')} />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy section">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {editing && editableText !== undefined ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          rows={8}
          className="text-sm leading-relaxed"
          autoFocus
        />
      ) : (
        <div id={`section-${id}`} className={cn(regenerating && 'opacity-40 pointer-events-none transition-opacity')}>
          {children}
        </div>
      )}
    </div>
  )
}
