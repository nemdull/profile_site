import type { ReactNode } from 'react'

type ExternalLinkProps = {
  href: string
  children: ReactNode
  className?: string
}

export function ExternalLink({ href, children, className = 'link' }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}
