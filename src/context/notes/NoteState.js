import { useState } from "react";
import noteContext from "./noteContext";


const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial)

    // Get all Note
    const getNote = async () => {
        // API Call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',

            headers: {
                'Content-Type': 'application/json',
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIwNGY0MmE0OTI1NjY2N2FlYjllMjM5In0sImlhdCI6MTY0NDQ5NjQyNX0.6Vod0bGrLa7NRGIaDtLsQ3W2tBAHqGhZIcyI4-4fdxs"
            },

        });

        const json = await response.json()
        setNotes(json)
    }

    // Add a Note
    const addNote = async (title, description, tag) => {
        // TODO: api call
        // API Call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIwNGY0MmE0OTI1NjY2N2FlYjllMjM5In0sImlhdCI6MTY0NDQ5NjQyNX0.6Vod0bGrLa7NRGIaDtLsQ3W2tBAHqGhZIcyI4-4fdxs"
            },
            body: JSON.stringify({ title, description, tag })
        });
        const note = await response.json();
        setNotes(notes.concat(note))
    }
    // Delete a Note
    const deleteNote = async (id) => {
        // API Call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',

            headers: {
                'Content-Type': 'application/json',
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIwNGY0MmE0OTI1NjY2N2FlYjllMjM5In0sImlhdCI6MTY0NDQ5NjQyNX0.6Vod0bGrLa7NRGIaDtLsQ3W2tBAHqGhZIcyI4-4fdxs"
            },
        });
        const json = response.json()
        console.log(json)
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)
    }
    // Edit a Note
    const editNote = async (id, title, description, tag) => {
        // API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIwNGY0MmE0OTI1NjY2N2FlYjllMjM5In0sImlhdCI6MTY0NDQ5NjQyNX0.6Vod0bGrLa7NRGIaDtLsQ3W2tBAHqGhZIcyI4-4fdxs"
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = await response.json()
        console.log(json)
        let newNotes = JSON.parse(JSON.stringify(notes))
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                
                break;
            }
            
        }
        setNotes(newNotes);
    }
    return (
        <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNote }}>
            {props.children}
        </noteContext.Provider>
    )

}


export default NoteState;