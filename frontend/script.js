// Elements
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const dueDateInput = document.getElementById("due-date");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search");
const themeToggle = document.getElementById("theme-toggle");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks(filter = "all", search = "") {
  taskList.innerHTML = "";

  let filtered = tasks.filter(task => {
    if (filter === "active" && task.completed) return false;
    if (filter === "completed" && !task.completed) return false;
    if (!task.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${index})">
        <span class="title">${task.title}</span>
        <span class="priority ${task.priority}">${task.priority}</span>
        ${task.dueDate ? `<span class="due-date">📅 ${task.dueDate}</span>` : ""}
      </div>
      <button class="delete-btn" onclick="deleteTask(${index})">✖</button>
    `;

    taskList.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task
addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;
  tasks.push({
    title: taskInput.value,
    priority: prioritySelect.value,
    dueDate: dueDateInput.value,
    completed: false,
  });
  taskInput.value = "";
  dueDateInput.value = "";
  renderTasks();
});

// Toggle complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Filters
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderTasks(btn.dataset.filter, searchInput.value);
  });
});

// Search
searchInput.addEventListener("input", () => {
  const activeFilter = document.querySelector(".filter-btn.active").dataset.filter;
  renderTasks(activeFilter, searchInput.value);
});

// Dark mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Initial render
renderTasks();
