let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let loggedInEmail = localStorage.getItem("savedEmail");

document.addEventListener("DOMContentLoaded", function () {
  if (loggedInEmail) {
    window.location.href = "/pages/dashboard.html";
  }
});

function register(e) {
  e.preventDefault();

  let fullNameEl = document.getElementById("fullName");
  let locationEmail = document.getElementById("locationEmail");
  let pass = document.getElementById("passWord");
  let confirmPassEl = document.getElementById("confirmPassWord");

  let errorFullName = document.getElementById("error-fullName");
  let errorEmail = document.getElementById("error-locationEmail");
  let errorPassWord = document.getElementById("error-passWord");
  let errorConfirmPassWord = document.getElementById("error-confirmPassWord");

  let fullName = fullNameEl.value.trim();
  let email = locationEmail.value.trim();
  let password = pass.value;
  let confirmPassword = confirmPassEl.value;

  let emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
  let passwordRegex = /^.{8,}$/;

  let isValid = true;

  // Kiểm tra Họ và Tên
  if (fullName === "") {
    errorFullName.textContent = "Họ và Tên không được để trống.";
    fullNameEl.classList.add("error-input");
    isValid = false;
  } else {
    errorFullName.textContent = "";
    fullNameEl.classList.remove("error-input");
  }

  // Kiểm tra Email
  if (email === "") {
    errorEmail.textContent = "Địa chỉ email không được để trống.";
    locationEmail.classList.add("error-input");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    errorEmail.textContent =
      "Email phải có đuôi @gmail.com, @yahoo.com hoặc @outlook.com.";
    locationEmail.classList.add("error-input");
    isValid = false;
  } else {
    let checkEmail = users.some((user) => user.email === email); // Sửa locationEmail thành email
    if (checkEmail) {
      errorEmail.textContent = "Email này đã được đăng ký.";
      locationEmail.classList.add("error-input");
      isValid = false;
    } else {
      errorEmail.textContent = "";
      locationEmail.classList.remove("error-input");
    }
  }

  // Kiểm tra Mật khẩu
  if (password === "") {
    errorPassWord.textContent = "Mật khẩu không được để trống.";
    pass.classList.add("error-input");
    isValid = false;
  } else if (!passwordRegex.test(password)) {
    errorPassWord.textContent = "Mật khẩu phải có tối thiểu 8 ký tự.";
    pass.classList.add("error-input");
    isValid = false;
  } else {
    errorPassWord.textContent = "";
    pass.classList.remove("error-input");
  }

  // Kiểm tra xác nhận mật khẩu
  if (confirmPassword === "") {
    errorConfirmPassWord.textContent =
      "Xác nhận lại mật khẩu không được để trống.";
    confirmPassEl.classList.add("error-input");
    isValid = false;
  } else if (confirmPassword !== password) {
    errorConfirmPassWord.textContent =
      "Mật khẩu xác nhận phải trùng với mật khẩu.";
    confirmPassEl.classList.add("error-input");
    isValid = false;
  } else {
    errorConfirmPassWord.textContent = "";
    confirmPassEl.classList.remove("error-input");
  }

  if (isValid) {
    // Lưu vào localStorage
    users.push({
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      fullName: fullName,
      email: email,
      password: password,
    });
    localStorage.setItem("users", JSON.stringify(users));

    document.querySelector("form").reset();

    localStorage.setItem("savedEmail", email);
    location.href = "/pages/dashboard.html";
  }
}
