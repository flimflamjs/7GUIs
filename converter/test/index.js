const render = require('flimflam/render')
const test = require('tape')
const converter = require('../')

function initComponent() {
  var container = document.createElement('div')
  var state = converter.init()
  var streams = render(converter.view, state, container)
  streams.state = state
  return streams
}

function getInputs(dom) {
  return {
    fahrenInput: dom.querySelector('.fahrenInput')
  , celsiusInput: dom.querySelector('.celsiusInput')
  }
}

test('212 fahren is 100 celsius', t => {
  var streams = initComponent()
  var keyup = new Event('keyup')
  var {fahrenInput, celsiusInput} = getInputs(streams.dom$())
  fahrenInput.value = 212 ; fahrenInput.dispatchEvent(keyup)
  t.strictEqual(celsiusInput.value, '100')
  t.end()
})
test('32 fahren is 0 celsius', t => {
  var streams = initComponent()
  var keyup = new Event('keyup')
  var {fahrenInput, celsiusInput} = getInputs(streams.dom$())
  fahrenInput.value = 32 ; fahrenInput.dispatchEvent(keyup)
  t.strictEqual(celsiusInput.value, '0')
  t.end()
})
test('0 celsius is 32 fahren', t => {
  var streams = initComponent()
  var keyup = new Event('keyup')
  var {fahrenInput, celsiusInput} = getInputs(streams.dom$())
  celsiusInput.value = 0 ; celsiusInput.dispatchEvent(keyup)
  t.strictEqual(fahrenInput.value, '32')
  t.end()
})
test('100 celsius is 212 fahren', t => {
  var streams = initComponent()
  var keyup = new Event('keyup')
  var {fahrenInput, celsiusInput} = getInputs(streams.dom$())
  celsiusInput.value = 100 ; celsiusInput.dispatchEvent(keyup)
  t.strictEqual(fahrenInput.value, '212')
  t.end()
})
