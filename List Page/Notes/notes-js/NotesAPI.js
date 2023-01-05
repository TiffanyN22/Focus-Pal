// interact with local storage
var currentTaskId = 4; //TODO: update based on which task was selected

export default class NotesAPI { //NotesAPI in main.js refers to class here with methods to get notes, static to access wherever we want
    static getAllNotes() {
        //if no existing notes, get empty array
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

        //filter notes based on task 
        let filteredNotes = notes.filter(note => note.taskId == currentTaskId);

        //TODO: delete this comment, used for console.log to test
        // var filteredNotes = notes.filter(checkTaskId);
        // function checkTaskId(note){
        //     console.log("taskID: " + note.taskId);
        //     console.log("current task id:" + currentTaskId);
        //     return note.taskId == currentTaskId;
        // }
        
        
        //order by timestamp
        return filteredNotes.sort((a, b) => { 
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static saveNote(noteToSave) { //update and insert note
        const notes = NotesAPI.getAllNotes(); //get current notes
        const existing = notes.find(note => note.id == noteToSave.id); //compare id with each existing node

        // Edit/Update
        if (existing) { //same id -> update
            existing.title = noteToSave.title; //update title
            existing.body = noteToSave.body; //update body
            existing.updated = new Date().toISOString(); //update tiem
        } else { //insert new note
            noteToSave.id = Math.floor(Math.random() * 1000000); //generate random id, can incremenet on server side
            noteToSave.taskId = currentTaskId;
            noteToSave.updated = new Date().toISOString(); //get iso timestamp
            notes.push(noteToSave);
        }

        localStorage.setItem("notesapp-notes", JSON.stringify(notes)); //resave local storage key, override existing entry
    }

    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id); //get every note except for the one with the same id

        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }
}