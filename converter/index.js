const flyd = require('flimflam/flyd')
const h = require('flimflam/h')
const render = require('flimflam/render')

function init() {
  var state = {
    changeCelsius$: flyd.stream()
  , changeFahren$: flyd.stream()
  }

  state.fahren$ = flyd.map(celsiusToFahren, state.changeCelsius$)
  state.celsius$ = flyd.map(fahrenToCelsius, state.changeFahren$)
  return state
}

const fahrenToCelsius = f => Math.round(((f||0) - 32) * 5/9)
const celsiusToFahren = c => Math.round((c||0) * 9/5 + 32)

function view(state) {
  return h('body', [
    h('div', [
      h('label', 'Fahrenheit')
    , h('input.fahrenInput', {
        props: {type: 'number', value: state.fahren$()}
      , on: {keyup: ev => state.changeFahren$(ev.currentTarget.value)}
    })
    ])
  , h('div', [
      h('label', 'Celsius')
    , h('input.celsiusInput', {
        props: {type: 'number', value: state.celsius$()}
      , on: {keyup: ev => state.changeCelsius$(ev.currentTarget.value)}
    })
    ])
  ])
}

render(view, init(), document.body)

module.exports = {init, view}
