import { ExternalLink } from '@/components/atoms/ExternalLink'
import { profile } from '@/content'

export function Footer() {
  const { links, meta } = profile

  return (
    <footer className="page">
      <div className="border-t border-rule py-10 text-sm text-soft">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.url}>
              <ExternalLink href={link.url}>{link.label}</ExternalLink>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          内容を最後に確かめた日は {meta.reviewedOn} です。このサイトの
          <ExternalLink href={meta.repoUrl}>コード</ExternalLink>
          も公開しています。
        </p>
        <p className="mt-1">© 2026 {meta.name}</p>
      </div>
    </footer>
  )
}
