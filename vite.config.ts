import { readFileSync } from "node:fs"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

// 載せる内容（リンクの一覧など）は、画面と同じ profile.json から読む
const profile = JSON.parse(readFileSync(path.resolve(__dirname, "./src/content/profile.json"), "utf8"))

/**
 * 検索エンジン向けの情報を、ビルドのときに profile.json から作る。
 *   - index.html に、schema.org の Person（sameAs = 同じ人の別のページ）を埋め込む
 *   - robots.txt と sitemap.xml を出力する
 */
function searchMeta(): Plugin {
  const site: string = profile.meta.siteUrl
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.meta.name,
    alternateName: profile.meta.reading,
    url: site,
    image: `${site}apple-touch-icon.png`,
    jobTitle: profile.meta.role,
    sameAs: profile.links.map((link: { url: string }) => link.url),
  }
  return {
    name: "search-meta",
    transformIndexHtml: () => [
      {
        tag: "script",
        attrs: { type: "application/ld+json" },
        // HTML の中に置くので、タグの始まりに見える文字は逃がしておく
        children: JSON.stringify(person).replace(/</g, "\\u003c"),
        injectTo: "head",
      },
    ],
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${site}sitemap.xml\n`,
      })
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}</loc></url>\n</urlset>\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), searchMeta()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
