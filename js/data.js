tasks = [
  {
    id: 1,
    taskName: "Phân tích và lên kế hoạch dự án",
    assigneeId: 1,
    projectId: 1,
    asignDate: "2002-03-24",
    dueDate: "2002-03-26",
    priority: "Cao",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 2,
    taskName: "Thiết kế giao diện (UI/UX)",
    assigneeId: 2,
    projectId: 1,
    asignDate: "2002-03-24",
    dueDate: "2002-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do",
  },
  {
    id: 3,
    taskName: "Thiết kế giao diện (UI/UX)",
    assigneeId: 2,
    projectId: 1,
    asignDate: "2002-03-24",
    dueDate: "2002-03-26",
    priority: "Cao",
    progress: "Đúng tiến độ",
    status: "In Progress",
  },
  {
    id: 4,
    taskName: "Thiết kế giao diện (UI/UX)",
    assigneeId: 2,
    projectId: 1,
    asignDate: "2002-03-24",
    dueDate: "2002-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "Pending",
  },
  {
    id: 5,
    taskName: "Thiết kế giao diện (UI/UX)",
    assigneeId: 2,
    projectId: 1,
    asignDate: "2002-03-24",
    dueDate: "2002-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "Done",
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
    email: "nguyenquanan@gmail.com",
    password: "123456789",
  },
  {
    id: 3,
    fullName: "Bách Nguyễn",
    email: "bachnguyen@gmail.com",
    password: "123456789",
  },
  {
    id: 4,
    fullName: "Minh Nguyễn",
    email: "minh23923@gmail.com",
    password: "123456789",
  },
  {
    id: 5,
    fullName: "An Nguyễn",
    email: "nguyenquanan@gmail.com",
    password: "123456789",
  },
  {
    id: 6,
    fullName: "Bách Nguyễn",
    email: "bachnguyen@gmail.com",
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
    description:
      "Giải pháp phát triển ứng dụng di động toàn diện, biến ý tưởng của bạn thành ứng dụng thực tế, hiện đại, hoạt động mượt mà trên mọi thiết bị.",
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
    description:
      "Quản lý dữ liệu khách hàng di động giúp doanh nghiệp lưu trữ, cập nhật và theo dõi thông tin khách hàng mọi lúc, mọi nơi",
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
