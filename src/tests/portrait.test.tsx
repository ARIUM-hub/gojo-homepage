import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PortraitImage } from '../components/PortraitImage'

describe('PortraitImage', () => {
  it('shows an accessible fallback when the portrait fails to load', () => {
    render(<PortraitImage src="/missing.jpg" alt="五条悟人物图" />)

    fireEvent.error(screen.getByRole('img', { name: '五条悟人物图' }))

    expect(
      screen.getByRole('img', { name: '五条悟人物图加载失败' }),
    ).toHaveTextContent('五条悟')
    expect(document.querySelector('img')).toBeNull()
  })
})
