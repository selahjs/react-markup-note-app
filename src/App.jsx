import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"

function App() {
  const [notes, setNotes] = useState(()=>JSON.parse(localStorage.getItem("notes"))||[])
  const [currentNoteId, setCurrentNoteId] = useState(
      (notes[0] && notes[0].id) || ""
  )
  
  // localStorage.clear()
  // console.log(JSON.parse(localStorage.getItem("notes")))
  useEffect(()=>{
    localStorage.setItem("notes", JSON.stringify(notes))
  },[notes])
  
  //This function is run twice(in App and Sidebar)
  function createNewNote() {
      const newNote = {
          id: nanoid(),
          body: "# Type your markdown note's title here"
      }
      //returns 
      setNotes(prevNotes => [newNote, ...prevNotes])
      setCurrentNoteId(newNote.id)
  }

  //This function is an onChange event handler inside Edit's Reactmde input field
  //is invoked inside (Edit)
  function updateNote(text) {
      //this code updates the notes, additionally moves currently mmodifying notes to the top
      setNotes(oldNotes =>{ 
        const newArray = []
        for(let i=0; i<oldNotes.length; i++){
          const note = oldNotes[i]
          if(note.id === currentNoteId){
            newArray.unshift({...note, body:text})
          }
          else{
            newArray.push(note);
          }
        }
        return newArray
    
    })
  }

  function deleteNote(event, id){
    event.stopPropagation()
      setNotes(oldNotes=>{
        return oldNotes.filter(note=>{
          return note.id !== id
        })
      })
  }

  //this function is only invoked in App, however the returned value is used in(Edit and Sidebar)
  //return the value of the current note i.e. an object {id... , body...}
  function findCurrentNote() {
      return notes && notes.find(note => {
          return note.id === currentNoteId
      }) || notes[0]
  }

  return (
    <main className="App">
      { notes.length>0?
          <Split
            sizes={[25, 75]}
            className="split"
            direction="horizontal"
          >
            <Sidebar 
              notes={notes}
              newNote={createNewNote}
              currentNote={findCurrentNote()}
              setCurrentNoteId={setCurrentNoteId}
              deleteNote={deleteNote}
            />
            {
                    currentNoteId && 
                    notes.length > 0 &&

                    <Editor 
                      currentNote={findCurrentNote()}
                      updateNote={updateNote}
                    />
            }
          </Split>
      :
          <div className="no-notes">
              <h1>You have no notes</h1>
              <button 
                  className="first-note" 
                  onClick={createNewNote}
              >
                  Create one now
              </button>
          </div>
      }
    </main>
  )
}

export default App
