const R = require('ramda')
const h = require('flimflam/h')
const flyd = require('flyd')

const updateSheet = require('./lib/update-sheet')

function init() {
  var state = {
    changeCell$: flyd.stream()
  }
  state.sheet$ = flyd.scan(
    (sheet, [val, loc]) => updateSheet(loc, val, sheet)
  , {formulas: {}, values: {}, references: {}}
  , state.changeCell$
  )
  return state
}

function view(state) {
  return h('div', {
    style: {overflowY: 'auto', maxHeight: '16em'}
  }, [
    h('p', "Double-click a cell to edit it; press Enter to save.")
  , table(state)
  ])
}

const AtoZ = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const oneTo99 = R.times(R.add(1), 99)

const table = state => {
  return h('table', {
    style: {
      maxHeight: '8em'
    , overflow: 'auto'
    }
  }, [
    h('thead', [
      h('tr',
        R.map(
          c => h('th', c)
        , R.concat([''], AtoZ)
        )
      )
    ])
  , h('tbody', 
      R.map(
        n => h('tr', cells(state)(n))
      , oneTo99
      )
    )
  ])
}

const cells = state => row => {
  const label = h('td', [h('strong', row)])
  const input = loc => h('input', {
    props: {type: 'text'}
  , on: {
      // For every change event, pass the input's value and the current cell name to the changeCell$ stream
      change: ev => state.changeCell$([ev.currentTarget.value, loc])
    }
  })
  const td = col => {
    const loc = AtoZ[col] + row
    return h('td', [
      input(loc)
    , h('p', '= ' + (state.sheet$().values[loc] || '0'))
    ])
  }
  const inputs = R.times(td, 26)
  return R.concat([label], inputs)
}

const cell = x => {
  const val = isSelected ? x.formula : x.value
}

module.exports = {init, view}
