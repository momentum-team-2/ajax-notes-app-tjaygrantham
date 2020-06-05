notesURL = 'http://localhost:3000/notes/'

function getNotes(url){
  return axios.get(url).then(response => response.data)
}

document.querySelector('.editor').addEventListener('submit', event => {
  event.preventDefault()
  target = event.target
  const title = document.querySelector('#title').value
  const body = document.querySelector('#body').value
  const id = document.querySelector('.editor').id
  axios.patch(notesURL+id, {
    'title': title,
    'body': body,
    'changed': moment().valueOf()
  })
  refreshNotes()
})

function addNoteToList(note){
  const notegen = _.template(document.querySelector('#note-template').innerHTML)
  document.querySelector('.picker').innerHTML += notegen(note)
}

function addNotes(){
  getNotes(notesURL).then(notes => {
    for(note of notes) {
      addNoteToList(note)
    }
    for(note of document.getElementsByClassName('picker-note')){
      note.addEventListener('click', event => {
        loadNoteWithID(event.target.parentElement.id)
      })
    }
  })
}

function loadNoteWithID(id){
  getNotes(notesURL).then(notes => {
    let targetNote
    for(note of notes){
      if (note.id === Number(id)){
        targetNote = note
      }
    }
    if(targetNote){
      document.querySelector('#title').value = targetNote.title
      document.querySelector('#body').value = targetNote.body
      document.querySelector('.editor').id = targetNote.id
    }
  })
}

function refreshNotes(event){
  const id = document.querySelector('.editor').id
  let url = 'http://' + location.host
  if(id){
    url += '?id=' + id
  }
  location.href = url
}

function createNote(event){
  let title = prompt('Enter the title of your new note')
  if(title){
    axios.post(notesURL, {
      'title': title,
      'body': '',
      'created': moment().valueOf(),
      'changed': moment().valueOf()
    }).then(() => refreshNotes())
  }
}

function deleteNote(event){
  if(confirm('Are you sure you want to delete this note?'))
    axios.delete(notesURL+event.target.id).then(() => refreshNotes())
}

addNotes()
const query = new URLSearchParams(location.search)
if(query.get('id')){
  loadNoteWithID(query.get('id'))
}