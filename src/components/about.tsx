import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const highlights = [
  { metric: '1.5+', label: 'Years of experience' },
  { metric: '3', label: 'Major projects' },
  { metric: '10+', label: 'Technologies shipped' },
  { metric: '5', label: 'Technical articles' },
]

export function About() {
  return (
    <section id="about" className="border-t bg-background py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">About</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Who I am</h2>
          <p className="max-w-3xl text-base text-muted-foreground">
            Summary copy can be filled in later. Keep this area descriptive enough to understand the focus of the
            portfolio.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <Card key={item.label} className="bg-card/70">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">{item.metric}</CardTitle>
                <CardDescription>{item.label}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Placeholder paragraph describing current role, responsibilities, and the type of problems being solved. Use
              this as guidance for future detailed copywriting.
            </p>
            <p>
              Extend with additional notes about collaboration style, tooling preferences, or ongoing learning efforts to
              match the reference site structure.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
