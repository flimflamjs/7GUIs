const R = require('ramda')
const h = require('flimflam/h')
const flyd = require('flimflam/flyd')
const render = require('flimflam/render')

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
  , h('button', {on: {click: state.add$}}, 'Count!')
  ])
}

render(view, init(), document.body)

module.exports = {view, init}

