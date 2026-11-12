import { MessageCircle } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card'

const channels = [
  {
    label: 'X（DM）',
    description: '技術の話題や情報交換、仕事のご相談はこちらへ',
    href: 'https://x.com/nemdull',
    icon: MessageCircle,
  },
]

export function Contact() {
  return (
    <section id="contact" className="bg-background py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Contact</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">お問い合わせ</h2>
          <p className="text-base text-muted-foreground">
            新しいプロジェクトや情報交換のご相談は、SNSのメッセージから気軽にご連絡ください。
          </p>
        </div>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>連絡チャネル</CardTitle>
            <CardDescription>首都圏を拠点に活動しています。ご都合の良いチャネルからご連絡ください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {channels.map(({ label, description, href, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary transition hover:underline"
                  >
                    {label}
                  </a>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
