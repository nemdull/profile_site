import { Section } from '@/components/molecules/Section'
import { profile } from '@/content'

export function Experience() {
  return (
    <Section id="experience" title="経歴">
      <div className="space-y-14">
        {profile.experience.map((job) => (
          <article key={job.period}>
            <p className="text-sm text-soft">{job.period}</p>
            <h3 className="mt-1 text-lg leading-snug font-bold">{job.title}</h3>
            <p className="text-sm text-soft">{job.org}</p>
            <p className="mt-4 max-w-[42em]">{job.summary}</p>
            <ul className="mt-4 max-w-[42em] list-disc space-y-1.5 pl-5 marker:text-soft">
              {job.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="mt-4 max-w-[42em] text-sm text-soft">使った技術：{job.tech.join('、')}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
