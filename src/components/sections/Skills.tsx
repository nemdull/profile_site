import { Section } from '@/components/ui/Section'
import { profile } from '@/content'

// 帯に流すのは、道具の名前だけ（かっこ書きの内訳は下の一覧で読める）
const short = (name: string) => name.split('（')[0]

function Belt({ names, reverse = false }: { names: string[]; reverse?: boolean }) {
  return (
    <div className="belt" data-reverse={reverse || undefined}>
      <div className="belt-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined}>
            {names.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  const { skills } = profile
  const tools = skills.groups.slice(0, 3)
  const work = tools[0].items.map(short)
  const personal = [...tools[1].items, ...tools[2].items].map(short)

  return (
    <>
      <div className="belts" aria-hidden="true">
        <Belt names={work} />
        <Belt names={personal} reverse />
      </div>
      <Section id="skills" title={skills.title}>
        <div className="skill-groups">
          {skills.groups.map((group) => (
            <div key={group.group}>
              <h3 className="skill-group-name">{group.group}</h3>
              <ul className="skill-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
