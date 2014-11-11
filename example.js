var formatData = require('./')

var streams = [
  formatData('ndjson'),
  formatData('csv'),
  formatData('sse'),
  formatData('json'),
  formatData({format: 'json', style: 'object'}),
  formatData('json', {style: 'newline'}),
  formatData({style: 'sse'}),
  formatData()
]

function testStreams() {
  if (streams.length === 0) return
  console.log('\n')
  var stream = streams.shift()
  stream.pipe(process.stdout)
  stream.write({a: 1, b:2})
  stream.write({a: 'hello', b:'world'})
  stream.on('end', testStreams)
  stream.end()
}

testStreams()