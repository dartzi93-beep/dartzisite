export interface CampaignInput {
  brandName: string
  industry: string
  objective: string
  budget: string
  targetAudience: string
  geography: string
  sport: string
  athleteType: string
  additionalNotes: string
}

export interface AthleteRecommendation {
  name: string
  sport: string
  whyTheyFit: string
  audienceOverlap: string
  brandAlignment: string
  risks: string
  partnershipTier: string
  activationRole: string
}

export interface KPI {
  metric: string
  target: string
  rationale: string
}

export interface BudgetItem {
  category: string
  percentage: number
  notes: string
}

export interface TimelinePhase {
  phase: string
  duration: string
  activities: string[]
}

export interface Risk {
  risk: string
  mitigation: string
}

export interface CampaignBriefData {
  executiveSummary: {
    challenge: string
    opportunity: string
    recommendation: string
  }
  campaignObjectives: string[]
  targetAudience: {
    demographics: string
    psychographics: string
    consumerBehavior: string
    sportsFanInsights: string
  }
  athleteRecommendations: AthleteRecommendation[]
  campaignConcept: {
    name: string
    insight: string
    whyConsumersCare: string
  }
  activationPlan: {
    socialMedia: string
    shortFormVideo: string
    events: string
    retail: string
    experiential: string
    pr: string
    digital: string
    paidMedia: string
    ownedMedia: string
    earnedMedia: string
  }
  contentIdeas: string[]
  kpis: KPI[]
  budgetAllocation: BudgetItem[]
  timeline: TimelinePhase[]
  risks: Risk[]
  whyItWillWork: string
}

export interface Campaign {
  id: string
  name: string
  input: CampaignInput
  brief: CampaignBriefData
  createdAt: string
  updatedAt: string
  isFavorite: boolean
}

export const SPORTS = [
  'NFL', 'NBA', 'WNBA', 'MLB', 'NHL', 'NCAA Football', 'NCAA Basketball',
  'MLS / Soccer', 'Golf', 'Combat Sports / MMA / Boxing',
  'Tennis', 'Olympics', 'Formula 1', 'Track & Field', 'Esports', 'Other',
]

export const ATHLETE_TYPES = [
  'Superstar', 'Rising Star', 'Rookie', 'Retired Legend',
  'Influencer Athlete', 'Team Partnership',
]

export const OBJECTIVES = [
  'Brand Awareness', 'Product Launch', 'Retail Traffic',
  'Sales Conversion', 'Community Engagement', 'Customer Retention',
  'Market Expansion', 'Brand Repositioning',
]

export const BUDGETS = [
  'Under $100k', '$100k–$250k', '$250k–$500k', '$500k–$1M', '$1M+',
]
