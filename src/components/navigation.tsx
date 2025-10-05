import { useEffect, useState } from 'react'
import { Github, Linkedin, Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

const navItems = [
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Community', href: '#community' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/nemdull', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nemdull/', icon: Linkedin },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 48)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${isScrolled ? 'border-b bg-background/80 backdrop-blur' : ''}`}>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="font-mono text-lg font-semibold text-primary">
          {"nemdull's Profile"}
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="text-muted-foreground transition hover:text-foreground">
              {item.name}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {socialLinks.map(({ label, href, icon: Icon }) => {
            const isExternal = href.startsWith('http')
            return (
              <Button key={label} variant="ghost" size="sm" asChild>
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              </Button>
            )
          })}
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen((prev) => !prev)} aria-expanded={isOpen} aria-label="Toggle navigation">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t bg-card/80 backdrop-blur md:hidden">
          <nav className="space-y-2 px-4 py-4 text-sm font-medium">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-foreground transition hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              {socialLinks.map(({ label, href, icon: Icon }) => {
                const isExternal = href.startsWith('http')
                return (
                  <Button key={label} variant="outline" size="sm" asChild>
                    <a
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  </Button>
                )
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
