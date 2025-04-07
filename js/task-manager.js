let projects = JSON.parse(localStorage.getItem("projects")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let projectId = JSON.parse(localStorage.getItem("projectId")) || [];

let loggedInEmail = localStorage.getItem("savedEmail");

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
  let findProject = projects.find((el) => el.id === projectId);
  if (!findProject) {
    console.error(`Không tìm thấy dự án với ID ${projectId}`);
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
      console.error("Không tìm thấy user cho một hoặc cả hai thành viên");
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
  }
}

// let filterTasks = tasks.filter((el) => el.projectId === projectId);
// console.log();

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
                    <button class="btn btn-warning sizeBtn me-3" data-bs-toggle="modal" data-bs-target="#addNewTask" onclick="editTask(${
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

  const parts = date.split("-");
  if (parts.length !== 3) return "";

  const [year, month, day] = parts;

  return `${month} - ${day}`;
}

let isFormValid = true;

function validateTaskForm() {
  let taskNameInput = document.getElementById("taskName");
  let errorTask = document.getElementById("error-nameTask");
  let newName = taskNameInput.value.trim(); // Sửa ở đây: lấy .value

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

  const resetErrors = () => {
    errorTask.textContent = "";
    // errorAssignee.textContent = "";
    // errorStatus.textContent = "";
    errorAsignDate.textContent = "";
    errorDueDate.textContent = "";
    // errorPriority.textContent = "";
    // errorProgress.textContent = "";

    taskNameInput.classList.remove("error-input");
    assigneeSelect.classList.remove("error-input");
    statusSelect.classList.remove("error-input");
    asignDateInput.classList.remove("error-input");
    dueDateInput.classList.remove("error-input");
    prioritySelect.classList.remove("error-input");
    progressSelect.classList.remove("error-input");
  };

  resetErrors();

  let hasError = false;

  console.log(newName + "sd");

  if (newName === "") {
    errorTask.textContent = "Tên tác vụ không được để trống";
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
    if (statusValue === "Pending") statusValue = "Pending";
    if (statusValue === "Done") statusValue = "Done";

    document.getElementById("status").value = statusValue;

    const formatDateForInput = (dateString) => {
      if (!dateString) return "";

      const date = new Date(dateString);
      const year = date.getFullYear();

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
  } else {
    console.error(`Không tìm thấy nhiệm vụ với ID ${taskId}`);
  }
}

function confirmEditTask(taskId) {
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("addNewTask")
  );
  let task = tasks.find((el) => el.id === taskId);

  validateTaskForm();

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

  renderToDo();
  renderInProgress();
  renderPending();
  renderDone();
}

function renderAssigneeId(taskId) {
  console.log(taskId);

  let project = projects.find((el) => el.id === projectId);
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
  let find = tasks.find((el) => el.id === taskId);
  let user = users.find((el) => el.id === find.assigneeId);
  document.getElementById("assignee").value = user.id;
}

function addNewTask() {
  let modalTitle = document.getElementById("exampleModalLabel");
  modalTitle.textContent = "Thêm nhiệm vụ";

  let addBtn = document.getElementById("add-btn");
  addBtn.removeAttribute("onclick");
  addBtn.setAttribute("onclick", `confirmAddTask(${projectId})`);

  renderAssigneeId(projectId);

  document.getElementById("taskName").value = "";
  document.getElementById("assignee").value = "";
  document.getElementById("status").value = "";
  document.getElementById("asignDate").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("progress").value = "";
}

function confirmAddTask(taskId) {
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("addNewTask")
  );
  validateTaskForm();

  if (!isFormValid) {
    return; // Không đóng modal nếu có lỗi
  }

  let taskNameInput = document.getElementById("taskName");
  let errorTask = document.getElementById("error-nameTask");
  let newName = taskNameInput.value.trim();

  let findTask = tasks.find((el) => el.taskName === newName); // Sửa el.fullName thành el.taskName

  if (findTask) {
    // Nếu tìm thấy nhiệm vụ trùng tên
    errorTask.textContent = `Không được trùng tên nhiệm vụ`;
    taskNameInput.classList.add("error-input");
    return; // Không đóng modal
  }

  // Thêm nhiệm vụ mới
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

  renderToDo();
  renderInProgress();
  renderPending();
  renderDone();
}

function deleteTask(taskId) {
  let confirmDeleteTask = document.getElementById("deleteTask");

  confirmDeleteTask.setAttribute("onclick", `confirmDeleteTask(${taskId})`);

  console.log(confirmDeleteTask);
}

function confirmDeleteTask(taskId) {
  let deleteIndex = tasks.findIndex((el) => el.id === taskId);

  tasks.splice(deleteIndex, 1);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderToDo();
  renderInProgress();
  renderPending();
  renderDone();
}
