let projects = JSON.parse(localStorage.getItem("projects")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// let projectId = JSON.parse(localStorage.getItem("projectId")) || [];

let params = new URLSearchParams(window.location.search);
let projectId = params.get("id");

let loggedInEmail = localStorage.getItem("savedEmail");

let sectionStatus = {
  toDo: false,
  inProgress: false,
  pending: false,
  done: false,
};

function logOut() {
  localStorage.removeItem("savedEmail");
}

document.addEventListener("DOMContentLoaded", function () {
  if (!loggedInEmail) {
    window.location.href = "/pages/logIn.html";
  } else {
    renderProduct(projectId);
  }
});

function renderProduct(projectId) {
  let nameProject = document.getElementById("nameProject");
  let findProject = projects.find((el) => el.id == projectId);

  nameProject.textContent = findProject.projectName;

  let description = document.getElementById("description");
  description.textContent = findProject.description;

  let userName1 = document.getElementsByClassName("user-name")[0];
  let userName2 = document.getElementsByClassName("user-name")[1];
  let userAvatar1 = document.getElementsByClassName("user-avatar")[0];
  let userAvatar2 = document.getElementsByClassName("user-avatar")[1];
  let role1 = document.getElementsByClassName("user-role")[0];
  let role2 = document.getElementsByClassName("user-role")[1];

  userAvatar2.style.opacity = "1";

  if (findProject.members && findProject.members.length > 0) {
    if (findProject.members.length === 1) {
      userAvatar2.style.opacity = "0";
    }

    let user1 = users[findProject.members[0].userId - 1];
    let user2 = users[findProject.members[1]?.userId - 1];

    let userFullName1 = user1.fullName;
    let userFullName2 = user2?.fullName;

    let text1 = userFullName1.trim().split(" ");
    let initials1 = text1
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

    let text2 = userFullName2?.trim().split(" ");
    let initials2 = text2
      ?.map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

    userName1.textContent = userFullName1;
    userName2.textContent = userFullName2;
    userAvatar1.textContent = initials1;
    userAvatar2.textContent = initials2;
    userAvatar1.href = `mailto:${user1.email}`;
    userAvatar2.href = `mailto:${user2?.email}`;
    role1.textContent = findProject.members[0].role;
    role2.textContent = findProject.members[1]?.role;
  }
}

let filterTasks = tasks.filter((el) => el.projectId == projectId);

function renderToDo() {
  let renderToDo = filterTasks.filter(
    (el) => el.status.toLowerCase() === "to do"
  );
  renderStatusTask(renderToDo, "toDo");
}

function renderInProgress() {
  let renderInProgress = filterTasks.filter(
    (el) => el.status.toLowerCase() === "in progress"
  );
  renderStatusTask(renderInProgress, "inProgress");
}

function renderPending() {
  let renderPending = filterTasks.filter(
    (el) => el.status.toLowerCase() === "pending"
  );
  renderStatusTask(renderPending, "pending");
}

function renderDone() {
  let renderDone = filterTasks.filter(
    (el) => el.status.toLowerCase() === "done"
  );
  renderStatusTask(renderDone, "done");
}

function renderStatusTask(listStatus, list) {
  let status = document.getElementById(`${list}`);
  let img = document.getElementById(`${list}-img`);

  status.innerHTML = "";
  console.log("todo => ", sectionStatus[list]);

  if (sectionStatus[list]) {
    status.classList.add("closeStatus");
    img.src = "/assets/img/Triangle1.png";
    console.log("remove");
    sectionStatus[list] = false;
    console.log(sectionStatus);
  } else {
    console.log("show");
    status.classList.remove("closeStatus");
    img.src = "/assets/img/Triangle2x.png";
    sectionStatus[list] = true;
    console.log(sectionStatus);
  }

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
      progress === "trễ hẹn"
        ? "bg-danger"
        : progress === "có rủi ro"
        ? "bg-warning"
        : "bg-success";

    status.innerHTML += `<tr>
                <td>${task.taskName}</td>
                <td class="text-center">${user.fullName}</td>
                <td class="text-center"><span class="badge ${btnPriority}">${
      task.priority
    }</span></td>
                <td class="text-center" style="color: #0D6EFD;">${getMonthDay(
                  task.asignDate
                )}</td>
                <td class="text-center" style="color: #0D6EFD;">${getMonthDay(
                  task.dueDate
                )}</td>
                <td class="text-center"><span class="badge ${btnProgress}">${
      task.progress
    }</span></td> 
                <td class="text-center">
                    <button class="btn btn-warning sizeBtn me-3" data-bs-toggle="modal" data-bs-target="#addNewTaskModal" onclick="editTask(${
                      task.id
                    })">Sửa</button>
                    <button class="btn btn-danger sizeBtn" data-bs-toggle="modal" data-bs-target="#deleteTask" onclick="deleteTask(${
                      task.id
                    })">Xoá</button>
                </td>
            </tr>`;
  });
}

