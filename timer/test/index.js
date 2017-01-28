const render = require('flimflam/render')
const test = require('tape')
const timer = require('../')

function initComponent() {
  var container = document.createElement('div')
  var state = timer.init()
  var streams = render(timer.view, state, container)
  streams.state = state
  return streams
}

test("clicking 'start' changes button text to 'reset'", t=> {
  var streams = initComponent()
  var btn = streams.dom$().querySelector('button')
  btn.click()
  t.equal(btn.textContent, 'Reset')
  t.end()
})

test("click 'start' initializes the timer to start counting", t => {
  var streams = initComponent()
  var p = streams.dom$().querySelector('.secondsElapsed')
  var btn = streams.dom$().querySelector('button')
  btn.click()
  t.ok(Number(p.textContent.replace('s', '')) > 0)
  t.end()
})

test("the progress fills based on time elapsed", t => {
  var streams = initComponent()
  var btn = streams.dom$().querySelector('button')
  var bar = streams.dom$().querySelector(".gauge-fill")
  btn.click()
  setTimeout(() => {
    const width = Number(bar.style.width.replace('%', ''))
    t.ok(width >= 10 && width < 15)
    t.end()
  }, 1000)
})

test("changing the duration during timing changes the percentage fill", t => {
  var streams = initComponent()
  var btn = streams.dom$().querySelector('button')
  var bar = streams.dom$().querySelector(".gauge-fill")
  var input = streams.dom$().querySelector('input[type=range]')
  btn.click()
  setTimeout(() => {
    input.value = 3
    var ev = new Event('input')
    input.dispatchEvent(ev)
    const width2 = Number(bar.style.width.replace('%', ''))
    t.ok(width2 >= 30 && width2 < 35)
    t.end()
  }, 1000)
})

