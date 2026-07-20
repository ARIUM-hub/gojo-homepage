import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { AppRoutes } from '../AppRoutes'

function renderRoute(route: string) {
  return render(
    <MemoryRouter
      initialEntries={[route]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('AppRoutes', () => {
  it('does not warn about React Router future flags', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    try {
      renderRoute('/')

      expect(warn).not.toHaveBeenCalledWith(
        expect.stringContaining('React Router Future Flag Warning'),
      )
    } finally {
      warn.mockRestore()
    }
  })

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

    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
    expect(
      screen.getByRole('heading', { name: '页面不存在' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '返回主页' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
