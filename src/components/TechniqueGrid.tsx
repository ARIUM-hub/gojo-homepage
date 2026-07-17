import { useState } from 'react'

import type { Technique } from '../data/gojo'

interface TechniqueGridProps {
  techniques: readonly Technique[]
}

export function TechniqueGrid({ techniques }: TechniqueGridProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="bento-grid">
      {techniques.map((technique) => {
        const isOpen = openId === technique.id
        const detailId = `${technique.id}-detail`

        return (
          <article className="info-card" key={technique.id}>
            <p className="eyebrow">{technique.label}</p>
            <h3>{technique.name}</h3>
            {isOpen && <p id={detailId}>{technique.summary}</p>}
            <button
              className="text-button"
              type="button"
              aria-expanded={isOpen}
              aria-controls={detailId}
              onClick={() => setOpenId(isOpen ? null : technique.id)}
            >
              {isOpen ? '收起' : '查看'}{technique.name}详情
            </button>
          </article>
        )
      })}
    </div>
  )
}
