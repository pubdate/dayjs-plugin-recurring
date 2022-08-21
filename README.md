# dayjs-plugin-recurring

> ⚠️ This package has yet to be used in a real project. It may NOT be production-ready. <br/>
> If you experience any issues, [let us know](https://github.com/pubdate/dayjs-plugin-recurring/issues/new).

A [dayjs](https://day.js.org/) plugin to work with recurring dates.

## Getting Started

### NPM

```sh
npm i dayjs @pubdate/dayjs-plugin-recurring
```

```js
import dayjs from 'dayjs'
import recurring from '@pubdate/dayjs-plugin-recurring'

dayjs.extend(recurring)
```

### CDN

```html
<script src="https://unpkg.com/dayjs"></script>
<script src="https://unpkg.com/@pubdate/dayjs-plugin-recurring"></script>

<script>
  dayjs.extend(dayjs_plugin_recurring)
</script>
```

## Options

### order

#### chronological (default)

In chronological order:

- The first occurrence is always the oldest.
- The sequence continues from the oldest to the newest.
- Arrays of occurrences are always ordered from the oldest to the newest.

```js
dayjs.extend(recurring, { order: 'chronological' })
dayjs('R3/2020-01-01/P1Y').all() // [2020-01-01, 2021-01-01, 2022-01-01, 2023-01-01]
dayjs('R3/P1Y/2023-01-01').all() // [2020-01-01, 2021-01-01, 2022-01-01, 2023-01-01]
```

#### relative

In relative order:

- The first occurrence is `start` if provided, or `end` if provided, or `context` (the current dayjs instance).
- If `start` is provided or `end` is not, the sequence continues from the oldest to the newest. And from the newest to the oldest otherwise.
- Arrays of occurrences returned by `all()`/`first(n)` are ordered from the first (cf. first point) to the last.
- Arrays of occurrences returned by `last(n)` are ordered from the last to the first (cf. first point).
- Arrays of occurrences returned by `prev(n)`/`next(n)` are ordered from the closest of the current occurrence to the furthest.

```js
dayjs.extend(recurring, { order: 'relative' })
dayjs('R3/2020-01-01/P1Y').all() // [2020-01-01, 2021-01-01, 2022-01-01, 2023-01-01]
dayjs('R3/P1Y/2023-01-01').all() // [2023-01-01, 2022-01-01, 2021-01-01, 2020-01-01]
```

#### Comparison
<!-- markdownlint-disable-next-line MD040 -->
```
all/first         1 - 2 - 3 - 4 - 5
chronological     ---------------->   [1, 2, 3, 4, 5]
relative (start)  ---------------->   [1, 2, 3, 4, 5]
relative (end)    <----------------   [5, 4, 3, 2, 1]

last              1 - 2 - 3 - 4 - 5
chronological     ---------------->   [1, 2, 3, 4, 5]
relative (start)  <----------------   [5, 4, 3, 2, 1]
relative (end)    ---------------->   [1, 2, 3, 4, 5]

prev              1 - 2 - 3 - 4 - 5
chronological     -----> now          [1, 2]
relative (start)  <----- now          [2, 1]
relative (end)           now ----->   [4, 5]

next              1 - 2 - 3 - 4 - 5
chronological            now ----->   [4, 5]
relative (start)         now ----->   [4, 5]
relative (end)    <----- now          [2, 1]
```

## API

> 💡 Unless explicitly stated otherwise, all examples are in **chronological** order.

### Create a recurring dayjs instance

To create a recurring dayjs instance, simply pass an [ISO 8601 recurring time interval](https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals) string to the dayjs factory. <br/>
It will return the occurrence that matches `start` if provided, or `end` if provided, or now.

```js
dayjs('R10/2020-01-01/P1Y') // 2020-01-01
dayjs('R10/2020-01-01/P1Y').last() // 2030-01-01

dayjs('R10/P1Y/2030-01-01') // 2030-01-01
dayjs('R10/P1Y/2030-01-01').first() // 2020-01-01

dayjs('R10/P1Y') // dayjs()
dayjs('R10/P1Y').last() // dayjs().add(10, 'years')
```

To generate a recurring instance from a regular instance, call `recurring()` with a string or an object. <br/>
It will keep the date as current occurrence. And use it as start if the argument has no `start` and no `end`.

```js
dayjs('2025-01-01').recurring('R10/2020-01-01/P1Y') //  2025-01-01
dayjs('2025-01-01').recurring('R10/2020-01-01/P1Y').last() // 2030-01-01

dayjs('2025-01-01').recurring({ times: 10, start: '2020-01-01', duration: 'P1Y' }) //  2025-01-01
dayjs('2025-01-01').recurring({ times: 10, start: '2020-01-01', duration: 'P1Y' }).last() // 2030-01-01

dayjs('2025-01-01').recurring('R10/P1Y') // 2025-01-01
dayjs('2025-01-01').recurring('R10/P1Y').last() // 2035-01-01
```

Pass an object with `start` and `end` but no `times` to automatically compute `times`.

```js
dayjs('2025-01-01').recurring({ start: '2020-01-01', end: '2030-01-01', duration: 'P1Y' }) // times: 10
dayjs('2025-01-01').recurring({ start: '2020-01-01', duration: 'P1Y' }) // times: undefined
```

### `recurring()`

Returns the recurring config.

```js
dayjs('R10/2020-01-01/P1Y').recurring().toString({ dateFormat: 'YYYY-MM-DD' }) // 'R10/2020-01-01/P1Y'
```

### `all()`

Returns all occurrences. <br/>
Or `null` when there is no limit.

```js
dayjs('R3/2020-01-01/P1Y').all() // [2020-01-01, 2021-01-01, 2022-01-01, 2023-01-01]
dayjs('R/2020-01-01/P1Y').all() // null
```

### `allBetween(a, b, unit = 'milliseconds', inclusion = '()')`

Returns all occurrences between `a` and `b`. <br/>
If you want to limit the granularity to a [unit other than milliseconds](https://day.js.org/docs/en/manipulate/start-of#list-of-all-available-units), pass it as the second parameter. <br/>
The fourth parameter is about inclusivity. A `[` indicates inclusion of a value. A `(` indicates exclusion.

```js
dayjs('R/2020-01-01/P1Y').allBetween('2022-01-01', '2025-01-01') // [2023-01-01, 2024-01-01]
dayjs('R/2020-01-01/P1Y', undefined, '(]').allBetween('2022-01-01', '2025-01-01') // [2023-01-01, 2024-01-01, 2025-01-01]
dayjs('R/2020-01-10/P1Y', 'month', '(]').allBetween('2022-01-01', '2025-01-01') // [2023-01-10, 2024-01-10, 2025-01-10]
```

### `first()`

Returns the first occurrence. <br/>
Or `null`, in **chronological** order, when there is no `start` and no limit.

```js
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first() // 2020-01-01
dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').first() // null
dayjs('2025-01-01').recurring('R10/P1Y/2030-01-01').first() // 2020-01-01
```

### `first(n, query)`

Returns the first `n` occurrences that match [`query`](#query). <br/>
Or `null`, in **chronological** order, when there is no `start` and no limit.

```js
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first(3) // [2020-01-01, 2021-01-01, 2022-01-01]
dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').first(3) // null
dayjs('2025-01-01').recurring('R10/P1Y/2030-01-01').first(3) // [2020-01-01, 2021-01-01, 2022-01-01]

dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').first(3, { isBefore: '2022-01-01' }) // [2020-01-01, 2021-01-01]
```

### `last()`

Returns the first occurrence. <br/>
Or `null`, in **chronological** order, when there is no `start` and no limit. <br/>
Or `null`, in **relative** order, when there is no limit.

```js
dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').last() // 2030-01-01
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').last() // null
dayjs('2025-01-01').recurring('R10/2020-01-01/P1Y').last() // 2030-01-01
```

### `last(n, query)`

Returns the last `n` occurrences that match [`query`](#query). <br/>
Or `null`, in **chronological** order, when there is no `end` and no limit. <br/>
Or `null`, in **relative** order, when there is no limit.

```js
dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').last(3) // [2028-01-01, 2029-01-01, 2030-01-01]
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').last(3) // null
dayjs('2025-01-01').recurring('R10/2020-01-01/P1Y').last(3) // [2028-01-01, 2029-01-01, 2030-01-01]

dayjs('2025-01-01').recurring('R/P1Y/2030-01-01').last(3, { isAfter: '2028-01-01' }) // [2029-01-01, 2030-01-01]
```

### `prev()`

Returns the previous occurrence. <br/>
Or `null` when the current occurrence is the first one.

```js
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').prev() // 2024-01-01
dayjs('2020-01-01').recurring('R/2020-01-01/P1Y').prev() // null
```

### `prev(n, query)`

Returns the `n` previous occurrences that match [`query`](#query).

```js
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').prev(2) // [2023-01-01, 2024-01-01]
dayjs('2021-01-01').recurring('R/2020-01-01/P1Y').prev(2) // [2020-01-01]

dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').prev(Infinity, { isAfter: '2021-01-01' }) // [2022-01-01, 2023-01-01, 2024-01-01]
```

### `next()`

Returns the next occurrence. <br/>
Or `null` when the current occurrence is the last one.

```js
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next() // 2026-01-01
dayjs('2030-01-01').recurring('R10/2020-01-01/P1Y').next() // null
```

### `next(n, query)`

Returns the `n` previous occurrences that match [`query`](#query).

```js
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next(2) // [2026-01-01, 2027-01-01]
dayjs('2029-01-01').recurring('R10/2020-01-01/P1Y').next(2) // [2030-01-01-01]
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next(Infinity, { isBefore: '2029-01-01' }) // [2026-01-01, 2027-01-01, 2028-01-01]
```

### Query

Some methods accept a query. These methods will stop the moment a date does not match the query. <br/>
The query can be an object of which the keys are the name of dayjs comparison methods and the values are either a date or the arguments of said methods. <br/>
It can also be a function that takes a date and returns a boolean. <br/>

```js
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next(Infinity, { isBefore: '2029-01-01' }) // [2026-01-01, 2027-01-01, 2028-01-01]
dayjs('2025-01-10').recurring('R/2020-01-10/P1Y').next(Infinity, { isBefore: ['2029-01-01', 'year'] }) // [2026-01-10, 2027-01-10, 2028-01-10]
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next(Infinity, date => date.isBefore('2029-01-01')) // [2026-01-01, 2027-01-01, 2028-01-01]
```

The example below returns an empty array because, even though `2027-01-01` and `2028-01-01` match the query, `2026-01-01` does not.

```js
dayjs('2025-01-01').recurring('R/2020-01-01/P1Y').next(Infinity, { isAfter: '2026-01-01', isBefore: '2029-01-01' }) // []
```
