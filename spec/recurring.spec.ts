import dayjs from 'dayjs'
import recurring from '../src'
import Recurring from '../src/recurring'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(recurring)

const duration = { years: 1, months: 2, weeks: 3, days: 4, hours: 5, minutes: 6, seconds: 7 }
const dateFormat = 'YYYY-MM-DDTHH:mm:ss'

const R5Start = Recurring.parse('R5/2020-01-01/P1Y2M3W4DT5H6M7S')!
const R5End = Recurring.parse('R5/P1Y2M3W4DT5H6M7S/2020-01-01')!
const R5EndContext = Recurring.parse('R5/P1Y2M3W4DT5H6M7S/2020-01-01', { context: dayjs('2016-04-17T08:41:39') })!
const R5Context = Recurring.parse('R5/P1Y2M3W4DT5H6M7S', { context: dayjs('3000-01-01') })!
const R5ContextAsEnd = Recurring.parse('R5/P1Y2M3W4DT5H6M7S', { context: dayjs('3000-01-01'), contextAsEnd: true })!
const R5NoContext = Recurring.parse('R5/P1Y2M3W4DT5H6M7S')!

const RStart = Recurring.parse('R/2020-01-01/P1Y2M3W4DT5H6M7S')!
const REnd = Recurring.parse('R/P1Y2M3W4DT5H6M7S/2020-01-01')!
const REndContext = Recurring.parse('R/P1Y2M3W4DT5H6M7S/2020-01-01', { context: dayjs('2016-04-17T08:41:39') })!
const RContext = Recurring.parse('R/P1Y2M3W4DT5H6M7S', { context: dayjs('3000-01-01') })!
const RContextAsEnd = Recurring.parse('R/P1Y2M3W4DT5H6M7S', { context: dayjs('3000-01-01'), contextAsEnd: true })!
const RNoContext = Recurring.parse('R/P1Y2M3W4DT5H6M7S')!

