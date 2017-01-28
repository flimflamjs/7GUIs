const render = require('flimflam/render')
const test = require('tape')
const crud = require('../')

function initComponent() {
  var container = document.createElement('div')
  var state = crud.init()
  var streams = render(crud.view, state, container)
  streams.state = state
  return streams
}

test('when input is entered, people are filtered by surname', t => {
  var streams = initComponent()
  var inp = streams.dom$().querySelector('input.filter')
  inp.value = 'emil'
  var ol = streams.dom$().querySelector('ol')
  var ev = new Event('keyup')
  inp.dispatchEvent(ev)
  t.strictEqual(ol.textContent, 'Emil, Hans')
  t.end()
})

test('when a row is clicked, the name and surname inputs are filled', t => {
  var streams = initComponent()
  var li = streams.dom$().querySelectorAll('li')[1]
  var ev = new Event('click')
  li.dispatchEvent(ev)
  var inp_name = streams.dom$().querySelector('input.name')
  var inp_surname = streams.dom$().querySelector('input.surname')
  t.strictEqual(`${inp_name.value} ${inp_surname.value}`, 'Max Mustermann')
  t.end()
})

test('deselecting a selected row clears the inputs', t => {
  var streams = initComponent()
  var li = streams.dom$().querySelectorAll('li')[1]
  var ev = new Event('click')
  li.dispatchEvent(ev)
  li.dispatchEvent(ev)
  var inp_name = streams.dom$().querySelector('input.name')
  var inp_surname = streams.dom$().querySelector('input.surname')
  t.strictEqual(inp_name.value + inp_surname.value, '')
  t.end()
})

test('updating a selected name changes its entry in the list', t => {
  var streams = initComponent()
  var li = streams.dom$().querySelectorAll('li')[1]
  var click = new Event('click')
  li.dispatchEvent(click)
  var inp_name = streams.dom$().querySelector('input.name')
  inp_name.value = "Roger"
  var updateBtn = streams.dom$().querySelector('button.update')
  updateBtn.dispatchEvent(click)
  t.strictEqual(li.textContent, 'Mustermann, Roger')
  t.end()
})

test('creating a new name appends it to the list', t => {
  var streams = initComponent()
  var li = streams.dom$().querySelectorAll('li')[1]
  var click = new Event('click')
  li.dispatchEvent(click)
  var inp_name = streams.dom$().querySelector('input.name')
  inp_name.value = "Roger"
  var createBtn = streams.dom$().querySelector('button.create')
  createBtn.dispatchEvent(click)
  var newLi = streams.dom$().querySelectorAll('li')[3]
  t.strictEqual(newLi.textContent, 'Mustermann, Roger')
  t.end()
})

test('delete a selected name removes it from the list', t => {
  var streams = initComponent()
  var li = streams.dom$().querySelectorAll('li')[1]
  var click = new Event('click')
  li.dispatchEvent(click)
  var deleteBtn = streams.dom$().querySelector('button.delete')
  deleteBtn.dispatchEvent(click)
  var listText = streams.dom$().querySelector('ol').textContent
  t.strictEqual(listText, 'Emil, HansTisch, Roman')
  t.end()
})
