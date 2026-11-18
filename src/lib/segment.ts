// 日本語の文を、読みながら 1 つずつ出していくための小さなかたまりに分ける。
// 句読点や閉じかっこは前のかたまりに、開きかっこは次のかたまりに付ける（行の頭に「。」が来ないように）。

const CLOSERS = /^[\s、。，．・：；？！）」』】〕》〉…‥ー]+$/
const OPENERS = /^[（「『【〔《〈]+$/
// 1 文字の助詞（を・に・が…）は、前の語にくっつけたほうが自然に読める
const PARTICLE = /^[ぁ-ん]$/

export function segmentJa(text: string): string[] {
  const parts =
    typeof Intl.Segmenter === 'function'
      ? Array.from(new Intl.Segmenter('ja', { granularity: 'word' }).segment(text), (part) => part.segment)
      : Array.from(text)

  const chunks: string[] = []
  let opening = ''
  for (const part of parts) {
    if (OPENERS.test(part)) {
      opening += part
      continue
    }
    const attach = opening === '' && chunks.length > 0 && (CLOSERS.test(part) || PARTICLE.test(part))
    if (attach) chunks[chunks.length - 1] += part
    else chunks.push(opening + part)
    opening = ''
  }
  if (opening) chunks.push(opening)
  return chunks
}
