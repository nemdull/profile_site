import { Room } from '@/components/ui/Room'
import { profile } from '@/content'

// "2026 年 4 月から" のような期間から、はじまりの年だけを取り出す（大きく見せる用）
const startYear = (period: string) => period.match(/\d{4}/)?.[0] ?? ''

/** 仕事の経歴。はじまりの年を大きく置いて、その横に中身を書く */
export function Experience() {
  const { experience } = profile

  return (
    <Room id="experience" title={experience.title}>
      <ol className="jobs">
        {experience.items.map((job) => (
          <li key={job.period} className="job">
            <div className="job-when">
              <p className="job-year" aria-hidden="true">
                {startYear(job.period)}
              </p>
              <p className="job-period">
                {job.period}
                {job.now ? <span className="now">いまここ</span> : null}
              </p>
            </div>
            <div className="job-body">
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
            </div>
          </li>
        ))}
      </ol>
    </Room>
  )
}
