/* eslint-disable @typescript-eslint/method-signature-style */

import type { PluginFunc } from 'dayjs'
import type Recurring from '../src/recurring'
import type { Query } from '../src/recurring'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    /**
     * @returns All occurrences for the provided `recurring`. Or `null` when there is no limit.
     *
     * @example
     * dayjs('R3/2020-01-01/P1Y').all() // [2020-01-01, 2021-01-01, 2022-01-01, 2023-01-01]
     * dayjs('R/2020-01-01/P1Y').all() // null
     */
    all: () => readonly Dayjs[] | null
    /**
     * @returns First chronological occurrence. Or `null` when the provided `recurring` does not have a `start` and there is no limit.
     *
     * @example
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first() // 2020-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').first() // null
     */
    first(): Dayjs | null
    /**
     * @returns First `n` chronological occurrences. Or `null` when the provided `recurring` does not have a `start` and there is no limit.
     *
     * @example
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first(3) // [2020-01-01, 2021-01-01, 2022-01-01]
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').first(3) // null
     */
    first(n: number, query?: PQuery): readonly Dayjs[] | null
    /**
     * @returns Last chronological occurrence. Or `null` when the provided `recurring` does not have a `end` and there is no limit.
     *
     * @example
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first() // 2020-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').first() // null
     */
    last(): Dayjs | null
    /**
     * @returns Last `n` chronological occurrences.
     *
     * @example
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').last() // 2030-01-01
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').last() // null
     */
    last(n: number, query?: Query): readonly Dayjs[] | null
    /**
     * @returns Previous chronological occurrence. Or `null` when the the current occurrence is the first one.
     *
     * @example
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').last(3) // [2028-01-01, 2029-01-01, 2030-01-01]
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').last(3) // null
     */
    prev(): Dayjs | null
    /**
     * @returns Previous chronological occurrences within limits sorted chronologically.
     *
     * @example
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').prev(2) // [2023-01-01, 2024-01-01]
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').prev(2) // [2023-01-01, 2024-01-01]
     *
     * dayjs('2021-01-01').recurring('R/2020-01-01/P1Y').prev(2) // [2020-01-01]
     * dayjs('2021-01-01').recurring('R10/P1Y/2030-01-01').prev(2) // [2020-01-01]
     *
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').prev(Infinity, { isAfter: '2021-01-01' }) // [2022-01-01, 2023-01-01, 2024-01-01]
     */
    prev(n: number, query?: Query): readonly Dayjs[]
    /**
     * @returns Next chronological occurrence. Or `null` when the the current occurrence is the last one.
     *
     * @example
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next() // 2026-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').next() // 2026-01-01
     *
     * dayjs('2030-01-01').recurring('R10/2020-01-01/P1Y').next() // null
     * dayjs('2030-01-01').recurring('R/P1Y/2030-01-01').next() // null
     */
    next(): Dayjs | null
    /**
     * @returns Next chronological occurrences within limits sorted chronologically.
     *
     * @example
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next(2) // [2026-01-01, 2027-01-01]
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').next(2) // [2026-01-01, 2027-01-01]
     *
     * dayjs('2029-01-01').recurring('R10/2020-01-01/P1Y').next(2) // [2030-01-01-01]
     * dayjs('2029-01-01').recurring('R/P1Y/2030-01-01').next(2) // [2030-01-01-01]
     *
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next(Infinity, { isBefore: '2029-01-01' }) // [2026-01-01, 2027-01-01, 2028-01-01]
     */
    next(n: number, query?: Parameters): readonly Dayjs[]
    /**
     * @returns The recurring instance.
     *
     * @example
     * dayjs('2025-01-01')
     *  .recurring({ start: '2020-01-01', end: '2030-01-01', duration: { years: 1} })
     *  .recurring().toString({ dateFormat: 'YYYY-MM-DD' }) // 'R10/2020-01-01/P1Y'
     */
    recurring(): Recurring | undefined
    /**
     * @returns A new dayjs instance with the provided recurring.
     * If the recurring has no start and no end, the dayjs instance will be used as start (or as end if `contextAsEnd` option is set to true).
     *
     * @example
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y') // 2025-01-01
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first() // 2020-01-01
     *
     * dayjs('2025-01-01').recurring('R/P1Y').first() // 2025-01-01
     * dayjs('2025-01-01').recurring('R/P1Y', { contextAsEnd: true }).last() // 2025-01-01
     *
     * dayjs('2025-06-15').recurring('R/2020-01-01/P1Y') // 2025-06-15
     * dayjs('2025-06-15').recurring('R/2020-01-01/P1Y').next() // 2026-01-01
     * dayjs('2025-06-15').recurring('R/2020-01-01/P1Y').prev() // 2025-01-01
     */
    recurring(input?: string | Recurring, opts?: { contextAsEnd?: boolean }): Dayjs | undefined
  }
}
