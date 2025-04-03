tasks = [
  {
    id: 1,
    taskName: "Xây dựng website thương mại điện tử",
    assigneeId: 1,
    projectId: 1,
    asignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
];

users = [
  {
    id: 1,
    fullName: "Minh Nguyễn",
    email: "minh23923@gmail.com",
    password: "123456789",
  },
  {
    id: 2,
    fullName: "An Nguyễn",
    email: "nguyenquanan@gamil.com",
    password: "123456789",
  },
];

projects = [
  {
    id: 1,
    projectName: "Xây dựng website thương mại điện tử",
    description:
      "Dự án nhằn phát triển một nền tảng thương mại điện tử với các tính năng như giỏ hàng, thanh toán và quán lý sản phẩm",
    members: [
      {
        userId: 1,
        role: "Project owner",
      },
      {
        userId: 2,
        role: "Frontend developer",
      },
    ],
  },
  {
    id: 2,
    projectName: "Phát triển ứng dụng di động",
    members: [
      {
        userId: 3,
        role: "Project owner",
      },
      {
        userId: 4,
        role: "Frontend developer",
      },
    ],
  },
  {
    id: 3,
    projectName: "Quản lý dữ liệu khách hàng",
    members: [
      {
        userId: 5,
        role: "Project owner",
      },
      {
        userId: 6,
        role: "Frontend developer",
      },
    ],
  },
];

if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(users));
}
if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
if (!localStorage.getItem("projects")) {
  localStorage.setItem("projects", JSON.stringify(projects));
}
