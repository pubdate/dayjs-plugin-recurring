import type dayjs from 'dayjs'
import type { ConfigType, Dayjs } from 'dayjs'

import Duration from './duration'
import { DayjsPluginRecurringError } from './errors'

const REGEX_DURATION = /P(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?/
const REGEX_DATE = /.+/
const REGEX_SE = new RegExp(`^R(?<times>[0-9]*)/(?:(?<start>${REGEX_DATE.source})/(?<duration_a>${REGEX_DURATION.source})|(?<duration_b>${REGEX_DURATION.source})(?:/(?<end>${REGEX_DATE.source}))?)$`)

interface ParseOpts {
  times?: number
  start?: ConfigType
  end?: ConfigType
  duration: Parameters<(typeof Duration)['parse']>[0]
}
export type Query = {
  [K in keyof Dayjs as Dayjs[K] extends (date: Dayjs) => boolean ? K : never]?:
  Dayjs[K] extends (date: Dayjs) => boolean ? Parameters<Dayjs[K]> | Parameters<Dayjs[K]>[0] : never
} | ((date: Dayjs) => boolean)

export default class Recurring {
  static dayjsFactory: typeof dayjs | undefined

  readonly #start: ConfigType | undefined
  readonly #end: ConfigType | undefined

  private constructor (
    readonly times: number | undefined,
    readonly start: ConfigType | undefined,
    readonly end: ConfigType | undefined,
    readonly duration: Duration,
    context?: ConfigType,
    contextAsEnd: boolean = false
  ) {
    // SET #start/#end USING start/end, context OR dayjs()
    this.#start = this.start != null || (this.end == null && !contextAsEnd)
      ? this.start ?? context ?? Recurring.dayjsFactory!()
      : undefined
    this.#end = this.end != null || (this.start == null && contextAsEnd)
      ? this.end ?? context ?? Recurring.dayjsFactory!()
      : undefined
    // GENERATE times AND REMOVE end/#end WHEN BOTH #start AND #end ARE PROVIDED
    if (this.#start != null && this.#end != null) {
      if (this.times == null) {
        const recurring = Recurring.parse({ start: this.#start, duration: this.duration })!
        this.#relativeAll = recurring.relativeFirst(Infinity, (date: Dayjs): boolean => !date.isAfter(this.#end))
        this.times = this.#relativeAll.length - 1
      }
      this.end = undefined
      this.#end = undefined
    }
  }

  static parse (input: string | ParseOpts, { context, contextAsEnd }: { context?: Dayjs, contextAsEnd?: boolean } = {}): Recurring {
    if (input instanceof Recurring) return input
    if ((typeof input !== 'string' && typeof input !== 'object') || input == null) throw new DayjsPluginRecurringError('recurring_invalid')
    if (typeof input === 'string') { // INPUT IS STRING
      const match = input.match(REGEX_SE)
      if (match?.groups == null) throw new DayjsPluginRecurringError('recurring_invalid')
      const duration = Duration.parse(match.groups.duration_a || match.groups.duration_b) // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      return new Recurring(
        match.groups?.times ? +match.groups.times : undefined, // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        match.groups?.start || undefined, // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        match.groups?.end || undefined, // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        duration,
        context,
        contextAsEnd
      )
    } else { // INPUT IS OBJECT
      const duration = Duration.parse(input.duration)
      return new Recurring(
        input.times,
        input.start,
        input.end,
        duration,
        context,
        contextAsEnd
      )
    }
  }

  // ALL

  #relativeAll: readonly Dayjs[] | null | undefined
  relativeAll (): readonly Dayjs[] | null {
    if (this.times == null) return null // NO LIMIT
    if (this.#relativeAll === undefined) {
      this.#relativeAll = [this.relativeFirst(), ...this.relativeNext(this.relativeFirst(), Infinity)]
    }
    return this.#relativeAll
  }

  chronologicalAll (): readonly Dayjs[] | null {
    if (this.relativeAll() == null) return null
    if (this.dir === 'asc') return this.relativeAll()
    return [...this.relativeAll()!].reverse()
  }

  // FIRST

  #relativeFirst: Dayjs | undefined
  relativeFirst (): Dayjs
  relativeFirst (n: number, query?: Query): readonly Dayjs[]
  relativeFirst (n?: number, query?: Query): Dayjs | readonly Dayjs[] {
    if (n == null) { // () => Dayjs
      if (this.#relativeFirst === undefined) {
        this.#relativeFirst = this.#setRecurring(Recurring.dayjsFactory!(this.#start ?? this.#end), { $recurringRelativeHistory: [] })
      }
      return this.#relativeFirst
    } else { // (n) => Dayjs[]
      if (n === 0) return []
      if (!this.#validateQuery(this.relativeFirst()!, query)) return []
      return [this.relativeFirst()!, ...this.relativeNext(this.relativeFirst()!, n - 1, query)]
    }
  }

  chronologicalFirst (): Dayjs
  chronologicalFirst (n: number, query?: Query): readonly Dayjs[]
  chronologicalFirst (n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) return this.dir === 'asc' ? this.relativeFirst() : this.relativeLast()
    return this.dir === 'asc' ? this.relativeFirst(n, query) : this.relativeLast(n, query)
  }

  // LAST

  #relativeLast: Dayjs | null | undefined
  relativeLast (): Dayjs | null
  relativeLast (n: number, query?: Query): readonly Dayjs[] | null
  relativeLast (n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) { // () => Dayjs
      if (this.#relativeLast === undefined) {
        this.#relativeLast = this.relativeAll()?.[this.relativeAll()!.length - 1] ?? null
      }
      return this.#relativeLast
    } else { // (n) => Dayjs[]
      if (n === 0) return []
      let arr = this.relativeAll()
      if (arr == null) return null
      arr = [...arr].reverse()
      const result = []
      for (let i = 0; i < n; i++) {
        if (!this.#validateQuery(arr[i], query)) break
        if (arr[i] == null) break
        result.push(arr[i])
      }
      return result
    }
  }

  chronologicalLast (): Dayjs
  chronologicalLast (n: number, query?: Query): readonly Dayjs[]
  chronologicalLast (n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) return this.dir === 'asc' ? this.relativeLast() : this.relativeFirst()
    const arr = this.dir === 'asc' ? this.relativeLast(n, query) : this.relativeFirst(n, query)
    if (arr == null) return null
    return [...arr].reverse()
  }

  // PREV

  relativePrev (date: Dayjs): Dayjs | null
  relativePrev (date: Dayjs, n: number, query?: Query): readonly Dayjs[]
  relativePrev (date: Dayjs, n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) { // () => Dayjs
      return this.relativePrev(date, 1)[0] ?? null
    } else { // (n) => Dayjs[]
      const arr = [...this.#relativeHistory(date)].reverse()
      const result: Dayjs[] = []
      for (let i = 0; i < n; i++) {
        if (!this.#validateQuery(arr[i], query)) break
        if (arr[i] == null) break
        result.push(arr[i])
      }
      return result
    }
  }

  chronologicalPrev (date: Dayjs): Dayjs
  chronologicalPrev (date: Dayjs, n: number, query?: Query): readonly Dayjs[]
  chronologicalPrev (date: Dayjs, n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) return this.dir === 'asc' ? this.relativePrev(date) : this.relativeNext(date)
    const arr = this.dir === 'asc' ? this.relativePrev(date, n, query) : this.relativeNext(date, n, query)
    if (arr == null) return null
    return [...arr].reverse()
  }

  // NEXT

  relativeNext (date: Dayjs): Dayjs | null
  relativeNext (date: Dayjs, n: number, query?: Query): readonly Dayjs[]
  relativeNext (date: Dayjs, n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) { // () => Dayjs
      if (this.times != null && this.#relativeHistory(date).length >= this.times) return null
      if (this.relativeFirst()[this.dir === 'asc' ? 'isAfter' : 'isBefore'](date)) return this.relativeFirst()
      if (this.#relativeHistory(date).length !== 0) {
        date = this.#setRecurring(
          this.duration._addToDate(this.#relativeHistory(date)[this.#relativeHistory(date).length - 1], this.dir === 'asc' ? 1 : -1),
          { $recurringRelativeHistory: this.#relativeHistory(date) }
        )
      }
      return this.#setRecurring(
        this.duration._addToDate(date, this.dir === 'asc' ? 1 : -1),
        { $recurringRelativeHistory: [...this.#relativeHistory(date), date] }
      )
    } else { // (n) => Dayjs[]
      let succ = this.#relativeHistory(date).length === 0
        ? this.relativeFirst()
        : this.relativeNext(this.#relativeHistory(date)[this.#relativeHistory(date).length - 1])
      if (succ == null) return []
      if (succ.isSame(date)) succ = this.relativeNext(succ)
      const result: Dayjs[] = []
      for (let i = 0; i < n; i++) {
        if (succ == null) break
        if (!this.#validateQuery(succ, query)) break
        result.push(succ)
        succ = this.relativeNext(succ)
      }
      return result
    }
  }

  chronologicalNext (date: Dayjs): Dayjs
  chronologicalNext (date: Dayjs, n: number, query?: Query): readonly Dayjs[]
  chronologicalNext (date: Dayjs, n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) return this.dir === 'asc' ? this.relativeNext(date) : this.relativePrev(date)
    return this.dir === 'asc' ? this.relativeNext(date, n, query) : this.relativePrev(date, n, query)
  }

  // OTHER

  get dir (): 'asc' | 'desc' {
    return this.#start != null ? 'asc' : 'desc'
  }

  toString ({ dateFormat, includeContext }: { dateFormat?: string, includeContext?: boolean } = {}): string {
    let body: string | undefined
    if (body == null && this.start != null) body = `${Recurring.dayjsFactory!(this.start).format(dateFormat)}/${this.duration.toString()}`
    if (body == null && this.end != null) body = `${this.duration.toString()}/${Recurring.dayjsFactory!(this.end).format(dateFormat)}`
    if (body == null && (includeContext ?? false) && this.#start != null) body = `${Recurring.dayjsFactory!(this.#start).format(dateFormat)}/${this.duration.toString()}`
    if (body == null && (includeContext ?? false) && this.#end != null) body = `${this.duration.toString()}/${Recurring.dayjsFactory!(this.#end).format(dateFormat)}`
    return `R${this.times ?? ''}/${body ?? this.duration.toString()}`
  }

  // PRIVATE

  #relativeHistory (date: Dayjs): readonly Dayjs[] {
    if (date.$recurringRelativeHistory != null) return date.$recurringRelativeHistory
    if (!this.relativeFirst()[this.dir === 'asc' ? 'isBefore' : 'isAfter'](date)) {
      date.$recurringRelativeHistory = [] // date is before firstOccurrenceInDirDirection in the dir direction
    } else {
      date.$recurringRelativeHistory = [
        this.relativeFirst(),
        ...this.relativeNext(this.relativeFirst(), Infinity, { [this.dir === 'asc' ? 'isBefore' : 'isAfter']: date })
      ]
    }
    return date.$recurringRelativeHistory
  }

  #setRecurring (date: Dayjs, { $recurringRelativeHistory }: { $recurringRelativeHistory: readonly Dayjs[] }): Dayjs {
    date.$recurring = this
    date.$recurringRelativeHistory = $recurringRelativeHistory
    return date
  }

  #validateQuery (date: Dayjs, query: Query | undefined): boolean {
    if (query == null) return true
    if (query instanceof Function) return query(date)
    return Object.entries(query).every(([k, v]) => (date[k as keyof Dayjs])(v))
  }
}
