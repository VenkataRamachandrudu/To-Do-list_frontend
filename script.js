const todoInput = document.getElementById("todo-input");
const dueDateInput = document.getElementById("due-date");
const priorityInput = document.getElementById("priority");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

addBtn.addEventListener("click", () => {
  const text = todoInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  todos.push({
    text,
    completed: false,
    dueDate,
    priority
  });

  saveAndRender();

  todoInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "Medium";
});

function renderTodos() {
  todoList.innerHTML = "";

  let filtered = todos;
  if (currentFilter === "active") {
    filtered = todos.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filtered = todos.filter(t => t.completed);
  }

  filtered.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;
    li.innerHTML = `
      <div>
        <input type="checkbox" ${todo.completed ? "checked" : ""} 
          onclick="toggleComplete(${index})">
        <span>${todo.text} 
          <small>(${todo.priority}${todo.dueDate ? " - " + todo.dueDate : ""})</small>
        </span>
      </div>
      <div class="actions">
        <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    todoList.appendChild(li);
  });
}

function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveAndRender();
}

function deleteTask(index) {
  todos.splice(index, 1);
  saveAndRender();
}

function editTask(index) {
  const newText = prompt("Edit task:", todos[index].text);
  if (newText) {
    todos[index].text = newText.trim();
    saveAndRender();
  }
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}

renderTodos();
