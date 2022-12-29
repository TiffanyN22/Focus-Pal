// purpose: start up application
import App from "./App.js";

const root = document.getElementById("app");
const app = new App(root);

/*
import NotesAPI from "./NotesAPI.js";

//id and time stamp updated through api
NotesAPI.saveNote({
    title: "New Notes!",
    body: "I am a new note",
})

console.log(NotesAPI.getAllNotes())
*/

/*
import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js"
const app = document.getElementById("app");
const view = NotesView(app, {
    onNoteAdd(){
        console.log("Let's add a note")
    },
    onNoteSelect(id){
        console.log("Note selected: " + id);
    },
    onNoteEdit(newTitle, newBody){
        console.log(newTitle);
        console.log(newBody);
    },
    onNoteDelete(id){
        console.log("Note Deleted: " + id);
    }
})
view.updateNoteList(NotesAPI.getAllNotes());
*/
