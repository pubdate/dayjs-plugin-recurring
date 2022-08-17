import Recurring from '../../src/recurring'
import { duration, R5Start, dateFormat, R5End, R5EndContext, R5Context, R5ContextAsEnd, R5NoContext, RStart, REnd, REndContext, RContext, RContextAsEnd, RNoContext, nowR5, nowR } from './_setup'

describe('Recurring', () => {
  describe('parse()', () => {
    describe('parse(string)', () => {
      test('it parses string recurrings', () => {
        expect(Recurring.parse('R5/2020-01-01/P1Y2M3W4DT5H6M7S')).toEqual({ times: 5, start: '2020-01-01', duration })
        expect(Recurring.parse('R5/P1Y2M3W4DT5H6M7S/2020-01-01')).toEqual({ times: 5, end: '2020-01-01', duration })
        expect(Recurring.parse('R5/P1Y2M3W4DT5H6M7S')).toEqual({ times: 5, duration })

        expect(Recurring.parse('R/2020-01-01/P1Y2M3W4DT5H6M7S')).toEqual({ start: '2020-01-01', duration })
        expect(Recurring.parse('R/P1Y2M3W4DT5H6M7S/2020-01-01')).toEqual({ end: '2020-01-01', duration })
        expect(Recurring.parse('R/P1Y2M3W4DT5H6M7S')).toEqual({ duration })
      })

      test('it returns undefined when the value is invalid', () => {
        expect(Recurring.parse('abc')).toEqual(undefined)
        expect(Recurring.parse('abc R5/2020-01-01/P1Y2M3W4DT5H6M7S')).toEqual(undefined)
        expect(Recurring.parse('R5/2020-01-01/P1Y2M3W4DT5H6M7S abc')).toEqual(undefined)

        expect(Recurring.parse('abc/2020-01-01/P1Y2M3W4DT5H6M7S')).toEqual(undefined)
        // TODO: expect(Recurring.parse('R5/abc/P1Y2M3W4DT5H6M7S')).toEqual(undefined)
        expect(Recurring.parse('R5/2020-01-01/abc')).toEqual(undefined)

        expect(Recurring.parse('5/2020-01-01/P1Y2M3W4DT5H6M7S')).toEqual(undefined)
        expect(Recurring.parse('2020-01-01/P1Y2M3W4DT5H6M7S')).toEqual(undefined)

        expect(Recurring.parse('R5/2020-01-01/2030-01-01')).toEqual(undefined)
        // TODO: expect(Recurring.parse('R5/P1Y/P1Y')).toEqual(undefined)
      })
    })

    describe('parse(object)', () => {
      test('it parses object recurrings', () => {
        expect(Recurring.parse({ times: 5, start: '2020-01-01', duration })).toEqual({ times: 5, start: '2020-01-01', duration })
        expect(Recurring.parse({ times: 5, end: '2020-01-01', duration })).toEqual({ times: 5, end: '2020-01-01', duration })
        expect(Recurring.parse({ times: 5, duration })).toEqual({ times: 5, duration })

        expect(Recurring.parse({ start: '2020-01-01', duration })).toEqual({ start: '2020-01-01', duration })
        expect(Recurring.parse({ end: '2020-01-01', duration })).toEqual({ end: '2020-01-01', duration })
        expect(Recurring.parse({ duration })).toEqual({ duration })
      })

      test('it removes end when start is provided and computes times when missing', () => {
        expect(Recurring.parse({ times: 999, start: '2020-01-01', end: '2026-03-07T01:30:35', duration })).toEqual({ times: 999, start: '2020-01-01', duration })
        expect(Recurring.parse({ start: '2020-01-01', end: '2026-03-07T01:30:34', duration })).toEqual({ times: 4, start: '2020-01-01', duration })
        expect(Recurring.parse({ start: '2020-01-01', end: '2026-03-07T01:30:35', duration })).toEqual({ times: 5, start: '2020-01-01', duration })
        expect(Recurring.parse({ start: '2020-01-01', end: '2026-03-07T01:30:36', duration })).toEqual({ times: 5, start: '2020-01-01', duration })
      })
    })

    test('it returns undefined when the value is neither a string nor an object', () => {
      expect(Recurring.parse(1 as any)).toEqual(undefined)
      expect(Recurring.parse(null as any)).toEqual(undefined)
      expect(Recurring.parse(new Date() as any)).toEqual(undefined)
    })
  })

  describe('toString()', () => {
    test('it formats the duration', () => {
      expect(R5Start.toString({ dateFormat })).toEqual('R5/2020-01-01T00:00:00/P1Y2M3W4DT5H6M7S')
      expect(R5End.toString({ dateFormat })).toEqual('R5/P1Y2M3W4DT5H6M7S/2020-01-01T00:00:00')
      expect(R5EndContext.toString({ dateFormat })).toEqual('R5/P1Y2M3W4DT5H6M7S/2020-01-01T00:00:00')
      expect(R5Context.toString({ dateFormat })).toEqual('R5/P1Y2M3W4DT5H6M7S')
      expect(R5ContextAsEnd.toString({ dateFormat })).toEqual('R5/P1Y2M3W4DT5H6M7S')
      expect(R5NoContext.toString({ dateFormat })).toEqual('R5/P1Y2M3W4DT5H6M7S')

      expect(RStart.toString({ dateFormat })).toEqual('R/2020-01-01T00:00:00/P1Y2M3W4DT5H6M7S')
      expect(REnd.toString({ dateFormat })).toEqual('R/P1Y2M3W4DT5H6M7S/2020-01-01T00:00:00')
      expect(REndContext.toString({ dateFormat })).toEqual('R/P1Y2M3W4DT5H6M7S/2020-01-01T00:00:00')
      expect(RContext.toString({ dateFormat })).toEqual('R/P1Y2M3W4DT5H6M7S')
      expect(RContextAsEnd.toString({ dateFormat })).toEqual('R/P1Y2M3W4DT5H6M7S')
      expect(RNoContext.toString({ dateFormat })).toEqual('R/P1Y2M3W4DT5H6M7S')

      expect(R5Start.toString({ dateFormat, includeContext: true })).toEqual('R5/2020-01-01T00:00:00/P1Y2M3W4DT5H6M7S')
      expect(R5End.toString({ dateFormat, includeContext: true })).toEqual('R5/P1Y2M3W4DT5H6M7S/2020-01-01T00:00:00')
      expect(R5EndContext.toString({ dateFormat, includeContext: true })).toEqual('R5/P1Y2M3W4DT5H6M7S/2020-01-01T00:00:00')
      expect(R5Context.toString({ dateFormat, includeContext: true })).toEqual('R5/3000-01-01T00:00:00/P1Y2M3W4DT5H6M7S')
      expect(R5ContextAsEnd.toString({ dateFormat, includeContext: true })).toEqual('R5/P1Y2M3W4DT5H6M7S/3000-01-01T00:00:00')
      expect(R5NoContext.toString({ dateFormat, includeContext: true })).toEqual(`R5/${nowR5.format(dateFormat)}/P1Y2M3W4DT5H6M7S`)

      expect(RStart.toString({ dateFormat, includeContext: true })).toEqual('R/2020-01-01T00:00:00/P1Y2M3W4DT5H6M7S')
      expect(REnd.toString({ dateFormat, includeContext: true })).toEqual('R/P1Y2M3W4DT5H6M7S/2020-01-01T00:00:00')
      expect(REndContext.toString({ dateFormat, includeContext: true })).toEqual('R/P1Y2M3W4DT5H6M7S/2020-01-01T00:00:00')
      expect(RContext.toString({ dateFormat, includeContext: true })).toEqual('R/3000-01-01T00:00:00/P1Y2M3W4DT5H6M7S')
      expect(RContextAsEnd.toString({ dateFormat, includeContext: true })).toEqual('R/P1Y2M3W4DT5H6M7S/3000-01-01T00:00:00')
      expect(RNoContext.toString({ dateFormat, includeContext: true })).toEqual(`R/${nowR.format(dateFormat)}/P1Y2M3W4DT5H6M7S`)
    })
  })
})
