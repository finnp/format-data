# format-data
Windows | Mac/Linux
------- | ---------
[![Windows Build status](http://img.shields.io/appveyor/ci/finnp/format-data.svg)](https://ci.appveyor.com/project/finnp/format-data/branch/master) | [![Build Status](https://travis-ci.org/finnp/format-data.svg?branch=master)](https://travis-ci.org/finnp/format-data)

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

## full control of prefix, separator, suffix

You can pass a custom prefix, separator, or suffix to the stream builder for csv and json cases.

Examples:

```js
## default separator for csv is ','
> formatData('csv')
'a,b\n1,2\nhello,world\n'

## change separator to a tab
> formatData({format: 'csv', separator: '\t'})
'a\tb\n1\t2\nhello\tworld\n'

## default object style finishes with }]
> formatData({
  format: 'json',
  style: 'object'
})
{"rows":[{"a":1,"b":2},{"a":"hello","b":"world"}]}

## custom suffix
> formatData({
  format: 'json',
  style: 'object',
  suffix: ', "next": "/api/rows?page=2"}'
})
{"rows":[{"a":1,"b":2},{"a":"hello","b":"world"}], "next": "/api/rows?page=2"}

## suffix still added in cases of error
> formatData({
  format: 'json',
  style: 'object',
  suffix: ', "next": "/api/rows?page=2"}'
})
{"rows":[], "error":"Oh no!", "next": "/api/rows?page=2"}

```



## format

Formats and the used modules:

* `'csv'`  - `require('csv-write-stream')(opts)`
* `'ndjson'` - `require('ndjson').stringify(opts)`
* `json` - `new require('./json.js')(opts)`
* `sse` - `require('ssejson').serialize(opts)`
