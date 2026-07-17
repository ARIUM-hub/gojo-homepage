import type { AnchorHTMLAttributes } from 'react'

import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    Link: ({
      to,
      ...props
    }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
      <a {...props} href={to} data-router-link="true" />
    ),
  }
})

import { SiteHeader } from '../components/SiteHeader'

describe('SiteHeader', () => {
  it('uses native anchors for the four section links', () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <SiteHeader />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'GOJO / SATORU' })).toHaveAttribute(
      'data-router-link',
      'true',
    )

    const navigation = screen.getByRole('navigation', { name: '主要导航' })
    const expectedLinks = [
      ['档案', '/#profile-summary'],
      ['术式', '/#techniques'],
      ['关系', '/#relationships'],
      ['经历', '/#story'],
    ] as const

    for (const [name, href] of expectedLinks) {
      const link = within(navigation).getByRole('link', { name })

      expect(link).toBeInstanceOf(HTMLAnchorElement)
      expect(link).toHaveAttribute('href', href)
      expect(link).not.toHaveAttribute('data-router-link')
    }
  })
})
