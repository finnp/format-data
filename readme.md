
Module for formatting tabular data from object streams in different standard ways.
Supporting `csv`, `ndjson`, `json` and `sse`.

## Usage

```js
formatData(format, [opts])
```
The `opts` object will be passed to the underlying serializing module (see below).


or just pass an options object with `format` as a key. The format key will be deletec
before passing it to the underlying module.

```js
formatData(opts)
```

## format

Formats and the used modules:

* `'csv'`  - `require('csv-write-stream')(opts)`
* `'ndjson'` - `require('ndjson').stringify(opts)`
* `json` - `new require('sleep-ref').SLEEPStream()`
* `sse` - `require('ssejson').serialize(opts)`


## Options



### format

Format that maps directly to a mime type


