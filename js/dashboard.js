let projects = JSON.parse(localStorage.getItem("projects")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let loggedInEmail = localStorage.getItem("savedEmail");
let perPage = 5;
let currentPage = 1;

// Kiểm tra đăng nhập khi tải trang
document.addEventListener("DOMContentLoaded", function () {
  // khi trang html load xong
  if (!loggedInEmail) {
    window.location.href = "/pages/logIn.html";
  } else {
    renderProjects(1);
  }
});

//tìm id của người mới đăng nhập
let loggedInUser = users.find((user) => user.email === loggedInEmail);
let loggedInUserId = loggedInUser ? loggedInUser.id : null;

// Hàm phân trang
function pagination(activePage = 1, filteredProjects) {
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  let totalPages = Math.ceil(filteredProjects.length / perPage);

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
  let currentPage = indexPage;
  let contentProjects = document.getElementById("contentProject");
  contentProjects.innerHTML = "";

  let filteredProjects = [];
  if (loggedInUserId) {
    filteredProjects = projects.filter(
      (project) =>
        Array.isArray(project.members) &&
        project.members.some(
          (member) =>
            member.userId === loggedInUserId && member.role === "Project owner"
        )
    );
  }

  // Lọc theo từ khóa tìm kiếm
  let searchValue = document
    .getElementById("search")
    .value.trim()
    .toLowerCase();
  let searchedProjects = filteredProjects;
  if (searchValue) {
    searchedProjects = filteredProjects.filter((project) =>
      project.projectName.toLowerCase().includes(searchValue)
    );
  }

  // Phân trang

  let start = (currentPage - 1) * perPage;
  let end = start + perPage;
  let currentData = searchedProjects.slice(start, end);

  // Render dữ liệu
  let html = "";
  currentData.forEach((element) => {
    html += `
        <tr>
          <td class="p-3 text-center">${element.id}</td>
          <td class="p-3">${element.projectName}</td>
          <td class="d-flex justify-content-center">
            <button class="btn btn-warning sizeBtn-1 me-2" data-bs-toggle="modal" data-bs-target="#addNewProject" onclick="editProject(${element.id})">Sửa</button>
            <button class="btn btn-danger sizeBtn-2 me-2" data-bs-toggle="modal" data-bs-target="#deleteProject" onclick="deleteProject(${element.id})">Xoá</button>
            <button class="btn btn-primary sizeBtn-1" onclick="productManager(${element.id})">Chi tiết</button>
          </td>
        </tr>
      `;
  });
  contentProjects.innerHTML = html;

  // Gọi hàm phân trang
  pagination(indexPage, searchedProjects);
}

function add() {
  let addBtn = document.getElementById("add-btn");
  addBtn.removeAttribute("onclick");
  let add = document.getElementById("exampleModalLabel");
  add.textContent = `Thêm dự án`;

  document.getElementById("form").reset();

  let projectInput = document.getElementById("project-name");
  let errorSpan = document.getElementById("error-addProject");
  projectInput.classList.remove("error-input");
  errorSpan.textContent = "";

  let descriptionInput = document.getElementById("description");
  let errorDescription = document.getElementById("error-description");
  descriptionInput.classList.remove("error-input");
  errorDescription.textContent = "";

  addBtn.setAttribute("onclick", `addProject()`);
}

function addProject() {
  let isValid = true;
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("addNewProject")
  );
  let project = document.getElementById("project-name");
  let projectName = project.value.trim();
  let errorProject = document.getElementById("error-addProject");

  let textterea = document.getElementById("description");
  let description = textterea.value.trim();
  let errorDescription = document.getElementById("error-description");
  console.log(errorProject);

  if (projectName === "") {
    errorProject.textContent = `Tên dự án không được để trống`;
    project.classList.add("error-input");
    isValid = false;
  } else if (projectName.length < 8) {
    errorProject.textContent = `Mô tả dự án không được dưới 8 ký tự`;
    project.classList.add("error-input");
    isValid = false;
  }

  if (description === "") {
    errorDescription.textContent = `Mô tả dự án không được để trống`;
    textterea.classList.add("error-input");
    isValid = false;
  } else if (description.length < 10) {
    errorDescription.textContent = `Mô tả dự án không được dưới 10 ký tự`;
    textterea.classList.add("error-input");
    isValid = false;
  }

  let findIndex = projects.findIndex(
    (el) => el.projectName.toLowerCase() === projectName.toLowerCase()
  );
  if (findIndex !== -1) {
    errorProject.textContent = `Tên dự án không được trùng nhau`;
    project.classList.add("error-input");
    isValid = false;
  }

  let findDescription = projects.findIndex(
    (el) => el.description.toLowerCase() === description.toLowerCase()
  );
  if (findDescription !== -1) {
    errorDescription.textContent = `Mô tả dự án không được trùng nhau`;
    textterea.classList.add("error-input");
    isValid = false;
  }

  if (isValid) {
    project.value = "";
    errorProject.textContent = ``;
    project.classList.remove("error-input");
    modal.hide();

    let userId = users.find((el) => el.email === loggedInEmail);
    console.log();

    projects.push({
      id: projects.length > 0 ? projects[projects.length - 1].id + 1 : 1,
      projectName: projectName,
      description: description,
      members: [{ userId: userId.id, role: "Project owner" }],
    });

    localStorage.setItem("projects", JSON.stringify(projects));

    let indexPage = Math.ceil(projects.length / 5);

    renderProjects(indexPage);
  }
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

  let descriptionInput = document.getElementById("description");
  let errorDescription = document.getElementById("error-description");
  descriptionInput.classList.remove("error-input");
  errorDescription.textContent = "";

  let find = projects.find((el) => el.id === projectId);
  if (find) {
    projectInput.value = find.projectName;
    descriptionInput.value = find.description;
  } else {
    console.error(`Không tìm thấy dự án với ID: ${projectId}`);
  }
}

