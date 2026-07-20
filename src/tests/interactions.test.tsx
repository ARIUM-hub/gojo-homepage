import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { DomainExperience } from '../components/DomainExperience'
import { RelationshipTabs } from '../components/RelationshipTabs'
import { TechniqueGrid } from '../components/TechniqueGrid'
import { gojo } from '../data/gojo'
import { HomePage } from '../pages/HomePage'

describe('HomePage interactions', () => {
  it('opens the domain dialog and moves focus to its close button', async () => {
    const user = userEvent.setup()

    render(<DomainExperience />)

    const trigger = screen.getByRole('button', { name: '展开无量空处' })
    expect(
      screen.queryByRole('dialog', { name: '无量空处' }),
    ).not.toBeInTheDocument()

    await user.click(trigger)

    const dialog = screen.getByRole('dialog', { name: '无量空处' })
    const closeButton = screen.getByRole('button', { name: '关闭无量空处' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(closeButton).toHaveFocus()
  })

  it('closes with Escape or the close button and restores trigger focus', async () => {
    const user = userEvent.setup()

    render(<DomainExperience />)

    const trigger = screen.getByRole('button', { name: '展开无量空处' })
    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(
      screen.queryByRole('dialog', { name: '无量空处' }),
    ).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: '关闭无量空处' }))

    expect(
      screen.queryByRole('dialog', { name: '无量空处' }),
    ).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('keeps forward and reverse Tab focus inside the domain dialog', async () => {
    const user = userEvent.setup()

    render(<DomainExperience />)

    await user.click(screen.getByRole('button', { name: '展开无量空处' }))
    const closeButton = screen.getByRole('button', { name: '关闭无量空处' })

    await user.tab()
    expect(closeButton).toHaveFocus()

    await user.tab({ shift: true })
    expect(closeButton).toHaveFocus()
  })

  it('isolates the home page while open and restores it after close', async () => {
    const user = userEvent.setup()
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'clip'

    try {
      const { container } = render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <HomePage />
        </MemoryRouter>,
      )
      container.setAttribute('aria-hidden', 'false')

      const skipLink = screen.getByRole('link', { name: '跳到主要内容' })
      const trigger = screen.getByRole('button', { name: '展开无量空处' })
      await user.click(trigger)

      const closeButton = screen.getByRole('button', { name: '关闭无量空处' })
      expect(container).toHaveAttribute('inert')
      expect(container).toHaveAttribute('aria-hidden', 'true')
      expect(document.body.style.overflow).toBe('hidden')

      skipLink.focus()
      expect(closeButton).toHaveFocus()

      await user.click(closeButton)

      expect(container).not.toHaveAttribute('inert')
      expect(container).toHaveAttribute('aria-hidden', 'false')
      expect(document.body.style.overflow).toBe('clip')
      expect(trigger).toHaveFocus()
    } finally {
      document.body.style.overflow = originalOverflow
    }
  })

  it('restores background state when unmounted while open', async () => {
    const user = userEvent.setup()
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'auto'

    try {
      const { container, unmount } = render(<DomainExperience />)

      await user.click(screen.getByRole('button', { name: '展开无量空处' }))
      expect(container).toHaveAttribute('inert')
      expect(document.body.style.overflow).toBe('hidden')

      unmount()

      expect(container).not.toHaveAttribute('inert')
      expect(container).not.toHaveAttribute('aria-hidden')
      expect(document.body.style.overflow).toBe('auto')
      expect(
        document.querySelector('[data-domain-portal-host]'),
      ).not.toBeInTheDocument()
    } finally {
      document.body.style.overflow = originalOverflow
    }
  })

  it('renders the domain experience trigger on the home page', () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <HomePage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('button', { name: '展开无量空处' }),
    ).toBeInTheDocument()
  })

  it('renders Gojo profile facts', () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByText('12 月 7 日')).toBeInTheDocument()
    expect(screen.getByText('190cm 以上')).toBeInTheDocument()
    expect(
      screen.getByText('东京都立咒术高等专门学校'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '最强的现代咒术师' }),
    ).toBeInTheDocument()
  })

  it('expands and collapses a technique detail', async () => {
    const user = userEvent.setup()

    render(<TechniqueGrid techniques={gojo.techniques} />)

    const trigger = screen.getByRole('button', { name: '查看六眼详情' })
    const detail = screen.getByText(/近乎零损耗/)
    expect(trigger).toHaveAttribute('aria-controls', detail.id)
    expect(detail).not.toBeVisible()

    await user.click(trigger)
    expect(detail).toBeVisible()

    await user.click(trigger)
    expect(detail).not.toBeVisible()
  })

  it('switches relationship details by tab', async () => {
    const user = userEvent.setup()

    render(<RelationshipTabs relationships={gojo.relationships} />)

    await user.click(screen.getByRole('tab', { name: '乙骨忧太' }))

    expect(screen.getByRole('tabpanel')).toHaveTextContent('后继者')
  })

  it('supports roving focus and keyboard navigation between relationship tabs', async () => {
    const user = userEvent.setup()

    render(<RelationshipTabs relationships={gojo.relationships} />)

    const geto = screen.getByRole('tab', { name: '夏油杰' })
    const yuji = screen.getByRole('tab', { name: '虎杖悠仁' })
    const megumi = screen.getByRole('tab', { name: '伏黑惠' })
    const yuta = screen.getByRole('tab', { name: '乙骨忧太' })
    const panel = screen.getByRole('tabpanel')

    expect(geto).toHaveAttribute('aria-selected', 'true')
    expect(geto).toHaveAttribute('tabindex', '0')
    expect(yuji).toHaveAttribute('tabindex', '-1')
    expect(megumi).toHaveAttribute('tabindex', '-1')
    expect(yuta).toHaveAttribute('tabindex', '-1')
    expect(geto).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveAttribute('aria-labelledby', geto.id)

    geto.focus()
    await user.keyboard('{ArrowRight}')
    expect(yuji).toHaveFocus()
    expect(yuji).toHaveAttribute('aria-selected', 'true')
    expect(panel).toHaveAttribute('aria-labelledby', yuji.id)

    await user.keyboard('{End}')
    expect(yuta).toHaveFocus()
    expect(yuta).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{Home}')
    expect(geto).toHaveFocus()
    expect(geto).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(yuta).toHaveFocus()
    expect(yuta).toHaveAttribute('aria-selected', 'true')
    expect(panel).toHaveAttribute('aria-labelledby', yuta.id)
  })

  it('uses unique relationship tab and panel IDs for each instance', () => {
    render(
      <>
        <RelationshipTabs relationships={gojo.relationships} />
        <RelationshipTabs relationships={gojo.relationships} />
      </>,
    )

    const getoTabs = screen.getAllByRole('tab', { name: '夏油杰' })
    const panels = screen.getAllByRole('tabpanel')

    expect(getoTabs[0].id).not.toBe(getoTabs[1].id)
    expect(panels[0].id).not.toBe(panels[1].id)
    expect(getoTabs[0]).toHaveAttribute('aria-controls', panels[0].id)
    expect(getoTabs[1]).toHaveAttribute('aria-controls', panels[1].id)
    expect(panels[0]).toHaveAttribute('aria-labelledby', getoTabs[0].id)
    expect(panels[1]).toHaveAttribute('aria-labelledby', getoTabs[1].id)
  })
})
