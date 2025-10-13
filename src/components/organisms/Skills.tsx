import { useState } from 'react'

import { Badge } from '@/components/atoms/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'

type SkillIconSource =
  | { kind: 'simpleicon'; slug: string; color?: string }
  | { kind: 'devicon'; path: string }
  | { kind: 'glyph'; glyph: string }
  | { kind: 'text'; label: string }

type Skill = {
  name: string
  sources: SkillIconSource[]
}

type SkillCategory = {
  title: string
  icon: string
  skills: Skill[]
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: '🎨',
    skills: [
      {
        name: 'React',
        sources: [
          { kind: 'simpleicon', slug: 'react', color: '61DAFB' },
          { kind: 'devicon', path: 'react/react-original.svg' },
          { kind: 'text', label: 'React' },
        ],
      },
      {
        name: 'TypeScript',
        sources: [
          { kind: 'simpleicon', slug: 'typescript', color: '3178C6' },
          { kind: 'devicon', path: 'typescript/typescript-original.svg' },
          { kind: 'text', label: 'TS' },
        ],
      },
      {
        name: 'Oracle APEX (UI)',
        sources: [
          { kind: 'devicon', path: 'oracle/oracle-original.svg' },
          { kind: 'simpleicon', slug: 'oracle', color: 'F80000' },
          { kind: 'text', label: 'APEX' },
        ],
      },
      {
        name: 'HTML5',
        sources: [
          { kind: 'simpleicon', slug: 'html5', color: 'E34F26' },
          { kind: 'devicon', path: 'html5/html5-original.svg' },
          { kind: 'text', label: 'HTML' },
        ],
      },
      {
        name: 'CSS3',
        sources: [
          { kind: 'simpleicon', slug: 'css3', color: '1572B6' },
          { kind: 'devicon', path: 'css3/css3-original.svg' },
          { kind: 'text', label: 'CSS' },
        ],
      },
    ],
  },
  {
    title: 'Backend',
    icon: '⚙️',
    skills: [
      {
        name: 'PL/SQL',
        sources: [
          { kind: 'devicon', path: 'oracle/oracle-original.svg' },
          { kind: 'simpleicon', slug: 'oracle', color: 'F80000' },
          { kind: 'text', label: 'PL/SQL' },
        ],
      },
      {
        name: 'Oracle Database',
        sources: [
          { kind: 'devicon', path: 'oracle/oracle-original.svg' },
          { kind: 'simpleicon', slug: 'oracle', color: 'F80000' },
          { kind: 'text', label: 'Oracle DB' },
        ],
      },
      {
        name: 'Node.js',
        sources: [
          { kind: 'simpleicon', slug: 'nodedotjs', color: '339933' },
          { kind: 'devicon', path: 'nodejs/nodejs-original.svg' },
          { kind: 'text', label: 'Node.js' },
        ],
      },
      {
        name: 'Ruby on Rails',
        sources: [
          { kind: 'simpleicon', slug: 'rubyonrails', color: 'CC0000' },
          { kind: 'devicon', path: 'rails/rails-original-wordmark.svg' },
          { kind: 'text', label: 'Rails' },
        ],
      },
      {
        name: 'Go',
        sources: [
          { kind: 'simpleicon', slug: 'go', color: '00ADD8' },
          { kind: 'devicon', path: 'go/go-original.svg' },
          { kind: 'text', label: 'Go' },
        ],
      },
    ],
  },
  {
    title: 'DevOps & Cloud',
    icon: '☁️',
    skills: [
      {
        name: 'Docker',
        sources: [
          { kind: 'simpleicon', slug: 'docker', color: '2496ED' },
          { kind: 'devicon', path: 'docker/docker-original.svg' },
          { kind: 'text', label: 'Docker' },
        ],
      },
      {
        name: 'GitHub Actions',
        sources: [
          { kind: 'simpleicon', slug: 'github', color: '181717' },
          { kind: 'devicon', path: 'github/github-original.svg' },
          { kind: 'text', label: 'GitHub' },
        ],
      },
      {
        name: 'CI/CD',
        sources: [
          { kind: 'glyph', glyph: '🛠️' },
          { kind: 'text', label: 'CI/CD' },
        ],
      },
      {
        name: 'Infrastructure as Code',
        sources: [
          { kind: 'glyph', glyph: '📐' },
          { kind: 'text', label: 'IaC' },
        ],
      },
      {
        name: 'Monitoring',
        sources: [
          { kind: 'glyph', glyph: '📈' },
          { kind: 'text', label: 'Monitoring' },
        ],
      },
    ],
  },
  {
    title: 'QA / Quality',
    icon: '🔍',
    skills: [
      {
        name: 'Playwright',
        sources: [
          { kind: 'simpleicon', slug: 'playwright', color: '45BA4B' },
          { kind: 'devicon', path: 'playwright/playwright-original.svg' },
          { kind: 'text', label: 'Playwright' },
        ],
      },
      {
        name: 'Jest',
        sources: [
          { kind: 'simpleicon', slug: 'jest', color: 'C21325' },
          { kind: 'devicon', path: 'jest/jest-plain.svg' },
          { kind: 'text', label: 'Jest' },
        ],
      },
      {
        name: 'レビュー観点設計',
        sources: [{ kind: 'glyph', glyph: '📝' }],
      },
      {
        name: '影響調査・試験設計',
        sources: [{ kind: 'glyph', glyph: '🧪' }],
      },
      {
        name: 'E2E自動化',
        sources: [{ kind: 'glyph', glyph: '🤖' }],
      },
    ],
  },
]

