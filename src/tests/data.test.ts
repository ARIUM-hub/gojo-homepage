import { describe, expect, expectTypeOf, it } from 'vitest'

import { gojo } from '../data/gojo'
import type {
  GojoProfile,
  Relationship,
  Technique,
  TimelineEntry,
} from '../data/gojo'

describe('gojo profile data', () => {
  it('uses unique ids in the expected order for every collection', () => {
    const collectionIds = [
      {
        actual: gojo.techniques.map((item) => item.id),
        expected: [
          'six-eyes',
          'limitless',
          'blue',
          'red',
          'purple',
          'reverse',
          'void',
        ],
      },
      {
        actual: gojo.relationships.map((item) => item.id),
        expected: ['geto', 'yuji', 'megumi', 'yuta'],
      },
      {
        actual: gojo.timeline.map((item) => item.id),
        expected: [
          'hidden-inventory',
          'night-parade',
          'shibuya',
          'final-battle',
        ],
      },
    ]

    for (const { actual, expected } of collectionIds) {
      expect(actual).toEqual(expected)
      expect(new Set(actual).size).toBe(actual.length)
    }
  })

  it('contains every required profile text value', () => {
    expect({
      name: gojo.name,
      romanizedName: gojo.romanizedName,
      title: gojo.title,
      identity: gojo.identity,
      quote: gojo.quote,
      profile: gojo.profile,
      bio: gojo.bio,
    }).toEqual({
      name: '五条悟',
      romanizedName: 'SATORU GOJO',
      title: '最强的现代咒术师',
      identity: '特级咒术师 · 教师',
      quote: '没关系，我可是最强的。',
      profile: {
        birthday: '12 月 7 日',
        height: '190cm 以上',
        grade: '特级',
        affiliation: '东京都立咒术高等专门学校',
      },
      bio: '拥有六眼与无下限术式的现代最强咒术师。作为教师，他试图培养能够改变咒术界的新一代。',
    })
  })

  it('keeps every collection string field non-empty', () => {
    const collections = [
      ['techniques', gojo.techniques],
      ['relationships', gojo.relationships],
      ['timeline', gojo.timeline],
    ] as const

    for (const [collectionName, items] of collections) {
      for (const item of items) {
        for (const [field, value] of Object.entries(item)) {
          const assertionMessage = `${collectionName}.${item.id}.${field}`

          expect(typeof value, assertionMessage).toBe('string')
          expect((value as string).trim(), assertionMessage).not.toBe('')
        }
      }
    }
  })

  it('exposes the complete readonly type contract', () => {
    expectTypeOf<GojoProfile>().toEqualTypeOf<{
      readonly name: string
      readonly romanizedName: string
      readonly title: string
      readonly identity: string
      readonly quote: string
      readonly profile: {
        readonly birthday: string
        readonly height: string
        readonly grade: string
        readonly affiliation: string
      }
      readonly bio: string
      readonly techniques: readonly Technique[]
      readonly relationships: readonly Relationship[]
      readonly timeline: readonly TimelineEntry[]
    }>()

    expectTypeOf<Technique>().toEqualTypeOf<{
      readonly id: string
      readonly name: string
      readonly label: string
      readonly summary: string
    }>()
    expectTypeOf<Relationship>().toEqualTypeOf<{
      readonly id: string
      readonly name: string
      readonly role: string
      readonly summary: string
    }>()
    expectTypeOf<TimelineEntry>().toEqualTypeOf<{
      readonly id: string
      readonly era: string
      readonly title: string
      readonly summary: string
    }>()
    expectTypeOf(gojo).toMatchTypeOf<GojoProfile>()
  })
})
