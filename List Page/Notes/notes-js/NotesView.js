export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        //={} is default object
        this.root = root; //takes in root element (div with calss notes and id app)
        this.onNoteSelect = onNoteSelect; //when user clicks on note on sidebar, function that runs
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        //use javascript to render view
        this.root.innerHTML = `
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="New Note...">
                <textarea class="notes__body">Take Note...</textarea>
            </div>
            <div class="notes__sidebar">
                <div class="notes__container">
                    <div class="notes__list"></div>
                </div>
                <button class="notes__add" type="button">Add Note</button>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd(); //call function when button pressed
        });

        [inpTitle, inpBody].forEach(inputField => { //grab each input field
            inputField.addEventListener("blur", () => { //blur: user exit out of input field
                const updatedTitle = inpTitle.value.trim(); //get new title and trim edges
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody); //pass arguments into onNoteEdit
            });
        });

        this.updateNotePreviewVisibility(false); //default make it hidden -> make visible once you ahve note to preview
    }

    //add item to sidebar, underscore to denote that it should be a private message
    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60; //before ... to shorten body length

        /*
            data-note-id="${id}: keep track of id using html dataset attribute
            body: whe you get passed in a long body, only put up to 60 characters in preview
            if more than max body length, add ..., otherwise don't
            toLocaleString: format stirng in local format
        */ 
        return `
            <div class="notes__list-item" data-note-id="${id}"> 
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    //update list of notes in sidebar
    updateNoteList(notes) { 
        const notesListContainer = this.root.querySelector(".notes__list"); //take list of notes container 

        // Empty list
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated)); //new date to convert timestamp

            notesListContainer.insertAdjacentHTML("beforeend", html); //insert html from one to another
        }

        // Add select/delete events for each list item (each note)
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => { //for each html notes list item
            noteListItem.addEventListener("click", () => { //when it is clikced on
                this.onNoteSelect(noteListItem.dataset.noteId); //code knows which id user selected
            });

            noteListItem.addEventListener("dblclick", () => { //double clicked on
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) { //if they click confirm
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    //update view to show selected node
    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title; //update input view
        this.root.querySelector(".notes__body").value = note.body;

        //get each note itme
        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected"); //remove selected from previous if any of them ahve it
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected"); //choose and give selected
    }

    //hide edit when first open
    updateNotePreviewVisibility(visible) { //visible is true of false
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden"; //set visibility of right side based on visible true/false
    }
}