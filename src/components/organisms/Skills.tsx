import { Section } from '@/components/molecules/Section'
import { profile } from '@/content'

export function Skills() {
  return (
    <Section id="skills" title="スキル">
      <dl className="border-b border-rule">
        {profile.skills.map((skill) => (
          <div key={skill.group} className="grid gap-x-8 gap-y-1 border-t border-rule py-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <dt className="font-bold">{skill.group}</dt>
            <dd>{skill.items.join('、')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
