import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const highlights = [
  { metric: '1.5+', label: '年の実務経験' },
  { metric: '3', label: '主要業務プロジェクト' },
  { metric: '10+', label: '扱った技術' },
  { metric: '5', label: '技術記事（累計6,000PV）' },
]

export function About() {
  return (
    <section id="about" className="border-t bg-background py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">About</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">私について</h2>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="transition hover:text-primary">— 経歴</span>
            <span className="transition hover:text-primary">— 専門分野</span>
            <span className="transition hover:text-primary">— 価値観</span>
          </div>
          <p className="max-w-3xl text-base text-muted-foreground">
            <strong className="text-foreground">2024年に金融系SIerへ新卒入社し、大手不動産EC／業務システムの開発・保守を担当。</strong>
            <strong className="text-primary">Oracle APEX／PL/SQL</strong>を中核に、React・TypeScript・AWSを横断し、品質担保と自動化を軸に安定運用と開発速度の両立を目指しています。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <Card key={item.label} className="bg-card/70">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold text-primary">{item.metric}</CardTitle>
                <CardDescription>{item.label}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="bg-card/60">
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <strong className="text-primary">フォーム回帰のE2E自動化（Playwright）</strong>やレビュー観点の標準化をリードし、障害ゼロ運用の継続に貢献しました。
            </p>
            <p>
              <strong className="text-primary">生成AI（ChatGPT/Copilot）</strong>を活用したログ解析・テスト観点出しで調査リードタイムを短縮。プライベートではGo/Reactの個人開発や技術記事執筆、社内共有会を通じてナレッジを還元しています。
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
