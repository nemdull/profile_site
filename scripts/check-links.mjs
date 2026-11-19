// 載せているリンクが、いまも開けるかを確かめる。
//   使い方: npm run check:links
//
// `npm run check` は「リンクの形」と「張ってよいサイトか」を見るが、行き先が生きているかまでは見ない。
// こちらは、実際に 1 本ずつ開いてみる。ネットワークに出るので、ビルドには入れていない
// （外のサイトが一時的に落ちているだけで、ビルドが止まるのを避けるため）。
//
// 結果は 3 つに分ける
//   開けた       … 200 番台が返ってきた
//   確かめられず … 機械からのアクセスを断るサイト、時間切れ、一時的なサーバーエラー。失敗にはしない
//   切れている   … 404 / 410、またはサイトそのものが見つからない。これがあると失敗で終わる
import { appendFileSync, readFileSync } from 'node:fs'

const profile = JSON.parse(readFileSync(new URL('../src/content/profile.json', import.meta.url), 'utf8'))

// ログインしていないと中身を返さないサイト。機械からは「開けるか」を判断できないので、開きに行かない
const BROWSER_ONLY = new Set(['x.com', 'instagram.com'])
const TIMEOUT_MS = 60_000
const PARALLEL = 4

const found = new Map()
const walk = (value, path) => {
  if (typeof value === 'string') {
    if (/^https?:\/\//.test(value) && !found.has(value)) found.set(value, path)
  } else if (Array.isArray(value)) value.forEach((item, index) => walk(item, `${path}[${index}]`))
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => walk(item, `${path}.${key}`))
}
walk(profile, 'profile')

async function open(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; nemdull-link-check; +https://www.nemdull.com/)',
      accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
    },
  })
  await response.body?.cancel()
  return response.status
}

async function check(url) {
  const host = new URL(url).hostname.replace(/^www\./, '')
  if (BROWSER_ONLY.has(host)) return { kind: 'unknown', note: 'ログインしないと確かめられないサイト' }

  let last = ''
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const status = await open(url)
      if (status >= 200 && status < 300) return { kind: 'ok', note: String(status) }
      if (status === 404 || status === 410) return { kind: 'dead', note: String(status) }
      last = String(status)
      // 401 / 403 / 429 は、機械からのアクセスを断っているだけのことが多い。やり直しても変わらない
      if (status < 500) return { kind: 'unknown', note: `${status}（機械からの確認を断られた）` }
    } catch (error) {
      const code = error?.cause?.code ?? error?.name ?? 'error'
      // 名前が引けないのは、サイトが無くなったか、名前を引く仕組みの一時的な不調。2 回続いたら「無い」とみなす
      if (code === 'ENOTFOUND' && attempt === 2) return { kind: 'dead', note: 'サイトが見つからない' }
      last = code === 'TimeoutError' ? `${TIMEOUT_MS / 1000} 秒待っても返事がない` : code
    }
    if (attempt === 1) await new Promise((resolve) => setTimeout(resolve, 5_000))
  }
  return { kind: 'unknown', note: `${last}（一時的なものかもしれない）` }
}

const queue = [...found.entries()]
const results = []
await Promise.all(
  Array.from({ length: PARALLEL }, async () => {
    while (queue.length) {
      const [url, path] = queue.shift()
      results.push({ url, path, ...(await check(url)) })
    }
  }),
)

const LABEL = { ok: '開けた', unknown: '確かめられず', dead: '切れている' }
const ORDER = { dead: 0, unknown: 1, ok: 2 }
results.sort((a, b) => ORDER[a.kind] - ORDER[b.kind] || a.url.localeCompare(b.url))

for (const { kind, url, note, path } of results) {
  console.log(`${LABEL[kind]}\t${note}\t${url}${kind === 'ok' ? '' : `\t← ${path}`}`)
}
const count = (kind) => results.filter((result) => result.kind === kind).length
const summary = `リンクの点検: ${results.length} 本（開けた ${count('ok')}、確かめられず ${count('unknown')}、切れている ${count('dead')}）`
console.log(`\n${summary}`)

// GitHub Actions では、実行結果のページにも表で出す
if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results.map(({ kind, url, note }) => `| ${LABEL[kind]} | ${note} | ${url} |`).join('\n')
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### ${summary}\n\n| 結果 | くわしく | リンク |\n| --- | --- | --- |\n${rows}\n`)
}

if (count('dead') > 0) {
  console.error('\n切れているリンクがあります。src/content/profile.json を直してください。')
  process.exit(1)
}
