const render = require('flimflam/render')
const test = require('tape')
const booker = require('../')

const d1 = '22.12.2015'
const d2 = '22.12.2016'

function initComponent() {
  var container = document.createElement('div')
  var state = booker.init()
  var streams = render(booker.view, state, container)
  streams.state = state
  return streams
}

test('when one-way is selected, return date input is disabled', t => {
  var streams = initComponent()
  var inp = streams.dom$().querySelector('input.returnDate')
  t.ok(inp.disabled)
  t.end()
})

test('when return is selected, return date is enabled', t => {
  var streams = initComponent()
  var drop = streams.dom$().querySelector('select')
  var change = new Event('change')
  drop.value = 'round-trip'
  drop.dispatchEvent(change)
  var inp = streams.dom$().querySelector('input.returnDate')
  t.ok(!inp.disabled)
  t.end()
})

test('when a misformatted date is entered in departure, it becomes red', t => {
  var streams = initComponent()
  var inp = streams.dom$().querySelector('input.departureDate')
  var keyup = new Event('keyup')
  inp.value = '22.22.22'
  inp.dispatchEvent(keyup)
  t.notEqual(inp.className.indexOf('red'), -1)
  t.end()
})

test('when a misformatted date is entered in return, it becomes red', t => {
  var streams = initComponent()
  streams.state.type$('round-trip')
  var inp = streams.dom$().querySelector('input.returnDate')
  var keyup = new Event('keyup')
  inp.value = '22.22.22'
  inp.dispatchEvent(keyup)
  t.notEqual(inp.className.indexOf('red'), -1)
  t.end()
})

test('when a formatted date is entered in departure, it is not red', t => {
  var streams = initComponent()
  var inp = streams.dom$().querySelector('input.departureDate')
  var keyup = new Event('keyup')
  inp.value = d1
  inp.dispatchEvent(keyup)
  t.equal(inp.className.indexOf('red'), -1)
  t.end()
})

test('when a formatted date is entered in return, it is not red', t => {
  var streams = initComponent()
  streams.state.type$('round-trip')
  var inp = streams.dom$().querySelector('input.returnDate')
  var keyup = new Event('keyup')
  inp.value = d1
  inp.dispatchEvent(keyup)
  t.equal(inp.className.indexOf('red'), -1)
  t.end()
})

test('when a date is entered in return that is less-than or equal-to the departure, the book button is disabled', t => {
  var streams = initComponent()
  streams.state.type$('round-trip')
  var inp1 = streams.dom$().querySelector('input.returnDate')
  var inp2 = streams.dom$().querySelector('input.departureDate')
  var btn = streams.dom$().querySelector('button')
  var keyup = new Event('keyup')
  inp1.value = d1
  inp2.value = d1
  inp1.dispatchEvent(keyup)
  inp2.dispatchEvent(keyup)
  t.ok(btn.disabled)
  t.end()
})

test('when a return flight is booked with valid dates, it displays successful booking text', t => {
  var streams = initComponent()
  streams.state.type$('round-trip')
  var inp1 = streams.dom$().querySelector('input.returnDate')
  var inp2 = streams.dom$().querySelector('input.departureDate')
  var btn = streams.dom$().querySelector('button')
  var p = streams.dom$().querySelector('p.bookingMessage')
  var keyup = new Event('keyup')
  var click = new Event('click')
  inp1.value = d1
  inp2.value = d2
  inp1.dispatchEvent(keyup)
  inp2.dispatchEvent(keyup)
  btn.dispatchEvent(click)
  const txt = 'You have booked a round-trip flight, departing 22.12.2015 and returning 22.12.2016'
  t.ok(p.textContent, txt)
  t.end()
})

test('when a one-way flight is booked, it displays successful booking text', t => {
  var streams = initComponent()
  var inp1 = streams.dom$().querySelector('input.returnDate')
  var btn = streams.dom$().querySelector('button')
  var p = streams.dom$().querySelector('p.bookingMessage')
  var keyup = new Event('keyup')
  var click = new Event('click')
  inp1.value = d1
  inp1.dispatchEvent(keyup)
  btn.dispatchEvent(click)
  const txt = 'You have booked a one-way flight for 22.12.2015'
  t.ok(p.textContent, txt)
  t.end()
})

