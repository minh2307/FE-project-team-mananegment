let projects = JSON.parse(localStorage.getItem("projects")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let projectId = JSON.parse(localStorage.getItem("projectId")) || [];

let loggedInEmail = localStorage.getItem("savedEmail");

function logOut() {
  localStorage.removeItem("savedEmail");
}

// Kiểm tra đăng nhập khi tải trang
document.addEventListener("DOMContentLoaded", function () {
  if (!loggedInEmail) {
    window.location.href = "/pages/logIn.html";
  } else {
    renderProduct(projectId);
  }
});

function renderProduct(projectId) {
  let nameProject = document.getElementById("nameProject");
  let findProject = projects.find((el) => el.id === projectId);
  if (!findProject) {
    console.error(`Không tìm thấy dự án với ID: ${projectId}`);
    return;
  }

  nameProject.textContent = findProject.projectName;

  let description = document.getElementById("description");
  description.textContent = findProject.description;

  let userName1 = document.getElementsByClassName("user-name")[0];
  let userName2 = document.getElementsByClassName("user-name")[1];
  let userAvatar1 = document.getElementsByClassName("user-avatar")[0];
  let userAvatar2 = document.getElementsByClassName("user-avatar")[1];

  if (findProject.members && findProject.members.length >= 2) {
    let user1 = users[findProject.members[0].userId - 1];
    let user2 = users[findProject.members[1].userId - 1];
    if (!user1 || !user2) {
      console.error("Không tìm thấy user cho một hoặc cả hai members");
      return;
    }

    let userFullName1 = user1.fullName;
    let userFullName2 = user2.fullName;

    let text1 = userFullName1.trim().split(" ");
    let initials1 = text1
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

    let text2 = userFullName2.trim().split(" ");
    let initials2 = text2
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

    userName1.textContent = userFullName1;
    userName2.textContent = userFullName2;
    userAvatar1.textContent = initials1;
    userAvatar2.textContent = initials2;
    userAvatar1.href = `mailto:${user1.email}`;
    userAvatar2.href = `mailto:${user2.email}`;

    console.log(initials1);
    console.log(user2.email);
  }
}

function renderToDo() {
  let renderToDo = tasks.filter((el) => el.status.toLowerCase() === "to do");

  renderStatusTask(renderToDo, "toDo");
}

function renderInProgress() {
  let renderInProgress = tasks.filter(
    (el) => el.status.toLowerCase() === "in progress"
  );

  renderStatusTask(renderInProgress, "inProgress");
}

function renderPending() {
  let renderPending = tasks.filter(
    (el) => el.status.toLowerCase() === "pending"
  );

  renderStatusTask(renderPending, "pending");
}

function renderDone() {
  let renderDone = tasks.filter((el) => el.status.toLowerCase() === "done");

  renderStatusTask(renderDone, "done");
}

function renderStatusTask(listStatus, list) {
  console.log("check");

  // tìm tên người phụ trách
  let status = document.getElementById(`${list}`);
  status.classList.toggle("showStatus");
  status.innerHTML = "";

  listStatus.forEach((task) => {
    let user = users.find((u) => u.id === task.assigneeId);

    let priority = task.priority.toLowerCase().trim();
    let btnPriority =
      priority === "thấp"
        ? "bg-info"
        : priority === "trung bình"
        ? "bg-warning"
        : "bg-danger";

    let progress = task.progress.toLowerCase().trim();
    let btnProgress =
      progress === "trễ"
        ? "bg-danger"
        : progress === "có rủi ro"
        ? "bg-warning"
        : "bg-success";

    status.innerHTML += `<tr>
                <td>${task.taskName}</td>
                <td class="text-center">${user.fullName}</td>
                <td class="text-center"><span class="badge ${btnPriority}">${task.priority}</span></td>
                <td class="text-center" style="color: #0D6EFD;">${task.asignDate}</td>
                <td class="text-center" style="color: #0D6EFD;">${task.dueDate}</td>
                <td class="text-center"><span class="badge ${btnProgress}">${task.progress}</span></td> 
                <td class="text-center">
                    <button class="btn btn-warning sizeBtn me-3" data-bs-toggle="modal" data-bs-target="#addNewTask" onclick="editTask(${task.id})">Sửa</button>
                    <button class="btn btn-danger sizeBtn" data-bs-toggle="modal" data-bs-target="#deleteTask">Xóa</button>
                </td>
            </tr>`;
  });
}

function editTask(taskId) {
  let addBtn = document.getElementById("add-btn");
  addBtn.removeAttribute("onclick");
  addBtn.setAttribute("onclick", `cfeditTask(${taskId})`);
  let add = document.getElementById("exampleModalLabel");
  add.textContent = `Sửa nhiệm vụ`;

  let taskName = document.getElementById("taskName");
  let errorSpan = document.getElementById("error-nameTask");
  taskName.classList.remove("error-input");
  errorSpan.textContent = "";

  let find = tasks.find((el) => el.id === taskId);
  console.log(find);

  if (find) {
    taskName.value = find.taskName;
  } else {
    console.error(`Không tìm thấy dự án với ID: ${taskId}`);
  }
}

function cfeditTask(taskId) {
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("addNewTask")
  );

  let errorTask = document.getElementById("error-nameTask");
  let taskNameInput = document.getElementById("taskName");
  let newName = taskNameInput.value.trim();
  let assignee = document.getElementById("assignee");

  let task = tasks.find((el) => el.id === taskId);
  let user = users.find((el) => el.id === task.assigneeId);

  if (newName === "") {
    errorTask.textContent = "Tên nhiệm vụ không được để trống";
    taskNameInput.classList.add("error-input");
    return;
  }

  if (newName === task.taskName) {
    errorTask.textContent = "Tên nhiệm vụ chưa thay đổi";
    taskNameInput.classList.add("error-input");
    return;
  }

  task.taskName = newName;
  // task.assignee = ;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  errorTask.textContent = "";
  taskNameInput.classList.remove("error-input");
  taskNameInput.value = "";

  modal.hide();
}