function getMonthDay(date) {
  if (!date) return "";

  let parts = date.split("-");
  if (parts.length !== 3) return "";

  let [year, month, day] = parts;

  return `${month} - ${day}`;
}

let isFormValid = true;

function validateTaskForm() {
  console.log("validate");

  let taskNameInput = document.getElementById("taskName");
  let errorTask = document.getElementById("error-nameTask");
  let newName = taskNameInput.value.trim();

  let assigneeSelect = document.getElementById("assignee");
  let errorAssignee = document.getElementById("error-assignee");
  let assignee = assigneeSelect.value;

  let statusSelect = document.getElementById("status");
  let errorStatus = document.getElementById("error-status");
  let status = statusSelect.value;

  let asignDateInput = document.getElementById("asignDate");
  let errorAsignDate = document.getElementById("error-asignDate");
  let asignDate = asignDateInput.value;

  let dueDateInput = document.getElementById("dueDate");
  let errorDueDate = document.getElementById("error-dueDate");
  let dueDate = dueDateInput.value;

  let prioritySelect = document.getElementById("priority");
  let errorPriority = document.getElementById("error-priority");
  let priority = prioritySelect.value;

  let progressSelect = document.getElementById("progress");
  let errorProgress = document.getElementById("error-progress");
  let progress = progressSelect.value;

  errorTask.textContent = "";
  errorAssignee.textContent = "";
  errorStatus.textContent = "";
  errorAsignDate.textContent = "";
  errorDueDate.textContent = "";
  errorPriority.textContent = "";
  errorProgress.textContent = "";

  taskNameInput.classList.remove("error-input");
  assigneeSelect.classList.remove("error-input");
  statusSelect.classList.remove("error-input");
  asignDateInput.classList.remove("error-input");
  dueDateInput.classList.remove("error-input");
  prioritySelect.classList.remove("error-input");
  progressSelect.classList.remove("error-input");

  let hasError = false;
  let task = tasks.find((el) => el.id == projectId);

  if (newName === "") {
    errorTask.textContent = "Tên nhiệm vụ không được để trống";
    taskNameInput.classList.add("error-input");
    hasError = true;
  }

  if (assignee === "") {
    errorAssignee.textContent = "Vui lòng chọn người được giao";
    assigneeSelect.classList.add("error-input");
    hasError = true;
  }

  if (status === "") {
    errorStatus.textContent = "Vui lòng chọn trạng thái";
    statusSelect.classList.add("error-input");
    hasError = true;
  }

  if (asignDate === "") {
    errorAsignDate.textContent = "Vui lòng chọn ngày bắt đầu";
    asignDateInput.classList.add("error-input");
    hasError = true;
  }

  if (dueDate === "") {
    errorDueDate.textContent = "Vui lòng chọn ngày đến hạn";
    dueDateInput.classList.add("error-input");
    hasError = true;
  }

  if (asignDate && dueDate) {
    let startDate = new Date(asignDate);
    let endDate = new Date(dueDate);
    if (startDate > endDate) {
      errorDueDate.textContent = "Ngày đến hạn phải sau ngày bắt đầu";
      dueDateInput.classList.add("error-input");
      hasError = true;
    }
  }

  if (priority === "") {
    errorPriority.textContent = "Vui lòng chọn mức độ ưu tiên";
    prioritySelect.classList.add("error-input");
    hasError = true;
  }

  if (progress === "") {
    errorProgress.textContent = "Vui lòng chọn trạng thái tiến độ";
    progressSelect.classList.add("error-input");
    hasError = true;
  }

  isFormValid = !hasError;
}

