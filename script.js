
const API_BASE = "http://localhost:5000/api/tasks";

// Fetch and load tasks at start
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task
document.getElementById("addTaskBtn").addEventListener("click", addTask);

async function loadTasks() {
    const res = await fetch(API_BASE);
    const tasks = await res.json();
    renderTasks(tasks);
}

async function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    if (!text) return;

    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const newTask = await res.json();
    addTaskToDOM(newTask);

    input.value = "";
}

function renderTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    tasks.forEach(addTaskToDOM);
}

function addTaskToDOM(task) {
    const list = document.getElementById("taskList");

    const li = document.createElement("li");
    li.classList.add("task-item");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
    <span class="text">${task.text}</span>
    <div class="actions">
      <button class="complete-btn">✔</button>
      <button class="delete-btn">✖</button>
    </div>
  `;

    // Complete handler
    li.querySelector(".complete-btn").addEventListener("click", async () => {
        const res = await fetch(`${API_BASE}/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !task.completed })
        });

        const updated = await res.json();
        li.classList.toggle("completed");
        task.completed = updated.completed;
    });

    // Delete handler
    li.querySelector(".delete-btn").addEventListener("click", async () => {
        await fetch(`${API_BASE}/${task.id}`, { method: "DELETE" });
        li.remove();
    });

    list.appendChild(li);
}
