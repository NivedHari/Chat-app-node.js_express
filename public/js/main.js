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

function getMessage() {
  fetch("http://localhost:3000/message/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.messages) {
        displayMessages(data.messages);
      }
    })
    .catch((err) => console.log(err));
}

function displayMessages(messages) {
  const messageContainer = document.getElementById("messages");
  messageContainer.innerHTML = "";

  messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.textContent = message.text;
    messageContainer.append(messageElement);
  });
}

setInterval(() => {
  getMessage();
}, 1000);


document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token") === null) {
    window.location.href = "/public/signup.html";
  }
  getMessage();
});