function editTask(taskId) {
  renderAssigneeId(projectId);

  let addBtn = document.getElementById("add-btn");
  addBtn.removeAttribute("onclick");
  addBtn.setAttribute("onclick", `confirmEditTask(${taskId})`);

  let modalTitle = document.getElementById("exampleModalLabel");
  modalTitle.textContent = `Sửa nhiệm vụ`;

  let taskName = document.getElementById("taskName");
  let errorSpan = document.getElementById("error-nameTask");
  taskName.classList.remove("error-input");
  errorSpan.textContent = "";

  let find = tasks.find((el) => el.id === taskId);

  // gán lên input
  if (find) {
    taskName.value = find.taskName;

    let statusValue = find.status.toLowerCase();

    if (statusValue === "to do") statusValue = "To do";
    if (statusValue === "in progress") statusValue = "In Progress";
    if (statusValue === "pending") statusValue = "Pending";
    if (statusValue === "done") statusValue = "Done";

    document.getElementById("status").value = statusValue;

    let formatDateForInput = (dateString) => {
      if (!dateString) return "";

      let date = new Date(dateString);
      let year = date.getFullYear();

      if (year < 1900 || year > 2100) return "";

      return dateString;
    };

    document.getElementById("asignDate").value = formatDateForInput(
      find.asignDate
    );
    document.getElementById("dueDate").value = formatDateForInput(find.dueDate);

    document.getElementById("priority").value = find.priority.toLowerCase();
    document.getElementById("progress").value = find.progress.toLowerCase();

    renderAssigneeId(find.assigneeId);
    validateTaskForm();
  } else {
    console.error(`Không tìm thấy nhiệm vụ với ID ${taskId}`);
  }
}

function confirmEditTask(taskId) {
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("addNewTaskModal")
  );
  let task = tasks.find((el) => el.id === taskId);

  validateTaskForm();

  let newName = document.getElementById("taskName").value.trim();
  if (newName.length < 8) {
    document.getElementById("error-nameTask").textContent =
      "Tên nhiệm vụ không được ít hơn 8 ký tự";
    document.getElementById("taskName").classList.add("error-input");
    return;
  }

  if (!isFormValid) {
    return;
  }

  let taskName = document.getElementById("taskName").value.trim();
  let assignee = document.getElementById("assignee").value.trim();

  let status = document.getElementById("status").value.trim();
  let asignDate = document.getElementById("asignDate").value.trim();
  let dueDate = document.getElementById("dueDate").value.trim();
  let priority = document.getElementById("priority").value.trim();
  let progress = document.getElementById("progress").value.trim();

  task.taskName = taskName;
  task.assigneeId = parseInt(assignee);
  task.status = status;
  task.asignDate = asignDate;
  task.dueDate = dueDate;
  task.priority = priority;
  task.progress = progress;

  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskName").value = "";
  document.getElementById("assignee").value = "";
  document.getElementById("status").value = "";
  document.getElementById("asignDate").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("progress").value = "";

  modal.hide();

  sectionStatus["toDo"] = !sectionStatus["toDo"];
  renderToDo();
  sectionStatus["inProgress"] = !sectionStatus["inProgress"];
  renderInProgress();
  sectionStatus["pending"] = !sectionStatus["pending"];
  renderPending();
  sectionStatus["done"] = !sectionStatus["done"];
  renderDone();
}

function renderAssigneeId(taskId) {
  let project = projects.find((el) => el.id == projectId);
  if (!project) return;

  let userAssignees = project.members.map((member) => member.userId);

  let assigneeSelect = document.getElementById("assignee");
  assigneeSelect.innerHTML = "";

  assigneeSelect.innerHTML += `<option value="">Chọn người phụ trách</option>`;
  users.forEach((user) => {
    if (userAssignees.includes(user.id)) {
      assigneeSelect.innerHTML += `<option value="${user.id}">${user.fullName}</option>`;
    }
  });
  let find = tasks.find((el) => el.id == taskId);
  let user = users.find((el) => el.id === find.assigneeId);
  document.getElementById("assignee").value = user.id;
}

function addNewTask() {
  console.log(1);

  let modalTitle = document.getElementById("exampleModalLabel");
  modalTitle.textContent = "Thêm nhiệm vụ";

  let addBtn = document.getElementById("add-btn");
  addBtn.removeAttribute("onclick");
  addBtn.setAttribute("onclick", `confirmAddTask()`);

  renderAssigneeId(projectId);

  document.getElementById("taskName").value = "";
  document.getElementById("assignee").value = "";
  document.getElementById("status").value = "";
  document.getElementById("asignDate").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("progress").value = "";
}

