import type { ReactNode } from 'react'

type ExternalLinkProps = {
  href: string
  children: ReactNode
  className?: string
  /** 自分自身の別のページ（GitHub や X のプロフィールなど）へのリンクなら true。rel="me" が付く */
  me?: boolean
}

/** 別のサイトへのリンク。新しいタブで開く */
export function ExternalLink({ href, children, className = 'link', me = false }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel={me ? 'me noreferrer' : 'noreferrer'} className={className}>
      {children}
    </a>
  )
}
