import {
  type KeyboardEvent,
  useId,
  useRef,
  useState,
} from 'react'

import type { Relationship } from '../data/gojo'

interface RelationshipTabsProps {
  relationships: readonly Relationship[]
}

export function RelationshipTabs({ relationships }: RelationshipTabsProps) {
  const [selectedId, setSelectedId] = useState(relationships[0]?.id)
  const idPrefix = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const panelId = `${idPrefix}-relationship-detail`
  const selected = relationships.find(
    (relationship) => relationship.id === selectedId,
  )
  const getTabId = (relationshipId: string) =>
    `${idPrefix}-relationship-tab-${relationshipId}`

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex: number

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % relationships.length
        break
      case 'ArrowLeft':
        nextIndex =
          (currentIndex - 1 + relationships.length) % relationships.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = relationships.length - 1
        break
      default:
        return
    }

    event.preventDefault()
    const nextRelationship = relationships[nextIndex]
    if (!nextRelationship) return

    setSelectedId(nextRelationship.id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="relationship-panel panel">
      <div className="relationship-tabs" role="tablist" aria-label="人物关系">
        {relationships.map((relationship, index) => (
          <button
            id={getTabId(relationship.id)}
            key={relationship.id}
            role="tab"
            type="button"
            aria-selected={selectedId === relationship.id}
            aria-controls={panelId}
            tabIndex={selectedId === relationship.id ? 0 : -1}
            ref={(element) => {
              tabRefs.current[index] = element
            }}
            onClick={() => setSelectedId(relationship.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {relationship.name}
          </button>
        ))}
      </div>
      <div
        id={panelId}
        className="relationship-detail"
        role="tabpanel"
        aria-labelledby={
          selected ? getTabId(selected.id) : undefined
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
