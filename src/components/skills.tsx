import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React', level: 80 },
      { name: 'TypeScript', level: 78 },
      { name: 'Oracle APEX UI', level: 82 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'PL/SQL', level: 84 },
      { name: 'Go', level: 65 },
      { name: 'Node.js', level: 60 },
    ],
  },
]

const tooling = ['Playwright', 'Jest', 'GitHub Actions', 'Docker', 'AWS', 'Automation']

export function Skills() {
  return (
    <section id="skills" className="border-t bg-background py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Skills</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Core capabilities</h2>
          <p className="max-w-3xl text-base text-muted-foreground">
            Technical groups outlining areas of focus. Values represent relative confidence and can be refined with exact
            metrics later.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {skillCategories.map((category) => (
            <Card key={category.title} className="border-border/60 bg-card/80">
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
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
          <h3 className="text-lg font-semibold">Supporting tooling</h3>
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
