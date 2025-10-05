import { ExternalLink, Github } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type Project = {
  title: string
  description: string
  technologies: string[]
  githubUrl: string
  liveUrl: string
  featured: boolean
  note?: string
}

const projects: Project[] = [
  {
    title: '不動産EC 管理画面（業務）',
    description:
      'Oracle APEX／PL/SQL／React／AWS を活用した大手不動産EC向け管理画面の開発・保守。バリデーション標準化、外部連結テスト推進により移行後の安定稼働に貢献。',
    technologies: ['Oracle APEX', 'PL/SQL', 'React', 'AWS'],
    githubUrl: '#',
    liveUrl: '#',
    note: '社内案件のため非公開',
    featured: true,
  },
  {
    title: '業務管理画面（業務｜E2E自動化）',
    description:
      'APEX／PL/SQL／Playwright／Jest／AWS を使用したフォーム回帰の自動化パイプライン整備。手動検証の安定化と負荷削減を実現し、障害の根本原因特定と恒久対策を実装。',
    technologies: ['Oracle APEX', 'PL/SQL', 'Playwright', 'Jest', 'AWS'],
    githubUrl: '#',
    liveUrl: '#',
    note: '社内案件のため非公開',
    featured: true,
  },
  {
    title: 'sakujiru（個人アプリ｜Rails検証）',
    description:
      'Ruby on Rails 6／Docker Compose／Puma を使用した Rails×Docker の開発環境構築・運用検証とCIの試行。ローカルRubyとコンテナRubyのバージョン差異に起因する依存解決を再現・解消。',
    technologies: ['Ruby on Rails 6', 'Docker Compose', 'Puma'],
    githubUrl: 'https://github.com/nemdull/sakujiru-app',
    liveUrl: '#',
    featured: false,
  },
  {
    title: 'Go TODO API（個人）',
    description:
      'Go／Docker Compose／MySQL を使用した学習用REST API。ハンドラ／リポジトリ分離、Swagger導入検討、Linter/Formatter設定、MakefileでのDX改善。',
    technologies: ['Go', 'Docker Compose', 'MySQL'],
    githubUrl: 'https://github.com/nemdull',
    liveUrl: '#',
    note: 'リポジトリ一覧参照',
    featured: false,
  },
]

const featuredProjects = projects.filter((project) => project.featured)
const otherProjects = projects.filter((project) => !project.featured)

export function Projects() {
  return (
    <section id="projects" className="bg-muted/20 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Projects</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">プロジェクト</h2>
          <p className="max-w-3xl text-base text-muted-foreground">
            業務プロジェクトと個人開発を通じて培った実装・保守・品質担保の実績です。公開可能な範囲から一部をピックアップしています。
          </p>
        </div>

        <div className="space-y-5">
          <h3 className="text-xl font-semibold">注目プロジェクト</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <Card key={project.title} className="border-border/60 bg-card/80">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.note && <p className="text-xs text-muted-foreground">Code：{project.note}</p>}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <ProjectFooter project={project} />
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-xl font-semibold">個人プロジェクト</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {otherProjects.map((project) => (
              <Card key={project.title} className="border-border/60 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.note && <p className="text-xs text-muted-foreground">{project.note}</p>}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <ProjectFooter project={project} compact />
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">その他のアウトプット（業務外）</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/60 bg-card/60 p-5">
              <div className="space-y-2.5">
                <h4 className="text-lg font-semibold">技術記事（AI活用／自動化）</h4>
                <p className="text-sm text-muted-foreground">Qiita での技術記事執筆を通じた知見共有</p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">累計6000PV</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://qiita.com/nemdull" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Qiita
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
            <Card className="border-border/60 bg-card/60 p-5">
              <div className="space-y-2.5">
                <h4 className="text-lg font-semibold">社内共有会</h4>
                <p className="text-sm text-muted-foreground">E2E自動化とレビュー観点の標準化ノウハウの社内展開</p>
                <Badge variant="secondary">知見横展開</Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

type ProjectFooterProps = {
  project: Project
  compact?: boolean
}

function ProjectFooter({ project, compact }: ProjectFooterProps) {
  const showPreview = project.liveUrl && project.liveUrl !== '#'
  const showCode = project.githubUrl && project.githubUrl !== '#'

  if (!showPreview && !showCode) {
    return null
  }

  return (
    <CardFooter className={`gap-2 ${compact ? 'justify-start pt-0' : 'justify-end'}`}>
      {showPreview ? (
        <Button variant="outline" size="sm" asChild>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </a>
        </Button>
      ) : null}
      {showCode ? (
        <Button variant="outline" size="sm" asChild>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            Code
          </a>
        </Button>
      ) : null}
    </CardFooter>
  )
}
