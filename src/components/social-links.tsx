import { ExternalLink, Github, Instagram, Linkedin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const social = [
  { label: 'GitHub', href: 'https://github.com/nemdull', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nemdull/', icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com/nemdull', icon: Instagram },
  { label: 'Zenn', href: 'https://zenn.dev/nemdull', icon: ExternalLink },
  { label: 'Qiita', href: 'https://qiita.com/nemdull', icon: ExternalLink },
  { label: 'Findy Skills', href: 'https://findy-code.io/skills-share/6l9E_223HPNgn', icon: ExternalLink },
  { label: 'Speaker Deck', href: 'https://speakerdeck.com/nemdull', icon: ExternalLink },
  { label: 'Profile Page (old)', href: 'https://sites.google.com/view/nemdull/', icon: ExternalLink },
]

export function SocialLinks() {
  return (
    <section className="border-t bg-muted/10 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card className="border-border/60 bg-card/80">
          <CardHeader className="space-y-2.5 text-center">
            <span className="text-sm font-mono uppercase tracking-[0.4em] text-primary">Social</span>
            <CardTitle className="text-3xl font-semibold">Connect with NEMDULL</CardTitle>
            <p className="text-sm text-muted-foreground">
              最新の活動やプロジェクトは各種SNSで発信しています。気軽にフォロー・ご連絡ください。
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {social.map(({ label, href, icon: Icon }) => (
                <Button key={label} variant="outline" asChild className="h-14">
                  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Icon className="h-5 w-5" />
                    {label}
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
