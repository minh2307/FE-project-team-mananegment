let projects = JSON.parse(localStorage.getItem("projects")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let loggedInEmail = localStorage.getItem("savedEmail");
let user = users.find((el) => el.email === loggedInEmail);

function logOut() {
  localStorage.removeItem("savedEmail");
}

document.addEventListener("DOMContentLoaded", function () {
  if (!loggedInEmail) {
    window.location.href = "/pages/logIn.html";
  } else {
    rendertasks();
  }
});

let userTasks = tasks.filter((el) => el.assigneeId === user.id);

function rendertasks() {
  let projectIds = userTasks.map((task) => task.projectId);

  let uniqueProjectIds = projectIds.filter(
    (id, index) => projectIds.indexOf(id) === index
  );

  let tableTask = document.getElementById("taskBody");

  tableTask.innerHTML = ` <thead class="text-center" id="thead">
                        <tr>
                            <th class="col-3">Tên Nhiệm Vụ</th>
                            <th class="col-1">Độ ưu tiên</th>
                            <th class="col-2">Trạng thái</th>
                            <th class="col-1">Ngày Bắt Đầu</th>
                            <th class="col-1">Hạn Chót</th>
                            <th class="col-1">Tiến Độ</th>
                        </tr>
                    </thead>`;

  for (let value of uniqueProjectIds) {
    let nameProject = projects.find((el) => el.id === value);
    tableTask.innerHTML += `<tr> 
    <td colspan="7">
        <span type="button" style="font-weight: 700;" onclick="showTasks(${value})">
            <img src="/assets/img/Triangle1.png" alt="" style="width: 15px; height: 15px;"> ${nameProject.projectName}
        </span>
    </td>
</tr>
<tbody id="${value}" class="closeTask">
</tbody>`;
  }

  for (let projectId of uniqueProjectIds) {
    let taskfilter = userTasks.filter((task) => task.projectId === projectId);
    console.log(`Tasks project ${projectId}:`, taskfilter);

    let tbody = document.getElementById(`${projectId}`);

    taskfilter.forEach((el) => {
      let priority = el.priority.toLowerCase().trim();
      let btnPriority =
        priority === "thấp"
          ? "bg-info"
          : priority === "trung bình"
          ? "bg-warning"
          : "bg-danger";

      let progress = el.progress.toLowerCase().trim();
      let btnProgress =
        progress === "trễ hẹn"
          ? "bg-danger"
          : progress === "có rủi ro"
          ? "bg-warning"
          : "bg-success";

      tbody.innerHTML += `<tr>
                            <td>${el.taskName}</td>
                            <td class="text-center"><span class="badge ${btnPriority}">${
        el.priority
      }</span>
                            </td>
                            <td class="text-center">
                                <span class="bage">${el.status}</span>
                            <img src="/assets/img/Vector.png" alt="" class="pb-1 ms-1" onclick="showModal(${
                              el.id
                            })">
                            </td>
                            <td class="text-center" style="color: #0D6EFD;">${getMonthDay(
                              el.asignDate
                            )}</td>
                            <td class="text-center" style="color: #0D6EFD;">${getMonthDay(
                              el.dueDate
                            )}</td>
                            <td class="text-center"><span class="badge ${btnProgress}">${
        el.progress
      }</span></td>
                        </tr>`;
    });
  }
}

function getMonthDay(date) {
  if (!date) return "";

  let parts = date.split("-");
  if (parts.length !== 3) return "";

  let [year, month, day] = parts;

  return `${month} - ${day}`;
}

function showTasks(value) {
  let projectTasks = document.getElementById(`${value}`);
  projectTasks.classList.toggle("closeTask");
}

function showModal(taskId) {
  console.log(taskId);

  let updateStatus = document.getElementById("updateStatus");
  let status = tasks.find((el) => el.id === taskId).status;

  if (status === "In Progress" || status === "Pending") {
    let modalElement = document.getElementById("updateStatusModal");
    let modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
    updateStatus.setAttribute("onclick", `updateStatus(${taskId})`);
  }
}

function updateStatus(taskId) {
  let task = tasks.find((el) => el.id === taskId);

  if (task.status === "In Progress") {
    task.status = "Pending";
  } else if (task.status === "Pending") {
    task.status = "In Progress";
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  rendertasks();
}

let sortStatus = {
  priority: false,
  dueDate: false,
};

// Hàm sắp xếp theo độ ưu tiên
function sortByPriority(tasks) {
  let priorityOrder = { Cao: 3, "Trung bình": 2, Thấp: 1 };

  return tasks.sort((a, b) => {
    if (sortStatus.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]; // Thấp -> Cao
    } else {
      return priorityOrder[b.priority] - priorityOrder[a.priority]; // Cao -> Thấp
    }
  });
}

// Hàm sắp xếp theo hạn chót
function sortByDueDate(tasks) {
  return tasks.sort((a, b) => {
    let dateA = new Date(a.dueDate);
    let dateB = new Date(b.dueDate);

    if (sortStatus.dueDate) {
      return dateB - dateA; // Xa -> Gần
    } else {
      return dateA - dateB; // Gần -> Xa
    }
  });
}

function sort() {
  let sortSelect = document.getElementById("sort");
  let sortValue = sortSelect.value;

  // Tạo bản sao của userTasks
  let sortedTasks = [...userTasks];

  if (sortValue === "priority") {
    sortStatus.priority = !sortStatus.priority;
    userTasks = sortByPriority(sortedTasks);
  } else if (sortValue === "dueDate") {
    sortStatus.dueDate = !sortStatus.dueDate;
    userTasks = sortByDueDate(sortedTasks);
  }

  if (sortValue) {
    rendertasks();
  }

  sortSelect.value = "";
}
