
Module for formatting tabular data from object streams in different standard ways.
Supporting `csv`, `ndjson`, `json` and `sse`. Install with `npm install format-data`.

## Usage

```js
formatData(format, [opts])
```
The `opts` object will be passed to the underlying serializing module (see below).


or just pass an options object with `format` as a key.

```js
formatData(opts)
```

## format

Formats and the used modules:

* `'csv'`  - `require('csv-write-stream')(opts)`
* `'ndjson'` - `require('ndjson').stringify(opts)`
* `json` - `new require('./json.js')(opts)`
* `sse` - `require('ssejson').serialize(opts)`
