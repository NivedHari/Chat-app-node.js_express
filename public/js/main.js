const messageForm = document.getElementById("send-container");
const token = localStorage.getItem("token");
const logoutBtn = document.getElementById("logout");

messageForm.addEventListener("submit", sendMessage);
logoutBtn.addEventListener("click", logout);

function sendMessage(event) {
  event.preventDefault();
  const message = document.getElementById("message-input").value;
  console.log(message);
  fetch("http://localhost:3000/message/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ message }),
  });
}
function logout() {
  localStorage.removeItem("token");
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token") === null) {
    window.location.href = "/public/signup.html";
  }
});
