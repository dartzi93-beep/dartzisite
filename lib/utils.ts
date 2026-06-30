import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function getCampaigns() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('campaigns') || '[]')
  } catch {
    return []
  }
}

export function saveCampaign(campaign: object) {
  const campaigns = getCampaigns()
  const existing = (campaigns as { id: string }[]).findIndex((c) => c.id === (campaign as { id: string }).id)
  if (existing >= 0) {
    campaigns[existing] = campaign
  } else {
    campaigns.unshift(campaign)
  }
  localStorage.setItem('campaigns', JSON.stringify(campaigns))
}

export function deleteCampaign(id: string) {
  const campaigns = getCampaigns()
  const filtered = (campaigns as { id: string }[]).filter((c) => c.id !== id)
  localStorage.setItem('campaigns', JSON.stringify(filtered))
}