function confirmAddTask() {
  validateTaskForm();
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("addNewTaskModal")
  );

  let taskNameInput = document.getElementById("taskName");
  let errorTask = document.getElementById("error-nameTask");
  let newName = taskNameInput.value.trim();

  console.log(newName);

  let task = tasks.find((el) => el.taskName === newName);

  console.log(task);

  if (newName === "") {
    errorTask.textContent = "Tên nhiệm vụ không được để trống";
    taskNameInput.classList.add("error-input");
    return;
  }

  if (newName.length < 8) {
    errorTask.textContent = "Tên nhiệm vụ không được ít hơn 8 ký tự";
    taskNameInput.classList.add("error-input");
    return;
  }

  if (task?.taskName === newName && newName) {
    errorTask.textContent = "Tên nhiệm vụ không được trùng nhau";
    taskNameInput.classList.add("error-input");
    return;
  }

  if (!isFormValid) {
    console.log("lỗi validate");
    return;
  }

  let newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    taskName: newName,
    assigneeId: parseInt(document.getElementById("assignee").value),
    status: document.getElementById("status").value,
    asignDate: document.getElementById("asignDate").value,
    dueDate: document.getElementById("dueDate").value,
    priority: document.getElementById("priority").value,
    progress: document.getElementById("progress").value,
    projectId: projectId,
  };

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  errorTask.textContent = "";
  taskNameInput.classList.remove("error-input");

  modal.hide();

  renderByStatus(document.getElementById("status").value);
}

function deleteTask(taskId) {
  let confirmDeleteTask = document.getElementById("deleteTask");

  confirmDeleteTask.setAttribute("onclick", `confirmDeleteTask(${taskId})`);
}

function confirmDeleteTask(taskId) {
  let deleteIndex = tasks.findIndex((el) => el.id === taskId);

  let status = tasks[deleteIndex].status;

  tasks.splice(deleteIndex, 1);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderByStatus(status);
}

function renderByStatus(status) {
  filterTasks = tasks.filter((el) => el.projectId == projectId);
  switch (status) {
    case "To do":
      sectionStatus["toDo"] = !sectionStatus["toDo"];
      renderToDo();
      break;
    case "In inProgress":
      sectionStatus["inProgress"] = !sectionStatus["inProgress"];
      renderInProgress();
      break;
    case "Pending":
      sectionStatus["pending"] = !sectionStatus["pending"];
      renderPending();
      break;
    case "Done":
      sectionStatus["done"] = !sectionStatus["done"];
      renderDone();
      break;
  }
}

function dashboard() {
  window.location.href = "/pages/dashboard.html";
}

function addNewUser() {
  let modal = bootstrap.Modal.getInstance(document.getElementById("addUser"));

  let emailInput = document.getElementById("email-user");
  let emailUser = emailInput.value.trim();
  let errorEmail = document.getElementById("error-emailUser");

  let roleInput = document.getElementById("role");
  let roleUser = roleInput.value.trim();
  let errorRole = document.getElementById("error-role");

  let isValid = true;

  errorEmail.textContent = "";
  emailInput.classList.remove("error-input");
  errorRole.textContent = "";
  roleInput.classList.remove("error-input");

  let emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;

  if (emailUser === "") {
    errorEmail.textContent = "Email người dùng không được để trống";
    emailInput.classList.add("error-input");
    isValid = false;
  } else if (emailUser.length < 8) {
    errorEmail.textContent = "Email người dùng không được ít hơn 8 ký tự";
    emailInput.classList.add("error-input");
    isValid = false;
  } else if (!emailRegex.test(emailUser)) {
    errorEmail.textContent =
      "Email phải có đuôi @gmail.com, @yahoo.com hoặc @outlook.com.";
    emailInput.classList.add("error-input");
    isValid = false;
  }

  let user = users.find((el) => el.email === emailUser);
  if (user) {
    let project = projects.find((el) => el.id == projectId);
    let member = project.members.some((el) => el.userId === user.id);

    if (member) {
      errorEmail.textContent = "Người dùng này đã là thành viên của dự án.";
      emailInput.classList.add("error-input");
      isValid = false;
    }
  } else {
    errorEmail.textContent = "Email này không tồn tại trong hệ thống.";
    emailInput.classList.add("error-input");
    isValid = false;
  }

  if (roleUser === "") {
    errorRole.textContent = "Vai trò người dùng không được để trống";
    roleInput.classList.add("error-input");
    isValid = false;
  }
  // else if (roleUser.length < 8) {
  //   errorRole.textContent = "Vai trò người dùng không được ít hơn 8 ký tự";
  //   roleInput.classList.add("error-input");
  //   isValid = false;
  // }

  if (isValid) {
    let project = projects.find((el) => el.id == projectId);
    project.members.push({ userId: user.id, role: roleUser });

    localStorage.setItem("projects", JSON.stringify(projects));

    emailInput.value = "";
    roleInput.value = "";

    modal.hide();
    renderProduct(projectId);
  }
}

