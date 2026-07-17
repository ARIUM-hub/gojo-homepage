import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ProfilePage } from '../pages/ProfilePage'

describe('ProfilePage', () => {
  it('renders the detailed Gojo profile', () => {
    const { container } = render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ProfilePage />
      </MemoryRouter>,
    )

    const portrait = screen.getByRole('img', {
      name: '五条悟档案页人物图',
    })
    expect(portrait).toHaveClass('profile-portrait-media')

    fireEvent.error(portrait)

    expect(
      screen.getByRole('img', { name: '五条悟档案页人物图加载失败' }),
    ).toHaveClass('profile-portrait-media', 'portrait-media')
    expect(screen.getByText('12 月 7 日')).toBeInTheDocument()
    expect(screen.getByText('190cm 以上')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '六眼' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '无下限术式' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '无量空处' }),
    ).toBeInTheDocument()
    expect(container.querySelectorAll('.profile-stats dt')).toHaveLength(4)
    expect(container.querySelectorAll('.profile-stats dd')).toHaveLength(4)
    expect(screen.getByRole('link', { name: '返回主页' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
