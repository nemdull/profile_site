import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const skillCategories = [
  {
    title: 'Frontend',
    icon: '🎨',
    skills: [
      { name: 'React', level: 48 },
      { name: 'TypeScript', level: 44 },
      { name: 'Oracle APEX (UI)', level: 50 },
      { name: 'HTML', level: 48 },
      { name: 'CSS', level: 44 },
    ],
  },
  {
    title: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'PL/SQL', level: 50 },
      { name: 'Oracle Database', level: 48 },
      { name: 'Node.js', level: 38 },
      { name: 'Ruby on Rails', level: 41 },
      { name: 'Go', level: 35 },
    ],
  },
  {
    title: 'DevOps & Cloud',
    icon: '☁️',
    skills: [
      { name: 'AWS', level: 44 },
      { name: 'Docker', level: 41 },
      { name: 'GitHub Actions', level: 38 },
      { name: 'Lambda', level: 41 },
      { name: 'API Gateway', level: 38 },
    ],
  },
  {
    title: 'QA / Quality',
    icon: '🔍',
    skills: [
      { name: 'Playwright', level: 48 },
      { name: 'Jest', level: 44 },
      { name: 'レビュー観点設計', level: 50 },
      { name: '影響調査・試験設計', level: 48 },
      { name: 'E2E自動化', level: 44 },
    ],
  },
]

const tooling = [
  'Jira',
  'Confluence',
  'Slack',
  'Outlook',
  'Figma',
  'GitHub',
  'CloudWatch Logs',
  'RDS',
  'S3',
  '生成AI (ChatGPT/Copilot)',
  'レビュー標準化',
  '障害対応',
  'バージョンアップ対応',
  '自動化推進',
  '技術記事執筆',
  '社内共有',
  'E2E テスト設計',
  '影響調査',
]

export function Skills() {
  return (
    <section id="skills" className="border-t bg-background py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Skills</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">技術スタック</h2>
          <p className="max-w-3xl text-base text-muted-foreground">
            Oracle APEX／PL/SQL を中核に、React・TypeScript・AWS を横断した開発・保守・品質担保を主戦場としています。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {skillCategories.map((category) => (
            <Card key={category.title} className="border-border/60 bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <span className="text-2xl" aria-hidden="true">
                    {category.icon}
                  </span>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium text-foreground">
                      <span>{skill.name}</span>
                      <span className="text-xs text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">コラボレーション・ツール</h3>
          <div className="flex flex-wrap gap-2">
            {tooling.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
