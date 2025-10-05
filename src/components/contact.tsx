import { Mail, MapPin } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Contact() {
  return (
    <section id="contact" className="bg-background py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Contact</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">お問い合わせ</h2>
          <p className="text-base text-muted-foreground">
            新しいプロジェクトや情報交換のご相談は、各種SNSまたはメールから気軽にご連絡ください。
          </p>
        </div>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>連絡先情報</CardTitle>
            <CardDescription>ご都合の良いチャネルからご連絡ください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Email</p>
                <a href="mailto:nemdull067@gmail.com" className="text-sm text-primary transition hover:underline">
                  nemdull067@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">横浜, 日本</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
