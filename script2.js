const filter = document.getElementById("filter");
const navLinks = document.querySelectorAll(".nav-pills .nav-link");

filter.addEventListener("keyup", filterTasks);
navLinks.forEach((link) => {
  link.addEventListener("click", filterByStatus);
});

const val = localStorage.getItem("type");
console.log(val);

function populateTaskList() {
  const table = document.createElement("table");
  const tableHead = document.createElement("thead");
  const tableBody = document.createElement("tbody");
  const headerRow = document.createElement("tr");
  const nameHeader = document.createElement("th");
  const taskHeader = document.createElement("th");
  const dateHeader = document.createElement("th");
  const statusHeader = document.createElement("th");
  const actionHeader = document.createElement("th");

  nameHeader.innerText = "Name";
  taskHeader.innerText = "Task";
  dateHeader.innerText = "Date";
  statusHeader.innerText = "Status";
  actionHeader.innerText = "Action";

  headerRow.appendChild(nameHeader);
  headerRow.appendChild(taskHeader);
  headerRow.appendChild(dateHeader);
  headerRow.appendChild(statusHeader);
  headerRow.appendChild(actionHeader);
  tableHead.appendChild(headerRow);
  table.appendChild(tableHead);
  table.appendChild(tableBody);

  const list = document.getElementById("task_body");
  list.appendChild(table);
  
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  if (val == "year") {
    sortByYear(tasks);
  }
  if (val == "month") {
    sortByMonth(tasks);
  }
  if (val == "day") {
    sortByDay(tasks);
  }

  if (tasks && tasks.length > 0) {
    tasks.forEach(({ name, task, date, status }) => {
      let row = document.createElement("tr");
      let nameCell = document.createElement("td");
      let taskCell = document.createElement("td");
      let dateCell = document.createElement("td");
      let statusCell = document.createElement("td");
      let actionCell = document.createElement("td");
      let editDeleteContainer = document.createElement("div");
      let editIcon = document.createElement("button");
      let deleteButton = document.createElement("button");
      nameCell.innerText = name;
      taskCell.innerText = task;
      dateCell.innerText = date;
      statusCell.innerText = status;
      deleteButton.innerHTML = '<i class="bi bi-trash"></i>'; 
      deleteButton.classList.add("btn", "btn-sm","deletee");
      deleteButton.setAttribute("data-name", name);
      deleteButton.addEventListener("click", deleteTask);
      editIcon.innerHTML = '<i class="bi bi-pencil-fill " ></i>'; 
      editIcon.classList.add("btn", "btn-sm" , "edit");
      editIcon.addEventListener("click", editTask);
      editIcon.style.marginRight = "10px";
      editDeleteContainer.appendChild(editIcon);
      editDeleteContainer.appendChild(deleteButton);
      actionCell.appendChild(editDeleteContainer);
      row.appendChild(nameCell);
      row.appendChild(taskCell);
      row.appendChild(dateCell);
      row.appendChild(statusCell);
      row.appendChild(actionCell);
      tableBody.appendChild(row);
      
    });
  } else {
    let row = document.createElement("tr");
    let noTasksCell = document.createElement("td");
    noTasksCell.setAttribute("colspan", "5");
    noTasksCell.innerText = "No Data found in Table";
    row.appendChild(noTasksCell);
    tableBody.appendChild(row);
  }
}

function deleteTask(e) {
  const deleteButton = e.target;
  const name = deleteButton.getAttribute("data-name");
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks = tasks.filter((task) => task.name !== name);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  const row = deleteButton.closest("tr");
  localStorage.getItem("tasks");
  row.remove("row");
  // location.reload();
}

window.addEventListener("DOMContentLoaded", populateTaskList);

function filterByStatus(e) {
  const selectedStatus = e.target.dataset.filter;


  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

 
  e.target.classList.add("active");

  filterTasks();
}

function filterTasks() {
  let searchText = filter.value.toLowerCase();
  let selectedStatus = document.querySelector(".nav-pills .nav-link.active").dataset.filter;
  let rows = document.getElementById("task_table").getElementsByTagName("tr");

  for (let row of rows) {
    let name = row.cells[0].textContent.toLowerCase();
    let task = row.cells[1].textContent.toLowerCase();
    let date = row.cells[2].textContent.toLowerCase();
    let status = row.cells[3].textContent.toLowerCase();

    let match =
      (name.includes(searchText) ||
        task.includes(searchText) ||
        date.includes(searchText) ||
        status.includes(searchText)) &&
      (selectedStatus === "all" || status === selectedStatus);

    if (match) {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  }
}



function sortByYear(tasks) {
  return tasks.sort((a, b) => {
    const yearA = new Date(a.date).getFullYear();
    const yearB = new Date(b.date).getFullYear();
    return yearB - yearA;
  });
}

function sortByMonth(tasks) {
  return tasks.sort((a, b) => {
    const monthA = new Date(a.date).getMonth();
    const monthB = new Date(b.date).getMonth();
    return monthB - monthA;
  });
}

function sortByDay(tasks) {
  return tasks.sort((a, b) => {
    const dayA = new Date(a.date).getDate();
    const dayB = new Date(b.date).getDate();
    return dayB - dayA;
  });
}

function editTask(e) {
  const editIcon = e.target;
  const taskRow = editIcon.closest("tr");
  const statusCell = taskRow.cells[3];
  const currentStatus = statusCell.innerText;
  if (currentStatus === "Completed") {
    alert("task is completed");
    return;
  }
 

  const select = document.createElement("select");
  select.classList.add("status-select");

  
 
  const options = ["Start", "Pending", "Completed"];
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.text = option;
    if (option === currentStatus) {
      optionElement.selected = true;
    }
    
    select.appendChild(optionElement);
  });

  
  select.addEventListener("change", function () {
    const newStatus = this.value;
    statusCell.innerText = newStatus;

  
    const taskName = taskRow.cells[0].innerText;
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach((task) => {
      if (task.name === taskName) {
        task.status = newStatus;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  
  statusCell.innerHTML = '';
  statusCell.appendChild(select);
}
