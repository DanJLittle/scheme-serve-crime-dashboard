import { describe, expect, it } from 'vitest'
import { parsePostcodes } from './postcodes'

describe('parsePostcodes', () => {
  it('normalises comma-separated postcodes and removes duplicates', () => {
    const result = parsePostcodes(' m1 1ae, SW1A 1AA, M1 1AE ')

    expect(result).toEqual(['M1 1AE', 'SW1A 1AA'])
  })

  it('removes blank values', () => {
    expect(parsePostcodes('M1 1AE, ,  ')).toEqual(['M1 1AE'])
  })

  it('returns an empty array for empty input', () => {
    expect(parsePostcodes('')).toEqual([])
  })
})
