import { Section } from '@/components/ui/Section'
import { profile } from '@/content'
import { useScrollProgress } from '@/lib/hooks'

/** 仕事の経歴。左の線は、読み進めた所まで光る */
export function Experience() {
  const { experience } = profile
  const ref = useScrollProgress<HTMLDivElement>()

  return (
    <Section id="experience" title={experience.title}>
      <div ref={ref} className="timeline">
        <span className="timeline-fill" aria-hidden="true" />
        <ol>
          {experience.items.map((job) => (
            <li key={job.period} className="job">
              <p className="job-period">
                {job.period}
                {job.now ? <span className="now">いまここ</span> : null}
              </p>
              <h3 className="job-title">{job.title}</h3>
              <p className="job-org">{job.org}</p>
              <p className="job-summary">{job.summary}</p>
              <ul className="job-points">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <ul className="chips" aria-label="使った技術">
                {job.tech.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
