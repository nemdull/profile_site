import { Mail, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Contact() {
  return (
    <section id="contact" className="border-t bg-background py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary">Contact</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Let&apos;s collaborate</h2>
          <p className="text-base text-muted-foreground">
            Use the placeholders below for future contact channels. Buttons remain disabled until destinations exist.
          </p>
        </div>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Preferred channels</CardTitle>
            <CardDescription>Update addresses and CTA links when copy is ready.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">nemdull067@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">Yokohama, Japan</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="default" disabled>
                Email me
              </Button>
              <Button variant="outline" disabled>
                Schedule a call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
