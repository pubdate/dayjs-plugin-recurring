import type { Dayjs } from 'dayjs'
import { DayjsPluginRecurringError } from './errors'

const ORDERED_DATE_UNITS = ['years', 'months', 'weeks', 'days'] as const
const ORDERED_TIME_UNITS = ['hours', 'minutes', 'seconds'] as const
const ORDERED_UNITS = [...ORDERED_DATE_UNITS, ...ORDERED_TIME_UNITS] as const

type OrderedUnitTuples<T extends string[] | readonly string[]> = { [K in keyof T]: [T[K], T[K] extends `${infer F}${string}` ? Uppercase<F> : never] }
const ORDERED_DATE_UNIT_TUPLES: OrderedUnitTuples<typeof ORDERED_DATE_UNITS> = [['years', 'Y'], ['months', 'M'], ['weeks', 'W'], ['days', 'D']]
const ORDERED_TIME_UNIT_TUPLES: OrderedUnitTuples<typeof ORDERED_TIME_UNITS> = [['hours', 'H'], ['minutes', 'M'], ['seconds', 'S']]

const REGEX_SE = /^P(?:(?<years>\d+)Y)?(?:(?<months>\d+)M)?(?:(?<weeks>\d+)W)?(?:(?<days>\d+)D)?(?:T(?:(?<hours>\d+)H)?(?:(?<minutes>\d+)M)?(?:(?<seconds>\d+)S)?)?$/

type ParseOpts = Partial<Record<typeof ORDERED_UNITS[number], number>>
export default class Duration {
  private constructor (
    readonly years: number = 0,
    readonly months: number = 0,
    readonly weeks: number = 0,
    readonly days: number = 0,
    readonly hours: number = 0,
    readonly minutes: number = 0,
    readonly seconds: number = 0
  ) {}

  static parse (input: string | ParseOpts): Duration {
    if (input instanceof Duration) return input
    if ((typeof input !== 'string' && typeof input !== 'object') || input == null) throw new DayjsPluginRecurringError('duration_invalid')
    let obj: ParseOpts = {}
    if (typeof input === 'string') {
      const match = input.match(REGEX_SE)
      if (match?.groups == null) throw new DayjsPluginRecurringError('duration_invalid')
      obj = Object.fromEntries(Object.entries(match.groups).map(([k, v]) => [k, v ? +v : 0])) as ParseOpts // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    } else {
      obj = input
    }
    const args = ORDERED_UNITS.map(x => obj[x] ?? 0)
    if (args.every(x => x === 0)) throw new DayjsPluginRecurringError('duration_zero')
    if (args.some(x => x < 0)) throw new DayjsPluginRecurringError('duration_negative')
    if (args.some(x => x % 1 !== 0)) throw new DayjsPluginRecurringError('duration_float')
    return new Duration(...args)
  }

  /** @deprecated PRIVATE */
  _addToDate (date: Dayjs, times = 1): Dayjs {
    return [...ORDERED_UNITS].reduce<Dayjs>((acc, unit) => acc.add(this[unit] * times, unit), date)
  }

  toString (): string {
    const parts = [ORDERED_DATE_UNIT_TUPLES, ORDERED_TIME_UNIT_TUPLES]
      .map(tuples => tuples.map(([unit, u]) => this[unit] > 0 ? `${this[unit]}${u}` : null).join(''))
    return `P${parts[0]}${parts[1] !== '' ? 'T' : ''}${parts[1]}`
  }
}
