import dayjs from 'dayjs'
import Recurring from '../../src/recurring'
import { R5Start, dateFormat, R5End, R5EndContext, R5Context, R5ContextAsEnd, R5NoContext, nowR5, RStart, REnd, REndContext, RContext, RContextAsEnd, RNoContext, nowR } from './_setup'

describe('Recurring', () => {
  describe('chronological', () => {
    describe('chronologicalAll()', () => {
      test('it returns an array of dayjs instances', () => {
        expect(R5Start.chronologicalAll()!.map(x => x.format(dateFormat)))
          .toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5End.chronologicalAll()!.map(x => x.format(dateFormat)))
          .toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5EndContext.chronologicalAll()!.map(x => x.format(dateFormat)))
          .toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5Context.chronologicalAll()!.map(x => x.format(dateFormat)))
          .toEqual(['3000-01-01T00:00:00', '3001-03-26T05:06:07', '3002-06-20T10:12:14', '3003-09-14T15:18:21', '3004-12-09T20:24:28', '3006-03-07T01:30:35'])
        expect(R5ContextAsEnd.chronologicalAll()!.map(x => x.format(dateFormat)))
          .toEqual(['2993-10-28T22:29:25', '2995-01-23T03:35:32', '2996-04-17T08:41:39', '2997-07-12T13:47:46', '2998-10-06T18:53:53', '3000-01-01T00:00:00'])
        expect(R5NoContext.chronologicalAll()!.map(x => x.format(dateFormat)))
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
        expect(RStart.chronologicalAll()).toEqual(null)
        expect(REnd.chronologicalAll()).toEqual(null)
        expect(REndContext.chronologicalAll()).toEqual(null)
        expect(RContext.chronologicalAll()).toEqual(null)
        expect(RContextAsEnd.chronologicalAll()).toEqual(null)
        expect(RNoContext.chronologicalAll()).toEqual(null)
      })

      test('it returns an array of dayjs instances with the same recurring', () => {
        R5Start.chronologicalAll()!.forEach(x => expect(x.$recurring).toBe(R5Start))
      })
    })

    describe('chronologicalAllBetween()', () => {
      test('it returns an array of dayjs instances (start)', () => {
        expect(Recurring.parse('R/2020-01-01/P1Y').chronologicalAllBetween('2000-01-01', '2010-01-01').map(x => x.format('YYYY-MM-DD')))
          .toEqual([])
        expect(Recurring.parse('R/2020-01-01/P1Y').chronologicalAllBetween('2000-01-01', '2025-01-01').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2020-01-01', '2021-01-01', '2022-01-01', '2023-01-01', '2024-01-01'])
        expect(Recurring.parse('R/2020-01-01/P1Y').chronologicalAllBetween('2022-01-01', '2025-01-01').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2023-01-01', '2024-01-01'])
        expect(Recurring.parse('R/2020-01-01/P1Y').chronologicalAllBetween('2025-01-01', '2022-01-01').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2023-01-01', '2024-01-01'])

        expect(Recurring.parse('R/2020-01-01/P1Y').chronologicalAllBetween('2022-01-01', '2025-01-01', undefined, '[)').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2022-01-01', '2023-01-01', '2024-01-01'])
        expect(Recurring.parse('R/2020-01-01/P1Y').chronologicalAllBetween('2022-01-01', '2025-01-01', undefined, '(]').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2023-01-01', '2024-01-01', '2025-01-01'])
        expect(Recurring.parse('R/2020-01-01/P1Y').chronologicalAllBetween('2022-01-01', '2025-01-01', undefined, '[]').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2022-01-01', '2023-01-01', '2024-01-01', '2025-01-01'])

        expect(Recurring.parse('R/2020-01-02/P1Y').chronologicalAllBetween('2022-02-01', '2025-01-01', undefined, '[]').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2023-01-02', '2024-01-02'])
        expect(Recurring.parse('R/2020-01-02/P1Y').chronologicalAllBetween('2022-02-01', '2025-01-01', 'month', '[]').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2023-01-02', '2024-01-02', '2025-01-02'])
        expect(Recurring.parse('R/2020-01-02/P1Y').chronologicalAllBetween('2022-02-01', '2025-01-01', 'year', '[]').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2022-01-02', '2023-01-02', '2024-01-02', '2025-01-02'])
      })

      test('it returns an array of dayjs instances (end)', () => {
        expect(Recurring.parse('R/P1Y/2030-01-01').chronologicalAllBetween('3000-01-01', '3010-01-01').map(x => x.format('YYYY-MM-DD')))
          .toEqual([])
        expect(Recurring.parse('R/P1Y/2030-01-01').chronologicalAllBetween('2025-01-01', '3010-01-01').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2026-01-01', '2027-01-01', '2028-01-01', '2029-01-01', '2030-01-01'])
        expect(Recurring.parse('R/P1Y/2030-01-01').chronologicalAllBetween('2022-01-01', '2025-01-01').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2023-01-01', '2024-01-01'])
        expect(Recurring.parse('R/P1Y/2030-01-01').chronologicalAllBetween('2025-01-01', '2022-01-01').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2023-01-01', '2024-01-01'])

        expect(Recurring.parse('R/P1Y/2030-01-01').chronologicalAllBetween('2022-01-01', '2025-01-01', undefined, '[)').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2022-01-01', '2023-01-01', '2024-01-01'])
        expect(Recurring.parse('R/P1Y/2030-01-01').chronologicalAllBetween('2022-01-01', '2025-01-01', undefined, '(]').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2023-01-01', '2024-01-01', '2025-01-01'])
        expect(Recurring.parse('R/P1Y/2030-01-01').chronologicalAllBetween('2022-01-01', '2025-01-01', undefined, '[]').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2022-01-01', '2023-01-01', '2024-01-01', '2025-01-01'])

        expect(Recurring.parse('R/P1Y/2030-01-02').chronologicalAllBetween('2022-02-01', '2025-01-01', undefined, '[]').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2023-01-02', '2024-01-02'])
        expect(Recurring.parse('R/P1Y/2030-01-02').chronologicalAllBetween('2022-02-01', '2025-01-01', 'month', '[]').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2023-01-02', '2024-01-02', '2025-01-02'])
        expect(Recurring.parse('R/P1Y/2030-01-02').chronologicalAllBetween('2022-02-01', '2025-01-01', 'year', '[]').map(x => x.format('YYYY-MM-DD')))
          .toEqual(['2022-01-02', '2023-01-02', '2024-01-02', '2025-01-02'])
      })
    })

    describe('chronologicalFirst()', () => {
      test('it returns the first occurrence', () => {
        expect(R5Start.chronologicalFirst()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5End.chronologicalFirst()!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
        expect(R5EndContext.chronologicalFirst()!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
        expect(R5Context.chronologicalFirst()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
        expect(R5ContextAsEnd.chronologicalFirst()!.format(dateFormat)).toEqual('2993-10-28T22:29:25')
        expect(R5NoContext.chronologicalFirst()!.format(dateFormat)).toEqual(nowR5.format(dateFormat))
      })

      test('it returns null when there is no start and no limit', () => {
        expect(RStart.chronologicalFirst()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(REnd.chronologicalFirst()).toEqual(null)
        expect(REndContext.chronologicalFirst()).toEqual(null)
        expect(RContext.chronologicalFirst()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
        expect(RContextAsEnd.chronologicalFirst()).toEqual(null)
        expect(RNoContext.chronologicalFirst()!.format(dateFormat)).toEqual(nowR.format(dateFormat))
      })

      test('it returns the n first occurrences', () => {
        expect(R5Start.chronologicalFirst(0)!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalFirst(1)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
        expect(R5Start.chronologicalFirst(2)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07'])
        expect(R5Start.chronologicalFirst(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
        expect(R5Start.chronologicalFirst(4)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21'])
        expect(R5Start.chronologicalFirst(5)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28'])
        expect(R5Start.chronologicalFirst(6)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.chronologicalFirst(7)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])

        expect(R5End.chronologicalFirst(0)!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalFirst(1)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25'])
        expect(R5End.chronologicalFirst(2)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32'])
        expect(R5End.chronologicalFirst(3)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
        expect(R5End.chronologicalFirst(4)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46'])
        expect(R5End.chronologicalFirst(5)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53'])
        expect(R5End.chronologicalFirst(6)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.chronologicalFirst(7)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])

        expect(RStart.chronologicalFirst(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
        expect(REnd.chronologicalFirst(3)).toEqual(null)
      })

      test('it returns the n first occurrences that match query', () => {
        expect(R5Start.chronologicalFirst(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
        expect(R5Start.chronologicalFirst(3, { isBefore: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
        expect(R5Start.chronologicalFirst(3, { isSameOrBefore: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07'])
        expect(R5Start.chronologicalFirst(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5Start.chronologicalFirst(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalFirst(3, { isAfter: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalFirst(3, { isSameOrAfter: '2021-03-26T05:06:07' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalFirst(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])

        expect(R5End.chronologicalFirst(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
        expect(R5End.chronologicalFirst(3, { isBefore: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25'])
        expect(R5End.chronologicalFirst(3, { isSameOrBefore: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32'])
        expect(R5End.chronologicalFirst(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5End.chronologicalFirst(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalFirst(3, { isAfter: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalFirst(3, { isSameOrAfter: '2015-01-23T03:35:32' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalFirst(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
      })
    })

    describe('chronologicalLast()', () => {
      test('it returns the last occurrence', () => {
        expect(R5Start.chronologicalLast()!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
        expect(R5End.chronologicalLast()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5EndContext.chronologicalLast()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5Context.chronologicalLast()!.format(dateFormat)).toEqual('3006-03-07T01:30:35')
        expect(R5ContextAsEnd.chronologicalLast()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
        expect(R5NoContext.chronologicalLast()!.format(dateFormat)).toEqual(
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
        expect(RStart.chronologicalLast()).toEqual(null)
        expect(REnd.chronologicalLast()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(REndContext.chronologicalLast()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(RContext.chronologicalLast()).toEqual(null)
        expect(RContextAsEnd.chronologicalLast()!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
        expect(RNoContext.chronologicalLast()).toEqual(null)
      })

      test('it returns the n last occurrences', () => {
        expect(R5Start.chronologicalLast(0)!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalLast(1)!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35'])
        expect(R5Start.chronologicalLast(2)!.map(x => x.format(dateFormat))).toEqual(['2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.chronologicalLast(3)!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.chronologicalLast(4)!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.chronologicalLast(5)!.map(x => x.format(dateFormat))).toEqual(['2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.chronologicalLast(6)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.chronologicalLast(7)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])

        expect(R5End.chronologicalLast(0)!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalLast(1)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
        expect(R5End.chronologicalLast(2)!.map(x => x.format(dateFormat))).toEqual(['2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.chronologicalLast(3)!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.chronologicalLast(4)!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.chronologicalLast(5)!.map(x => x.format(dateFormat))).toEqual(['2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.chronologicalLast(6)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.chronologicalLast(7)!.map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])

        expect(RStart.chronologicalLast(3)).toEqual(null)
        expect(REnd.chronologicalLast(3)!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      })

      test('it returns the n last occurrences that match query', () => {
        expect(R5Start.chronologicalLast(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.chronologicalLast(3, { isBefore: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalLast(3, { isSameOrBefore: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalLast(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5Start.chronologicalLast(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalLast(3, { isAfter: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35'])
        expect(R5Start.chronologicalLast(3, { isSameOrAfter: '2024-12-09T20:24:28' })!.map(x => x.format(dateFormat))).toEqual(['2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.chronologicalLast(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])

        expect(R5End.chronologicalLast(3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.chronologicalLast(3, { isBefore: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalLast(3, { isSameOrBefore: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalLast(3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5End.chronologicalLast(3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalLast(3, { isAfter: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00'])
        expect(R5End.chronologicalLast(3, { isSameOrAfter: '2018-10-06T18:53:53' })!.map(x => x.format(dateFormat))).toEqual(['2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.chronologicalLast(3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      })
    })

    describe('chronologicalPrev()', () => {
      test('it returns the previous occurrence', () => {
        expect(R5Start.chronologicalPrev(dayjs('3000-01-01'))!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
        expect(R5Start.chronologicalPrev(dayjs('2000-01-01'))).toEqual(null)

        expect(R5Start.chronologicalPrev(dayjs('2026-03-07T01:30:36'))!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
        expect(R5Start.chronologicalPrev(dayjs('2026-03-07T01:30:35'))!.format(dateFormat)).toEqual('2024-12-09T20:24:28')
        expect(R5Start.chronologicalPrev(dayjs('2024-12-09T20:24:28'))!.format(dateFormat)).toEqual('2023-09-14T15:18:21')
        expect(R5Start.chronologicalPrev(dayjs('2023-09-14T15:18:21'))!.format(dateFormat)).toEqual('2022-06-20T10:12:14')
        expect(R5Start.chronologicalPrev(dayjs('2022-06-20T10:12:14'))!.format(dateFormat)).toEqual('2021-03-26T05:06:07')
        expect(R5Start.chronologicalPrev(dayjs('2021-03-26T05:06:07'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5Start.chronologicalPrev(dayjs('2020-01-01T00:00:00'))).toEqual(null)

        expect(R5End.chronologicalPrev(dayjs('3000-01-01'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5End.chronologicalPrev(dayjs('2000-01-01'))).toEqual(null)

        expect(R5End.chronologicalPrev(dayjs('2020-01-01T00:00:01'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5End.chronologicalPrev(dayjs('2020-01-01T00:00:00'))!.format(dateFormat)).toEqual('2018-10-06T18:53:53')
        expect(R5End.chronologicalPrev(dayjs('2018-10-06T18:53:53'))!.format(dateFormat)).toEqual('2017-07-12T13:47:46')
        expect(R5End.chronologicalPrev(dayjs('2017-07-12T13:47:46'))!.format(dateFormat)).toEqual('2016-04-17T08:41:39')
        expect(R5End.chronologicalPrev(dayjs('2016-04-17T08:41:39'))!.format(dateFormat)).toEqual('2015-01-23T03:35:32')
        expect(R5End.chronologicalPrev(dayjs('2015-01-23T03:35:32'))!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
        expect(R5End.chronologicalPrev(dayjs('2013-10-28T22:29:25'))).toEqual(null)
      })

      test('it returns the n previous occurrences', () => {
        expect(R5Start.chronologicalPrev(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.chronologicalPrev(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])

        expect(R5Start.chronologicalPrev(dayjs('2023-09-14T15:18:21'), 1).map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14'])
        expect(R5Start.chronologicalPrev(dayjs('2023-09-14T15:18:21'), 2).map(x => x.format(dateFormat))).toEqual(['2021-03-26T05:06:07', '2022-06-20T10:12:14'])
        expect(R5Start.chronologicalPrev(dayjs('2023-09-14T15:18:21'), 3).map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
        expect(R5Start.chronologicalPrev(dayjs('2023-09-14T15:18:21'), 4).map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])

        expect(R5End.chronologicalPrev(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.chronologicalPrev(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])

        expect(R5End.chronologicalPrev(dayjs('2017-07-12T13:47:46'), 1).map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39'])
        expect(R5End.chronologicalPrev(dayjs('2017-07-12T13:47:46'), 2).map(x => x.format(dateFormat))).toEqual(['2015-01-23T03:35:32', '2016-04-17T08:41:39'])
        expect(R5End.chronologicalPrev(dayjs('2017-07-12T13:47:46'), 3).map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
        expect(R5End.chronologicalPrev(dayjs('2017-07-12T13:47:46'), 4).map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])
      })

      test('it returns the n previous occurrences that match query', () => {
        expect(R5Start.chronologicalPrev(dayjs('2024-12-09T20:24:28'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21'])
        expect(R5Start.chronologicalPrev(dayjs('2024-12-09T20:24:28'), 3, { isBefore: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalPrev(dayjs('2024-12-09T20:24:28'), 3, { isSameOrBefore: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalPrev(dayjs('2024-12-09T20:24:28'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5Start.chronologicalPrev(dayjs('2024-12-09T20:24:28'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalPrev(dayjs('2024-12-09T20:24:28'), 3, { isAfter: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21'])
        expect(R5Start.chronologicalPrev(dayjs('2024-12-09T20:24:28'), 3, { isSameOrAfter: '2022-06-20T10:12:14' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21'])
        expect(R5Start.chronologicalPrev(dayjs('2024-12-09T20:24:28'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21'])

        expect(R5End.chronologicalPrev(dayjs('2018-10-06T18:53:53'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46'])
        expect(R5End.chronologicalPrev(dayjs('2018-10-06T18:53:53'), 3, { isBefore: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalPrev(dayjs('2018-10-06T18:53:53'), 3, { isSameOrBefore: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalPrev(dayjs('2018-10-06T18:53:53'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5End.chronologicalPrev(dayjs('2018-10-06T18:53:53'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalPrev(dayjs('2018-10-06T18:53:53'), 3, { isAfter: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46'])
        expect(R5End.chronologicalPrev(dayjs('2018-10-06T18:53:53'), 3, { isSameOrAfter: '2016-04-17T08:41:39' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46'])
        expect(R5End.chronologicalPrev(dayjs('2018-10-06T18:53:53'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2015-01-23T03:35:32', '2016-04-17T08:41:39', '2017-07-12T13:47:46'])
      })
    })

    describe('chronologicalNext()', () => {
      test('it returns the next occurrence', () => {
        expect(R5Start.chronologicalNext(dayjs('3000-01-01'))).toEqual(null)
        expect(R5Start.chronologicalNext(dayjs('2000-01-01'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')

        expect(R5Start.chronologicalNext(dayjs('2019-12-31T23:59:59'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5Start.chronologicalNext(dayjs('2020-01-01T00:00:00'))!.format(dateFormat)).toEqual('2021-03-26T05:06:07')
        expect(R5Start.chronologicalNext(dayjs('2021-03-26T05:06:07'))!.format(dateFormat)).toEqual('2022-06-20T10:12:14')
        expect(R5Start.chronologicalNext(dayjs('2022-06-20T10:12:14'))!.format(dateFormat)).toEqual('2023-09-14T15:18:21')
        expect(R5Start.chronologicalNext(dayjs('2023-09-14T15:18:21'))!.format(dateFormat)).toEqual('2024-12-09T20:24:28')
        expect(R5Start.chronologicalNext(dayjs('2024-12-09T20:24:28'))!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
        expect(R5Start.chronologicalNext(dayjs('2026-03-07T01:30:35'))).toEqual(null)

        expect(R5End.chronologicalNext(dayjs('3000-01-01'))).toEqual(null)
        expect(R5End.chronologicalNext(dayjs('2000-01-01'))!.format(dateFormat)).toEqual('2013-10-28T22:29:25')

        expect(R5End.chronologicalNext(dayjs('2013-10-28T22:29:24'))!.format(dateFormat)).toEqual('2013-10-28T22:29:25')
        expect(R5End.chronologicalNext(dayjs('2013-10-28T22:29:25'))!.format(dateFormat)).toEqual('2015-01-23T03:35:32')
        expect(R5End.chronologicalNext(dayjs('2015-01-23T03:35:32'))!.format(dateFormat)).toEqual('2016-04-17T08:41:39')
        expect(R5End.chronologicalNext(dayjs('2016-04-17T08:41:39'))!.format(dateFormat)).toEqual('2017-07-12T13:47:46')
        expect(R5End.chronologicalNext(dayjs('2017-07-12T13:47:46'))!.format(dateFormat)).toEqual('2018-10-06T18:53:53')
        expect(R5End.chronologicalNext(dayjs('2018-10-06T18:53:53'))!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
        expect(R5End.chronologicalNext(dayjs('2020-01-01T00:00:00'))).toEqual(null)
      })

      test('it returns the n next occurrences', () => {
        expect(R5Start.chronologicalNext(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalNext(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])

        expect(R5Start.chronologicalNext(dayjs('2022-06-20T10:12:14'), 1).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21'])
        expect(R5Start.chronologicalNext(dayjs('2022-06-20T10:12:14'), 2).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28'])
        expect(R5Start.chronologicalNext(dayjs('2022-06-20T10:12:14'), 3).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
        expect(R5Start.chronologicalNext(dayjs('2022-06-20T10:12:14'), 4).map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])

        expect(R5End.chronologicalNext(dayjs('3000-01-01'), 3).map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalNext(dayjs('2000-01-01'), 3).map(x => x.format(dateFormat))).toEqual(['2013-10-28T22:29:25', '2015-01-23T03:35:32', '2016-04-17T08:41:39'])

        expect(R5End.chronologicalNext(dayjs('2016-04-17T08:41:39'), 1).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46'])
        expect(R5End.chronologicalNext(dayjs('2016-04-17T08:41:39'), 2).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53'])
        expect(R5End.chronologicalNext(dayjs('2016-04-17T08:41:39'), 3).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
        expect(R5End.chronologicalNext(dayjs('2016-04-17T08:41:39'), 4).map(x => x.format(dateFormat))).toEqual(['2017-07-12T13:47:46', '2018-10-06T18:53:53', '2020-01-01T00:00:00'])
      })

      test('it returns the n next occurrences that match query', () => {
        expect(R5Start.chronologicalNext(dayjs('2021-03-26T05:06:07'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28'])
        expect(R5Start.chronologicalNext(dayjs('2021-03-26T05:06:07'), 3, { isBefore: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14'])
        expect(R5Start.chronologicalNext(dayjs('2021-03-26T05:06:07'), 3, { isSameOrBefore: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21'])
        expect(R5Start.chronologicalNext(dayjs('2021-03-26T05:06:07'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5Start.chronologicalNext(dayjs('2021-03-26T05:06:07'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalNext(dayjs('2021-03-26T05:06:07'), 3, { isAfter: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalNext(dayjs('2021-03-26T05:06:07'), 3, { isSameOrAfter: '2023-09-14T15:18:21' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5Start.chronologicalNext(dayjs('2021-03-26T05:06:07'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28'])

        expect(R5End.chronologicalNext(dayjs('2015-01-23T03:35:32'), 3, { isBefore: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53'])
        expect(R5End.chronologicalNext(dayjs('2015-01-23T03:35:32'), 3, { isBefore: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39'])
        expect(R5End.chronologicalNext(dayjs('2015-01-23T03:35:32'), 3, { isSameOrBefore: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46'])
        expect(R5End.chronologicalNext(dayjs('2015-01-23T03:35:32'), 3, { isBefore: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual([])

        expect(R5End.chronologicalNext(dayjs('2015-01-23T03:35:32'), 3, { isAfter: '3000-01-01' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalNext(dayjs('2015-01-23T03:35:32'), 3, { isAfter: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalNext(dayjs('2015-01-23T03:35:32'), 3, { isSameOrAfter: '2017-07-12T13:47:46' })!.map(x => x.format(dateFormat))).toEqual([])
        expect(R5End.chronologicalNext(dayjs('2015-01-23T03:35:32'), 3, { isAfter: '1000-00-00' })!.map(x => x.format(dateFormat))).toEqual(['2016-04-17T08:41:39', '2017-07-12T13:47:46', '2018-10-06T18:53:53'])
      })
    })
  })
})
