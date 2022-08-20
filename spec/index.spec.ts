import dayjs, { Dayjs } from 'dayjs'
import recurring from '../src'

dayjs.extend(recurring)

const isAbout = (a: Dayjs, b: Dayjs): boolean => a.isAfter(b.subtract(2, 'seconds')) && a.isBefore(b.add(2, 'seconds'))

const duration = { years: 1, months: 2, weeks: 3, days: 4, hours: 5, minutes: 6, seconds: 7 }
const dateFormat = 'YYYY-MM-DDTHH:mm:ss'

describe('dayjs-plugin-recurring', () => {
  describe('parse()', () => {
    test('it returns a dayjs instance with the correct date', () => {
      expect(dayjs('R5/2020-01-01/P1Y2M3W4DT5H6M7S').format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(dayjs('R5/P1Y2M3W4DT5H6M7S/2020-01-01').format(dateFormat)).toEqual('2020-01-01T00:00:00')
      expect(isAbout(dayjs('R5/P1Y2M3W4DT5H6M7S'), dayjs())).toEqual(true)
    })

    test('it returns a dayjs instance with the correct recurring', () => {
      expect(dayjs('R5/2020-01-01/P1Y2M3W4DT5H6M7S').recurring()).toEqual({ times: 5, start: '2020-01-01', duration })
      expect(dayjs('R5/P1Y2M3W4DT5H6M7S/2020-01-01').recurring()).toEqual({ times: 5, end: '2020-01-01', duration })
      expect(dayjs('R5/P1Y2M3W4DT5H6M7S').recurring()).toEqual({ times: 5, duration })
    })
  })

  describe('recurring()', () => {
    test('it returns a dayjs instance with the correct date', () => {
      expect(dayjs('2016-04-17T08:41:39').recurring('R5/P1Y2M3W4DT5H6M7S/2020-01-01')!.format(dateFormat)).toEqual('2016-04-17T08:41:39')
      expect(dayjs('3000-01-01').recurring('R5/P1Y2M3W4DT5H6M7S')!.format(dateFormat)).toEqual('3000-01-01T00:00:00')
    })

    test('it returns a dayjs instance with the correct recurring', () => {
      expect(dayjs('2016-04-17T08:41:39').recurring('R5/P1Y2M3W4DT5H6M7S/2020-01-01')!.recurring()).toEqual({ times: 5, end: '2020-01-01', duration })
      expect(dayjs('3000-01-01').recurring('R5/P1Y2M3W4DT5H6M7S')!.recurring()).toEqual({ times: 5, duration })
    })

    test('it throws an error when recurring is invalid', () => {
      expect(() => dayjs('2016-04-17T08:41:39').recurring('abc')).toThrow('[@pubdate/dayjs-plugin-recurring] recurring_invalid')
    })
  })

  test('it passes methods to recurring (default = chronological)', () => {
    dayjs.extend((...args) => (recurring as any)(...args))

    const date = dayjs('2022-06-20T10:12:14').recurring('R5/2020-01-01/P1Y2M3W4DT5H6M7S')!
    expect(date.all()!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
    expect(date.first()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
    expect(date.first(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
    expect(date.last()!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
    expect(date.last(3)!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
    expect(date.prev()?.format(dateFormat)).toEqual('2021-03-26T05:06:07')
    expect(date.prev(2)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07'])
    expect(date.next()?.format(dateFormat)).toEqual('2023-09-14T15:18:21')
    expect(date.next(2)!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28'])
  })

  test('it passes methods to recurring (chronological)', () => {
    dayjs.extend((...args) => (recurring as any)(...args), { order: 'chronological' })

    const date = dayjs('2022-06-20T10:12:14').recurring('R5/2020-01-01/P1Y2M3W4DT5H6M7S')!
    expect(date.all()!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
    expect(date.first()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
    expect(date.first(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
    expect(date.last()!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
    expect(date.last(3)!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
    expect(date.prev()?.format(dateFormat)).toEqual('2021-03-26T05:06:07')
    expect(date.prev(2)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07'])
    expect(date.next()?.format(dateFormat)).toEqual('2023-09-14T15:18:21')
    expect(date.next(2)!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28'])
  })

  test('it passes methods to recurring (relative)', () => {
    dayjs.extend((...args) => (recurring as any)(...args), { order: 'relative' })

    const date = dayjs('2022-06-20T10:12:14').recurring('R5/2020-01-01/P1Y2M3W4DT5H6M7S')!
    expect(date.all()!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14', '2023-09-14T15:18:21', '2024-12-09T20:24:28', '2026-03-07T01:30:35'])
    expect(date.first()!.format(dateFormat)).toEqual('2020-01-01T00:00:00')
    expect(date.first(3)!.map(x => x.format(dateFormat))).toEqual(['2020-01-01T00:00:00', '2021-03-26T05:06:07', '2022-06-20T10:12:14'])
    expect(date.last()!.format(dateFormat)).toEqual('2026-03-07T01:30:35')
    expect(date.last(3)!.map(x => x.format(dateFormat))).toEqual(['2026-03-07T01:30:35', '2024-12-09T20:24:28', '2023-09-14T15:18:21'])
    expect(date.prev()?.format(dateFormat)).toEqual('2021-03-26T05:06:07')
    expect(date.prev(2)!.map(x => x.format(dateFormat))).toEqual(['2021-03-26T05:06:07', '2020-01-01T00:00:00'])
    expect(date.next()?.format(dateFormat)).toEqual('2023-09-14T15:18:21')
    expect(date.next(2)!.map(x => x.format(dateFormat))).toEqual(['2023-09-14T15:18:21', '2024-12-09T20:24:28'])
  })
})
