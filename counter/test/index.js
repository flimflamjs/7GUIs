const render = require('flimflam/render')
const test = require('tape')
const counter = require('../')

function initComponent() {
  var container = document.createElement('div')
  var state = counter.init()
  var streams = render(counter.view, state, container)
  streams.state = state
  return streams
}

test("should show 0 initially", t=> {
  var streams = initComponent()
  const count = parseInt(streams.dom$().querySelector('p').textContent)
  t.strictEqual(count, 0)
  t.end()
})
test("should show 1 when button clicked", t=> {
  var streams = initComponent()
  streams.dom$().querySelector("button").click()
  const count = parseInt(streams.dom$().querySelector('p').textContent)
  t.strictEqual(count, 1)
  t.end()
})
test("should show 11 when button clicked 11 times", t=> {
  var streams = initComponent()
  var btn = streams.dom$().querySelector('button')
  for(var i = 0; i < 11; ++i) btn.click()
  const count = parseInt(streams.dom$().querySelector('p').textContent)
  t.strictEqual(count, 11)
  t.end()
})
