import data from './profile.json'

export type LinkItem = { label: string; url: string; note?: string }
export type SiteLink = LinkItem & { primary: boolean }

/** 主張に付ける根拠。公開できるものには url を付ける。 */
export type Evidence = { kind: string; label: string; url?: string }
export type Claim = { claim: string; evidence: Evidence[] }

export type Job = {
  period: string
  title: string
  org: string
  summary: string
  points: string[]
  tech: string[]
}

export type Work = {
  title: string
  status?: string
  lead: string
  detail: string
  tech: string[]
  links: LinkItem[]
}

export type Article = { date: string; title: string; url: string; site: string }
export type SkillGroup = { group: string; items: string[] }
export type DatedItem = { date: string; name: string; note?: string; url?: string }

export type Profile = {
  meta: {
    name: string
    reading: string
    role: string
    tagline: string[]
    lead: string
    intro: string
    reviewedOn: string
    siteUrl: string
    repoUrl: string
  }
  links: SiteLink[]
  claims: Claim[]
  experience: Job[]
  works: Work[]
  writing: Article[]
  skills: SkillGroup[]
  certifications: DatedItem[]
  background: DatedItem[]
  contact: { text: string; links: LinkItem[] }
}

// JSON の形が型と合わなければ、ここでビルドが止まる
export const profile: Profile = data
