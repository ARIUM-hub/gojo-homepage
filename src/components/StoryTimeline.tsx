import type { TimelineEntry } from '../data/gojo'

interface StoryTimelineProps {
  entries: readonly TimelineEntry[]
}

export function StoryTimeline({ entries }: StoryTimelineProps) {
  return (
    <ol className="timeline">
      {entries.map((entry) => (
        <li key={entry.id}>
          <p className="eyebrow">{entry.era}</p>
          <h3>{entry.title}</h3>
          <p>{entry.summary}</p>
        </li>
      ))}
    </ol>
  )
}
