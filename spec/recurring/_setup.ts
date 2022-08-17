import dayjs from 'dayjs'
import Recurring from '../../src/recurring'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

Recurring.dayjsFactory = dayjs

export const duration = { years: 1, months: 2, weeks: 3, days: 4, hours: 5, minutes: 6, seconds: 7 }
export const dateFormat = 'YYYY-MM-DDTHH:mm:ss'

export const R5Start = Recurring.parse('R5/2020-01-01/P1Y2M3W4DT5H6M7S')!
export const R5End = Recurring.parse('R5/P1Y2M3W4DT5H6M7S/2020-01-01')!
export const R5EndContext = Recurring.parse('R5/P1Y2M3W4DT5H6M7S/2020-01-01', { context: dayjs('2016-04-17T08:41:39') })!
export const R5Context = Recurring.parse('R5/P1Y2M3W4DT5H6M7S', { context: dayjs('3000-01-01') })!
export const R5ContextAsEnd = Recurring.parse('R5/P1Y2M3W4DT5H6M7S', { context: dayjs('3000-01-01'), contextAsEnd: true })!
export const R5NoContext = Recurring.parse('R5/P1Y2M3W4DT5H6M7S')!

export const RStart = Recurring.parse('R/2020-01-01/P1Y2M3W4DT5H6M7S')!
export const REnd = Recurring.parse('R/P1Y2M3W4DT5H6M7S/2020-01-01')!
export const REndContext = Recurring.parse('R/P1Y2M3W4DT5H6M7S/2020-01-01', { context: dayjs('2016-04-17T08:41:39') })!
export const RContext = Recurring.parse('R/P1Y2M3W4DT5H6M7S', { context: dayjs('3000-01-01') })!
export const RContextAsEnd = Recurring.parse('R/P1Y2M3W4DT5H6M7S', { context: dayjs('3000-01-01'), contextAsEnd: true })!
export const RNoContext = Recurring.parse('R/P1Y2M3W4DT5H6M7S')!

export const nowR5 = dayjs(R5NoContext.relativeFirst())
export const nowR = dayjs(RNoContext.relativeFirst())
