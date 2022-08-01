import type dayjs from 'dayjs'
import type { ConfigType, Dayjs } from 'dayjs'

import Duration from './duration'

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
    // GENERATE times IF GUESSABLE; AND REMOVE end/#end WHEN BOTH #start AND #end ARE PROVIDED
    if (this.#start != null && this.#end != null) {
      if (this.times == null) {
        const recurring = Recurring.parse({ start: this.#start, duration: this.duration })!
        this.#all = recurring.first(Infinity, (date: Dayjs): boolean => !date.isAfter(this.#end))
        this.times = this.#all.length - 1
      }
      this.end = undefined
      this.#end = undefined
    }
  }

  static parse (input: string | ParseOpts, { context, contextAsEnd }: { context?: Dayjs, contextAsEnd?: boolean } = {}): Recurring | undefined {
    if (input instanceof Recurring) return input
    if (typeof input === 'string') { // INPUT IS STRING
      const match = input.match(REGEX_SE)
      if (match?.groups == null) return
      const duration = Duration.parse(match.groups.duration_a || match.groups.duration_b) // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      if (duration == null) return
      return new Recurring(
        match.groups?.times ? +match.groups.times : undefined, // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        match.groups?.start || undefined, // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        match.groups?.end || undefined, // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        duration,
        context,
        contextAsEnd
      )
    } else { // INPUT IS OBJECT
      if (typeof input !== 'object' || input == null) return
      const duration = Duration.parse(input.duration)
      if (duration == null) return
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

  #all: readonly Dayjs[] | null | undefined
  all (): readonly Dayjs[] | null {
    if (this.times == null) return null // NO LIMITS
    if (this.#all === undefined) {
      const arr = [
        this.#firstOccurrenceInDirDirection,
        ...this.#getSuccessors(this.#firstOccurrenceInDirDirection, Infinity)
      ]
      if (this.dir === 'desc') arr.reverse()
      this.#all = arr
    }
    return this.#all
  }

  #first: Dayjs | null | undefined
  first (): Dayjs | null
  first (n: number, query?: Query): readonly Dayjs[]
  first (n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) { // () => Dayjs
      if (this.#first === undefined) {
        this.#first = this.dir === 'asc'
          ? this.#setRecurring(Recurring.dayjsFactory!(this.#start), { predecessors: [] })
          : this.all()?.[0] ?? null
      }
      return this.#first
    } else { // (n) => Dayjs[]
      if (n === 0) return []
      if (this.first() == null) return null
      if (!this.#validateQuery(this.first()!, query)) return null
      return [this.first()!, ...this.next(this.first()!, n - 1, query)]
    }
  }

  #last: Dayjs | null | undefined
  last (): Dayjs | null
  last (n: number, query?: Query): readonly Dayjs[] | null
  last (n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) { // () => Dayjs
      if (this.#last === undefined) {
        this.#last = this.dir === 'desc'
          ? this.#setRecurring(Recurring.dayjsFactory!(this.#end), { predecessors: [] })
          : this.all()?.[this.all()!.length - 1] ?? null
      }
      return this.#last
    } else { // (n) => Dayjs[]
      if (n === 0) return []
      if (this.last() == null) return null
      if (!this.#validateQuery(this.last()!, query)) return null
      return [...this.prev(this.last()!, n - 1, query), this.last()!]
    }
  }

  /**
   * @returns The occurrence or the `n` occurrences before `date` in the chronological direction ordered from the oldest to the newest.
   *
   * @example
   * Recurring.parse('R/2020-01-01/P1Y').prev(dayjs('2025-01-01')) // 2024-01-01
   * Recurring.parse('R/P1Y/2030-01-01').prev(dayjs('2025-01-01')) // 2024-01-01
   *
   * Recurring.parse('R/2020-01-01/P1Y').prev(dayjs('2025-01-01'), 2) // [2023-01-01, 2024-01-01]
   * Recurring.parse('R/P1Y/2030-01-01').prev(dayjs('2025-01-01'), 2) // [2023-01-01, 2024-01-01]
   */
  prev (date: Dayjs): Dayjs | null
  prev (date: Dayjs, n: number, query?: Query): readonly Dayjs[]
  prev (date: Dayjs, n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) return this.prev(date, 1)[0] ?? null
    return [...(this.dir === 'asc' ? this.#getPredecessors(date, n, query) : this.#getSuccessors(date, n, query))].reverse()
  }

  /**
   * @returns The occurrence or the `n` occurrences after `date` in the chronological direction ordered from the oldest to the newest.
   *
   * @example
   * Recurring.parse('R/2020-01-01/P1Y').next(dayjs('2025-01-01')) // 2026-01-01
   * Recurring.parse('R/P1Y/2030-01-01').next(dayjs('2025-01-01')) // 2026-01-01
   *
   * Recurring.parse('R/2020-01-01/P1Y').next(dayjs('2025-01-01'), 2) // [2026-01-01, 2027-01-01]
   * Recurring.parse('R/P1Y/2030-01-01').next(dayjs('2025-01-01'), 2) // [2026-01-01, 2027-01-01]
   */
  next (date: Dayjs): Dayjs | null
  next (date: Dayjs, n: number, query?: Query): readonly Dayjs[]
  next (date: Dayjs, n?: number, query?: Query): Dayjs | null | readonly Dayjs[] {
    if (n == null) return this.next(date, 1)[0] ?? null
    return this.dir === 'asc' ? this.#getSuccessors(date, n, query) : this.#getPredecessors(date, n, query)
  }

  /**
   * @returns The `n` occurrences succeeding `date` in the `dir` direction ordered from the closest to the furthest.
   *
   * @example
   * Recurring.parse('R/2020-01-01/P1Y').#getSuccessors(dayjs('2025-01-01'), 2) // [2026-01-01, 2027-01-01]
   * Recurring.parse('R/P1Y/2030-01-01').#getSuccessors(dayjs('2025-01-01'), 2) // [2024-01-01, 2023-01-01]
   */
  #getSuccessors (date: Dayjs, n: number, query?: Query): readonly Dayjs[] {
    this.#setPredecessors(date)
    let succ = date.$recurringPredecessors!.length === 0
      ? this.#firstOccurrenceInDirDirection
      : this.#getSuccessor(date.$recurringPredecessors![0])
    if (succ == null) return []
    if (succ.isSame(date)) succ = this.#getSuccessor(succ)
    const result: Dayjs[] = []
    for (let i = 0; i < n; i++) {
      if (succ == null) break
      if (!this.#validateQuery(succ, query)) break
      result.push(succ)
      succ = this.#getSuccessor(succ)
    }
    return result
  }

  /**
   * @returns The occurrence succeeding `date` in the `dir` direction.
   *
   * @example
   * Recurring.parse('R/2020-01-01/P1Y').#getSuccessor(dayjs('2025-01-01')) // 2026-01-01
   * Recurring.parse('R/P1Y/2030-01-01').#getSuccessor(dayjs('2025-01-01')) // 2024-01-01
   */
  #getSuccessor (date: Dayjs): Dayjs | undefined {
    this.#setPredecessors(date)
    if (this.times != null && date.$recurringPredecessors!.length >= this.times) return
    return this.#setRecurring(
      this.duration._addToDate(date, this.dir === 'asc' ? 1 : -1),
      { predecessors: [date, ...date.$recurringPredecessors!] }
    )
  }

  /**
   * @returns The `n` occurrences predecessing `date` in the `dir` direction ordered from the closest to the furthest.
   *
   * @example
   * Recurring.parse('R/2020-01-01/P1Y').#getPredecessors(dayjs('2025-01-01'), 2) // [2024-01-01, 2023-01-01]
   * Recurring.parse('R/P1Y/2030-01-01').#getPredecessors(dayjs('2025-01-01'), 2) // [2026-01-01, 2027-01-01]
   */
  #getPredecessors (date: Dayjs, n: number, query?: Query): readonly Dayjs[] {
    this.#setPredecessors(date)
    const arr = [...date.$recurringPredecessors!]
    const result: Dayjs[] = []
    for (let i = 0; i < n; i++) {
      if (!this.#validateQuery(arr[i], query)) break
      if (arr[i] == null) break
      result.push(arr[i])
    }
    return result
  }

  #setPredecessors (date: Dayjs): void {
    if (date.$recurringPredecessors != null) return
    if (!this.#firstOccurrenceInDirDirection[this.dir === 'asc' ? 'isBefore' : 'isAfter'](date)) {
      date.$recurringPredecessors = [] // date is before firstOccurrenceInDirDirection in the dir direction
    } else {
      date.$recurringPredecessors = [
        this.#firstOccurrenceInDirDirection,
        ...this.#getSuccessors(this.#firstOccurrenceInDirDirection, Infinity, { [this.dir === 'asc' ? 'isBefore' : 'isAfter']: date })
      ].reverse()
    }
  }

  #setRecurring (date: Dayjs, { predecessors }: { predecessors: Dayjs[] }): Dayjs {
    date.$recurring = this
    date.$recurringPredecessors = predecessors
    return date
  }

  #validateQuery (date: Dayjs, query: Query | undefined): boolean {
    if (query == null) return true
    if (query instanceof Function) return query(date)
    return Object.entries(query).every(([k, v]) => (date[k as keyof Dayjs] as any)(v))
  }

  get #firstOccurrenceInDirDirection (): Dayjs {
    return this.dir === 'asc' ? this.first()! : this.last()!
  }

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
}
