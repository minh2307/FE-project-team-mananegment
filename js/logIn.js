let users = JSON.parse(localStorage.getItem("users")) || [];

function logIn(e) {
  e.preventDefault();

  let locationEmail = document.getElementById("locationEmail");
  let passWord = document.getElementById("passWord");
  let error = document.getElementById("error");

  let emailValue = locationEmail.value.trim();
  let passwordValue = passWord.value.trim();

  let user = users.find(
    (user) => user.email === emailValue && user.password === passwordValue
  );

  console.log("User:", user);

  if (!user) {
    error.textContent = "Email hoặc mật khẩu không đúng.";
    locationEmail.classList.add("error-input");
    passWord.classList.add("error-input");
    return;
  }

  error.textContent = "";
  locationEmail.classList.remove("error-input");
  passWord.classList.remove("error-input");
  localStorage.setItem("savedEmail", emailValue);
  location.href = "/pages/dashboard.html";
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", logIn);
});
