import { ExternalLink, Github } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const featuredProjects = [
  {
    title: 'Real Estate Admin Platform',
    summary: 'Enterprise management console powered by Oracle APEX, React, and AWS.',
    technologies: ['Oracle APEX', 'React', 'AWS'],
  },
  {
    title: 'Automation Pipeline',
    summary: 'Playwright regression suite that stabilised release verification.',
    technologies: ['Playwright', 'Jest', 'TypeScript'],
  },
]

const sideProjects = [
  {
    title: 'Sakujiru',
    description: 'Rails and Docker sandbox for experimenting with containerised workflows.',
    technologies: ['Rails', 'Docker', 'PostgreSQL'],
  },
  {
    title: 'Go TODO API',
    description: 'Learning project building a REST API with Go and MySQL.',
    technologies: ['Go', 'MySQL', 'Docker Compose'],
  },
]

export function Projects() {
  return (
    <section id="projects" className="border-t bg-muted/20 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Projects</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Selected work</h2>
          <p className="max-w-3xl text-base text-muted-foreground">
            Highlights from client engagements and personal prototypes. Replace link targets when repositories or demos are
            ready to share.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <Card key={project.title} className="border-border/60 bg-card/80">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Github className="mr-2 h-4 w-4" />
                  Code
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Personal experiments</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {sideProjects.map((project) => (
              <Card key={project.title} className="border-border/60 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
