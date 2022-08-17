/* eslint-disable @typescript-eslint/method-signature-style */

import type { PluginFunc } from 'dayjs'
import type Recurring from '../src/recurring'
import type { Query } from '../src/recurring'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    /**
     * @returns All occurrences. Or `null` when there is no limit.
     *
     * @example
     * // relative
     * dayjs('R3/2020-01-01/P1Y').all() // [2020-01-01, 2021-01-01, 2022-01-01, 2023-01-01]
     * dayjs('R3/P1Y/2030-01-01').all() // [2030-01-01, 2029-01-01, 2028-01-01, 2027-01-01]
     * dayjs('R/2020-01-01/P1Y').all() // null
     *
     * // chronological
     * dayjs('R3/2020-01-01/P1Y').all() // [2020-01-01, 2021-01-01, 2022-01-01, 2023-01-01]
     * dayjs('R3/P1Y/2030-01-01').all() // [2027-01-01, 2028-01-01, 2029-01-01, 2030-01-01]
     * dayjs('R/2020-01-01/P1Y').all() // null
     */
    all: () => readonly Dayjs[] | null
    /**
     * @returns
     * - First occurrence.
     * - [chronological]: Or `null` when there is no `start` and no limit.
     *
     * @example
     * // relative
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first() // 2020-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').first() // 2030-01-01
     *
     * // chronological
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first() // 2020-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').first() // null
     * dayjs('2025-01-01').recurring('R10/P1Y/2030-01-01').first() // 2020-01-01
     */
    first(): Dayjs | null
    /**
     * @returns
     * - First `n` occurrences.
     * - [chronological]: Or `null` when there is no `start` and no limit.
     *
     * @example
     * // relative
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first(3) // [2020-01-01, 2021-01-01, 2022-01-01]
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').first(3) // [2030-01-01, 2029-01-01, 2028-01-01]
     *
     * // chronological
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first(3) // [2020-01-01, 2021-01-01, 2022-01-01]
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').first(3) // null
     * dayjs('2025-01-01').recurring('R10/P1Y/2030-01-01').first(3) // [2020-01-01, 2021-01-01, 2022-01-01]
     */
    first(n: number, query?: PQuery): readonly Dayjs[] | null
    /**
     * @returns
     * - Last occurrence.
     * - [relative]: Or `null` when there is no limit.
     * - [chronological]: Or `null` when there is no `end` and no limit.
     *
     * @example
     * // relative
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').last() // null
     * dayjs('2025-01-01').recurring('R10/2020-01-01/P1Y').last() // 2030-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').last() // null
     * dayjs('2025-01-01').recurring('R10/P1Y/2030-01-01').last() // 2020-01-01
     *
     * // chronological
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').last() // null
     * dayjs('2025-01-01').recurring('R10/2020-01-01/P1Y').last() // 2030-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').last() // 2030-01-01
     */
    last(): Dayjs | null
    /**
     * @returns
     * - Last `n` occurrences.
     * - [relative]: Or null when there is no limit.
     * - [chronological]: Or `null` when there is no `end` and no limit.
     *
     * @example
     * // relative
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').last(3) // null
     * dayjs('2025-01-01').recurring('R10/2020-01-01/P1Y').last(3) // [2030-01-01, 2029-01-01, 2028-01-01]
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').last(3) // null
     * dayjs('2025-01-01').recurring('R10/P1Y/2030-01-01').last(3) // [2020-01-01, 2021-01-01, 2022-01-01]
     *
     * // chronological
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').last(3) // null
     * dayjs('2025-01-01').recurring('R10/2020-01-01/P1Y').last(3) // [2028-01-01, 2029-01-01, 2030-01-01]
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').last(3) // [2028-01-01, 2029-01-01, 2030-01-01]
     */
    last(n: number, query?: Query): readonly Dayjs[] | null
    /**
     * @returns
     * - Previous occurrence. Or `null` when the the current occurrence is the first one.
     *
     * @example
     * // relative
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').prev() // 2024-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').prev() // 2026-01-01
     *
     * dayjs('2020-01-01').recurring('R/2020-01-01/P1Y').prev() // null
     * dayjs('2030-01-01').recurring('R/P1Y/2030-01-01').prev() // null
     *
     * // chronological
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').prev() // 2024-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').prev() // 2024-01-01
     *
     * dayjs('2020-01-01').recurring('R/2020-01-01/P1Y').prev() // null
     * dayjs('2020-01-01').recurring('R10/P1Y/2030-01-01').prev() // null
     */
    prev(): Dayjs | null
    /**
     * @returns Previous `n` occurrences.
     *
     * @example
     * // relative
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').prev(2) // [2024-01-01, 2023-01-01]
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').prev(2) // [2026-01-01, 2027-01-01]
     *
     * dayjs('2021-01-01').recurring('R/2020-01-01/P1Y').prev(2) // [2020-01-01]
     * dayjs('2029-01-01').recurring('R/P1Y/2030-01-01').prev(2) // [2030-01-01]
     *
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').prev(Infinity, { isAfter: '2021-01-01' }) // [2024-01-01, 2023-01-01, 2022-01-01]
     *
     * // chronological
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').prev(2) // [2023-01-01, 2024-01-01]
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').prev(2) // [2023-01-01, 2024-01-01]
     *
     * dayjs('2021-01-01').recurring('R/2020-01-01/P1Y').prev(2) // [2020-01-01]
     * dayjs('2021-01-01').recurring('R10/P1Y/2030-01-01').prev(2) // [2020-01-01]
     *
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').prev(Infinity, { isAfter: '2021-01-01' }) // [2022-01-01, 2023-01-01, 2024-01-01]
     */
    prev(n: number, query?: Query): readonly Dayjs[]
    /**
     * @returns
     * - Next occurrence. Or `null` when the the current occurrence is the last one.
     *
     * @example
     * // relative
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next() // 2026-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').next() // 2024-01-01
     *
     * dayjs('2030-01-01').recurring('R10/2020-01-01/P1Y').next() // null
     * dayjs('2020-01-01').recurring('R10/P1Y/2030-01-01').next() // null
     *
     * // chronological
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next() // 2026-01-01
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').next() // 2026-01-01
     *
     * dayjs('2030-01-01').recurring('R10/2020-01-01/P1Y').next() // null
     * dayjs('2030-01-01').recurring('R/P1Y/2030-01-01').next() // null
     */x
    next(): Dayjs | null
    /**
     * @returns Next `n` occurrences.
     *
     * @example
     * // relative
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next(2) // [2026-01-01, 2027-01-01]
     * dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').next(2) // [2024-01-01, 2023-01-01]
     *
     * dayjs('2029-01-01').recurring('R10/2020-01-01/P1Y').next(2) // [2030-01-01-01]
     * dayjs('2021-01-01').recurring('R10/P1Y/2030-01-01').next(2) // [2020-01-01-01]
     *
     * dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next(Infinity, { isBefore: '2029-01-01' }) // [2026-01-01, 2027-01-01, 2028-01-01]
     *
     * // chronological
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
     * dayjs('2025-01-01').recurring('R/P1Y').chronologicalFirst() // 2025-01-01
     * dayjs('2025-01-01').recurring('R/P1Y', { contextAsEnd: true }).chronologicalLast() // 2025-01-01
     *
     * dayjs('2025-06-15').recurring('R/2020-01-01/P1Y') // 2025-06-15
     * dayjs('2025-06-15').recurring('R/2020-01-01/P1Y').next() // 2026-01-01
     * dayjs('2025-06-15').recurring('R/2020-01-01/P1Y').prev() // 2025-01-01
     */
    recurring(input?: string | Recurring, opts?: { contextAsEnd?: boolean }): Dayjs | undefined
  }
}
