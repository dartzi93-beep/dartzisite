import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import type { CampaignInput, CampaignBriefData } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SECTION_SCHEMAS: Record<string, string> = {
  executiveSummary: `{ "challenge": "...", "opportunity": "...", "recommendation": "..." }`,
  campaignObjectives: `["objective 1", "objective 2", "objective 3", "objective 4", "objective 5"]`,
  targetAudience: `{ "demographics": "...", "psychographics": "...", "consumerBehavior": "...", "sportsFanInsights": "..." }`,
  athleteRecommendations: `[{ "name": "...", "sport": "...", "whyTheyFit": "...", "audienceOverlap": "...", "brandAlignment": "...", "risks": "...", "partnershipTier": "...", "activationRole": "..." }] (exactly 5 athletes)`,
  campaignConcept: `{ "name": "...", "insight": "...", "whyConsumersCare": "..." }`,
  activationPlan: `{ "socialMedia": "...", "shortFormVideo": "...", "events": "...", "retail": "...", "experiential": "...", "pr": "...", "digital": "...", "paidMedia": "...", "ownedMedia": "...", "earnedMedia": "..." }`,
  contentIdeas: `["idea 1", "idea 2", ... (at least 10 ideas)]`,
  kpis: `[{ "metric": "...", "target": "specific number with unit", "rationale": "..." }] (6-8 KPIs)`,
  budgetAllocation: `[{ "category": "...", "percentage": number, "notes": "..." }] (must sum to 100)`,
  timeline: `[{ "phase": "...", "duration": "...", "activities": ["...", "...", "..."] }] (4-5 phases)`,
  risks: `[{ "risk": "...", "mitigation": "..." }] (4-6 risks)`,
  whyItWillWork: `"3-4 sentence paragraph"`,
}

export async function POST(request: NextRequest) {
  try {
    const { input, section, currentBrief }: {
      input: CampaignInput
      section: keyof CampaignBriefData
      currentBrief: CampaignBriefData
    } = await request.json()

    if (!input || !section) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
    }

    const schema = SECTION_SCHEMAS[section as string]
    if (!schema) {
      return Response.json({ error: 'Unknown section' }, { status: 400 })
    }

    const prompt = `You are a senior sports marketing strategist. Regenerate only the "${section}" section of a campaign brief.

Campaign Details:
- Brand: ${input.brandName} (${input.industry})
- Objective: ${input.objective}
- Budget: ${input.budget}
- Target Audience: ${input.targetAudience}
- Geography: ${input.geography}
- Sport: ${input.sport}
- Athlete Type: ${input.athleteType}
- Notes: ${input.additionalNotes || 'None'}

Campaign Concept (for context): ${currentBrief.campaignConcept?.name || 'N/A'}

Output ONLY a valid JSON value matching this schema for "${section}":
${schema}

No preamble, no explanation. Output only the JSON value.`

    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      system: 'You are a senior sports marketing strategist. Output only valid JSON, no other text.',
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return Response.json({ error: 'Unexpected response format' }, { status: 500 })
    }

    const text = content.text.trim()

    // For string sections like whyItWillWork, handle quoted strings
    let parsed
    if (text.startsWith('"')) {
      parsed = JSON.parse(text)
    } else {
      const start = text.search(/[\[{"]/)
      const lastBrace = text.lastIndexOf('}')
      const lastBracket = text.lastIndexOf(']')
      const end = Math.max(lastBrace, lastBracket)
      parsed = JSON.parse(text.slice(start === -1 ? 0 : start, end === -1 ? undefined : end + 1))
    }

    return Response.json({ section, data: parsed })
  } catch (error) {
    console.error('Error regenerating section:', error)
    return Response.json({ error: 'Failed to regenerate section' }, { status: 500 })
  }
}
