import { Cpu, Terminal, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import ProfileImage from '@/components/img/Designer.jpeg'

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-background">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(79,127,251,0.45),transparent_60%),radial-gradient(circle_at_80%_10%,rgba(255,166,41,0.35),transparent_65%),radial-gradient(circle_at_50%_80%,rgba(31,74,184,0.4),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:80px_80px]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/30 to-background" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 text-center sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
            <img
              src={ProfileImage}
              alt="NEMDULL のプロフィール写真"
              className="h-40 w-40 rounded-full border-4 border-primary/70 object-cover shadow-xl shadow-primary/30 sm:h-48 sm:w-48"
            />
          </div>
          <div className="space-y-5">
            <p className="font-mono text-sm uppercase tracking-[0.4em] text-primary">Application Engineer</p>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
                <span className="text-primary font-mono">{'<NEMDULL/>'}</span>
              </h1>
              <h2 className="text-2xl font-mono text-muted-foreground sm:text-3xl">APPLICATION_ENGINEER.EXE</h2>
            </div>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg">
              2024年に金融系SIerへ新卒入社。Oracle APEX／PL/SQLを中核に、React・TypeScript・AWSを横断しながら
              品質と開発速度を両立させるアプリケーションエンジニアです。
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild>
            <a href="#projects" className="min-w-[220px] font-mono text-base">
              {'> VIEW_PROJECTS'}
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#contact" className="min-w-[220px] font-mono text-base">
              {'> ESTABLISH_CONTACT'}
            </a>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[{ icon: Terminal, label: 'FRONTEND' }, { icon: Cpu, label: 'BACKEND' }, { icon: Zap, label: 'DEVOPS' }].map(
            ({ icon: Icon, label }) => (
              <div
                key={label}
                className="group rounded-xl border border-primary/40 bg-card/70 px-6 py-5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-mono text-primary">{label}</p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
