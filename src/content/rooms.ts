import { profile } from './index'

/** 部屋の色。上から 夜 → 黄 → 紺 → 月 → 藤 の順でくり返す */
export type Tone = 'night' | 'lemon' | 'navy' | 'moon' | 'lavender'

export type RoomInfo = {
  id: string
  label: string
  tone: Tone
  /** 目次の札に大きく出す 1 文字 */
  glyph: string
}

const first = (text: string) => Array.from(text)[0] ?? ''

const room = (id: string, label: string, tone: Tone, glyph = first(label)): RoomInfo => ({ id, label, tone, glyph })

/** 自己紹介の部屋の色。いちばん上の画面の奥にあるので、目次には並べない */
export const INTRO_TONE: Tone = 'lemon'

/** ページの部屋。上から順に並べる。目次と、上の帯の「いまここ」が、この一覧を使う */
export const ROOMS: readonly RoomInfo[] = [
  room('top', 'いちばん上', 'night', first(profile.meta.headline[0] ?? '')),
  room('preflight', profile.preflight.title, 'navy'),
  room('claims', profile.claims.title, 'moon'),
  room('experience', profile.experience.title, 'lavender'),
  room('works', profile.works.title, 'night'),
  room('writing', profile.writing.title, 'lemon'),
  room('skills', profile.skills.title, 'navy'),
  room('certifications', profile.certifications.title, 'moon'),
  room('background', profile.background.title, 'lavender'),
  room('contact', profile.contact.title, 'night'),
]

export const toneOf = (id: string): Tone => ROOMS.find((entry) => entry.id === id)?.tone ?? 'night'

/** 1 つ上にある部屋の色。部屋の境目を、上の部屋の色のドットでつなぐのに使う */
export const toneAbove = (id: string): Tone => {
  const index = ROOMS.findIndex((entry) => entry.id === id)
  // いちばん上の画面のすぐ下は、その奥にあった自己紹介の部屋の色で終わっている
  return index <= 1 ? INTRO_TONE : ROOMS[index - 1].tone
}

/** 地の色が暗い部屋。上の帯は、暗い部屋の上では白い島に、明るい部屋の上では紺の島になる */
export const DARK_TONES: readonly Tone[] = ['night', 'navy']
