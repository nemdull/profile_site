import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const communities = [
  {
    name: 'CA TECH LOUNGE',
    period: '2025/09 — Present',
    description: '主に Go 言語を使ったバックエンド開発を学習中。',
    link: 'https://www.cyberagent.co.jp/careers/special/students/tech_lounge/',
  },
]

const hackathons = [
  {
    name: 'Benesse EdTech ハッカソン 2days',
    year: '2022',
  },
  {
    name: 'Rakuten Product Manager Internship 3days',
    year: '2022',
  },
  {
    name: 'マネーフォワード エンジニアインターンシップ',
    year: '2022',
  },
  {
    name: 'IBM IT Specialist',
    year: '2022',
  },
]

export function CommunityShowcase() {
  return (
    <section id="community" className="bg-muted/15 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Community</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">コミュニティ & ハッカソン</h2>
          <p className="mx-auto max-w-3xl text-sm text-muted-foreground">
            参加したコミュニティやハッカソン、インターンをピックアップ。学びとネットワークを広げた経験をまとめています。
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">コミュニティ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {communities.map((item) => (
                <article key={item.name} className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <span className="font-mono text-xs text-muted-foreground">{item.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-primary transition hover:text-primary/80"
                    >
                      公式サイトをみる ↗
                    </a>
                  ) : null}
                </article>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">ハッカソン・インターン</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {hackathons.map((item) => (
                <article key={item.name} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <span className="font-mono text-xs text-muted-foreground">{item.year}</span>
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
