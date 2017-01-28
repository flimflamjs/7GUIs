const flyd = require('flimflam/flyd')
const h = require('flimflam/h')

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
  return h('div', [
    h('div', [
      h('label', 'Fahrenheit')
    , h('br')
    , h('input.fahrenInput', {
        props: {type: 'number', value: state.fahren$()}
      , on: {input: ev => state.changeFahren$(ev.currentTarget.value)}
    })
    ])
  , h('div', [
      h('label', 'Celsius')
    , h('br')
    , h('input.celsiusInput', {
        props: {type: 'number', value: state.celsius$()}
      , on: {input: ev => state.changeCelsius$(ev.currentTarget.value)}
    })
    ])
  ])
}

module.exports = {init, view}
