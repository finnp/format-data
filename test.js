var test = require('tape')

var formatData = require('./')
var concat = require('concat-stream')
var EOL = require('os').EOL

test('formats', function (t) {
  var tStream = testStream.bind(this, t)
  t.plan(9)

  tStream(formatData('ndjson'), '{"a":1,"b":2}' + EOL + '{"a":"hello","b":"world"}' + EOL)

  tStream(formatData('csv'), 'a,b\n1,2\nhello,world\n')

  tStream(formatData({format: 'csv', separator: '\t'}), 'a\tb\n1\t2\nhello\tworld\n')

  tStream(formatData('sse'), 'event: data\ndata: {"a":1,"b":2}\n\nevent: data\ndata: {"a":"hello","b":"world"}\n\n')

  tStream(formatData('json'), '{"rows":[{"a":1,"b":2},{"a":"hello","b":"world"}]}')

  tStream(formatData({format: 'json', style: 'array'}), '[{"a":1,"b":2},{"a":"hello","b":"world"}]')

  tStream(formatData({format: 'json', style: 'object'}), '{"rows":[{"a":1,"b":2},{"a":"hello","b":"world"}]}')

  tStream(formatData({format: 'json', style: 'object', suffix: ',"next": "/hello/mars"}'}), '{"rows":[{"a":1,"b":2},{"a":"hello","b":"world"}],"next": "/hello/mars"}')

  tStream(formatData({style: 'sse'}), 'event: data\ndata: {"a":1,"b":2}\n\nevent: data\ndata: {"a":"hello","b":"world"}\n\n')

})

test('errors', function (t) {
  var eStream = errorStream.bind(this, t)
  t.plan(8)

  eStream(true, formatData('json'), '{"rows":[{"a":1,"b":2}],"error":"Oh no!"}')

  eStream(true, formatData({format: 'json', style: 'array'}), '[{"a":1,"b":2}]\n{"error":"Oh no!"}')

  eStream(false, formatData('json'), '{"rows":[],"error":"Oh no!"}')

  eStream(false, formatData({format: 'json', suffix: ',"next": "/hello/mars"}'}), '{"rows":[],"error":"Oh no!","next": "/hello/mars"}')

  eStream(false, formatData({format: 'json', style: 'array'}), '[]\n{"error":"Oh no!"}')

  eStream(true, formatData('sse'), 'event: data\ndata: {"a":1,"b":2}\n\nevent: error\ndata: {"message":"Oh no!"}\n\n')

  eStream(true, formatData('ndjson'), '{"a":1,"b":2}' + EOL + '\nError:\nOh no!')

  eStream(true, formatData('csv'), 'a,b\n1,2\n\nError:\nOh no!')
})

function testStream(t, stream, expect) {
  stream.pipe(concat(function (result) {
    t.equals(result, expect)
  }))
  stream.write({a: 1, b:2})
  stream.write({a: 'hello', b:'world'})
  stream.end()
}

function errorStream(t, data, stream, expect) {
  stream.pipe(concat(function (result) {
    t.equals(result, expect)
  }))
  if(data) stream.write({a: 1, b:2})
  stream.destroy(new Error('Oh no!'))
}
