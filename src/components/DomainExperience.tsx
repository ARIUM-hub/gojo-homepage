import { X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export function DomainExperience() {
  const [isOpen, setIsOpen] = useState(false)
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const host = document.createElement('div')
    host.setAttribute('data-domain-portal-host', '')
    document.body.append(host)
    setPortalHost(host)

    return () => host.remove()
  }, [])

  useEffect(() => {
    if (!isOpen || !portalHost) {
      if (wasOpenRef.current) {
        triggerRef.current?.focus()
        wasOpenRef.current = false
      }
      return
    }

    wasOpenRef.current = true

    const backgroundState = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement && element !== portalHost,
      )
      .map((element) => ({
        element,
        hadInert: element.hasAttribute('inert'),
        inert: element.getAttribute('inert'),
        hadAriaHidden: element.hasAttribute('aria-hidden'),
        ariaHidden: element.getAttribute('aria-hidden'),
      }))
    const previousOverflow = document.body.style.overflow

    backgroundState.forEach(({ element }) => {
      element.setAttribute('inert', '')
      element.setAttribute('aria-hidden', 'true')
    })
    document.body.style.overflow = 'hidden'
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

    const handleFocusIn = (event: FocusEvent) => {
      if (
        dialogRef.current &&
        event.target instanceof Node &&
        !dialogRef.current.contains(event.target)
      ) {
        closeRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
      backgroundState.forEach(
        ({ element, hadInert, inert, hadAriaHidden, ariaHidden }) => {
          if (hadInert) {
            element.setAttribute('inert', inert ?? '')
          } else {
            element.removeAttribute('inert')
          }

          if (hadAriaHidden) {
            element.setAttribute('aria-hidden', ariaHidden ?? '')
          } else {
            element.removeAttribute('aria-hidden')
          }
        },
      )
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, portalHost])

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

      {isOpen && portalHost
        ? createPortal(
            <div
              className="domain-overlay"
              ref={dialogRef}
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
                <p id={descriptionId}>
                  信息无穷地涌入，却什么也无法完成。
                </p>
              </div>
            </div>,
            portalHost,
          )
        : null}
    </div>
  )
}