const collaborationTools: Skill[] = [
  {
    name: 'Jira',
    sources: [
      { kind: 'simpleicon', slug: 'jira', color: '0052CC' },
      { kind: 'devicon', path: 'jira/jira-original.svg' },
      { kind: 'text', label: 'Jira' },
    ],
  },
  {
    name: 'Confluence',
    sources: [
      { kind: 'simpleicon', slug: 'confluence', color: '172B4D' },
      { kind: 'devicon', path: 'confluence/confluence-original.svg' },
      { kind: 'text', label: 'Confluence' },
    ],
  },
  {
    name: 'Slack',
    sources: [
      { kind: 'simpleicon', slug: 'slack', color: '4A154B' },
      { kind: 'devicon', path: 'slack/slack-original.svg' },
      { kind: 'text', label: 'Slack' },
    ],
  },
  {
    name: 'Figma',
    sources: [
      { kind: 'simpleicon', slug: 'figma', color: 'F24E1E' },
      { kind: 'devicon', path: 'figma/figma-original.svg' },
      { kind: 'text', label: 'Figma' },
    ],
  },
  {
    name: 'GitHub',
    sources: [
      { kind: 'simpleicon', slug: 'github', color: '181717' },
      { kind: 'devicon', path: 'github/github-original.svg' },
      { kind: 'text', label: 'GitHub' },
    ],
  },
  {
    name: '生成AI (ChatGPT/Copilot)',
    sources: [
      { kind: 'glyph', glyph: '🤖' },
      { kind: 'text', label: '生成AI' },
    ],
  },
  {
    name: 'レビュー標準化',
    sources: [{ kind: 'glyph', glyph: '🧭' }],
  },
  {
    name: '障害対応',
    sources: [{ kind: 'glyph', glyph: '🚑' }],
  },
  {
    name: 'バージョンアップ対応',
    sources: [{ kind: 'glyph', glyph: '📦' }],
  },
  {
    name: '自動化推進',
    sources: [{ kind: 'glyph', glyph: '⚙️' }],
  },
  {
    name: '技術記事執筆',
    sources: [{ kind: 'glyph', glyph: '✍️' }],
  },
  {
    name: '社内共有',
    sources: [{ kind: 'glyph', glyph: '🗣️' }],
  },
  {
    name: 'E2E テスト設計',
    sources: [{ kind: 'glyph', glyph: '🧪' }],
  },
  {
    name: '影響調査',
    sources: [{ kind: 'glyph', glyph: '🔎' }],
  },
]

const awsStack = [
  'AWS',
  'AWS Lambda',
  'Amazon API Gateway',
  'Amazon CloudWatch Logs',
  'Amazon RDS',
  'Amazon S3',
]

export function Skills() {
  return (
    <section id="skills" className="bg-background py-16">
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
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {category.skills.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">AWS スタック</h3>
          <div className="flex flex-wrap gap-2">
            {awsStack.map((service) => (
              <Badge
                key={service}
                variant="outline"
                className="border-primary/40 bg-primary/5 text-sm font-medium text-primary"
              >
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">コラボレーション・ツール</h3>
          <div className="flex flex-wrap gap-3">
            {collaborationTools.map((tool) => (
              <SkillBadge key={tool.name} skill={tool} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillBadge({ skill }: { skill: Skill }) {
  const [sourceIndex, setSourceIndex] = useState(0)
  const source = skill.sources[sourceIndex] ?? { kind: 'text', label: skill.name }

  const handleImageError = () => {
    if (sourceIndex < skill.sources.length - 1) {
      setSourceIndex((prev) => prev + 1)
    }
  }

  return (
    <div
      className="group relative flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-muted/20 p-2 shadow-sm transition-colors hover:border-primary/80"
      title={skill.name}
    >
      {source.kind === 'simpleicon' && (
        <img
          src={`https://cdn.simpleicons.org/${source.slug}${source.color ? `/${source.color}` : ''}`}
          alt={skill.name}
          className="h-8 w-8"
          loading="lazy"
          onError={handleImageError}
        />
      )}
      {source.kind === 'devicon' && (
        <img
          src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${source.path}`}
          alt={skill.name}
          className="h-8 w-8"
          loading="lazy"
          onError={handleImageError}
        />
      )}
      {source.kind === 'glyph' && (
        <span className="text-2xl" aria-hidden="true">
          {source.glyph}
        </span>
      )}
      {source.kind === 'text' && (
        <span className="text-[0.65rem] font-semibold text-muted-foreground">
          {source.label}
        </span>
      )}
      <span className="pointer-events-none absolute -bottom-2 z-10 translate-y-full whitespace-nowrap rounded bg-popover px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        {skill.name}
      </span>
      <span className="sr-only">{skill.name}</span>
    </div>
  )
}
