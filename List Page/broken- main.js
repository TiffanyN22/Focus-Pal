/* tutorial: https://www.youtube.com/watch?v=6eFwtaZf6zc&t=0s */
/*math english, business personal
math = business, english = personal*/
window.addEventListener('load', () => {
    /*if there are to-do's saved in local storage, gettem!
    also, encoding with JSON.string so JSON.parse unlocks it somehow
    todos is a global variable so we can use it anywhere without const?*/
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const newTodoForm = document.querySelector('#new-todo-form');

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();

		const todo = {
			content: e.target.elements.content.value,
			estimate: e.target.elements.estimate.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		} // making a todo object with different keys (content, estimate, category, con)

		todos.push(todo);

		if((content.value.length == 0)|| (category.value.length == 0) || (estimate.value.length == 0)){
			alert('Please fill in all categories');
		}
		// add something where it will get angry if fields not populated
		console.log('Hi Kara I am here too');


		localStorage.setItem('todos', JSON.stringify(todos)); // makes objects into a string in local storage under 'todos'

		// Reset the form
		e.target.reset();

		DisplayTodos()
	})

	DisplayTodos()
})
 // make an array of just categories and assign them colors ( max 10 categories )
function DisplayTodos () {

	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	//todos.sort
	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const category = document.createElement('div');//new
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const notes = document.createElement('button');
		const deleteButton = document.createElement('button');

		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble'); // figure out how to put bubble after?
		//Category, bubble, todo, time
		/*if (todo.category == 'english') {
			span.classList.add('english');
		} else {
			span.classList.add('math');
		}*/
		content.classList.add('todo-content');
		category.classList.add('todo-category');
		//estimate.classList.add('todo-estimate');
		actions.classList.add('actions');
		notes.classList.add('notes');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');
		//let value = todo.category + ': ' + todo.content + ' (' + todo.estimate +'m)';
		// what I want to put out : `<input type="text" size="40" value="${todo.category}: ${todo.content} (${todo.estimate}m) " readonly>`;
		//content.innerHTML =  `<input type="text" size="40" value=${value} readonly>`;
		category.innerHTML = `<input type="text" size="10" value="${todo.content} " readonly>`;
		content.innerHTML =  `<input type="text" size="10" value="${todo.category}: " readonly>`;
		estimate.innerHTML =  `<input type="text" size="5" value="(${todo.estimate}m)" readonly>`;

		//category.innerHTML = `<input type="text" size="40" value="${todo.category}: " readonly>`;
		notes.innerHTML = "Notes";
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(notes); /*myadd*/
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(category);
		todoItem.appendChild(estimate);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

		if (todo.done) {
			todoItem.classList.add('done');
		}
		
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			DisplayTodos()

		})

		notes.addEventListener('click', (e) => {
			/*add part where it goes to a notes page*/
		})

		edit.addEventListener('click', (e) => {
			//change "Create a" to "Edit"
			//change add to save
			//fill in stuff with data
			console.log('Someone clicked the edit button');


			//window.alert("Please fill in all 3 forms before submitting the form.");
			//flip back
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				console.log('Hi Kara I am here');
				let cat = prompt('Enter Category:');
				if (result) {
				// User clicked OK and entered a value
					todo.category = cat;
					console.log
				} else {
				// User clicked Cancel
				}
				
				let cont = prompt('Enter Todo:');
				if (result) {
				// User clicked OK and entered a value
					todo.content = cont;
				} else {
				// User clicked Cancel
				}
		
				let est = prompt('Enter Time:');
				if (result) {
				// User clicked OK and entered a value
					todo.estimate = est;
				} else {
				// User clicked Cancel
				}
				input.setAttribute('readonly', true);
				todo.content = e.target.value;

				//content.innerHTML = `<input type="text" size="40" value="${e.target.value} " readonly>`;
				//todo.estimate = e.target.estimate;
				//localStorage.setItem('todos', JSON.stringify(todos));
				//todo[index].content.value= 

				DisplayTodos()
			})

			e.target.reset()
		})


		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})
	})
}