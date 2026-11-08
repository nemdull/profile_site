import { ExternalLink, Github } from 'lucide-react'

import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/atoms/Card'

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
    title: '会員向けWebシステムの保守・エンハンス（業務｜PL）',
    description:
      '2026年度よりプロジェクトリーダーとして、要件整理・見積・顧客折衝・パートナー成果物レビューを担当。管理画面からバッチ・データ連携基盤まで保守範囲を広げ、顧客から直接依頼を受ける体制を構築。',
    technologies: ['Oracle APEX', 'PL/SQL', 'React', 'AWS', 'Jira'],
    githubUrl: '#',
    liveUrl: '#',
    note: '社内案件のため非公開',
    featured: true,
  },
  {
    title: '生成AIによるテスト自動化・設計書整備（業務）',
    description:
      'Playwright／Jest による回帰テスト自動化を土台に、生成AIを「誤らせない仕組みごと」業務に組み込む設計を推進。期待値の改変禁止・根拠必須・曖昧表現の自動検査などのガードレールを定義し、AI向け設計書の整備を主担当として実施。',
    technologies: ['Playwright', 'Jest', 'TypeScript', 'Claude Code', 'LLM'],
    githubUrl: '#',
    liveUrl: '#',
    note: '社内案件のため非公開',
    featured: true,
  },
  {
    title: '不動産EC 管理画面（業務）',
    description:
      'Oracle APEX／PL/SQL／React／AWS を活用した大手不動産EC向け管理画面の開発・保守。バリデーション標準化、外部連結テスト推進により移行後の安定稼働に貢献。',
    technologies: ['Oracle APEX', 'PL/SQL', 'React', 'AWS'],
    githubUrl: '#',
    liveUrl: '#',
    note: '社内案件のため非公開',
    featured: false,
  },
  {
    title: 'MonaBite（モバイルアプリ｜Shipaton 2026）',
    description:
      'SNSでバズった飲食店を、共有シートから1タップで自分の地図にピン留めするアプリ。RevenueCat 主催ハッカソン Shipaton 2026 向けに Expo（React Native／TypeScript）で iOS／Android 両対応、RevenueCat SDK でアプリ内課金を実装。',
    technologies: ['Expo', 'React Native', 'TypeScript', 'RevenueCat'],
    githubUrl: '#',
    liveUrl: '#',
    note: 'ハッカソン提出作（リポジトリは非公開）',
    featured: false,
  },
  {
    title: 'ニンメモ（モバイルアプリ｜人間メモ帳）',
    description:
      '人を覚えておくためのローカル保存アプリ。2列グリッドの人物カード、ハートをスワイプして好感度を調整するUI、テーマ切替を実装。型チェック・ユニットテスト・Web E2E・依存監査を通した上で App Store 申請資料まで整備。',
    technologies: ['Expo', 'React Native', 'TypeScript', 'Playwright'],
    githubUrl: '#',
    liveUrl: '#',
    note: 'リリース準備中（リポジトリは非公開）',
    featured: false,
  },
  {
    title: 'ジンバフ（モバイルアプリ｜参拝・徳行の記録）',
    description:
      '参拝・御朱印・おみくじ・徳行を記録し、スキルの成長と「加護（24時間バフ）」を可視化する和風アプリ。OpenStreetMap／Wikipedia の候補補完、Supabase による認証・共有ランキング、CSVエクスポートを実装。',
    technologies: ['Expo', 'React Native', 'Supabase'],
    githubUrl: '#',
    liveUrl: '#',
    note: '開発中（リポジトリは非公開）',
    featured: false,
  },
  {
    title: 'sf-meter（Web｜SF度メーター）',
    description:
      'SF 作品に登場するテクノロジーの危険度や SF 度合いを数値化して「SF メーター」として表示する Web アプリ。Go 製のバックエンド API と、React + TypeScript + Vite のフロントエンドで構成。',
    technologies: ['Go', 'React', 'TypeScript', 'Vite'],
    githubUrl: 'https://github.com/nemdull/sf-meter',
    liveUrl: '#',
    featured: false,
  },
  {
    title: 'sakujiru（Web｜作字クリエイター支援）',
    description:
      'Ruby on Rails 6／Docker Compose／Puma を使用した作画投稿プラットフォーム。Rails×Docker の開発環境構築・運用検証とCIの試行を行い、ローカルRubyとコンテナRubyのバージョン差異に起因する依存解決を再現・解消。',
    technologies: ['Ruby on Rails 6', 'Docker Compose', 'Puma'],
    githubUrl: 'https://github.com/nemdull/sakujiru-app',
    liveUrl: 'https://sakujiru-web.onrender.com/',
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
                <h4 className="text-lg font-semibold">Slack 匿名お悩み Bot（Findy ぷち改善ハッカソン）</h4>
                <p className="text-sm text-muted-foreground">
                  LLM × Slack × Playwright で、チームの心理的安全性を少しだけ上げる Bot を1日で実装。MVPの線引きとDBなし運用、権限の最小化を設計。
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">LLM API</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://qiita.com/nemdull/items/a2d72e6a5d4e82161e00"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      記事
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
            <Card className="border-border/60 bg-card/60 p-5">
              <div className="space-y-2.5">
                <h4 className="text-lg font-semibold">AWS 認定資格 参考書の共著</h4>
                <p className="text-sm text-muted-foreground">
                  AWS Solutions Architect Professional 対策書（改訂2版）の執筆チームに参加。章の執筆と Markdown → Word のビルド整備を担当。
                </p>
                <Badge variant="secondary">執筆中</Badge>
              </div>
            </Card>
            <Card className="border-border/60 bg-card/60 p-5">
              <div className="space-y-2.5">
                <h4 className="text-lg font-semibold">社内AI勉強会の立ち上げ・登壇</h4>
                <p className="text-sm text-muted-foreground">
                  生成AIを業務に組み込む際のガードレール設計や、E2E自動化・レビュー観点の標準化ノウハウを社内勉強会で2回登壇して展開。
                </p>
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
