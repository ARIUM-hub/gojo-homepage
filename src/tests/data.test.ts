import { describe, expect, it } from 'vitest'

import { gojo } from '../data/gojo'

describe('gojo profile data', () => {
  it('uses unique ids for techniques and relationships', () => {
    expect(new Set(gojo.techniques.map((item) => item.id)).size).toBe(
      gojo.techniques.length,
    )
    expect(new Set(gojo.relationships.map((item) => item.id)).size).toBe(
      gojo.relationships.length,
    )
  })

  it('contains the expected profile collection sizes', () => {
    expect(gojo.name).toBe('五条悟')
    expect(gojo.techniques).toHaveLength(7)
    expect(gojo.relationships).toHaveLength(4)
    expect(gojo.timeline).toHaveLength(4)
  })
})
