// 公開する内容の点検。`npm run build` の最初に走り、問題があればビルドを止める。
//   確認だけするとき: npm run check
//
// 見ていること
//   1. 「できること」の各行に、根拠が 1 つ以上付いている
//   2. リンクが https で、形が正しい
//   3. リンク先が、src/content/allowed-hosts.json にあるサイトだけになっている
//   4. 書体の字形セットに入っていない文字が無いか（これは警告だけ）
import { existsSync, readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

// リンクを張ってよいサイト。新しいサイトへ張るときは、src/content/allowed-hosts.json に足してから。
// 同じ一覧を、ページを開いたときの点検（src/systems/preflight.ts）も見ている
const ALLOWED_HOSTS = JSON.parse(read('../src/content/allowed-hosts.json'))

const profile = JSON.parse(read('../src/content/profile.json'))
const errors = []
const warnings = []

// 文字列の値を、場所つきですべて集める
const strings = []
const walk = (value, path) => {
  if (typeof value === 'string') strings.push([path, value])
  else if (Array.isArray(value)) value.forEach((item, index) => walk(item, `${path}[${index}]`))
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => walk(item, `${path}.${key}`))
}
walk(profile, 'profile')

// 1. 根拠
profile.claims.items.forEach((item, index) => {
  const evidence = Array.isArray(item.evidence) ? item.evidence : []
  if (evidence.length === 0) errors.push(`claims[${index}]「${item.claim}」に根拠がありません`)
  evidence.forEach((entry, at) => {
    if (!entry.kind?.trim() || !entry.label?.trim()) errors.push(`claims[${index}].evidence[${at}] の種類か説明が空です`)
  })
})

// 2・3. リンク
for (const [path, value] of strings) {
  if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) continue
  let url
  try {
    url = new URL(value)
  } catch {
    errors.push(`${path}: URL の形が正しくありません（${value}）`)
    continue
  }
  if (url.protocol !== 'https:') errors.push(`${path}: https ではありません（${value}）`)
  if (!ALLOWED_HOSTS.includes(url.hostname)) {
    errors.push(`${path}: ${url.hostname} は、リンクを張ってよいサイトの一覧にありません（${value}）`)
  }
}

// 4. 書体
const charsetPath = '../src/assets/fonts/charset.txt'
if (existsSync(new URL(charsetPath, import.meta.url))) {
  const charset = new Set(read(charsetPath))
  const missing = new Set()
  for (const [path, value] of strings) {
    if (path.endsWith('.url') || path.endsWith('Url')) continue
    for (const char of value) if (char.trim() && !charset.has(char)) missing.add(char)
  }
  if (missing.size > 0) {
    warnings.push(
      `書体のファイルに入っていない文字があります: ${[...missing].join(' ')}\n` +
        '  表示は端末の書体に切り替わるだけで、壊れません。そろえるには: npm run fonts',
    )
  }
} else {
  warnings.push('src/assets/fonts/charset.txt がありません。python3 scripts/subset-fonts.py で書体を作り直してください')
}

warnings.forEach((message) => console.warn(`警告: ${message}`))
if (errors.length > 0) {
  errors.forEach((message) => console.error(`エラー: ${message}`))
  console.error(`\n内容の点検で ${errors.length} 件の問題が見つかりました。src/content/profile.json を直してください。`)
  process.exit(1)
}
console.log(`内容の点検: 問題なし（主張 ${profile.claims.items.length} 件、文字列 ${strings.length} 件を確認）`)
