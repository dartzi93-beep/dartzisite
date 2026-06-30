import Anthropic from '@anthropic-ai/sdk'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js'

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
    "Content idea 1", "Content idea 2", "Content idea 3", "Content idea 4", "Content idea 5",
    "Content idea 6", "Content idea 7", "Content idea 8", "Content idea 9", "Content idea 10"
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

const TOOLS: Tool[] = [
  {
    name: 'generate_campaign_brief',
    description:
      'Generate a comprehensive sports marketing campaign brief with athlete recommendations, activation plan, KPIs, budget allocation, and timeline. Returns a fully structured JSON brief ready for presentation.',
    inputSchema: {
      type: 'object',
      properties: {
        brandName: {
          type: 'string',
          description: 'Brand or company name (e.g. Nike, Gatorade, State Farm)',
        },
        industry: {
          type: 'string',
          description: 'Brand industry or category (e.g. Apparel, Beverage, Insurance, Tech)',
        },
        sport: {
          type: 'string',
          description:
            'Sport or league focus (e.g. NFL, NBA, MLS / Soccer, Golf, Formula 1, Olympics)',
        },
        objective: {
          type: 'string',
          description:
            'Primary campaign objective (e.g. Brand Awareness, Product Launch, Sales Conversion, Market Expansion)',
        },
        budget: {
          type: 'string',
          description:
            'Campaign budget range (e.g. Under $100k, $100k–$250k, $250k–$500k, $500k–$1M, $1M+)',
        },
        targetAudience: {
          type: 'string',
          description:
            'Description of the target consumer (e.g. Men 18-34 in the Midwest who watch NFL weekly)',
        },
        geography: {
          type: 'string',
          description:
            'Geographic focus (e.g. National US, Northeast US, Global, specific city or region)',
        },
        athleteType: {
          type: 'string',
          description:
            'Preferred athlete profile (e.g. Superstar, Rising Star, Rookie, Retired Legend, Influencer Athlete, Team Partnership)',
        },
        additionalNotes: {
          type: 'string',
          description:
            'Any additional context, constraints, or requirements for the campaign (optional)',
        },
      },
      required: ['brandName', 'industry', 'sport', 'objective', 'budget', 'targetAudience', 'geography', 'athleteType'],
    },
  },
  {
    name: 'regenerate_section',
    description:
      'Regenerate a single section of an existing campaign brief with a fresh take. Useful when a specific section needs revision without regenerating the whole brief.',
    inputSchema: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          description:
            'The section to regenerate (executiveSummary, campaignObjectives, targetAudience, athleteRecommendations, campaignConcept, activationPlan, contentIdeas, kpis, budgetAllocation, timeline, risks, whyItWillWork)',
        },
        briefContext: {
          type: 'string',
          description: 'JSON string of the existing brief for context (or key fields: brandName, sport, objective, budget)',
        },
        additionalInstructions: {
          type: 'string',
          description: 'Specific guidance for the regeneration (optional, e.g. "focus more on digital-first tactics")',
        },
      },
      required: ['section', 'briefContext'],
    },
  },
]

function buildBriefPrompt(args: Record<string, string>): string {
  return `Generate a professional sports marketing campaign brief for:

Brand Name: ${args.brandName}
Industry: ${args.industry}
Campaign Objective: ${args.objective}
Budget Range: ${args.budget}
Target Audience: ${args.targetAudience}
Geography: ${args.geography}
Sport Focus: ${args.sport}
Target Athlete Type: ${args.athleteType}
Additional Context: ${args.additionalNotes || 'None provided'}

Create a comprehensive brief that a strategy team at a top sports marketing agency would present to a Fortune 500 client. Be specific to this brand, this sport, and this moment in culture.`
}

