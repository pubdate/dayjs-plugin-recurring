import dayjs from 'dayjs'
import { R5Start, dateFormat, R5End, R5EndContext, R5Context, R5ContextAsEnd, R5NoContext, nowR5, RStart, REnd, REndContext, RContext, RContextAsEnd, RNoContext, nowR } from './_setup'

describe('Recurring', () => {
  describe('relative', () => {
    describe('relativeAll()', () => {
      test('it returns an array of dayjs instances', () => {
        expect(R5Start.relativeAll()!.map(x => x.format(dateFormat)))
          .toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5End.relativeAll()!.map(x => x.format(dateFormat)))
          .toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46', '2016-04-17T08:41:39', '2015-01-23T03:35:32', '2013-10-28T22:29:25'])
        expect(R5EndContext.relativeAll()!.map(x => x.format(dateFormat)))
          .toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46', '2016-04-17T08:41:39', '2015-01-23T03:35:32', '2013-10-28T22:29:25'])
        expect(R5Context.relativeAll()!.map(x => x.format(dateFormat)))
          .toEqual(['3000-01-01T00:00:00', '3001-03-26T05:06:07', '3002-06-20T10:12:14', '3003-09-14T15:18:21', '3004-12-09T20:24:28', '3006-03-07T01:30:35'])
        expect(R5ContextAsEnd.relativeAll()!.map(x => x.format(dateFormat)))
          .toEqual(['3000-01-01T00:00:00', '2998-10-06T18:53:53', '2997-07-12T13:47:46', '2996-04-17T08:41:39', '2995-01-23T03:35:32', '2993-10-28T22:29:25'])
        expect(R5NoContext.relativeAll()!.map(x => x.format(dateFormat)))
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
        expect(RStart.relativeAll()).toEqual(null)
        expect(REnd.relativeAll()).toEqual(null)
        expect(REndContext.relativeAll()).toEqual(null)
        expect(RContext.relativeAll()).toEqual(null)
        expect(RContextAsEnd.relativeAll()).toEqual(null)
        expect(RNoContext.relativeAll()).toEqual(null)
      })

      test('it returns an array of dayjs instances with the same recurring', () => {
        R5Start.relativeAll()!.forEach(x => expect(x.$recurring).toBe(R5Start))
      })
    })

    describe('relativeFirst()', () => {
      test('it returns the first occurrence', () => {
        expect(R5Start.relativeFirst()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5End.relativeFirst()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5EndContext.relativeFirst()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5Context.relativeFirst()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
        expect(R5ContextAsEnd.relativeFirst()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
        expect(R5NoContext.relativeFirst()!.format(dateFormat)).toEqual(nowR5.format(dateFormat))
      })

      test('it returns null when there is no start and no limit', () => {
        expect(RStart.relativeFirst()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(REnd.relativeFirst()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(REndContext.relativeFirst()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(RContext.relativeFirst()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
        expect(RContextAsEnd.relativeFirst()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
        expect(RNoContext.relativeFirst()!.format(dateFormat)).toEqual(nowR.format(dateFormat))
      })

      test('it returns the n first occurrences', () => {
        expect(R5Start.relativeFirst(0)!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeFirst(1)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
        expect(R5Start.relativeFirst(2)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07'])
        expect(R5Start.relativeFirst(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
        expect(R5Start.relativeFirst(4)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21'])
        expect(R5Start.relativeFirst(5)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28'])
        expect(R5Start.relativeFirst(6)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.relativeFirst(7)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])

        expect(R5End.relativeFirst(0)!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeFirst(1)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
        expect(R5End.relativeFirst(2)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53'])
        expect(R5End.relativeFirst(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46'])
        expect(R5End.relativeFirst(4)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46', '2016-04-17T08:41:39'])
        expect(R5End.relativeFirst(5)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46', '2016-04-17T08:41:39', '2015-01-23T03:35:32'])
        expect(R5End.relativeFirst(6)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46', '2016-04-17T08:41:39', '2015-01-23T03:35:32', '2013-10-28T22:29:25'])
        expect(R5End.relativeFirst(7)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46', '2016-04-17T08:41:39', '2015-01-23T03:35:32', '2013-10-28T22:29:25'])

        expect(RStart.relativeFirst(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
        expect(REnd.relativeFirst(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46'])
      })

      test('it returns the n first occurrences that match query', () => {
        expect(R5Start.relativeFirst(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
        expect(R5Start.relativeFirst(3, { isBefore: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
        expect(R5Start.relativeFirst(3, { isSameOrBefore: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07'])
        expect(R5Start.relativeFirst(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5Start.relativeFirst(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeFirst(3, { isAfter: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeFirst(3, { isSameOrAfter: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeFirst(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])

        expect(R5End.relativeFirst(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46'])
        expect(R5End.relativeFirst(3, { isBefore: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeFirst(3, { isSameOrBefore: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeFirst(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5End.relativeFirst(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeFirst(3, { isAfter: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
        expect(R5End.relativeFirst(3, { isSameOrAfter: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53'])
        expect(R5End.relativeFirst(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46'])
      })
    })

    describe('relativeLast()', () => {
      test('it returns the last occurrence', () => {
        expect(R5Start.relativeLast()!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
        expect(R5End.relativeLast()!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
        expect(R5EndContext.relativeLast()!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
        expect(R5Context.relativeLast()!.format(dateFormat)).toEqual('3006-03-07T01:30:35')
        expect(R5ContextAsEnd.relativeLast()!.format(dateFormat)).toEqual('2993-10-28T22:29:25')
        expect(R5NoContext.relativeLast()!.format(dateFormat)).toEqual(
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
        expect(RStart.relativeLast()).toEqual(null)
        expect(REnd.relativeLast()).toEqual(null)
        expect(REndContext.relativeLast()).toEqual(null)
        expect(RContext.relativeLast()).toEqual(null)
        expect(RContextAsEnd.relativeLast()).toEqual(null)
        expect(RNoContext.relativeLast()).toEqual(null)
      })

      test('it returns the n last occurrences', () => {
        expect(R5Start.relativeLast(0)!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeLast(1)!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35'])
        expect(R5Start.relativeLast(2)!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28'])
        expect(R5Start.relativeLast(3)!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28', '2023-09-14T15:18:21'])
        expect(R5Start.relativeLast(4)!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28', '2023-09-14T15:18:21', '2022-06-20T10:12:14'])
        expect(R5Start.relativeLast(5)!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28', '2023-09-14T15:18:21', '2022-06-20T10:12:14', '2021-03-26T05:06:07'])
        expect(R5Start.relativeLast(6)!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28', '2023-09-14T15:18:21', '2022-06-20T10:12:14', '2021-03-26T05:06:07', '2020-01-01T00:00:00'])
        expect(R5Start.relativeLast(7)!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28', '2023-09-14T15:18:21', '2022-06-20T10:12:14', '2021-03-26T05:06:07', '2020-01-01T00:00:00'])

        expect(R5End.relativeLast(0)!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeLast(1)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25'])
        expect(R5End.relativeLast(2)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32'])
        expect(R5End.relativeLast(3)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
        expect(R5End.relativeLast(4)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46'])
        expect(R5End.relativeLast(5)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53'])
        expect(R5End.relativeLast(6)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.relativeLast(7)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])

        expect(RStart.relativeLast(3)).toEqual(null)
        expect(REnd.relativeLast(3)).toEqual(null)
      })

      test('it returns the n last occurrences that match query', () => {
        expect(R5Start.relativeLast(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28', '2023-09-14T15:18:21'])
        expect(R5Start.relativeLast(3, { isBefore: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeLast(3, { isSameOrBefore: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeLast(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5Start.relativeLast(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeLast(3, { isAfter: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35'])
        expect(R5Start.relativeLast(3, { isSameOrAfter: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28'])
        expect(R5Start.relativeLast(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28', '2023-09-14T15:18:21'])

        expect(R5End.relativeLast(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
        expect(R5End.relativeLast(3, { isBefore: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25'])
        expect(R5End.relativeLast(3, { isSameOrBefore: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32'])
        expect(R5End.relativeLast(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5End.relativeLast(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeLast(3, { isAfter: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeLast(3, { isSameOrAfter: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeLast(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
      })
    })

    describe('relativePrev()', () => {
      test('it returns the previous occurrence', () => {
        expect(R5Start.relativePrev(dayjs('3000-01-01'))!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
        expect(R5Start.relativePrev(dayjs('2000-01-01'))).toEqual(null)

        expect(R5Start.relativePrev(dayjs('2026-03-07T01:30:36'))!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
        expect(R5Start.relativePrev(dayjs('2026-03-07T01:30:35'))!.format(dateFormat)).toEqual('2024-12-09T20:24:28')
        expect(R5Start.relativePrev(dayjs('2024-12-09T20:24:28'))!.format(dateFormat)).toEqual('2023-09-14T15:18:21')
        expect(R5Start.relativePrev(dayjs('2023-09-14T15:18:21'))!.format(dateFormat)).toEqual('2022-06-20T10:12:14')
        expect(R5Start.relativePrev(dayjs('2022-06-20T10:12:14'))!.format(dateFormat)).toEqual('2021-03-26T05:06:07')
        expect(R5Start.relativePrev(dayjs('2021-03-26T05:06:07'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5Start.relativePrev(dayjs('2020-01-01T00:00:00'))).toEqual(null)

        expect(R5End.relativePrev(dayjs('3000-01-01'))).toEqual(null)
        expect(R5End.relativePrev(dayjs('2000-01-01'))!.format(dateFormat)).toEqual('2013-10-28T22:29:25')

        expect(R5End.relativePrev(dayjs('2013-10-28T22:29:24'))!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
        expect(R5End.relativePrev(dayjs('2013-10-28T22:29:25'))!.format(dateFormat)).toEqual('2015-01-23T03:35:32')
        expect(R5End.relativePrev(dayjs('2015-01-23T03:35:32'))!.format(dateFormat)).toEqual('2016-04-17T08:41:39')
        expect(R5End.relativePrev(dayjs('2016-04-17T08:41:39'))!.format(dateFormat)).toEqual('2017-07-12T13:47:46')
        expect(R5End.relativePrev(dayjs('2017-07-12T13:47:46'))!.format(dateFormat)).toEqual('2018-10-06T18:53:53')
        expect(R5End.relativePrev(dayjs('2018-10-06T18:53:53'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5End.relativePrev(dayjs('2020-01-01T00:00:00'))).toEqual(null)
      })

      test('it returns the n previous occurrences', () => {
        expect(R5Start.relativePrev(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28', '2023-09-14T15:18:21'])
        expect(R5Start.relativePrev(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])

        expect(R5Start.relativePrev(dayjs('2023-09-14T15:18:21'), 1).map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14'])
        expect(R5Start.relativePrev(dayjs('2023-09-14T15:18:21'), 2).map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2021-03-26T05:06:07'])
        expect(R5Start.relativePrev(dayjs('2023-09-14T15:18:21'), 3).map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2021-03-26T05:06:07', '2020-01-01T00:00:00'])
        expect(R5Start.relativePrev(dayjs('2023-09-14T15:18:21'), 4).map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2021-03-26T05:06:07', '2020-01-01T00:00:00'])

        expect(R5End.relativePrev(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativePrev(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])

        expect(R5End.relativePrev(dayjs('2016-04-17T08:41:39'), 1).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46'])
        expect(R5End.relativePrev(dayjs('2016-04-17T08:41:39'), 2).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53'])
        expect(R5End.relativePrev(dayjs('2016-04-17T08:41:39'), 3).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.relativePrev(dayjs('2016-04-17T08:41:39'), 4).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      })

      test('it returns the n previous occurrences that match query', () => {
        expect(R5Start.relativePrev(dayjs('2024-12-09T20:24:28'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2022-06-20T10:12:14', '2021-03-26T05:06:07'])
        expect(R5Start.relativePrev(dayjs('2024-12-09T20:24:28'), 3, { isBefore: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativePrev(dayjs('2024-12-09T20:24:28'), 3, { isSameOrBefore: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativePrev(dayjs('2024-12-09T20:24:28'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5Start.relativePrev(dayjs('2024-12-09T20:24:28'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativePrev(dayjs('2024-12-09T20:24:28'), 3, { isAfter: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21'])
        expect(R5Start.relativePrev(dayjs('2024-12-09T20:24:28'), 3, { isSameOrAfter: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2022-06-20T10:12:14'])
        expect(R5Start.relativePrev(dayjs('2024-12-09T20:24:28'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2022-06-20T10:12:14', '2021-03-26T05:06:07'])

        expect(R5End.relativePrev(dayjs('2015-01-23T03:35:32'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53'])
        expect(R5End.relativePrev(dayjs('2015-01-23T03:35:32'), 3, { isBefore: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39'])
        expect(R5End.relativePrev(dayjs('2015-01-23T03:35:32'), 3, { isSameOrBefore: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46'])
        expect(R5End.relativePrev(dayjs('2015-01-23T03:35:32'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5End.relativePrev(dayjs('2015-01-23T03:35:32'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativePrev(dayjs('2015-01-23T03:35:32'), 3, { isAfter: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativePrev(dayjs('2015-01-23T03:35:32'), 3, { isSameOrAfter: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativePrev(dayjs('2015-01-23T03:35:32'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53'])
      })
    })

    describe('relativeNext()', () => {
      test('it returns the next occurrence', () => {
        expect(R5Start.relativeNext(dayjs('3000-01-01'))).toEqual(null)
        expect(R5Start.relativeNext(dayjs('2000-01-01'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')

        expect(R5Start.relativeNext(dayjs('2019-12-31T23:59:59'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5Start.relativeNext(dayjs('2020-01-01T00:00:00'))!.format(dateFormat)).toEqual('2021-03-26T05:06:07')
        expect(R5Start.relativeNext(dayjs('2021-03-26T05:06:07'))!.format(dateFormat)).toEqual('2022-06-20T10:12:14')
        expect(R5Start.relativeNext(dayjs('2022-06-20T10:12:14'))!.format(dateFormat)).toEqual('2023-09-14T15:18:21')
        expect(R5Start.relativeNext(dayjs('2023-09-14T15:18:21'))!.format(dateFormat)).toEqual('2024-12-09T20:24:28')
        expect(R5Start.relativeNext(dayjs('2024-12-09T20:24:28'))!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
        expect(R5Start.relativeNext(dayjs('2026-03-07T01:30:35'))).toEqual(null)

        expect(R5End.relativeNext(dayjs('3000-01-01'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5End.relativeNext(dayjs('2000-01-01'))).toEqual(null)

        expect(R5End.relativeNext(dayjs('2020-01-01T00:00:01'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5End.relativeNext(dayjs('2020-01-01T00:00:00'))!.format(dateFormat)).toEqual('2018-10-06T18:53:53')
        expect(R5End.relativeNext(dayjs('2018-10-06T18:53:53'))!.format(dateFormat)).toEqual('2017-07-12T13:47:46')
        expect(R5End.relativeNext(dayjs('2017-07-12T13:47:46'))!.format(dateFormat)).toEqual('2016-04-17T08:41:39')
        expect(R5End.relativeNext(dayjs('2016-04-17T08:41:39'))!.format(dateFormat)).toEqual('2015-01-23T03:35:32')
        expect(R5End.relativeNext(dayjs('2015-01-23T03:35:32'))!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
        expect(R5End.relativeNext(dayjs('2013-10-28T22:29:25'))).toEqual(null)
      })

      test('it returns the n next occurrences', () => {
        expect(R5Start.relativeNext(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeNext(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])

        expect(R5Start.relativeNext(dayjs('2022-06-20T10:12:14'), 1).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21'])
        expect(R5Start.relativeNext(dayjs('2022-06-20T10:12:14'), 2).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28'])
        expect(R5Start.relativeNext(dayjs('2022-06-20T10:12:14'), 3).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.relativeNext(dayjs('2022-06-20T10:12:14'), 4).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])

        expect(R5End.relativeNext(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2018-10-06T18:53:53', '2017-07-12T13:47:46'])
        expect(R5End.relativeNext(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])

        expect(R5End.relativeNext(dayjs('2017-07-12T13:47:46'), 1).map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39'])
        expect(R5End.relativeNext(dayjs('2017-07-12T13:47:46'), 2).map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2015-01-23T03:35:32'])
        expect(R5End.relativeNext(dayjs('2017-07-12T13:47:46'), 3).map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2015-01-23T03:35:32', '2013-10-28T22:29:25'])
        expect(R5End.relativeNext(dayjs('2017-07-12T13:47:46'), 4).map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2015-01-23T03:35:32', '2013-10-28T22:29:25'])
      })

      test('it returns the n next occurrences that match query', () => {
        expect(R5Start.relativeNext(dayjs('2021-03-26T05:06:07'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28'])
        expect(R5Start.relativeNext(dayjs('2021-03-26T05:06:07'), 3, { isBefore: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14'])
        expect(R5Start.relativeNext(dayjs('2021-03-26T05:06:07'), 3, { isSameOrBefore: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21'])
        expect(R5Start.relativeNext(dayjs('2021-03-26T05:06:07'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5Start.relativeNext(dayjs('2021-03-26T05:06:07'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeNext(dayjs('2021-03-26T05:06:07'), 3, { isAfter: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeNext(dayjs('2021-03-26T05:06:07'), 3, { isSameOrAfter: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.relativeNext(dayjs('2021-03-26T05:06:07'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28'])

        expect(R5End.relativeNext(dayjs('2018-10-06T18:53:53'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2016-04-17T08:41:39', '2015-01-23T03:35:32'])
        expect(R5End.relativeNext(dayjs('2018-10-06T18:53:53'), 3, { isBefore: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeNext(dayjs('2018-10-06T18:53:53'), 3, { isSameOrBefore: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeNext(dayjs('2018-10-06T18:53:53'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5End.relativeNext(dayjs('2018-10-06T18:53:53'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.relativeNext(dayjs('2018-10-06T18:53:53'), 3, { isAfter: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46'])
        expect(R5End.relativeNext(dayjs('2018-10-06T18:53:53'), 3, { isSameOrAfter: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2016-04-17T08:41:39'])
        expect(R5End.relativeNext(dayjs('2018-10-06T18:53:53'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2016-04-17T08:41:39', '2015-01-23T03:35:32'])
      })
    })
  })
})
