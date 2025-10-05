import { Award } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

type Certification = {
  name: string
  issuedAt: string
  issuer?: string
}

const certifications: Certification[] = [
  { name: '応用情報技術者試験', issuedAt: '2025年8月', issuer: '独立行政法人 情報処理推進機構（IPA）' },
  { name: 'ORACLE MASTER Silver SQL 2019', issuedAt: '2025年6月', issuer: 'Oracle' },
  { name: 'AWS Certified Cloud Practitioner', issuedAt: '2025年3月', issuer: 'AWS' },
  { name: 'TOEIC 770', issuedAt: '2024年11月', issuer: 'ETS' },
  { name: 'Oracle Certified Java Programmer, Silver SE 17', issuedAt: '2024年10月', issuer: 'Oracle' },
  { name: 'Oracle Certified Java Programmer, Bronze SE', issuedAt: '2024年5月', issuer: 'Oracle' },
  { name: '情報セキュリティマネジメント試験', issuedAt: '2022年7月', issuer: '独立行政法人 情報処理推進機構（IPA）' },
  { name: '基本情報技術者試験', issuedAt: '2022年6月', issuer: '独立行政法人 情報処理推進機構（IPA）' },
  { name: 'ITパスポート', issuedAt: '2022年6月', issuer: '独立行政法人 情報処理推進機構（IPA）' },
]

export function Certifications() {
  return (
    <section id="certifications" className="py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Certifications</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">資格・認定</h2>
          </div>
        </div>

        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          最新の職務経歴書に記載した資格・語学スコアを取得年月とともに掲載しています。学習の軸や専門領域の証跡として、継続的にアップデートしています。
        </p>

        <div className="flex flex-col gap-3">
          {certifications.map((certification) => (
            <div
              key={`${certification.name}-${certification.issuedAt}`}
              className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="text-base font-semibold leading-tight">{certification.name}</p>
                {certification.issuer && <p className="text-xs text-muted-foreground">{certification.issuer}</p>}
              </div>
              <Badge variant="secondary" className="w-fit whitespace-nowrap sm:shrink-0">
                {certification.issuedAt}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