const nowR5 = dayjs(R5NoContext.first())
const nowR = dayjs(RNoContext.first())

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

  describe('all', () => {
    test('it returns an array of dayjs instances', () => {
      expect(R5Start.all()!.map(x => x.format(dateFormat)))
        .toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5End.all()!.map(x => x.format(dateFormat)))
        .toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5EndContext.all()!.map(x => x.format(dateFormat)))
        .toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5Context.all()!.map(x => x.format(dateFormat)))
        .toEqual(['3000-01-01T00:00:00', '3001-03-26T05:06:07', '3002-06-20T10:12:14', '3003-09-14T15:18:21', '3004-12-09T20:24:28', '3006-03-07T01:30:35'])
      expect(R5ContextAsEnd.all()!.map(x => x.format(dateFormat)))
        .toEqual(['2993-10-28T22:29:25', '2995-01-23T03:35:32', '2996-04-17T08:41:39', '2997-07-12T13:47:46', '2998-10-06T18:53:53', '3000-01-01T00:00:00'])
      expect(R5NoContext.all()!.map(x => x.format(dateFormat)))
        .toEqual(
          [
            nowR5.format(dateFormat),
            nowR5
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .format(dateFormat),
            nowR5
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .format(dateFormat),
            nowR5
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .format(dateFormat),
            nowR5
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .format(dateFormat),
            nowR5
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
              .format(dateFormat)
          ]
        )
    })

    test('it returns null when there is no limit', () => {
      expect(RStart.all()).toEqual(null)
      expect(REnd.all()).toEqual(null)
      expect(REndContext.all()).toEqual(null)
      expect(RContext.all()).toEqual(null)
      expect(RContextAsEnd.all()).toEqual(null)
      expect(RNoContext.all()).toEqual(null)
    })

    test('it returns an array of dayjs instances with the same recurring', () => {
      const recurring = R5Start
      recurring.all()!.forEach(x => expect(x.recurring()).toBe(recurring))
    })
  })

  describe('first()', () => {
    test('it returns the first occurrence', () => {
      expect(R5Start.first()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(R5End.first()!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
      expect(R5EndContext.first()!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
      expect(R5Context.first()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
      expect(R5ContextAsEnd.first()!.format(dateFormat)).toEqual('2993-10-28T22:29:25')
      expect(R5NoContext.first()!.format(dateFormat)).toEqual(nowR5.format(dateFormat))
    })

    test('it returns null when there is no start and no limit', () => {
      expect(RStart.first()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(REnd.first()).toEqual(null)
      expect(REndContext.first()).toEqual(null)
      expect(RContext.first()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
      expect(RContextAsEnd.first()).toEqual(null)
      expect(RNoContext.first()!.format(dateFormat)).toEqual(nowR.format(dateFormat))
    })

    test('it returns the n first occurrences', () => {
      expect(R5Start.first(0)!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.first(1)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
      expect(R5Start.first(2)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07'])
      expect(R5Start.first(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
      expect(R5Start.first(4)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21'])
      expect(R5Start.first(5)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28'])
      expect(R5Start.first(6)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5Start.first(7)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])

      expect(R5End.first(0)!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.first(1)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25'])
      expect(R5End.first(2)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32'])
      expect(R5End.first(3)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
      expect(R5End.first(4)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46'])
      expect(R5End.first(5)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53'])
      expect(R5End.first(6)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5End.first(7)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])

      expect(RStart.first(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
      expect(REnd.first(3)).toEqual(null)
    })

    test('it returns the n first occurrences that match query', () => {
      expect(R5Start.first(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
      expect(R5Start.first(3, { isBefore: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
      expect(R5Start.first(3, { isSameOrBefore: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07'])
      expect(R5Start.first(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

      expect(R5Start.first(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.first(3, { isAfter: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.first(3, { isSameOrAfter: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.first(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])

      expect(R5End.first(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
      expect(R5End.first(3, { isBefore: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25'])
      expect(R5End.first(3, { isSameOrBefore: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32'])
      expect(R5End.first(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

      expect(R5End.first(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.first(3, { isAfter: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.first(3, { isSameOrAfter: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.first(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
    })
  })

  describe('last()', () => {
    test('it returns the last occurrence', () => {
      expect(R5Start.last()!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
      expect(R5End.last()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(R5EndContext.last()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(R5Context.last()!.format(dateFormat)).toEqual('3006-03-07T01:30:35')
      expect(R5ContextAsEnd.last()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
      expect(R5NoContext.last()!.format(dateFormat)).toEqual(
        nowR5
          .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
          .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
          .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
          .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
          .add(1, 'years').add(2, 'months').add(3, 'weeks').add(4, 'days').add(5, 'hours').add(6, 'minutes').add(7, 'seconds')
          .format(dateFormat)
      )
    })

    test('it returns null when there is no start and no limit', () => {
      expect(RStart.last()).toEqual(null)
      expect(REnd.last()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(REndContext.last()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(RContext.last()).toEqual(null)
      expect(RContextAsEnd.last()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
      expect(RNoContext.last()).toEqual(null)
    })

    test('it returns the n last occurrences', () => {
      expect(R5Start.last(0)!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.last(1)!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35'])
      expect(R5Start.last(2)!.map(x => x.format(dateFormat))).toEqual(['2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5Start.last(3)!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5Start.last(4)!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5Start.last(5)!.map(x => x.format(dateFormat))).toEqual(['2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5Start.last(6)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5Start.last(7)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])

      expect(R5End.last(0)!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.last(1)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
      expect(R5End.last(2)!.map(x => x.format(dateFormat))).toEqual(['2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5End.last(3)!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5End.last(4)!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5End.last(5)!.map(x => x.format(dateFormat))).toEqual(['2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5End.last(6)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5End.last(7)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])

      expect(RStart.last(3)).toEqual(null)
      expect(REnd.last(3)!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
    })

    test('it returns the n last occurrences that match query', () => {
      expect(R5Start.last(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5Start.last(3, { isBefore: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.last(3, { isSameOrBefore: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.last(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

      expect(R5Start.last(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.last(3, { isAfter: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35'])
      expect(R5Start.last(3, { isSameOrAfter: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual(['2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5Start.last(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])

      expect(R5End.last(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5End.last(3, { isBefore: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.last(3, { isSameOrBefore: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.last(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

      expect(R5End.last(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.last(3, { isAfter: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
      expect(R5End.last(3, { isSameOrAfter: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual(['2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5End.last(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
    })
  })

  describe('prev()', () => {
    test('it returns the previous occurrence', () => {
      expect(R5Start.prev(dayjs('3000-01-01'))!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
      expect(R5Start.prev(dayjs('2000-01-01'))).toEqual(null)

      expect(R5Start.prev(dayjs('2026-03-07T01:30:36'))!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
      expect(R5Start.prev(dayjs('2026-03-07T01:30:35'))!.format(dateFormat)).toEqual('2024-12-09T20:24:28')
      expect(R5Start.prev(dayjs('2024-12-09T20:24:28'))!.format(dateFormat)).toEqual('2023-09-14T15:18:21')
      expect(R5Start.prev(dayjs('2023-09-14T15:18:21'))!.format(dateFormat)).toEqual('2022-06-20T10:12:14')
      expect(R5Start.prev(dayjs('2022-06-20T10:12:14'))!.format(dateFormat)).toEqual('2021-03-26T05:06:07')
      expect(R5Start.prev(dayjs('2021-03-26T05:06:07'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(R5Start.prev(dayjs('2020-01-01T00:00:00'))).toEqual(null)

      expect(R5End.prev(dayjs('3000-01-01'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(R5End.prev(dayjs('2000-01-01'))).toEqual(null)

      expect(R5End.prev(dayjs('2020-01-01T00:00:01'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(R5End.prev(dayjs('2020-01-01T00:00:00'))!.format(dateFormat)).toEqual('2018-10-06T18:53:53')
      expect(R5End.prev(dayjs('2018-10-06T18:53:53'))!.format(dateFormat)).toEqual('2017-07-12T13:47:46')
      expect(R5End.prev(dayjs('2017-07-12T13:47:46'))!.format(dateFormat)).toEqual('2016-04-17T08:41:39')
      expect(R5End.prev(dayjs('2016-04-17T08:41:39'))!.format(dateFormat)).toEqual('2015-01-23T03:35:32')
      expect(R5End.prev(dayjs('2015-01-23T03:35:32'))!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
      expect(R5End.prev(dayjs('2013-10-28T22:29:25'))).toEqual(null)
    })

    test('it returns the n previous occurrences', () => {
      expect(R5Start.prev(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5Start.prev(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])

      expect(R5Start.prev(dayjs('2023-09-14T15:18:21'), 1).map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14'])
      expect(R5Start.prev(dayjs('2023-09-14T15:18:21'), 2).map(x => x.format(dateFormat))).toEqual(['2021-03-26T05:06:07', '2022-06-20T10:12:14'])
      expect(R5Start.prev(dayjs('2023-09-14T15:18:21'), 3).map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
      expect(R5Start.prev(dayjs('2023-09-14T15:18:21'), 4).map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])

      expect(R5End.prev(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5End.prev(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])

      expect(R5End.prev(dayjs('2017-07-12T13:47:46'), 1).map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39'])
      expect(R5End.prev(dayjs('2017-07-12T13:47:46'), 2).map(x => x.format(dateFormat))).toEqual(['2015-01-23T03:35:32', '2016-04-17T08:41:39'])
      expect(R5End.prev(dayjs('2017-07-12T13:47:46'), 3).map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
      expect(R5End.prev(dayjs('2017-07-12T13:47:46'), 4).map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
    })

    test('it returns the n previous occurrences that match query', () => {
      expect(R5Start.prev(dayjs('2024-12-09T20:24:28'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21'])
      expect(R5Start.prev(dayjs('2024-12-09T20:24:28'), 3, { isBefore: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.prev(dayjs('2024-12-09T20:24:28'), 3, { isSameOrBefore: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.prev(dayjs('2024-12-09T20:24:28'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

      expect(R5Start.prev(dayjs('2024-12-09T20:24:28'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.prev(dayjs('2024-12-09T20:24:28'), 3, { isAfter: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21'])
      expect(R5Start.prev(dayjs('2024-12-09T20:24:28'), 3, { isSameOrAfter: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21'])
      expect(R5Start.prev(dayjs('2024-12-09T20:24:28'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21'])

      expect(R5End.prev(dayjs('2018-10-06T18:53:53'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46'])
      expect(R5End.prev(dayjs('2018-10-06T18:53:53'), 3, { isBefore: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.prev(dayjs('2018-10-06T18:53:53'), 3, { isSameOrBefore: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.prev(dayjs('2018-10-06T18:53:53'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

      expect(R5End.prev(dayjs('2018-10-06T18:53:53'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.prev(dayjs('2018-10-06T18:53:53'), 3, { isAfter: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46'])
      expect(R5End.prev(dayjs('2018-10-06T18:53:53'), 3, { isSameOrAfter: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46'])
      expect(R5End.prev(dayjs('2018-10-06T18:53:53'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46'])
    })
  })

  describe('next()', () => {
    test('it returns the next occurrence', () => {
      expect(R5Start.next(dayjs('3000-01-01'))).toEqual(null)
      expect(R5Start.next(dayjs('2000-01-01'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')

      expect(R5Start.next(dayjs('2019-12-31T23:59:59'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(R5Start.next(dayjs('2020-01-01T00:00:00'))!.format(dateFormat)).toEqual('2021-03-26T05:06:07')
      expect(R5Start.next(dayjs('2021-03-26T05:06:07'))!.format(dateFormat)).toEqual('2022-06-20T10:12:14')
      expect(R5Start.next(dayjs('2022-06-20T10:12:14'))!.format(dateFormat)).toEqual('2023-09-14T15:18:21')
      expect(R5Start.next(dayjs('2023-09-14T15:18:21'))!.format(dateFormat)).toEqual('2024-12-09T20:24:28')
      expect(R5Start.next(dayjs('2024-12-09T20:24:28'))!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
      expect(R5Start.next(dayjs('2026-03-07T01:30:35'))).toEqual(null)

      expect(R5End.next(dayjs('3000-01-01'))).toEqual(null)
      expect(R5End.next(dayjs('2000-01-01'))!.format(dateFormat)).toEqual('2013-10-28T22:29:25')

      expect(R5End.next(dayjs('2013-10-28T22:29:24'))!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
      expect(R5End.next(dayjs('2013-10-28T22:29:25'))!.format(dateFormat)).toEqual('2015-01-23T03:35:32')
      expect(R5End.next(dayjs('2015-01-23T03:35:32'))!.format(dateFormat)).toEqual('2016-04-17T08:41:39')
      expect(R5End.next(dayjs('2016-04-17T08:41:39'))!.format(dateFormat)).toEqual('2017-07-12T13:47:46')
      expect(R5End.next(dayjs('2017-07-12T13:47:46'))!.format(dateFormat)).toEqual('2018-10-06T18:53:53')
      expect(R5End.next(dayjs('2018-10-06T18:53:53'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(R5End.next(dayjs('2020-01-01T00:00:00'))).toEqual(null)
    })

    test('it returns the n next occurrences', () => {
      expect(R5Start.next(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.next(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])

      expect(R5Start.next(dayjs('2022-06-20T10:12:14'), 1).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21'])
      expect(R5Start.next(dayjs('2022-06-20T10:12:14'), 2).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28'])
      expect(R5Start.next(dayjs('2022-06-20T10:12:14'), 3).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
      expect(R5Start.next(dayjs('2022-06-20T10:12:14'), 4).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])

      expect(R5End.next(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.next(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])

      expect(R5End.next(dayjs('2016-04-17T08:41:39'), 1).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46'])
      expect(R5End.next(dayjs('2016-04-17T08:41:39'), 2).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53'])
      expect(R5End.next(dayjs('2016-04-17T08:41:39'), 3).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      expect(R5End.next(dayjs('2016-04-17T08:41:39'), 4).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
    })

    test('it returns the n next occurrences that match query', () => {
      expect(R5Start.next(dayjs('2021-03-26T05:06:07'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28'])
      expect(R5Start.next(dayjs('2021-03-26T05:06:07'), 3, { isBefore: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14'])
      expect(R5Start.next(dayjs('2021-03-26T05:06:07'), 3, { isSameOrBefore: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21'])
      expect(R5Start.next(dayjs('2021-03-26T05:06:07'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

      expect(R5Start.next(dayjs('2021-03-26T05:06:07'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.next(dayjs('2021-03-26T05:06:07'), 3, { isAfter: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.next(dayjs('2021-03-26T05:06:07'), 3, { isSameOrAfter: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5Start.next(dayjs('2021-03-26T05:06:07'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28'])

      expect(R5End.next(dayjs('2015-01-23T03:35:32'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53'])
      expect(R5End.next(dayjs('2015-01-23T03:35:32'), 3, { isBefore: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39'])
      expect(R5End.next(dayjs('2015-01-23T03:35:32'), 3, { isSameOrBefore: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46'])
      expect(R5End.next(dayjs('2015-01-23T03:35:32'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

      expect(R5End.next(dayjs('2015-01-23T03:35:32'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.next(dayjs('2015-01-23T03:35:32'), 3, { isAfter: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.next(dayjs('2015-01-23T03:35:32'), 3, { isSameOrAfter: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual([])
      expect(R5End.next(dayjs('2015-01-23T03:35:32'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53'])
    })
  })
})
