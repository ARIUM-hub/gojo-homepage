import { describe, expect, it } from 'vitest'
import edgeOneConfig from '../../edgeone.json'

const immutableCacheHeader = {
  key: 'Cache-Control',
  value: 'public, max-age=31536000, immutable',
}

describe('EdgeOne deployment config', () => {
  it('configures immutable caching for static assets and images', () => {
    expect(edgeOneConfig.headers).toEqual([
      {
        source: '/assets/*',
        headers: [immutableCacheHeader],
      },
      {
        source: '/images/*',
        headers: [immutableCacheHeader],
      },
    ])
  })

  it('does not define rewrites', () => {
    expect(edgeOneConfig).not.toHaveProperty('rewrites')
  })
})
