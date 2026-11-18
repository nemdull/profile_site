// ページを開いたときに、ブラウザの中で実際に走らせる点検。
// 見ているのは本物の DOM なので、どこかが壊れればちゃんと落ちる。
// ビルドの前に走る scripts/check-content.mjs と、同じ許可一覧を使っている。
import { allowedHosts } from '@/content'
import { prefersReducedMotion } from '@/lib/hooks'

export type CheckId = 'headline' | 'avatar' | 'https' | 'hosts' | 'evidence' | 'overflow' | 'motion'

export type Outcome = {
  ok: boolean
  detail: string
  /** その場に出す札（CheckNote）と電光掲示板に流す、短い読み取り値 */
  brief: string
  /** 落ちたとき、原因になった要素。「壊れた所を見る」で使う */
  target?: Element | null
}

export type Check = {
  id: CheckId
  label: string
  /** 札に出す短い名前 */
  short: string
  run: () => Outcome | Promise<Outcome>
}

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
    short: '見出し',
    run: () => {
      const headings = document.querySelectorAll('h1')
      const first = headings[0]
      const text = first?.textContent?.trim() ?? ''
      if (headings.length !== 1) {
        return { ok: false, detail: `h1 が ${headings.length} 個あります`, brief: `h1 × ${headings.length}`, target: first }
      }
      if (text.length === 0) return { ok: false, detail: 'h1 の中身が空です', brief: 'h1 が空', target: first }
      return { ok: true, detail: `h1 は 1 つ。「${text}」`, brief: 'h1 × 1' }
    },
  },
  {
    id: 'avatar',
    label: 'アイコンの画像が読み込めている',
    short: 'アイコン',
    run: async () => {
      const image = document.querySelector<HTMLImageElement>('img[data-avatar]')
      if (!image) return { ok: false, detail: '画像の要素が見つかりません', brief: '要素なし' }
      await settled(image)
      if (image.naturalWidth === 0) {
        return { ok: false, detail: '画像を読み込めませんでした', brief: '読み込めず', target: image.parentElement }
      }
      const size = `${image.naturalWidth}×${image.naturalHeight}`
      return { ok: true, detail: `${size} で読み込み済み`, brief: size }
    },
  },
  {
    id: 'https',
    label: '外へのリンクが、ぜんぶ https',
    short: 'https',
    run: () => {
      const links = externalLinks()
      const bad = links.filter((link) => link.protocol !== 'https:')
      if (bad.length > 0) {
        return {
          ok: false,
          detail: `https でないリンクが ${bad.length} 本（${nameOf(bad[0])}）`,
          brief: `http が ${bad.length} 本`,
          target: bad[0],
        }
      }
      return { ok: true, detail: `${links.length} 本、ぜんぶ https`, brief: `${links.length} 本` }
    },
  },
  {
    id: 'hosts',
    label: 'リンクの行き先が、決めたサイトだけ',
    short: '行き先',
    run: () => {
      const links = externalLinks()
      const bad = links.filter((link) => !allowedHosts.includes(link.hostname))
      if (bad.length > 0) {
        return { ok: false, detail: `${bad[0].hostname} は、一覧にないサイトです`, brief: '一覧にないサイト', target: bad[0] }
      }
      const hosts = new Set(links.map((link) => link.hostname))
      return { ok: true, detail: `行き先は ${hosts.size} サイト。ぜんぶ一覧にあります`, brief: `${hosts.size} サイト` }
    },
  },
  {
    id: 'evidence',
    label: '「できること」に、ぜんぶ根拠が付いている',
    short: '根拠',
    run: () => {
      const claims = Array.from(document.querySelectorAll('[data-claim]'))
      const bare = claims.filter((claim) => claim.querySelector('[data-evidence]') === null)
      if (claims.length === 0) return { ok: false, detail: '「できること」が見つかりません', brief: '0 件' }
      if (bare.length > 0) {
        return { ok: false, detail: `根拠のない行が ${bare.length} 件あります`, brief: `根拠なし ${bare.length} 件`, target: bare[0] }
      }
      return { ok: true, detail: `${claims.length} 件、ぜんぶ根拠つき`, brief: `${claims.length}/${claims.length} 件` }
    },
  },
  {
    id: 'overflow',
    label: '画面の横にはみ出していない',
    short: '横幅',
    run: () => {
      const root = document.documentElement
      // 裏で開かれていて画面の幅が 0 のときは、測りようがないので落とさない
      if (root.clientWidth === 0) return { ok: true, detail: '画面が出ていないので、まだ測っていません', brief: '未計測' }
      const over = root.scrollWidth - root.clientWidth
      if (over > 0) return { ok: false, detail: `横に ${over}px はみ出しています`, brief: `+${over}px` }
      return { ok: true, detail: `幅 ${root.clientWidth}px に収まっています`, brief: `${root.clientWidth}px` }
    },
  },
  {
    id: 'motion',
    label: '「動きを減らす」設定を守っている',
    short: '動き',
    run: () => {
      if (!prefersReducedMotion()) return { ok: true, detail: '設定はオフ。ふつうに動かしています', brief: '動かす' }
      // 一瞬で終わる色の切り替えなどは数えない。目に見えて動き続けるものだけを探す
      const running = document.getAnimations().filter((animation) => {
        const length = Number(animation.effect?.getComputedTiming().activeDuration ?? 0)
        return animation.playState === 'running' && length > 100
      })
      if (running.length > 0) {
        return { ok: false, detail: `止まっていない動きが ${running.length} 個あります`, brief: `${running.length} 個が動く` }
      }
      return { ok: true, detail: '設定はオン。動きを止めています', brief: '止める' }
    },
  },
]
