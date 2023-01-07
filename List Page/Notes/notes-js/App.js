import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";

export default class App {
    constructor(root) {
        this.notes = []; //list of active notes
        this.activeNote = null; //currently active note
        this.view = new NotesView(root, this._handlers()); //get handlers object

        //update list of notes
        this._refreshNotes();
    }

    _refreshNotes() {
        const notes = NotesAPI.getAllNotes(); //call NotesAPI to get all notes

        this._setNotes(notes); //call ui to uplaod what's visible there

        if (notes.length > 0) { //if one notes saved, set active note (first position)
            this._setActiveNote(notes[0]);
        }
    }

    _setNotes(notes) {
        this.notes = notes; //list of notes
        this.view.updateNoteList(notes); //take notes currently in application 
        this.view.updateNotePreviewVisibility(notes.length > 0); //if at least one note, want preview area to be visible
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note); //tell view to update visible note
    }

    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId); //find note as the one with the same id as what was passed in
                this._setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = { //default title and body
                    title: "Title",
                    body: "Take note here..."
                };

                NotesAPI.saveNote(newNote);
                this._refreshNotes(); //refresh note list to add new note
            },
            onNoteEdit: (title, body) => {
                NotesAPI.saveNote({ //save note -> only get title and body from ui, id from activeNote variable
                    id: this.activeNote.id,
                    title, //same as title: title
                    body
                });

                this._refreshNotes();
            },
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            },
        };
    }
}