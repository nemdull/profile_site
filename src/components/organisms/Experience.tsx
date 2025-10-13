import { Briefcase } from 'lucide-react'

import { Badge } from '@/components/atoms/Badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card'

const experiences = [
  {
    period: '2024/04 — 現在',
    title: 'Software Engineer（金融系SIer）',
    company: '金融系SIer',
    summary:
      '不動産EC向け管理画面（Oracle APEX／PL/SQL／React／AWS）の開発・保守を担当。フォーム回帰のE2E自動化（Playwright）導入、Jestでの単体テスト整備により品質向上を実現。Slack×Jira運用ルールの標準化、障害報告テンプレート整備を通じて開発効率を向上。',
    achievements: [
      '本番障害2件の恒久対策後、以降の障害ゼロ運用を継続',
      '回帰自動化で手動検証負荷を削減、検証の再現性を向上',
      '生成AIの活用でログ調査・テスト観点出しを効率化（調査時間短縮）',
      'Qiita等での外部発信（累計6,000PV）と社内共有で、知見をチーム横断に展開',
    ],
    technologies: ['Oracle APEX', 'PL/SQL', 'React', 'TypeScript', 'AWS', 'Playwright', 'Jest'],
  },
]

export function Experience() {
  return (
    <section id="experience" className="bg-muted/20 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Experience</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">職歴</h2>
          </div>
        </div>

        <div className="grid gap-6">
          {experiences.map((item) => (
            <Card key={item.title} className="border-border/60 bg-card/80">
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.company}</CardDescription>
                <p className="text-sm text-muted-foreground">{item.period}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {item.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
