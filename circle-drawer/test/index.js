const render = require('flimflam/render')
const test = require('tape')
const circles = require('../')

function initComponent() {
  var container = document.createElement('div')
  var state = circles.init()
  var streams = render(circles.view, state, container)
  streams.state = state
  return streams
}

test('the radius adjuster does not show when no circles have been created', t=> {
  var streams = initComponent()
  t.ok(streams.dom$().querySelector('.radiusDialog').className.match('is-hidden'))
  t.end()
})

test('clicking on the blank svg background creates a circle', t=> {
  var streams = initComponent()
  var click = new Event('click')
  var svg = streams.dom$().querySelector('svg')
  svg.dispatchEvent(click)
  console.log(streams.state.circles$().current.length === 1)
  t.end()
})

test('clicking on a circle over the svg background does not create a circle', t=> {
  var streams = initComponent()
  var click = new Event('click')
  var svg = streams.dom$().querySelector('svg')
  svg.dispatchEvent(click)
  console.log(streams.state.circles$().current.length === 1)
  t.end()
})

test('clicking on a circle sets it to the currently selected slot', t=> {
  t.end()
})

test('clicking on a circle shows the radius adjuster', t=> {
  t.end()
})

test('changing the radius of a selected circle changes the r attr of the circle with a matching ID', t=> {
  t.end()
})

test('the undo button is disabled when no actions have been made on the circles array', t=> {
  t.end()
})

test('the redo button is disabled when undo has not been clicked', t=> {
  t.end()
})

test('the redo button is enabled when the undo has been clicked', t=> {
  t.end()
})

test('the undo button is enabled after the first action is made', t=> {
  t.end()
})

test('the redo button is disabled when undo is clicked and then an action is made', t=> {
  t.end()
})
