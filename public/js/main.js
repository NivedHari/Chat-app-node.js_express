const messageForm = document.getElementById("send-container");
const token = localStorage.getItem("token");
const logoutBtn = document.getElementById("logout");

messageForm.addEventListener("submit", sendMessage);
logoutBtn.addEventListener("click", logout);

function sendMessage(event) {
  event.preventDefault();
  const message = document.getElementById("message-input").value;
  console.log(message);
  fetch(`http://localhost:3000/message/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ message }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const message = data.newMsg;
      console.log(message);
      let messages = JSON.parse(localStorage.getItem("messages")) || [];
      messages.push(message);
      if (messages.length > 10) {
        messages = messages.slice(-10);
      }
      localStorage.setItem("messages", JSON.stringify(messages));
      getMessage();
    })
    .catch((err) => {
      console.log(err);
    });
}
function logout() {
  localStorage.removeItem("token");
}

function getMessage() {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  let lastMsgId = null;
  let url;
  if (messages.length > 0) {
    lastMsgId = messages[0].id;
    console.log(lastMsgId);
    url = `http://localhost:3000/message?lastMsgId=${lastMsgId}`;
  } else {
    url = `http://localhost:3000/message`;
  }

  fetch(url, {
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
        const newMessages = data.messages;
        const allMessages = [...newMessages, ...messages];
        console.log("new from then", newMessages);
        let lastMsgs = allMessages;
        if (allMessages.length > 10) {
          lastMsgs = allMessages.slice(-10);
        }
        displayMessages(allMessages);
        localStorage.setItem("messages", JSON.stringify(lastMsgs));
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
    messageElement.textContent = `${message.name}: ${message.message}`;
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