function buildRegeneratePrompt(section: string, briefContext: string, additionalInstructions?: string): string {
  const sectionSchemas: Record<string, string> = {
    executiveSummary: `{ "challenge": "...", "opportunity": "...", "recommendation": "..." }`,
    campaignObjectives: `["objective 1", "objective 2", "objective 3", "objective 4", "objective 5"]`,
    targetAudience: `{ "demographics": "...", "psychographics": "...", "consumerBehavior": "...", "sportsFanInsights": "..." }`,
    athleteRecommendations: `[{ "name": "...", "sport": "...", "whyTheyFit": "...", "audienceOverlap": "...", "brandAlignment": "...", "risks": "...", "partnershipTier": "...", "activationRole": "..." }] (exactly 5 athletes)`,
    campaignConcept: `{ "name": "...", "insight": "...", "whyConsumersCare": "..." }`,
    activationPlan: `{ "socialMedia": "...", "shortFormVideo": "...", "events": "...", "retail": "...", "experiential": "...", "pr": "...", "digital": "...", "paidMedia": "...", "ownedMedia": "...", "earnedMedia": "..." }`,
    contentIdeas: `["idea 1", "idea 2", ... ] (at least 10 ideas)`,
    kpis: `[{ "metric": "...", "target": "...", "rationale": "..." }]`,
    budgetAllocation: `[{ "category": "...", "percentage": N, "notes": "..." }] (must sum to 100)`,
    timeline: `[{ "phase": "...", "duration": "...", "activities": ["..."] }] (4-5 phases)`,
    risks: `[{ "risk": "...", "mitigation": "..." }] (4-6 risks)`,
    whyItWillWork: `"3-4 sentence string"`,
  }

  const schema = sectionSchemas[section] ?? 'appropriate JSON'

  return `You are regenerating the "${section}" section of a sports marketing campaign brief.

Campaign context:
${briefContext}

${additionalInstructions ? `Additional instructions: ${additionalInstructions}\n\n` : ''}Output ONLY the JSON value for the "${section}" field — no wrapper object, no key, no explanation. The schema is:
${schema}`
}

async function generateBrief(client: Anthropic, args: Record<string, string>): Promise<string> {
  const stream = await client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildBriefPrompt(args) }],
  })

  const message = await stream.finalMessage()
  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')

  const text = content.text.trim()
  const jsonStart = text.indexOf('{')
  const jsonEnd = text.lastIndexOf('}')
  if (jsonStart === -1 || jsonEnd === -1) throw new Error('Could not parse JSON from Claude response')

  const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1))
  return JSON.stringify(parsed, null, 2)
}

async function regenerateSection(
  client: Anthropic,
  section: string,
  briefContext: string,
  additionalInstructions?: string,
): Promise<string> {
  const stream = await client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: 'You are a senior sports marketing strategist. Output only valid JSON — no preamble, no explanation.',
    messages: [
      { role: 'user', content: buildRegeneratePrompt(section, briefContext, additionalInstructions) },
    ],
  })

  const message = await stream.finalMessage()
  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')

  return content.text.trim()
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    process.stderr.write('Error: ANTHROPIC_API_KEY environment variable is required\n')
    process.exit(1)
  }

  const anthropic = new Anthropic({ apiKey })

  const server = new Server(
    { name: 'campaign-brief-generator', version: '1.0.0' },
    { capabilities: { tools: {} } },
  )

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }))

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params
    const safeArgs = (args ?? {}) as Record<string, string>

    try {
      if (name === 'generate_campaign_brief') {
        const result = await generateBrief(anthropic, safeArgs)
        return {
          content: [{ type: 'text', text: result }],
        }
      }

      if (name === 'regenerate_section') {
        const result = await regenerateSection(
          anthropic,
          safeArgs.section,
          safeArgs.briefContext,
          safeArgs.additionalInstructions,
        )
        return {
          content: [{ type: 'text', text: result }],
        }
      }

      throw new Error(`Unknown tool: ${name}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        content: [{ type: 'text', text: `Error: ${message}` }],
        isError: true,
      }
    }
  })

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err}\n`)
  process.exit(1)
})
