import type { Dayjs, PluginFunc } from 'dayjs'
import type { Query } from './recurring'

import Recurring from './recurring'

const plugin: PluginFunc = (_option, dayjsClass, dayjsFactory) => {
  Recurring.dayjsFactory = dayjsFactory

  const oldParse = dayjsClass.prototype.parse
  dayjsClass.prototype.parse = function (cfg: Record<string, any>) {
    this.$recurring = typeof cfg.date === 'string' ? Recurring.parse(cfg.date, { context: this }) : undefined
    if (this.$recurring != null) cfg.date = this.$recurring.start ?? this.$recurring.end
    return oldParse.bind(this)(cfg)
  }

  dayjsClass.prototype.all = function () { return this.$recurring!.all() }

  dayjsClass.prototype.first = function (n, query) {
    return this.$recurring!.first(n, query)
  } as { (this: Dayjs): Dayjs | null, (this: Dayjs, n: number, query?: Query): readonly Dayjs[] | null }

  dayjsClass.prototype.last = function (n, query) {
    return this.$recurring!.last(n, query)
  } as { (this: Dayjs): Dayjs | null, (this: Dayjs, n: number, query?: Query): readonly Dayjs[] | null }

  dayjsClass.prototype.prev = function (n, query) {
    return this.$recurring!.prev(this, n, query)
  } as { (this: Dayjs): Dayjs | null, (this: Dayjs, n: number, query?: Query): readonly Dayjs[] }

  dayjsClass.prototype.next = function (n, query) {
    return this.$recurring!.next(this, n, query)
  } as { (this: Dayjs): Dayjs | null, (this: Dayjs, n: number, query?: Query): readonly Dayjs[] }

  dayjsClass.prototype.recurring = function (input, { contextAsEnd }: { contextAsEnd?: boolean } = {}) {
    if (input === undefined) { // (): Recurring
      return this.$recurring
    } else { // (recurring): Dayjs
      const clone = this.clone()
      clone.$recurring = Recurring.parse(input, { context: this, contextAsEnd: contextAsEnd ?? false })
      if (clone.$recurring == null) return
      return clone
    }
  } as { (this: Dayjs): Recurring | undefined, (this: Dayjs, input?: Parameters<(typeof Recurring)['parse']>[0], opts?: { contextAsEnd?: boolean }): Dayjs | undefined }
}

export default plugin
