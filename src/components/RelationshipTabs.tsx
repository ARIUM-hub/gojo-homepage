import { useState } from 'react'

import type { Relationship } from '../data/gojo'

interface RelationshipTabsProps {
  relationships: readonly Relationship[]
}

export function RelationshipTabs({ relationships }: RelationshipTabsProps) {
  const [selectedId, setSelectedId] = useState(relationships[0]?.id)
  const selected = relationships.find(
    (relationship) => relationship.id === selectedId,
  )

  return (
    <div className="relationship-panel panel">
      <div className="relationship-tabs" role="tablist" aria-label="人物关系">
        {relationships.map((relationship) => (
          <button
            id={`relationship-tab-${relationship.id}`}
            key={relationship.id}
            role="tab"
            type="button"
            aria-selected={selectedId === relationship.id}
            aria-controls="relationship-detail"
            onClick={() => setSelectedId(relationship.id)}
          >
            {relationship.name}
          </button>
        ))}
      </div>
      <div
        id="relationship-detail"
        className="relationship-detail"
        role="tabpanel"
        aria-labelledby={
          selected ? `relationship-tab-${selected.id}` : undefined
        }
      >
        {selected ? (
          <>
            <p className="eyebrow">{selected.role}</p>
            <h3>{selected.name}</h3>
            <p>{selected.summary}</p>
          </>
        ) : (
          <p>资料暂缺</p>
        )}
      </div>
    </div>
  )
}
