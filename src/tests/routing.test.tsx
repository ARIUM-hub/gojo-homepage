import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AppRoutes } from '../AppRoutes'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('AppRoutes', () => {
  it('navigates from home to profile', async () => {
    const user = userEvent.setup()

    renderRoute('/')
    await user.click(screen.getByRole('link', { name: '进入个人档案' }))

    expect(
      screen.getByRole('heading', { name: '个人档案' }),
    ).toBeInTheDocument()
  })

  it('renders a not found page', () => {
    renderRoute('/missing')

    expect(
      screen.getByRole('heading', { name: '页面不存在' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '返回主页' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
