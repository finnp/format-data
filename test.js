var test = require('tape')

var formatData = require('./')
var concat = require('concat-stream')

test('formats', function (t) {
  var tStream = testStream.bind(this, t)
  t.plan(7)
  
  tStream(formatData('ndjson'), '{"a":1,"b":2}\n{"a":"hello","b":"world"}\n')
  
  tStream(formatData('csv'), 'a,b\n1,2\nhello,world\n')
  
  tStream(formatData('sse'), 'event: data\ndata: {"a":1,"b":2}\n\nevent: data\ndata: {"a":"hello","b":"world"}\n\n')
  
  tStream(formatData('json'), '{"rows":[{"a":1,"b":2},{"a":"hello","b":"world"}]}')
  
  tStream(formatData({format: 'json', style: 'array'}), '[{"a":1,"b":2},{"a":"hello","b":"world"}]')
  
  tStream(formatData({format: 'json', style: 'object'}), '{"rows":[{"a":1,"b":2},{"a":"hello","b":"world"}]}')
  
  tStream(formatData({style: 'sse'}), 'event: data\ndata: {"a":1,"b":2}\n\nevent: data\ndata: {"a":"hello","b":"world"}\n\n')

})

test('errors', function(t) {
  var tStream = errorStream.bind(this, t)
  t.plan(1)
  tStream(formatData('json'), '{"rows":[{"a":1,"b":2},{"error":"Oh no!"}]}')
})

function testStream(t, stream, expect) {
  stream.pipe(concat(function (result) {
    t.equals(result, expect)
  }))
  stream.write({a: 1, b:2})
  stream.write({a: 'hello', b:'world'})
  stream.end()
}

function errorStream(t, stream, expect) {
  stream.pipe(concat(function (result) {
    t.equals(result, expect)
  }))
  stream.write({a: 1, b:2})
  stream.destroy(new Error('Oh no!'))
}

