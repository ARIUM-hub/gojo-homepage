import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { RelationshipTabs } from '../components/RelationshipTabs'
import { TechniqueGrid } from '../components/TechniqueGrid'
import { gojo } from '../data/gojo'
import { HomePage } from '../pages/HomePage'

describe('HomePage interactions', () => {
  it('renders Gojo profile facts', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    try {
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
    } finally {
      warn.mockRestore()
    }
  })

  it('expands and collapses a technique detail', async () => {
    const user = userEvent.setup()

    render(<TechniqueGrid techniques={gojo.techniques} />)

    const trigger = screen.getByRole('button', { name: '查看六眼详情' })
    await user.click(trigger)
    expect(screen.getByText(/近乎零损耗/)).toBeInTheDocument()

    await user.click(trigger)
    expect(screen.queryByText(/近乎零损耗/)).not.toBeInTheDocument()
  })

  it('switches relationship details by tab', async () => {
    const user = userEvent.setup()

    render(<RelationshipTabs relationships={gojo.relationships} />)

    await user.click(screen.getByRole('tab', { name: '乙骨忧太' }))

    expect(screen.getByRole('tabpanel')).toHaveTextContent('后继者')
  })
})
