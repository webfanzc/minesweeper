import { describe, expect, it } from 'vitest'

function pow(num: number) {
  return num ** 2
}

describe('tests', () => {
  it('should works', () => {
    expect(pow(4)).toMatchInlineSnapshot('16')
  })
})
