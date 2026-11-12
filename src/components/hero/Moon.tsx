import type { CSSProperties } from 'react'

import avatar from '@/assets/images/avatar.webp'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { profile, type LinkItem } from '@/content'
import { usePreflight } from '@/systems/preflight-context'

// 読み込めない画像。隕石でアイコンの通信が切れたときに差し替える
const DEAD_IMAGE = 'data:image/png;base64,AAAA'

// 隕石のあとに軌道へ紛れ込む、一覧にないサイトへのリンク
const STRANGER: LinkItem = { label: '？？？', url: 'https://example.com/' }

/** アイコンの月と、そのまわりを回るリンク */
export function Moon() {
  const { fault } = usePreflight()
  const dead = fault === 'avatar'

  const satellites: (LinkItem & { state?: string })[] = profile.links
    .filter((link) => link.primary)
    .map((link, index) =>
      fault === 'https' && index === 0
        ? { ...link, url: link.url.replace('https://', 'http://'), state: 'broken' }
        : link,
    )
  if (fault === 'hosts') satellites.push({ ...STRANGER, state: 'stranger' })

  return (
    <div className="moon-wrap">
      <div className="moon-ring" aria-hidden="true" />
      <div className="moon" data-dead={dead || undefined}>
        <img
          data-avatar
          src={dead ? DEAD_IMAGE : avatar}
          alt="nemdull のアイコン。宇宙服のヘルメットをかぶった青い猫"
          width={640}
          height={640}
          decoding="async"
        />
        {dead ? <span className="moon-static">通信が途絶えました</span> : null}
      </div>
      {dead ? null : (
        <div className="zzz" aria-hidden="true">
          <span>z</span>
          <span>z</span>
          <span>z</span>
        </div>
      )}
      <ul className="orbit" aria-label="ほかの場所">
        {satellites.map((link, index) => (
          <li
            key={link.label}
            className="sat"
            style={{ '--a': `${(360 / satellites.length) * index - 35}deg` } as CSSProperties}
          >
            <ExternalLink href={link.url} className="sat-link">
              <span data-state={link.state}>{link.label}</span>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
