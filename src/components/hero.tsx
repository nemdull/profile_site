import { ArrowRight, Cpu, Terminal, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 text-center sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="font-mono text-sm uppercase tracking-[0.4em] text-primary">Application Engineer</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Crafting reliable web experiences across the stack.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Frontend, backend, and automation tooling brought together with a pragmatic mindset.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <a href="#projects" className="flex items-center gap-2">
              View Projects
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#contact">Contact</a>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Terminal, label: 'Frontend' },
            { icon: Cpu, label: 'Backend' },
            { icon: Zap, label: 'Automation' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="rounded-xl border bg-card/60 px-6 py-4 text-sm font-medium text-muted-foreground">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