function cfeditProject(projectId) {
  let isValid = true;
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("addNewProject")
  );

  let errorProject = document.getElementById("error-addProject");
  let errorDescription = document.getElementById("error-description");
  let projectInput = document.getElementById("project-name");
  let descriptionInput = document.getElementById("description");

  let newName = projectInput.value.trim();
  let newDescription = descriptionInput.value.trim();

  let project = projects.find((el) => el.id === projectId);

  let check = projects.some(
    (el) =>
      el.projectName.toLowerCase() === newName.toLowerCase() &&
      el.id !== projectId
  );

  if (newName === "") {
    errorProject.textContent = `Tên dự án không được để trống`;
    projectInput.classList.add("error-input");
    isValid = false;
  } else if (newName === project.projectName) {
    errorProject.textContent = `Tên dự án chưa thay đổi`;
    projectInput.classList.add("error-input");
    isValid = false;
  } else if (check) {
    errorProject.textContent = `Tên dự án không được trùng nhau`;
    projectInput.classList.add("error-input");
    isValid = false;
  } else if (newName.length < 8) {
    errorProject.textContent = `Mô tả dự án không được dưới 8 ký tự`;
    projectInput.classList.add("error-input");
    isValid = false;
  }

  check = projects.some(
    (el) =>
      el.description.toLowerCase() === newDescription.toLowerCase() &&
      el.id !== projectId
  );
  if (newDescription === "") {
    errorDescription.textContent = `Mô tả dự án không được để trống`;
    descriptionInput.classList.add("error-input");
    isValid = false;
  } else if (newDescription === project.description) {
    errorDescription.textContent = `Mô tả dự án chưa thay đổi`;
    descriptionInput.classList.add("error-input");
    isValid = false;
  } else if (check) {
    errorDescription.textContent = `Mô tả dự án không được trùng nhau`;
    descriptionInput.classList.add("error-input");
    isValid = false;
  } else if (newDescription.length < 10) {
    errorDescription.textContent = `Mô tả dự án không được dưới 10 ký tự`;
    descriptionInput.classList.add("error-input");
    isValid = false;
  }

  if (isValid) {
    project.projectName = newName;
    project.description = newDescription;

    localStorage.setItem("projects", JSON.stringify(projects));

    let indexPage = Math.ceil((projects.indexOf(project) + 1) / 5);
    renderProjects(indexPage);

    projectInput.value = "";
    descriptionInput.value = "";

    modal.hide();
  }
}

function deleteProject(projectId) {
  let cfDelProject = document.getElementById("confirm-deleteProject");

  cfDelProject.setAttribute("onclick", `cfDelProject(${projectId})`);

  console.log(cfDelProject);
}

function cfDelProject(projectId) {
  let deleteIndex = projects.findIndex((el) => el.id === projectId);
  console.log(deleteIndex);

  projects.splice(deleteIndex, 1);

  let indexPage = Math.ceil(projectId / 5);

  renderProjects(indexPage);
  localStorage.setItem("projects", JSON.stringify(projects));
}

function productManager(projectId) {
  // localStorage.setItem("projectId", JSON.stringify(projectId));

  window.location.href = `/pages/task-manager.html?id=${projectId}`;
}

function logOut() {
  localStorage.removeItem("savedEmail");
}

//tìm kiếm real-time
document.getElementById("search").addEventListener("input", function () {
  renderProjects(1);
});
