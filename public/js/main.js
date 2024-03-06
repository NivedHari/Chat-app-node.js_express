const messageForm = document.getElementById("send-container");
const createGroupForm = document.getElementById("create-group");
const token = localStorage.getItem("token");
const logoutBtn = document.getElementById("logout");
const createBtn = document.getElementById("create-btn");
const groupFormDiv = document.querySelector(".group-form__div");
const groupList = document.getElementById("groups-list");
const groupName = document.querySelector(".chat-name");

messageForm.addEventListener("submit", sendMessage);
createGroupForm.addEventListener("submit", createGroup);
logoutBtn.addEventListener("click", logout);

function sendMessage(event) {
  event.preventDefault();
  const message = document.getElementById("message-input").value;
  const groupId = document.getElementById("group_id").value;
  const data = {
    message,
    groupId,
  };
  console.log(data);
  fetch(`http://localhost:3000/message/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // const message = data.newMsg;
      // console.log(message);
      // let messages = JSON.parse(localStorage.getItem("messages")) || [];
      // messages.push(message);
      // if (messages.length > 10) {
      //   messages = messages.slice(-10);
      // }
      // localStorage.setItem("messages", JSON.stringify(messages));
      // getMessage();
      messageForm.reset();
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
    lastMsgId = messages[messages.length - 1].id;
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
        const allMessages = [...messages, ...newMessages];
        console.log("new from then", newMessages);
        let lastMsgs = allMessages;
        lastMsgs = allMessages.slice(-1000);
        displayMessages(allMessages);
        localStorage.setItem("messages", JSON.stringify(lastMsgs));
      }
    })
    .catch((err) => console.log(err));
}

async function showGroupMessages(groupId) {
  const MessageResponse = await fetch(
    `http://localhost:3000/user/get-group-messages?groupId=${groupId}`
  );
  const data = await MessageResponse.json();
  // console.log(data.messages);
  displayMessages(data.messages);
}

function displayMessages(messages) {
  const messageContainer = document.getElementById("messages");
  messageContainer.innerHTML = "";

  messages.forEach((message) => {
    const messageElement = document.createElement("li");
    messageElement.classList.add("message");
    messageElement.textContent = `${message.name}: ${message.message}`;
    messageContainer.append(messageElement);
  });
}

async function showGroup() {
  const token = localStorage.getItem("token");
  const groupsResponse = await fetch(`http://localhost:3000/user/getGroups`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await groupsResponse.json();
  console.log(data);

  const commonGroupItem = document.createElement("li");
  commonGroupItem.textContent = "Common Group";
  commonGroupItem.className = "clickable";
  commonGroupItem.addEventListener("click", () => {
    showGroupChat(0);
    localStorage.setItem("groupId", 0);
  });
  const allMembersItem = document.createElement("span");
  allMembersItem.textContent = "All Members";
  allMembersItem.className = "members";
  commonGroupItem.appendChild(allMembersItem);
  groupList.append(commonGroupItem);

  data.groups.forEach((item) => {
    const groupItem = document.createElement("li");
    groupItem.textContent = item.name;
    groupItem.className = "clickable";
    groupItem.addEventListener("click", () => {
      showGroupChat(item.id);
      localStorage.setItem("groupId", item.id);
    });
    const membersItem = document.createElement("span");
    membersItem.textContent = `${item.members} Members`;
    membersItem.className = "members";
    groupItem.appendChild(membersItem);
    groupList.append(groupItem);
  });
}

async function showGroupChat(id) {
  const groupId = id;

  setupGroup(groupId);
  if (groupId === 0) {
    getMessage();
  } else {
    showGroupMessages(id);
  }
}

async function setupGroup(groupId) {
  if (groupId === 0) {
    groupName.innerHTML = "";
    const groupHeader = document.createElement("h1");
    groupHeader.textContent = "Common Group";
    groupName.appendChild(groupHeader);
    document.getElementById("group_id").value = groupId;
  } else {
    const response = await fetch(
      `http://localhost:3000/user/get-group?groupId=${groupId}`
    );
    const data = await response.json();
    // console.log(data.group);
    groupName.innerHTML = "";
    const groupHeader = document.createElement("h1");
    groupHeader.textContent = data.group.name;
    groupName.appendChild(groupHeader);
    document.getElementById("group_id").value = groupId;
  }
}

function createGroup(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  const groupName = document.getElementById("group-name").value;
  const selectedUsers = Array.from(
    document.querySelectorAll('input[name="users"]:checked')
  ).map((checkbox) => checkbox.value);

  const data = {
    name: groupName,
    membersNo: selectedUsers.length + 1,
    membersIds: selectedUsers,
  };

  fetch("http://localhost:3000/user/create-group", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      createGroupForm.reset();
      alert(response);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function showAllUser() {
  const token = localStorage.getItem("token");
  try {
    const userResponse = await fetch("http://localhost:3000/user/getusers", {
      headers: {
        Authorization: token,
      },
    });
    if (!userResponse.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await userResponse.json();
    console.log(data.users);

    const userList = document.getElementById("userList");
    userList.innerHTML = "";

    data.users.forEach((user) => {
      const listItem = document.createElement("li");
      listItem.classList.add("users-li");

      const div = document.createElement("div");
      div.classList.add("user-div");

      const h6 = document.createElement("h6");
      h6.innerHTML = `<strong>${user.name}</strong>`;

      div.appendChild(h6);

      const input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.classList.add("form-check-inline");
      input.setAttribute("name", "users");
      input.setAttribute("value", user.id);

      listItem.appendChild(div);
      listItem.appendChild(input);

      userList.appendChild(listItem);
    });
  } catch (error) {
    console.error(error);
  }
}

// setInterval(() => {
//   getMessage();
// }, 1000);

createBtn.addEventListener("click", function () {
  showAllUser();
  groupFormDiv.style.display = "block";
  document.getElementById("overlay").style.display = "block";
});

window.addEventListener("click", function (event) {
  if (event.target !== createBtn && !groupFormDiv.contains(event.target)) {
    groupFormDiv.style.display = "none";
    document.getElementById("overlay").style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token") === null) {
    window.location.href = "/public/signup.html";
  }
  showGroup();
  const groupNo = localStorage.getItem("groupId");
  if (groupNo) {
    if (groupNo === 0) {
      showGroupChat(0);
    } else {
      showGroupChat(groupNo);
    }
  }
});
