import avatar from '@/assets/images/Designer.jpeg'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { profile } from '@/content'

const anchors = [
  { label: '経歴', href: '#experience' },
  { label: 'つくったもの', href: '#works' },
  { label: '書いたもの', href: '#writing' },
  { label: 'スキル', href: '#skills' },
  { label: '資格', href: '#certifications' },
  { label: '連絡', href: '#contact' },
]

export function Navigation() {
  return (
    <header className="page flex items-center gap-6 py-5">
      <a href="#top" className="flex items-center gap-2.5 text-lg font-bold">
        <img src={avatar} alt="" width={32} height={32} className="h-8 w-8 rounded-full border border-rule" />
        {profile.meta.name}
      </a>
      <nav aria-label="ページ内の移動" className="ml-auto hidden md:block">
        <ul className="flex gap-6 text-sm">
          {anchors.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className="text-soft transition-colors hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="ml-auto md:ml-0">
        <ThemeToggle />
      </div>
    </header>
  )
}
