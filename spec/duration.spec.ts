import dayjs from 'dayjs'
import Duration from '../src/duration'

describe('Duration', () => {
  describe('parse()', () => {
    describe('parse(string)', () => {
      test('it parses string durations', () => {
        expect(Duration.parse('P1Y')).toEqual({ years: 1, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse('P2M')).toEqual({ years: 0, months: 2, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse('P3W')).toEqual({ years: 0, months: 0, weeks: 3, days: 0, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse('P4D')).toEqual({ years: 0, months: 0, weeks: 0, days: 4, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse('PT5H')).toEqual({ years: 0, months: 0, weeks: 0, days: 0, hours: 5, minutes: 0, seconds: 0 })
        expect(Duration.parse('PT6M')).toEqual({ years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 6, seconds: 0 })
        expect(Duration.parse('PT7S')).toEqual({ years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 7 })

        expect(Duration.parse('P1Y2M3W4DT5H6M7S')).toEqual({ years: 1, months: 2, weeks: 3, days: 4, hours: 5, minutes: 6, seconds: 7 })
        expect(Duration.parse('P1Y2M3W4D')).toEqual({ years: 1, months: 2, weeks: 3, days: 4, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse('PT5H6M7S')).toEqual({ years: 0, months: 0, weeks: 0, days: 0, hours: 5, minutes: 6, seconds: 7 })
      })

      test('it returns undefined when the value is invalid', () => {
        expect(Duration.parse('abc')).toEqual(undefined)
        expect(Duration.parse('abc P1Y')).toEqual(undefined)
        expect(Duration.parse('P1Y abc')).toEqual(undefined)
        expect(Duration.parse('P1YM')).toEqual(undefined)
        // TODO: expect(Duration.parse('P1YT')).toEqual(undefined)
        expect(Duration.parse('PT')).toEqual(undefined)
        expect(Duration.parse('P')).toEqual(undefined)
        // P
        expect(Duration.parse('1Y')).toEqual(undefined)
        expect(Duration.parse('T1H')).toEqual(undefined)
        // T
        expect(Duration.parse('PT1Y')).toEqual(undefined)
        expect(Duration.parse('PT2M')).toEqual({ years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 2, seconds: 0 })
        expect(Duration.parse('PT3W')).toEqual(undefined)
        expect(Duration.parse('PT4D')).toEqual(undefined)
        expect(Duration.parse('P5H')).toEqual(undefined)
        expect(Duration.parse('P6M')).toEqual({ years: 0, months: 6, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse('P7S')).toEqual(undefined)
        expect(Duration.parse('P1Y2M3W4D5H6M7S')).toEqual(undefined)
        expect(Duration.parse('PT1Y2M3W4D')).toEqual(undefined)
        expect(Duration.parse('P5H6M7S')).toEqual(undefined)
        // ORDER
        expect(Duration.parse('P1Y2M')).toEqual({ years: 1, months: 2, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse('P1M2Y')).toEqual(undefined)
        // UNSUPPORTED/NON-STANDARD
        expect(Duration.parse('-P1Y2M3W4DT5H6M7S')).toEqual(undefined)
        expect(Duration.parse('P-1Y2M3W4DT5H6M7S')).toEqual(undefined)
        expect(Duration.parse('P1Y2M3W4DT5H6M7.123S')).toEqual(undefined)
      })
    })

    describe('parse(object)', () => {
      test('it parses object durations', () => {
        expect(Duration.parse({ years: 1 })).toEqual({ years: 1, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse({ months: 2 })).toEqual({ years: 0, months: 2, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse({ weeks: 3 })).toEqual({ years: 0, months: 0, weeks: 3, days: 0, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse({ days: 4 })).toEqual({ years: 0, months: 0, weeks: 0, days: 4, hours: 0, minutes: 0, seconds: 0 })
        expect(Duration.parse({ hours: 5 })).toEqual({ years: 0, months: 0, weeks: 0, days: 0, hours: 5, minutes: 0, seconds: 0 })
        expect(Duration.parse({ minutes: 6 })).toEqual({ years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 6, seconds: 0 })
        expect(Duration.parse({ seconds: 7 })).toEqual({ years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 7 })
        expect(Duration.parse({ years: 1, months: 2, weeks: 3, days: 4, hours: 5, minutes: 6, seconds: 7 })).toEqual({ years: 1, months: 2, weeks: 3, days: 4, hours: 5, minutes: 6, seconds: 7 })
      })

      test('it returns input when input is duration', () => {
        const obj = { years: 1, months: 2, weeks: 3, days: 4, hours: 5, minutes: 6, seconds: 7 }
        const duration = Duration.parse(obj)!

        expect(Duration.parse(obj)).toEqual(obj)
        expect(Duration.parse(obj)).not.toBe(obj)
        expect(Duration.parse(obj)).not.toBe(duration)

        expect(Duration.parse(duration)).toEqual(obj)
        expect(Duration.parse(duration)).not.toBe(obj)
        expect(Duration.parse(duration)).toBe(duration)
      })

      test('it returns undefined when the value is invalid', () => {
        expect(Duration.parse({})).toEqual(undefined)
        expect(Duration.parse({ years: 0 })).toEqual(undefined)
        expect(Duration.parse({ years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })).toEqual(undefined)

        expect(Duration.parse({ years: -1 })).toEqual(undefined)

        expect(Duration.parse({ abc: 1 } as any)).toEqual(undefined)
        expect(Duration.parse({ abc: 1, years: 1 } as any)).toEqual({ years: 1, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
      })
    })

    test('it returns undefined when the value is neither a string nor an object', () => {
      expect(Duration.parse(1 as any)).toEqual(undefined)
      expect(Duration.parse(null as any)).toEqual(undefined)
      expect(Duration.parse(new Date() as any)).toEqual(undefined)
    })
  })

  describe('toString()', () => {
    test('it formats the duration', () => {
      expect(Duration.parse('P1Y')?.toString()).toEqual('P1Y')
      expect(Duration.parse('P2M')?.toString()).toEqual('P2M')
      expect(Duration.parse('P3W')?.toString()).toEqual('P3W')
      expect(Duration.parse('P4D')?.toString()).toEqual('P4D')
      expect(Duration.parse('PT5H')?.toString()).toEqual('PT5H')
      expect(Duration.parse('PT6M')?.toString()).toEqual('PT6M')
      expect(Duration.parse('PT7S')?.toString()).toEqual('PT7S')

      expect(Duration.parse('P1Y2M3W4DT5H6M7S')?.toString()).toEqual('P1Y2M3W4DT5H6M7S')
      expect(Duration.parse('P1Y2M3W4D')?.toString()).toEqual('P1Y2M3W4D')
      expect(Duration.parse('PT5H6M7S')?.toString()).toEqual('PT5H6M7S')
    })
  })

  describe('_addToDate()', () => {
    test('returns a dayjs incremented instance', () => {
      expect(Duration.parse('P1Y')?._addToDate(dayjs('2020-01-01'))).toEqual(dayjs('2021-01-01'))
      expect(Duration.parse('P1M1D')?._addToDate(dayjs('2020-02-29'))).toEqual(dayjs('2020-03-30')) // .add(1, 'month').add(1, 'day') !== .add(1, 'day').add(1, 'month')
      expect(Duration.parse('P1Y')?._addToDate(dayjs('2020-01-01'), -1)).toEqual(dayjs('2019-01-01'))
      expect(Duration.parse('P1M1D')?._addToDate(dayjs('2020-12-31'), -1)).toEqual(dayjs('2020-11-29')) // .subtract(1, 'month').subtract(1, 'day') !== .subtract(1, 'day').subtract(1, 'month')
    })
  })
})
