let projects = JSON.parse(localStorage.getItem("projects")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let loggedInEmail = localStorage.getItem("savedEmail");

//tìm id của người mới đăng nhập
let loggedInUser = users.find((user) => user.email === loggedInEmail);
let loggedInUserId = loggedInUser ? loggedInUser.id : null;

// Hàm phân trang
function pagination(activePage = 1, filteredProjects) {
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  let totalPages = Math.ceil(filteredProjects.length / 5);

  // Nút Previous
  pagination.innerHTML += `
          <button class="btn btn-outline-primary btnPagination" id="previous" 
                  style="border-radius: 5px 0px 0px 5px; color: #4E5A66; opacity: ${
                    activePage === 1 ? "0.4" : "1"
                  };" 
                  onclick="renderProjects(${activePage - 1})" 
                  ${activePage === 1 ? "disabled" : ""}><</button>
      `;

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
              <button class="btn btn-outline-primary btnPagination ${
                i === activePage ? "active" : ""
              }" 
                      onclick="renderProjects(${i})">${i}</button>
          `;
  }

  // Nút Next
  pagination.innerHTML += `
          <button class="btn btn-outline-primary btnPagination" id="next"
                  style="border-radius: 0px 5px 5px 0px; color: #4E5A66; opacity: ${
                    activePage === totalPages ? "0.4" : "1"
                  };" 
                  onclick="renderProjects(${activePage + 1})" 
                  ${activePage === totalPages ? "disabled" : ""}>></button>
      `;
}

//hàm in dự án
function renderProjects(indexPage) {
  let contentProjects = document.getElementById("contentProject");
  contentProjects.innerHTML = "";

  if (loggedInUserId) {
    // Lọc ra các dự án có members hợp lệ (!null)
    let validProjects = projects.filter((project) =>
      Array.isArray(project.members)
    );
    //lọc ra dự án bằng userId
    let isProjectOwner = validProjects.some((project) =>
      project.members.some(
        (member) =>
          member.userId === loggedInUserId && member.role === "Project owner"
      )
    );

    if (isProjectOwner) {
      filteredProjects = projects;
    } else {
      filteredProjects = validProjects.filter((project) =>
        project.members.some((member) => member.userId === loggedInUserId)
      );
    }
  }

  // Phân trang dữ liệu
  let end = indexPage * 5;
  let start = end - 5;
  let currentData = filteredProjects.slice(start, end);

  currentData.forEach((element) => {
    contentProjects.innerHTML += `
              <tr>
                  <td class="p-3 text-center">${element.id}</td>
                  <td class="p-3">${element.projectName}</td>
                  <td class="d-flex justify-content-around">
                      <button class="btn btn-warning sizeBtn-1" data-bs-toggle="modal" data-bs-target="#addNewProject" onclick="editProject(${element.id})">Sửa</button>
                      <button class="btn btn-danger sizeBtn-2" data-bs-toggle="modal" data-bs-target="#deleteProject" onclick="deleteProject(${element.id})">Xoá</button>
                      <button class="btn btn-primary sizeBtn-1">Chi tiết</button>
                  </td>
              </tr>
          `;
  });

  pagination(indexPage, filteredProjects);
}

function add() {
  let addBtn = document.getElementById("add-btn");
  addBtn.removeAttribute("onclick");
  let add = document.getElementById("exampleModalLabel");
  add.textContent = `Thêm dự án`;

  // Reset lại form khi mở modal
  document.getElementById("form").reset();

  // Xoá lỗi và class lỗi nếu có
  let projectInput = document.getElementById("project-name");
  let errorSpan = document.getElementById("error-addProject");
  projectInput.classList.remove("error-input");
  errorSpan.textContent = "";

  addBtn.setAttribute("onclick", `addProject()`);
}

function addProject() {
  let project = document.getElementById("project-name");
  let projectName = project.value.trim();
  let errorProject = document.getElementById("error-addProject");
  let addBtn = document.getElementById("add-btn");

  console.log(errorProject);

  if (projectName === "") {
    errorProject.textContent = `Tên dự án không được để trống`;
    project.classList.add("error-input");
    addBtn.removeAttribute("data-bs-dismiss");
    return;
  }

  let findIndex = projects.findIndex(
    (el) => el.projectName.toLowerCase() === projectName.toLowerCase()
  );
  if (findIndex !== -1) {
    errorProject.textContent = `Tên dự án không được trùng nhau`;
    project.classList.add("error-input");
    addBtn.removeAttribute("data-bs-dismiss");
    return;
  }

  addBtn.setAttribute("data-bs-dismiss", "modal");
  project.value = "";
  addBtn.click();
  addBtn.removeAttribute("data-bs-dismiss");
  errorProject.textContent = ``;
  project.classList.remove("error-input");

  // Thêm vào danh sách
  projects.push({
    id: projects.length > 0 ? projects[projects.length - 1].id + 1 : 1,
    projectName: projectName,
  });

  localStorage.setItem("projects", JSON.stringify(projects));

  let indexPage = Math.ceil(projects.length / 5);

  renderProjects(indexPage);
}

function editProject(projectId) {
  let addBtn = document.getElementById("add-btn");
  addBtn.removeAttribute("onclick");
  addBtn.setAttribute("onclick", `cfeditProject(${projectId})`);
  let add = document.getElementById("exampleModalLabel");
  add.textContent = `Sửa dự án`;

  // Xóa lỗi và class lỗi nếu có
  let projectInput = document.getElementById("project-name");
  let errorSpan = document.getElementById("error-addProject");
  projectInput.classList.remove("error-input");
  errorSpan.textContent = "";

  let find = projects.find((el) => el.id === projectId);
  if (find) {
    projectInput.value = find.projectName;
  } else {
    console.error(`Không tìm thấy dự án với ID: ${projectId}`);
  }
}

function cfeditProject(projectId) {
  let errorProject = document.getElementById("error-addProject");
  let addBtn = document.getElementById("add-btn");
  let projectInput = document.getElementById("project-name");
  let find = projects.find((el) => el.id === projectId);

  if (projectInput.value === "") {
    errorProject.textContent = `Tên dự án không được để trống`;
    projectInput.classList.add("error-input");
    addBtn.removeAttribute("data-bs-dismiss");
    return;
  }

  if (find) {
    // Kiểm tra xem giá trị mới có khác giá trị cũ không
    if (projectInput.value && projectInput.value !== find.projectName) {
      find.projectName = projectInput.value;

      addBtn.setAttribute("data-bs-dismiss", "modal");
      projectInput.value = "";
      addBtn.click();
      addBtn.removeAttribute("data-bs-dismiss");
      errorProject.textContent = ``;
      projectInput.classList.remove("error-input");

      let indexPage = Math.ceil((projects.indexOf(find) + 1) / 5);
      renderProjects(indexPage);
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  } else {
    console.error(`Không tìm thấy dự án với ID: ${projectId}`);
  }
}

function deleteProject(projectId) {
  let cfDelProject = document.getElementById("confirm-deleteProject");

  cfDelProject.setAttribute("onclick", `cfDelProject(${projectId})`);

  console.log(cfDelProject);
}

function cfDelProject(projectId) {
  projects.splice(projectId - 1, 1);

  let indexPage = Math.ceil(projectId / 5);

  renderProjects(indexPage);
  localStorage.setItem("projects", JSON.stringify(projects));
}

function logOut() {
  localStorage.removeItem("savedEmail");
}
// Kiểm tra đăng nhập khi tải trang
document.addEventListener("DOMContentLoaded", function () {
  // khi trang html load xong
  if (!loggedInEmail) {
    window.location.href = "/pages/logIn.html";
  } else {
    renderProjects(1);
  }
});
