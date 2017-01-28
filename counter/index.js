const R = require('ramda')
const h = require('flimflam/h')
const flyd = require('flimflam/flyd')

// The add$ stream constitutes the button clicks that increment
// The sum$ steam constitutes the running sum, starting with 0, incremented by add$
function init() {
  const add$ = flyd.stream()
  const sum$ = flyd.scan(R.inc, 0, add$)
  return {add$, sum$}
}

function view(state) {
  return h('body', [
    h('p', String(state.sum$()))
  , h('button.btn', {on: {click: state.add$}}, 'Count!')
  ])
}

module.exports = {view, init}

