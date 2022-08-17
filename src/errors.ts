export class DayjsPluginRecurringError extends Error {
  get package (): '@pubdate/dayjs-plugin-recurring' { return '@pubdate/dayjs-plugin-recurring' }
  constructor (
    public code: string,
    public solution?: string
  ) {
    let message = `[@pubdate/dayjs-plugin-recurring] ${code}`
    if (solution != null) message = `${message} (${solution})`
    super(message)
  }
}
