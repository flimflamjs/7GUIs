const render = require('flimflam/render')
const test = require('tape')
const cells = require('../')

function initComponent() {
  var container = document.createElement('div')
  var state = cells.init()
  var streams = render(cells.view, state, container)
  streams.state = state
  return streams
}

test('', t=> {
  t.end()
})
