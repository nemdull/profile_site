import hosts from './allowed-hosts.json'
import data from './profile.json'

export type LinkItem = { label: string; url: string; note?: string }
export type SiteLink = LinkItem & { primary: boolean }

/** 「できること」に付ける根拠。公開できるものには url を付ける。 */
export type Evidence = { kind: string; label: string; url?: string }
export type Claim = { claim: string; evidence: Evidence[] }

export type Job = {
  period: string
  now: boolean
  title: string
  org: string
  summary: string
  points: string[]
  tech: string[]
}

export type WorkId = 'sf-meter' | 'slack-bot' | 'sakujiru' | 'book' | 'app' | 'site'

export type Work = {
  id: string
  title: string
  status?: string
  lead: string
  detail: string
  tech: string[]
  links: LinkItem[]
}

export type MeterItem = { name: string; score: number }
export type Article = { date: string; title: string; url: string; site: string }
export type SkillGroup = { group: string; items: string[] }
export type Patch = { date: string; mark: string; name: string; tone: string }
export type DatedItem = { date: string; name: string; note?: string; url?: string }

export type Profile = {
  meta: {
    name: string
    reading: string
    role: string
    headline: string[]
    intro: string[]
    actions: LinkItem[]
    siteUrl: string
    repoUrl: string
  }
  links: SiteLink[]
  preflight: { title: string; lead: string[]; note: string; codeLabel: string; codeUrl: string }
  claims: { title: string; lead: string; items: Claim[] }
  experience: { title: string; items: Job[] }
  works: {
    title: string
    meter: { caption: string; low: string; high: string; unit: string; items: MeterItem[] }
    items: Work[]
  }
  writing: { title: string; lead: string; items: Article[]; more: LinkItem[] }
  skills: { title: string; groups: SkillGroup[] }
  certifications: { title: string; lead: string; articleLabel: string; articleUrl: string; items: Patch[] }
  background: { title: string; items: DatedItem[] }
  contact: { title: string; text: string; links: LinkItem[]; elsewhere: string; thanks: string }
}

// JSON の形が型と合わなければ、ここでビルドが止まる
export const profile: Profile = data

/** リンクを張ってよいサイト。ビルド前の点検と、ページを開いたときの点検の両方がこれを見る。 */
export const allowedHosts: readonly string[] = hosts

export const work = (id: WorkId): Work => {
  const found = profile.works.items.find((item) => item.id === id)
  if (!found) throw new Error(`works に ${id} がありません`)
  return found
}
