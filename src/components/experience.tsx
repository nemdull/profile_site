import { Briefcase } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const experiences = [
  {
    period: '2024/04 – Present',
    title: 'Software Engineer',
    company: 'Enterprise SIer',
    summary: 'Owning delivery of core business systems with a focus on quality and automation.',
    achievements: [
      'Introduced regression testing automation to reduce manual verification.',
      'Standardised review checklists to maintain consistent release quality.',
    ],
    technologies: ['Oracle APEX', 'TypeScript', 'React', 'AWS', 'Playwright'],
  },
]

export function Experience() {
  return (
    <section id="experience" className="border-t bg-muted/20 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Experience</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Recent work history</h2>
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
                <p className="text-sm text-muted-foreground">{item.summary}</p>
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
