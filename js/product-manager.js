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
  if (findProject) {
    nameProject.textContent = findProject.projectName;
  } else {
    console.error(`Không tìm thấy dự án với ID: ${projectId}`);
    return;
  }

  //renderNameProject
  nameProject.textContent = findProject.projectName;

  //renderDescription
  let description = document.getElementById("description");
  description.textContent = findProject.description;

  //renderMember
  let userName1 = document.getElementsByClassName("user-name")[0];
  let userName2 = document.getElementsByClassName("user-name")[1];

  let userAvatar1 = document.getElementsByClassName("user-avatar")[0];
  let userAvatar2 = document.getElementsByClassName("user-avatar")[1];

  if (findProject.members && findProject.members.length >= 2) {
    let userFullName1 = users[findProject.members[0].userId - 1].fullName;
    let userFullName2 = users[findProject.members[1].userId - 1].fullName;

    console.log(userFullName1);

    let text1 = userFullName1.trim().split(" ");
    let initials1 = text1
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

    let text2 = userFullName1.trim().split(" ");
    let initials2 = text2
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

    userName1.textContent = userFullName1;
    userName2.textContent = userFullName2;
    userAvatar1.textContent = initials1;
    userAvatar2.textContent = initials2;
    userAvatar1.href = `mailto:${
      users[findProject.members[0].userId - 1].email
    }`;
    userAvatar2.href = `mailto:${
      users[findProject.members[1].userId - 1].email
    }`;

    console.log(initials1);
    console.log(users[findProject.members[1].userId - 1].email);
  }
}
