import { X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

export function DomainExperience() {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        triggerRef.current?.focus()
        wasOpenRef.current = false
      }
      return
    }

    wasOpenRef.current = true
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        return
      }

      if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div className="domain-experience">
      <button
        className="button domain-trigger"
        type="button"
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
      >
        展开无量空处
      </button>

      {isOpen ? (
        <div
          className="domain-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          <button
            className="domain-close"
            type="button"
            ref={closeRef}
            aria-label="关闭无量空处"
            onClick={() => setIsOpen(false)}
          >
            <X aria-hidden="true" />
          </button>

          <div className="domain-copy">
            <p className="domain-kicker">DOMAIN EXPANSION</p>
            <h2 id={titleId}>无量空处</h2>
            <p id={descriptionId}>信息无穷地涌入，却什么也无法完成。</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
