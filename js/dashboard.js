let tasks = [
  {
    id: 1,
    taskName: "Soạn thảo đề cương dự án",
    assigneeId: 1,
    projectId: 1,
    asignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 2,
    taskName: "Phát triển ứng dụng di động",
    assigneeId: 2,
    projectId: 2,
    asignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 3,
    taskName: "Quản lý dữ liệu khách hàng",
    assigneeId: 3,
    projectId: 3,
    asignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 4,
    taskName: "Xây dựng website thương mại điện tử",
    assigneeId: 4,
    projectId: 4,
    asignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 5,
    taskName: "Phát triển ứng dụng di động",
    assigneeId: 5,
    projectId: 5,
    asignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 6,
    taskName: "Quản lý dữ liệu khách hàng",
    assigneeId: 6,
    projectId: 6,
    asignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 7,
    taskName: "Xây dựng website thương mại điện tử",
    assigneeId: 7,
    projectId: 7,
    asignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 8,
    taskName: "Phát triển ứng dụng di động",
    assigneeId: 8,
    projectId: 8,
    asignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 9,
    taskName: "Quản lý dữ liệu khách hàng",
    assigneeId: 9,
    projectId: 9,
    asignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
];

localStorage.setItem("tasks", JSON.stringify(tasks));

tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function pagination(activePage = 1) {
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  let totalPages = Math.ceil(tasks.length / 5);

  // Nút Previous
  pagination.innerHTML += `
        <button class="btn btn-outline-primary btnPagination" id="previous" 
                style="border-radius: 5px 0px 0px 5px; color: #4E5A66; opacity: ${
                  activePage === 1 ? "0.4" : "1"
                };" 
                onclick="renderTasks(${activePage - 1})" 
                ${activePage === 1 ? "disabled" : ""}>&lt;</button>
    `;

  // Các nút số trang
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
            <button class="btn btn-outline-primary btnPagination ${
              i === activePage ? "active" : ""
            }" 
                    onclick="renderTasks(${i})">${i}</button>
        `;
  }

  // Nút Next
  pagination.innerHTML += `
        <button class="btn btn-outline-primary btnPagination" id="next"
                style="border-radius: 0px 5px 5px 0px; color: #4E5A66; opacity: ${
                  activePage === totalPages ? "0.4" : "1"
                };" 
                onclick="renderTasks(${activePage + 1})" 
                ${activePage === totalPages ? "disabled" : ""}>&gt;</button>
    `;
}

function renderTasks(indexPage) {
  let contentTasks = document.getElementById("contentTasks");
  contentTasks.innerHTML = "";

  let end = indexPage * 5;
  let start = end - 5;

  let currentData = tasks.slice(start, end);

  currentData.forEach((element) => {
    contentTasks.innerHTML += `
            <tr>
                <td class="p-3 text-center">${element.id}</td>
                <td class="p-3">${element.taskName}</td>
                <td class="d-flex justify-content-around">
                    <button class="btn btn-warning sizeBtn-1" data-bs-toggle="modal" data-bs-target="#addNewTask" data-bs-whatever="@mdo">Sửa</button>
                    <button class="btn btn-danger sizeBtn-2" data-bs-toggle="modal" data-bs-target="#deleteTask">Xoá</button>
                    <button class="btn btn-primary sizeBtn-1">Chi tiết</button>
                </td>
            </tr>
        `;
  });

  pagination(indexPage);
}

// Khởi tạo
renderTasks(1);
