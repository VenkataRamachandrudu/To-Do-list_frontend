const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filters button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Render todos
function renderTodos(filter = "all") {
  todoList.innerHTML = "";
  todos
    .filter(todo => filter === "all" || (filter === "completed" && todo.completed) || (filter === "active" && !todo.completed))
    .forEach((todo, index) => {
      const li = document.createElement("li");
      li.className = todo.completed ? "completed" : "";

      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => toggleComplete(index));

      const text = document.createElement("span");
      text.className = "todo-text";
      text.textContent = todo.text;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn";
      editBtn.addEventListener("click", () => editTodo(index));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => deleteTodo(index));

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      todoList.appendChild(li);
    });
}

// Add new todo
addBtn.addEventListener("click", () => {
  const text = todoInput.value.trim();
  if (text === "") return;
  todos.push({ text, completed: false });
  saveAndRender();
  todoInput.value = "";
});

// Toggle complete
function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveAndRender();
}

// Edit todo
function editTodo(index) {
  const newText = prompt("Edit task:", todos[index].text);
  if (newText !== null && newText.trim() !== "") {
    todos[index].text = newText.trim();
    saveAndRender();
  }
}

// Delete todo
function deleteTodo(index) {
  todos.splice(index, 1);
  saveAndRender();
}

// Save to localStorage and render
function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos(document.querySelector(".filters button.active").dataset.filter);
}

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTodos(btn.dataset.filter);
  });
});

// Initial render
renderTodos();
