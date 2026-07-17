import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ProfilePage } from '../pages/ProfilePage'

describe('ProfilePage', () => {
  it('renders the detailed Gojo profile', () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ProfilePage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('img', { name: '五条悟档案页人物图' }),
    ).toBeInTheDocument()
    expect(screen.getByText('12 月 7 日')).toBeInTheDocument()
    expect(screen.getByText('190cm 以上')).toBeInTheDocument()
    expect(screen.getByText('无量空处')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '返回主页' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
