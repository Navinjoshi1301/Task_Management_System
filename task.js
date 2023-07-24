const form = document.getElementById("task_form");
form.addEventListener("submit", submitTask);
function submitTask(e) {
  e.preventDefault(); 
  const nameInput = document.getElementById("name");
  const taskInput = document.getElementById("task");
  const dateInput = document.getElementById("date");
  const statusInput = document.getElementById("status");

  let tasks = localStorage.getItem("tasks");
  tasks = tasks ? JSON.parse(tasks) : [];

  const newTask = {
    name: nameInput.value,
    task: taskInput.value,
    date: dateInput.value,
    status: statusInput.value
  };

  tasks.push(newTask);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  nameInput.value = "";
  taskInput.value = "";
  dateInput.value = "";
  statusInput.selectedIndex = 0;

  window.location.href = "table.html";
}
