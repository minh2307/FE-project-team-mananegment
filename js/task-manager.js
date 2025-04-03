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
    const user1 = users[findProject.members[0].userId - 1];
    const user2 = users[findProject.members[1].userId - 1];
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

function renderTable() {
  let toDo = document.getElementById("toDo");

  let renderToDo = tasks.filter((el) => el.status === "To do");

  console.log(renderToDo);

  renderToDo.forEach((task) => {
    let user = users.find((u) => u.id === task.assigneeId);

    toDo.innerHTML += `<tr class="collapse show" id="todoTasks">
                <td>${task.taskName}</td>
                <td class="text-center">${user.fullName}</td>
                <td class="text-center"><span class="badge bg-info">${task.priority}</span></td>
                <td class="text-center" style="color: #0D6EFD;">${task.asignDate}</td>
                <td class="text-center" style="color: #0D6EFD;">${task.dueDate}</td>
                <td class="text-center"><span class="badge bg-success">${task.progress}</span></td> 
                <td class="text-center">
                    <button class="btn btn-warning sizeBtn me-3">Sửa</button>
                    <button class="btn btn-danger sizeBtn" data-bs-toggle="modal" data-bs-target="#deleteTask">Xóa</button>
                </td>
            </tr>`;
  });
}

renderTable();
