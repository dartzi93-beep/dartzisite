import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import type { CampaignInput } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a senior sports marketing strategist with 15 years of experience building athlete partnership campaigns for Fortune 500 brands. You have worked at leading agencies including Wasserman, CAA Sports, Octagon, and Excel Sports Management.

Your briefs are distinguished by:
- Strategic precision over generic marketing language
- Specific, actionable recommendations with commercial rationale
- Athlete selections backed by audience data and brand alignment logic
- KPIs tied directly to business outcomes with realistic targets
- Budget allocations that reflect actual market rates

Rules for your output:
- Output ONLY a valid JSON object. No markdown, no preamble, no explanation.
- Use plain, direct language. No hype, no clichés, no empty phrases.
- Be specific: name real athletes, real platforms, real tactics.
- Budget percentages must sum exactly to 100.
- Include exactly 5 athlete recommendations.
- Include at least 10 content ideas.
- All KPI targets must include specific numbers.
- Timeline should have 4-5 phases.
- Include 4-6 risks with mitigations.

Output this exact JSON structure:
{
  "executiveSummary": {
    "challenge": "2-3 sentences describing the core marketing challenge",
    "opportunity": "2-3 sentences describing the sports marketing opportunity",
    "recommendation": "2-3 sentences summarizing the recommended approach"
  },
  "campaignObjectives": ["objective 1", "objective 2", "objective 3", "objective 4", "objective 5"],
  "targetAudience": {
    "demographics": "Specific age ranges, gender split, income, education, geography",
    "psychographics": "Values, lifestyle, mindset, what they care about",
    "consumerBehavior": "Purchase habits, media consumption, brand loyalty patterns",
    "sportsFanInsights": "How they consume the sport, athlete relationships, platform behavior"
  },
  "athleteRecommendations": [
    {
      "name": "Full athlete name",
      "sport": "Sport / team / position",
      "whyTheyFit": "2-3 sentences on strategic fit with this specific brand",
      "audienceOverlap": "Specific demographic and psychographic overlap data",
      "brandAlignment": "How this athlete's public identity aligns with the brand values",
      "risks": "Specific contractual or reputational considerations",
      "partnershipTier": "Tier 1 Lead Ambassador | Tier 2 Feature Partner | Tier 3 Content Creator",
      "activationRole": "Specific role and deliverables in this campaign"
    }
  ],
  "campaignConcept": {
    "name": "Campaign name (2-4 words, memorable)",
    "insight": "The core cultural or human insight that drives the concept",
    "whyConsumersCare": "Why this resonates specifically with the target audience right now"
  },
  "activationPlan": {
    "socialMedia": "Platform-specific strategy with posting cadence and content types",
    "shortFormVideo": "TikTok/Reels/YouTube Shorts approach with specific content formats",
    "events": "Event strategy including specific event types and integration points",
    "retail": "In-store or e-commerce activation approach",
    "experiential": "Live experience concepts and execution approach",
    "pr": "Media strategy, story angles, and target publications",
    "digital": "Website, email, and digital ecosystem strategy",
    "paidMedia": "Paid social, programmatic, and search strategy",
    "ownedMedia": "Brand channel strategy across all owned touchpoints",
    "earnedMedia": "Organic coverage strategy and amplification approach"
  },
  "contentIdeas": [
    "Content idea 1",
    "Content idea 2",
    "Content idea 3",
    "Content idea 4",
    "Content idea 5",
    "Content idea 6",
    "Content idea 7",
    "Content idea 8",
    "Content idea 9",
    "Content idea 10"
  ],
  "kpis": [
    { "metric": "KPI name", "target": "Specific number with unit", "rationale": "Why this metric matters for this campaign" }
  ],
  "budgetAllocation": [
    { "category": "Talent Fees", "percentage": 30, "notes": "Specific breakdown notes" },
    { "category": "Production", "percentage": 20, "notes": "Specific breakdown notes" },
    { "category": "Paid Media", "percentage": 25, "notes": "Specific breakdown notes" },
    { "category": "Events & Experiential", "percentage": 10, "notes": "Specific breakdown notes" },
    { "category": "PR & Agency", "percentage": 10, "notes": "Specific breakdown notes" },
    { "category": "Contingency", "percentage": 5, "notes": "Specific breakdown notes" }
  ],
  "timeline": [
    { "phase": "Phase name", "duration": "X weeks", "activities": ["Activity 1", "Activity 2", "Activity 3"] }
  ],
  "risks": [
    { "risk": "Specific risk description", "mitigation": "Concrete mitigation strategy" }
  ],
  "whyItWillWork": "3-4 sentences explaining why this campaign will succeed for this brand in this sport at this moment"
}`

function buildPrompt(input: CampaignInput): string {
  return `Generate a professional sports marketing campaign brief for:

Brand Name: ${input.brandName}
Industry: ${input.industry}
Campaign Objective: ${input.objective}
Budget Range: ${input.budget}
Target Audience: ${input.targetAudience}
Geography: ${input.geography}
Sport Focus: ${input.sport}
Target Athlete Type: ${input.athleteType}
Additional Context: ${input.additionalNotes || 'None provided'}

Create a comprehensive brief that a strategy team at a top sports marketing agency would present to a Fortune 500 client. Be specific to this brand, this sport, and this moment in culture.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { input }: { input: CampaignInput } = body

    if (!input?.brandName) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(input) }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return Response.json({ error: 'Unexpected response format from AI' }, { status: 500 })
    }

    // Extract JSON from the response (handles cases where model adds surrounding text)
    const text = content.text.trim()
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}')

    if (jsonStart === -1 || jsonEnd === -1) {
      return Response.json({ error: 'Could not parse AI response as JSON' }, { status: 500 })
    }

    const brief = JSON.parse(text.slice(jsonStart, jsonEnd + 1))
    return Response.json({ brief })
  } catch (error) {
    console.error('Error generating campaign brief:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ error: `Failed to generate brief: ${message}` }, { status: 500 })
  }
}
