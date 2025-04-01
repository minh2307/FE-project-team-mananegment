let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];

function register(e) {
  e.preventDefault();

  let locationEmail = document.getElementById("locationEmail");
  let passWord = document.getElementById("passWord");

  let error = document.getElementById("error");

  let emailValue = locationEmail.value.trim();
  let passwordValue = passWord.value;

  let user = users.find(
    (user) => user.email === emailValue && user.password === passwordValue
  );

  let isValid = true;

  if (emailValue === "" || passwordValue === "") {
    error.textContent = "Địa chỉ email và Mật khẩu không được để trống.";
    locationEmail.classList.add("error-input");
    passWord.classList.add("error-input");
    isValid = false;
  } else {
    error.textContent = "";
    locationEmail.classList.remove("error-input");
    passWord.classList.remove("error-input");
  }

  if (emailValue !== "" && passwordValue !== "" && !user) {
    error.textContent = "Email hoặc mật khẩu không đúng.";
    locationEmail.classList.add("error-input");
    passWord.classList.add("error-input");
    isValid = false;
  }

  if (isValid) {
    location.href = `/pages/dashboard.html`;
  }
}
