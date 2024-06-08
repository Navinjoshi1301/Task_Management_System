const form = document.getElementById("task_form");
const taskTable = document.getElementById("task_table");
const taskBody = document.getElementById("task_body");
const filter = document.getElementById("filter");
let clearBtn = document.getElementById("clear");
let nameInput = document.getElementById("name");
let taskInput = document.getElementById("task");
let dateInput = document.getElementById("date");
form.addEventListener("submit", addTask);
taskBody.addEventListener("click", deleteTask);
clearBtn.addEventListener("click", clearTasks);
filter.addEventListener("keyup", filterTasks);
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask(e) {
  e.preventDefault();

  if (nameInput.value === "" || taskInput.value === "" || dateInput.value === "") {
    alert("Please enter all fields");
    return;
  }

  let row = document.createElement("tr");

  let nameCell = document.createElement("td");
  nameCell.textContent = nameInput.value;

  let taskCell = document.createElement("td");
  taskCell.textContent = taskInput.value;

  let dateCell = document.createElement("td");
  dateCell.textContent = dateInput.value;

  let actionsCell = document.createElement("td");
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("data-name", nameInput.value);
  actionsCell.appendChild(deleteButton);

  row.appendChild(nameCell);
  row.appendChild(taskCell);
  row.appendChild(dateCell);
  row.appendChild(actionsCell);

  taskBody.appendChild(row);

  storeTaskInLocalStorage(nameInput.value, taskInput.value, dateInput.value);

  nameInput.value = "";
  taskInput.value = "";
  dateInput.value = "";
}

function loadTasks() {
  let tasks = getTasksFromLocalStorage();

  tasks.forEach((task) => {
    let row = document.createElement("tr");

    let nameCell = document.createElement("td");
    nameCell.textContent = task.name;

    let taskCell = document.createElement("td");
    taskCell.textContent = task.task;

    let dateCell = document.createElement("td");
    dateCell.textContent = task.date;

    let actionsCell = document.createElement("td");
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("data-name", task.name);
    actionsCell.appendChild(deleteButton);

    row.appendChild(nameCell);
    row.appendChild(taskCell);
    row.appendChild(dateCell);
    row.appendChild(actionsCell);

    taskBody.appendChild(row);
  });
}

function storeTaskInLocalStorage(name, task, date) {
  let tasks = getTasksFromLocalStorage();
  tasks.push({ name, task, date });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  
}

function getTasksFromLocalStorage() {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  return tasks;
}

function removeFromLocalStorage(name) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.filter((task) => task.name !== name);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(e) {
  if (e.target.tagName === "BUTTON" && e.target.hasAttribute("data-name")) {
    let name = e.target.getAttribute("data-name");
    if (confirm("Are you sure you want to delete this task?")) {
      e.target.closest("tr").remove();
      removeFromLocalStorage(name);
    }
  }
}

function clearTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    taskBody.innerHTML = "";
    localStorage.removeItem("tasks");
  }
}

function filterTasks() {
let searchText = filter.value.toLowerCase();
let rows = taskTable.getElementsByTagName("tr");

for (let row of rows) {
let name = row.cells[0].textContent.toLowerCase();
let task = row.cells[1].textContent.toLowerCase();
let date = row.cells[2].textContent.toLowerCase();
let match = name.includes(searchText) || task.includes(searchText) || date.includes(searchText);

if (match) {
  row.style.display = "table-row";
} else {
  row.style.display = "none";
}
}
}

