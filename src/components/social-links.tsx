import { Github, Linkedin, Rss } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const social = [
  { label: 'GitHub', href: '#', icon: Github },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
  { label: 'Blog', href: '#', icon: Rss },
]

export function SocialLinks() {
  return (
    <section className="border-t bg-muted/10 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card className="border-border/60 bg-card/80">
          <CardHeader className="text-center">
            <CardTitle>Stay connected</CardTitle>
            <p className="text-sm text-muted-foreground">
              Replace placeholder URLs with the actual social destinations you want to highlight.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {social.map(({ label, href, icon: Icon }) => (
                <Button key={label} variant="outline" asChild className="h-12" disabled>
                  <a href={href} className="flex items-center justify-center gap-2">
                    <Icon className="h-4 w-4" />
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
