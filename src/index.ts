import type { Dayjs, PluginFunc } from 'dayjs'
import type { Query } from './recurring'

import Recurring from './recurring'

const plugin: PluginFunc<{ order?: 'relative' | 'chronological' } | undefined> = (option, dayjsClass, dayjsFactory) => {
  Recurring.dayjsFactory = dayjsFactory
  const order = option?.order ?? 'chronological'

  const oldParse = dayjsClass.prototype.parse
  dayjsClass.prototype.parse = function (cfg: Record<string, any>) {
    try {
      this.$recurring = typeof cfg.date === 'string' ? Recurring.parse(cfg.date, { context: this }) : undefined
    } catch {}
    if (this.$recurring != null) cfg.date = this.$recurring.start ?? this.$recurring.end
    return oldParse.bind(this)(cfg)
  }

  dayjsClass.prototype.all = function () {
    return this.$recurring![`${order}All`]()
  }

  dayjsClass.prototype.first = function (n, query) {
    return this.$recurring![`${order}First`](n, query)
  } as { (this: Dayjs): Dayjs | null, (this: Dayjs, n: number, query?: Query): readonly Dayjs[] | null }

  dayjsClass.prototype.last = function (n, query) {
    return this.$recurring![`${order}Last`](n, query)
  } as { (this: Dayjs): Dayjs | null, (this: Dayjs, n: number, query?: Query): readonly Dayjs[] | null }

  dayjsClass.prototype.prev = function (n, query) {
    return this.$recurring![`${order}Prev`](this, n, query)
  } as { (this: Dayjs): Dayjs | null, (this: Dayjs, n: number, query?: Query): readonly Dayjs[] }

  dayjsClass.prototype.next = function (n, query) {
    return this.$recurring![`${order}Next`](this, n, query)
  } as { (this: Dayjs): Dayjs | null, (this: Dayjs, n: number, query?: Query): readonly Dayjs[] }

  dayjsClass.prototype.recurring = function (input, { contextAsEnd }: { contextAsEnd?: boolean } = {}) {
    if (input === undefined) { // (): Recurring
      return this.$recurring
    } else { // (recurring): Dayjs
      const clone = this.clone()
      clone.$recurring = Recurring.parse(input, { context: this, contextAsEnd: contextAsEnd ?? false })
      return clone
    }
  } as { (this: Dayjs): Recurring | undefined, (this: Dayjs, input?: Parameters<(typeof Recurring)['parse']>[0], opts?: { contextAsEnd?: boolean }): Dayjs }
}

export default plugin
