/* tutorial: https://www.youtube.com/watch?v=6eFwtaZf6zc&t=0s */
/*math english, business personal
math = business, english = personal*/
window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	var allCategories = [];

	if (localStorage.getItem('todos-categories') == null){
		localStorage.setItem('todos-categories', JSON.stringify([])); // setting empty array
	}
	else {
		allCategories = JSON.parse(localStorage.getItem('todos-categories') || []);
	}

	const newTodoForm = document.querySelector('#new-todo-form');

	var taskColors = ["rgb(255, 158, 184)", "rgb(245, 151, 151)", "rgb(245, 207, 151)", "rgb(222, 222, 0)", "rgb(151, 245, 185)","rgb(151, 245, 241)", "rgb(158, 217, 255)", "rgb(158, 164, 255)", "rgb(207, 158, 255)", "rgb(255, 158, 155)"]; //for calendar

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();
		let sectionBackground = document.getElementById('section-background');
		console.log(sectionBackground.clientHeight);
		sectionBackground.style.height = (Number(sectionBackground.clientHeight) + 75).toString() + "px";
		//console.log(sectionBackground.getHeight())
		//sectionBackground.setAttribute('height', sectionBackground.getAttribute('height') + 20);
		//check color
		if(!allCategories.includes(e.target.elements.category.value)){
			allCategories.push(e.target.elements.category.value);
			localStorage.setItem('todos-categories', JSON.stringify(allCategories));
		}
		// console.log("allCategories", allCategories);
		// console.log("index", allCategories.indexOf(e.target.elements.category.value));
		// console.log("color", taskColors[allCategories.indexOf(e.target.elements.category.value)%taskColors.length]);

		const todo = {
			content: e.target.elements.content.value,
			estimate: e.target.elements.estimate.value,
			category: e.target.elements.category.value,
			done: false,
			color: taskColors[allCategories.indexOf(e.target.elements.category.value)%taskColors.length],
			createdAt: new Date().getTime()
		}

		todos.push(todo);

		localStorage.setItem('todos', JSON.stringify(todos));

		// Reset the form
		e.target.reset();

		DisplayTodos()
	})

	DisplayTodos()
})

function DisplayTodos () {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
        const category = document.createElement('div'); //new
		const content = document.createElement('div');
        const estimate = document.createElement('div'); //new
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const notes = document.createElement('button');
		const deleteButton = document.createElement('button');

		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		category.classList.add('todo-category'); //new
        content.classList.add('todo-content');
        estimate.classList.add('todo-estimate'); //new
		actions.classList.add('actions');
		notes.classList.add('notes');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');

		
        //content.innerHTML = `<input type="text" size="40" value="${todo.category}: ${todo.content} (${todo.estimate}m) " readonly>`;
        let size = todo.content.length + 5;
        category.innerHTML =  `<input type="text" size="30" value="${todo.category}: " readonly>`;
        content.innerHTML = `<input type="text" size="${size}" value="${todo.content} " readonly>`;
        estimate.innerHTML = `<input type="text" size="10" value="(${todo.estimate}m)" readonly>`;

		notes.innerHTML = "Notes";
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(notes); /*myadd*/
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
        todoItem.appendChild(category); //new
		todoItem.appendChild(content);
        todoItem.appendChild(estimate);//new
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
			localStorage.setItem('currentTodoItem', content.querySelector('input').value);
			window.location.href='Notes/notes.html';
		})

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
                console.log('clicked off');
				input.setAttribute('readonly', true);
                console.log('set readonly attribute');
				todo.content = e.target.value;
                console.log('targetvalue:'+ e.target.value);
				/*todo.estimate = e.target.estimate;*/
				localStorage.setItem('todos', JSON.stringify(todos));
                console.log('todos');
				DisplayTodos()
			})
		})


		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})
	})
}