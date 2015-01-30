var ndjson = require('ndjson')
var csv = require('csv-write-stream')
var sse = require('ssejson')
var json = require('./json.js')
var PassThrough = require('stream').PassThrough

module.exports = function (format, opts) {
  opts = opts || {}
  if(typeof format == 'object')  {
    opts = format
    format = format.format || 'json'
  }
  var pass = new PassThrough({objectMode: true})
  var formatter

  if(format === 'ndjson') formatter = ndjson.stringify(opts)
  else if(format === 'csv') formatter = csv(opts)
  else if(format === 'sse') {
    opts.event = 'event' in opts ? opts.event : 'data' // default to 'data' events
    formatter = sse.serialize(opts)
  }
  else formatter = json(opts)

  if(!formatter.destroy) {
    formatter.destroy = function (err) { if(err) this.emit('error', err) }
  }

  formatter.on('error', function (err) {
    formatter.push('\nError:\n' + err.message)
    formatter.end()
  })

  return formatter

}