function membersProject(cpproject = null) {
  projects = JSON.parse(localStorage.getItem("projects")) || [];

  let membersContainer = document.getElementById("membersContainer");
  membersContainer.innerHTML = "";

  let project = cpproject;

  if (!project) {
    project = projects.find((el) => el.id == projectId);
  }

  if (!project) return;

  project.members.forEach((member) => {
    let user = users.find((u) => u.id === member.userId);
    if (!user) return;

    let initials = user.fullName
      .trim()
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

    membersContainer.innerHTML += `
      <div class="d-flex justify-content-between align-items-center mb-3 w-100">
        <div class="d-flex align-items-center w-50">
          <a href="mailto:${user.email}"
             class="user-avatar d-flex justify-content-center align-items-center me-3 ms-4"
             style="background-color: #007bff; width: 40px; height: 40px; border-radius: 50%; color: white; text-decoration: none;">
            ${initials}
          </a>
          <div>
            <div class="user-name fw-bold">${user.fullName}</div>
            <div class="user-email text-muted small">${user.email}</div>
          </div>
        </div>
        <div class="w-50 d-flex align-items-center ms-5">
          <input id="${member.userId}" type="text" class="form-control form-control-sm w-75 me-2" value="${member.role}">
          <img src="/assets/img/Trash.png" alt="delete" style="width: 20px; height: 20px;" onclick = "deleteUser(${user.id})">
        </div>
      </div>`;
  });
}

function editRole() {
  let project = projects.find((el) => el.id == projectId);

  project.members.forEach((member) => {
    let input = document.getElementById(`${member.userId}`);
    if (input) {
      member.role = input.value;
    }
  });

  renderProduct(projectId);
  localStorage.setItem("projects", JSON.stringify(projects));
}

let copyProject = JSON.parse(localStorage.getItem("projects")) || [];

function deleteUser(userId) {
  let project = projects.find((el) => el.id == projectId);

  let cpproject = copyProject.find((el) => el.id == projectId);
  console.log(userId);

  console.log(cpproject);

  let deleteIndex = cpproject.members.findIndex((el) => {
    return el.userId == userId;
  });
  console.log(deleteIndex);

  let usersTask = document.getElementById("usersTask");

  if (
    project.members.length !== cpproject.members.length ||
    !usersTask.classList.contains("show")
  ) {
    copyProject = JSON.parse(localStorage.getItem("projects")) || [];
  }

  cpproject.members.splice(deleteIndex, 1);

  membersProject(
    project.members.length !== cpproject.members.length ? cpproject : project
  );

  let editRole = document.getElementById("editRole");

  editRole.addEventListener("click", function () {
    localStorage.setItem("projects", JSON.stringify(copyProject));

    projects = JSON.parse(localStorage.getItem("projects")) || [];

    renderProduct(projectId);
  });
}

document.getElementById("search").addEventListener("input", function () {
  let searchValue = document
    .getElementById("search")
    .value.trim()
    .toLowerCase();

  let tasksInProject = tasks.filter((el) => el.projectId == projectId);
  let filteredTasks = tasksInProject.filter((task) =>
    task.taskName.toLowerCase().includes(searchValue)
  );

  // Reset trạng thái hiển thị
  sectionStatus = {
    toDo: true,
    inProgress: true,
    pending: true,
    done: true,
  };

  filteredTasks.forEach((task) => {
    let status = task.status.toLowerCase();
    if (status === "to do") sectionStatus.toDo = false;
    if (status === "in progress") sectionStatus.inProgress = false;
    if (status === "pending") sectionStatus.pending = false;
    if (status === "done") sectionStatus.done = false;
  });

  renderToDo();
  renderInProgress();
  renderPending();
  renderDone();
});
