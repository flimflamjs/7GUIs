const R = require('ramda')
const h = require('flimflam/h')
const render = require('flimflam/render')
const serialize = require('form-serialize')

const flyd = require('flimflam/flyd')

R.map = R.addIndex(R.map)

function init() {
  var state = {
    filter$: flyd.stream('')
  , selectedName$: flyd.stream()
  , clickCreate$: flyd.stream()
  , clickUpdate$: flyd.stream()
  , clickDelete$: flyd.stream()
  }

  // Composition of functions to take a create/update action and make it into a valid name
  const dataToSave = R.compose(
    flyd.map(obj => obj.surname + ', ' + obj.name)
  , flyd.filter(obj => obj.surname && obj.name) // reject blanks
  , flyd.map(getFormData) // form -> object
  )
  const toCreate$ = dataToSave(state.clickCreate$)
  // Sample from the currently selected name on every delete click
  const toDelete$ = flyd.sampleOn(state.clickDelete$, state.selectedName$)
  // Get a pair of currently selected name and new name to update on every update click
  const toUpdate$ = flyd.lift(
    R.pair
  , flyd.sampleOn(state.clickUpdate$, state.selectedName$)
  , dataToSave(state.clickUpdate$)
  )
  const defaultNames = ['Emil, Hans', 'Mustermann, Max', 'Tisch, Roman']
  const names$ = flyd.scanMerge([
    [toCreate$, (names, n) => R.append(n, names)]
  , [toUpdate$, (names, [oldName, newName]) => findAndUpdate(n => n === oldName, newName, names)]
  , [toDelete$, (names, idx) => R.remove(idx, 1, names)]
  ], defaultNames)

  state.filteredNames$ = flyd.lift(filter, names$, state.filter$)

  return state
}

const findAndUpdate = (pred, newVal, arr) =>
  R.update(R.find(pred, arr), newVal, arr)

// Get the form from the button click, then convert the form into an object, using the form-serialize module
const getFormData = ev =>
  serialize(ev.currentTarget.form, {hash: true})

// Apply the filter string as entered by the user
function filter(names, searchWord) {
  if(!searchWord || !searchWord.length) return names
  searchWord = searchWord.toLowerCase()
  return R.filter(n => n.toLowerCase().split(', ')[0].indexOf(searchWord) !== -1, names)
}


function view(state) {
  return h('body', [
    searchFilter(state)
  , h('form', {on: {submit: ev => {ev.preventDefault(); ev.stopPropagation();}}}, [
      h('ol', R.map(nameOption(state), state.filteredNames$()))
    , fields(state)
    , actions(state)
    ])
  ])
}

function searchFilter(state) {
  return h('div', [
    h('label', 'Filter by surname: ')
  , h('input.filter', {
      props: {type: 'text', name: 'filter'}
    , on: {keyup: ev => state.filter$(ev.currentTarget.value)}
    })
  ])
}

function fields(state) {
  const selected = R.find(R.equals(state.selectedName$()), state.filteredNames$()) || ''
  return h('div', [
    h('div', [
      h('label', 'Name: ')
    , h('input.name', {props: {name: 'name', type: 'text', value: R.last(selected.split(', '))}})
    ])
  , h('div', [
      h('label', 'Surname: ')
    , h('input.surname', {props: {name: 'surname', type: 'text', value: R.head(selected.split(', '))}})
    ])
  ])
}

function actions(state) {
  return h('div', [
    h('button.create', {
      on: {click: state.clickCreate$}
    , props: {type: 'button'}
    }, "Create")
    , h('button.update', {
      on: {click: state.clickUpdate$}
    , props: {disabled: state.selectedName$() === undefined, type: 'button'}
    }, "Update")
    , h('button.delete', {
      on: {click: state.clickDelete$}
    , props: {disabled: state.selectedName$() === undefined, type: 'button'}
    }, "Delete")
  ])
}

// A single item within the listing of selectable names
const nameOption = state => (name, idx) => {
  const isMatched = state.selectedName$() === name
  return h('li' , {
    on: {click: [state.selectedName$, isMatched ? undefined : name]}
  , class: {selected: isMatched}
  }, name)
}

render(view, init(), document.body)

module.exports = {init, view}
