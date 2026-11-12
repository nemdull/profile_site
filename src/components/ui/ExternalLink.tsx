import type { ReactNode } from 'react'

type ExternalLinkProps = {
  href: string
  children: ReactNode
  className?: string
}

/** 別のサイトへのリンク。新しいタブで開く */
export function ExternalLink({ href, children, className = 'link' }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  )
}
