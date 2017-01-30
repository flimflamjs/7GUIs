const render = require('flimflam/render')
const h = require('flimflam/h')

const counter = require('../counter')
const converter = require('../converter')
const booker = require('../flight-booker')
const timer = require('../timer')
const crud = require('../crud')
const circles = require('../circle-drawer')
const cells = require('../cells')

const init = () => {
  return {
    counter: counter.init()
  , converter: converter.init()
  , booker: booker.init()
  , timer: timer.init()
  , crud: crud.init()
  , circles: circles.init()
  , cells: cells.init()
  }
}

const view = state => {
  return h('div.max-width-4.mx-auto.mb4', [
    h('h1', 'Flimflam 7GUIs Examples')
  , h('p', [
      '7GUIs is a "benchmark" for frontend framework usability. Source code and documentation for each example implemented in Flimflam can be found '
    , h('a', {props: {href: "https://github.com/flimflamjs/7GUIs"}}, 'here')
    , '. More information about 7GUIs can be found '
    , h('a', {props: {href: 'https://github.com/eugenkiss/7guis'}}, 'here')
    , '.'
    ])
  , h('h2', "1. Counter")
  , counter.view(state.counter)
  , h('h2', "2. Temperature Converter")
  , converter.view(state.converter)
  , h('h2', "3. Flight Booker")
  , booker.view(state.booker)
  , h('h2', "4. Timer")
  , timer.view(state.timer)
  , h('h2', '5. CRUD')
  , crud.view(state.crud)
  , h('p', 'todo')
  , h('h2', '6. Circle Drawer')
  , circles.view(state.circles)
  , h('h2', '7. Cells')
  , cells.view(state.cells)
  ])
}

const container = document.createElement('div')
document.body.appendChild(container)
render(view, init(), container)
