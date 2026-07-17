import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PortraitImage } from '../components/PortraitImage'

describe('PortraitImage', () => {
  it('shows an accessible fallback when the portrait fails to load', () => {
    render(
      <PortraitImage
        src="/missing.jpg"
        alt="五条悟人物图"
        className="profile-portrait"
      />,
    )

    const portrait = screen.getByRole('img', { name: '五条悟人物图' })

    expect(portrait).toHaveClass('portrait-media', 'profile-portrait')
    fireEvent.error(portrait)

    const fallback = screen.getByRole('img', {
      name: '五条悟人物图加载失败',
    })

    expect(fallback).toHaveClass(
      'portrait-media',
      'portrait-fallback',
      'profile-portrait',
    )
    expect(fallback).toHaveTextContent('五条悟')
    expect(document.querySelector('img')).toBeNull()
  })

  it('tries a new source after the previous source failed', () => {
    const { rerender } = render(
      <PortraitImage src="/missing.jpg" alt="五条悟人物图" />,
    )

    fireEvent.error(screen.getByRole('img', { name: '五条悟人物图' }))
    rerender(<PortraitImage src="/replacement.jpg" alt="五条悟人物图" />)

    expect(screen.getByRole('img', { name: '五条悟人物图' })).toHaveAttribute(
      'src',
      '/replacement.jpg',
    )
  })
})
