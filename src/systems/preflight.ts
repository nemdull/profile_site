// ページを開いたときに、ブラウザの中で実際に走らせる点検。
// 見ているのは本物の DOM なので、どこかが壊れればちゃんと落ちる。
// ビルドの前に走る scripts/check-content.mjs と、同じ許可一覧を使っている。
import { allowedHosts } from '@/content'
import { prefersReducedMotion } from '@/lib/hooks'

export type CheckId = 'headline' | 'avatar' | 'https' | 'hosts' | 'evidence' | 'overflow' | 'motion'

export type Outcome = {
  ok: boolean
  detail: string
  /** 落ちたとき、原因になった要素。「壊れた所を見る」で使う */
  target?: Element | null
}

export type Check = { id: CheckId; label: string; run: () => Outcome | Promise<Outcome> }

/** わざと壊せる所。「隕石をぶつける」で、このうち 1 つが壊れる */
export type FaultId = 'headline' | 'avatar' | 'https' | 'hosts' | 'evidence'
export const FAULTS: readonly FaultId[] = ['headline', 'avatar', 'https', 'hosts', 'evidence']

const externalLinks = () =>
  Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).filter(
    (link) => !(link.getAttribute('href') ?? '').startsWith('#'),
  )

const nameOf = (link: HTMLAnchorElement) => link.textContent?.trim() || link.hostname

const settled = (image: HTMLImageElement) =>
  new Promise<void>((resolve) => {
    if (image.complete) {
      resolve()
      return
    }
    const done = () => {
      image.removeEventListener('load', done)
      image.removeEventListener('error', done)
      resolve()
    }
    image.addEventListener('load', done)
    image.addEventListener('error', done)
    window.setTimeout(done, 3000)
  })

export const CHECKS: readonly Check[] = [
  {
    id: 'headline',
    label: '見出しが表示されている',
    run: () => {
      const headings = document.querySelectorAll('h1')
      const first = headings[0]
      const text = first?.textContent?.trim() ?? ''
      if (headings.length !== 1) return { ok: false, detail: `h1 が ${headings.length} 個あります`, target: first }
      if (text.length === 0) return { ok: false, detail: 'h1 の中身が空です', target: first }
      return { ok: true, detail: `h1 は 1 つ。「${text}」` }
    },
  },
  {
    id: 'avatar',
    label: 'アイコンの画像が読み込めている',
    run: async () => {
      const image = document.querySelector<HTMLImageElement>('img[data-avatar]')
      if (!image) return { ok: false, detail: '画像の要素が見つかりません' }
      await settled(image)
      if (image.naturalWidth === 0) return { ok: false, detail: '画像を読み込めませんでした', target: image.parentElement }
      return { ok: true, detail: `${image.naturalWidth}×${image.naturalHeight} で読み込み済み` }
    },
  },
  {
    id: 'https',
    label: '外へのリンクが、ぜんぶ https',
    run: () => {
      const links = externalLinks()
      const bad = links.filter((link) => link.protocol !== 'https:')
      if (bad.length > 0) {
        return { ok: false, detail: `https でないリンクが ${bad.length} 本（${nameOf(bad[0])}）`, target: bad[0] }
      }
      return { ok: true, detail: `${links.length} 本、ぜんぶ https` }
    },
  },
  {
    id: 'hosts',
    label: 'リンクの行き先が、決めたサイトだけ',
    run: () => {
      const links = externalLinks()
      const bad = links.filter((link) => !allowedHosts.includes(link.hostname))
      if (bad.length > 0) {
        return { ok: false, detail: `${bad[0].hostname} は、一覧にないサイトです`, target: bad[0] }
      }
      const hosts = new Set(links.map((link) => link.hostname))
      return { ok: true, detail: `行き先は ${hosts.size} サイト。ぜんぶ一覧にあります` }
    },
  },
  {
    id: 'evidence',
    label: '「できること」に、ぜんぶ根拠が付いている',
    run: () => {
      const claims = Array.from(document.querySelectorAll('[data-claim]'))
      const bare = claims.filter((claim) => claim.querySelector('[data-evidence]') === null)
      if (claims.length === 0) return { ok: false, detail: '「できること」が見つかりません' }
      if (bare.length > 0) return { ok: false, detail: `根拠のない行が ${bare.length} 件あります`, target: bare[0] }
      return { ok: true, detail: `${claims.length} 件、ぜんぶ根拠つき` }
    },
  },
  {
    id: 'overflow',
    label: '画面の横にはみ出していない',
    run: () => {
      const root = document.documentElement
      // 裏で開かれていて画面の幅が 0 のときは、測りようがないので落とさない
      if (root.clientWidth === 0) return { ok: true, detail: '画面が出ていないので、まだ測っていません' }
      const over = root.scrollWidth - root.clientWidth
      if (over > 0) return { ok: false, detail: `横に ${over}px はみ出しています` }
      return { ok: true, detail: `幅 ${root.clientWidth}px に収まっています` }
    },
  },
  {
    id: 'motion',
    label: '「動きを減らす」設定を守っている',
    run: () => {
      if (!prefersReducedMotion()) return { ok: true, detail: '設定はオフ。ふつうに動かしています' }
      // 一瞬で終わる色の切り替えなどは数えない。目に見えて動き続けるものだけを探す
      const running = document.getAnimations().filter((animation) => {
        const length = Number(animation.effect?.getComputedTiming().activeDuration ?? 0)
        return animation.playState === 'running' && length > 100
      })
      if (running.length > 0) return { ok: false, detail: `止まっていない動きが ${running.length} 個あります` }
      return { ok: true, detail: '設定はオン。動きを止めています' }
    },
  },
]
