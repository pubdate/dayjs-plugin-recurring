import type Recurring from '../src/recurring'

declare module 'dayjs' {
  interface Dayjs {
    parse: (cfg: Record<string, any>) => unknown
    $recurring?: Recurring
    $recurringRelativeHistory?: readonly Dayjs[]
  }
}
