// いちばん上の画面の、スクロールの進み具合（0〜1）ごとの出来事。Hero と Intro の両方がこれを見る。

/** ここまでに、見出しの文字が飛び去る */
export const FLY_END = 0.4
/** 最後の「。」の明かりが広がりはじめる所 */
export const PORTAL_FROM = 0.06
/** 明かりの色が画面を覆いきる所。ここから下は、自己紹介の部屋 */
export const PORTAL_FULL = 0.4
/** 自己紹介を読みはじめる所と、読み終える所 */
export const READ_FROM = 0.3
export const READ_TO = 0.9
/** 上の帯の色と「いまここ」を、自己紹介の部屋に切り替える所 */
export const LATE_AT = 0.33
