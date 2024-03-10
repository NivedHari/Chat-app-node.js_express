const messageForm = document.getElementById("send-container");
const createGroupForm = document.getElementById("create-group");
const editGroupForm = document.getElementById("edit-group");
const token = localStorage.getItem("token");
const logoutBtn = document.getElementById("logout");
const createBtn = document.getElementById("create-btn");
const editBtn = document.querySelector(".edit-Btn");
const groupFormDiv = document.querySelector(".group-form__div");
const editFormDiv = document.querySelector(".edit-group-form__div");
const groupList = document.getElementById("groups-list");
const groupName = document.querySelector(".chat-name");
const groupHeader = document.getElementById("groupHeader");

messageForm.addEventListener("submit", sendMessage);
createGroupForm.addEventListener("submit", createGroup);
editGroupForm.addEventListener("submit", editGroup);
logoutBtn.addEventListener("click", logout);

const socket = io(window.location.origin);
socket.on("common-message", () => {
  const groupId = document.getElementById("group_id").value;
  if (+groupId === 0) {
    getMessage();
  }
});

socket.on("group-message", (GroupId) => {
  const groupId = document.getElementById("group_id").value;
  if (GroupId === groupId) {
    showGroupMessages(groupId);
  }
});
socket.on("new-group-created", () => {
  showGroup();
});

function sendMessage(event) {
  event.preventDefault();
  const message = document.getElementById("message-input").value;
  const groupId = document.getElementById("group_id").value;
  const imageFile = document.getElementById("image-input").files[0];
  const formData = new FormData();
  formData.append("message", message);
  formData.append("groupId", groupId);
  if (imageFile) {
    formData.append("image", imageFile);
    formData.append("isImg", true);
  } else {
    formData.append("isImg", false);
  }
  fetch(`/message/send`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (+groupId === 0) {
        socket.emit("new-common-message");
        getMessage();
      } else {
        socket.emit("new-group-message", groupId);
        showGroupMessages(groupId);
      }
      messageForm.reset();
    })
    .catch((err) => {
      console.log(err);
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("messages");
  localStorage.removeItem("groupId");
  window.location.href = "/login";
}

function getMessage() {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  let lastMsgId = null;
  let url;
  if (messages.length > 0) {
    lastMsgId = messages[messages.length - 1].id;
    url = `/message?lastMsgId=${lastMsgId}`;
  } else {
    url = `/message`;
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
      const userId = data.user.id;
      if (data.messages) {
        const newMessages = data.messages;
        const allMessages = [...messages, ...newMessages];
        let lastMsgs = allMessages;
        lastMsgs = allMessages.slice(-1000);
        displayMessages(allMessages, userId);
        localStorage.setItem("messages", JSON.stringify(lastMsgs));
      }
    })
    .catch((err) => console.log(err));
}

async function showGroupMessages(groupId) {
  const MessageResponse = await fetch(
    `/user/get-group-messages?groupId=${groupId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const data = await MessageResponse.json();
  displayMessages(data.messages, data.user.id);
}

function displayMessages(messages, userId) {
  const messageContainer = document.getElementById("messages");
  messageContainer.innerHTML = "";

  messages.forEach((message) => {
    const date = new Date(message.timestamp);
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = date.toLocaleString("en-US", options);
    const messageElement = document.createElement("li");
    messageElement.classList.add("message");
    const messageWrapper = document.createElement("div");
    messageWrapper.className = "message_wrapper";
    if (message.userId === userId) {
      message.name = "You";
      messageElement.classList.add("sender_class");
    } else {
      messageElement.classList.add("receiver_class");
    }

    const sender = document.createElement("span");
    sender.className = "sender-name";
    sender.textContent = message.name;

    const messageContent = document.createElement("span");
    messageContent.className = "message-content";
    messageContent.textContent = message.message;

    const time = document.createElement("span");
    time.className = "timestamp";
    time.textContent = formattedDate;
    let messageDiv;
    if (message.isImg) {
      console.log("Hai");
      // contains image
      messageDiv = document.createElement("div");
      messageDiv.className = "message_div imgMsg";
      const image = document.createElement("img");
      image.src = message.imgUrl;
      messageDiv.appendChild(sender);
      messageDiv.appendChild(image);
      messageDiv.appendChild(messageContent);
      messageDiv.appendChild(time);
    } else {
      //not image
      messageDiv = document.createElement("div");
      messageDiv.className = "message_div";
      messageDiv.appendChild(sender);
      messageDiv.appendChild(messageContent);
      messageDiv.appendChild(time);
    }

    messageElement.appendChild(messageDiv);
    if (message.userId === userId) {
      messageWrapper.appendChild(messageElement);
      messageContainer.append(messageWrapper);
    } else {
      messageContainer.append(messageElement);
    }
  });
}

async function showGroup() {
  const token = localStorage.getItem("token");
  const groupsResponse = await fetch(`/user/getGroups`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await groupsResponse.json();
  const userId = data.user.id;

  setUser(data.user.name);
  groupList.innerHTML = "";
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
      showGroupChat(item.id, userId);
      localStorage.setItem("groupId", item.id);
    });
    const membersItem = document.createElement("span");
    membersItem.textContent = `${item.members} Members`;
    membersItem.className = "members";
    groupItem.appendChild(membersItem);
    groupList.append(groupItem);
  });
}

async function showGroupChat(id, userId) {
  const groupId = id;
  setupGroup(groupId, userId);
  if (groupId === 0) {
    getMessage();
  } else {
    showGroupMessages(id);
  }
}

async function setupGroup(groupId, userId) {
  document.querySelector(".send-container").style.display = "flex";
  document.querySelector(".chat-name").style.display = "flex";

  const token = localStorage.getItem("token");
  if (groupId === 0) {
    groupName.innerHTML = "";
    groupHeader.innerText = "Common Group";
    groupName.appendChild(groupHeader);

    document.getElementById("group_id").value = groupId;
  } else if (groupId > 0) {
    const response = await fetch(`/user/get-group?groupId=${groupId}`, {
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    groupName.innerHTML = "";
    groupHeader.innerText = data.group.name;
    groupName.appendChild(groupHeader);

    editBtn.classList.add("material-symbols-outlined");
    editBtn.id = groupId;
    editBtn.textContent = "edit";
    groupName.appendChild(editBtn);
    if (+data.user.id !== +data.group.AdminId) {
      editBtn.style.display = "none";
    } else {
      editBtn.style.display = "block";
    }

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
    membersIds: selectedUsers,
  };

  fetch("/user/create-group", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      createGroupForm.reset();
      return response.json();
    })
    .then((data) => {
      socket.emit("new-group-created");
      showGroup();
      alert(data.message);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function showAllUser() {
  const token = localStorage.getItem("token");
  try {
    const userResponse = await fetch("/user/getusers", {
      headers: {
        Authorization: token,
      },
    });
    if (!userResponse.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await userResponse.json();

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

async function getGroupDetails(groupId) {
  const token = localStorage.getItem("token");
  const userResponse = await fetch(
    `/user/get-group-details?groupId=${groupId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const responseData = await userResponse.json();
  document.getElementById("edit-group-name").value = responseData.groupName;
  const editList = document.getElementById("editList");
  editList.innerHTML = "";
  document.getElementById("g_id").value = responseData.groupId;

  responseData.allUsers.forEach((user) => {
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
    responseData.groupMembers.filter((member) => {
      if (member.id === user.id) {
        input.setAttribute("checked", "checked");
      }
    });

    listItem.appendChild(div);
    listItem.appendChild(input);

    editList.appendChild(listItem);
  });
}

function editGroup(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  const groupId = document.getElementById("g_id").value;
  const groupName = document.getElementById("edit-group-name").value;
  const selectedUsers = Array.from(
    document.querySelectorAll('input[name="users"]:checked')
  ).map((checkbox) => checkbox.value);
  const data = {
    name: groupName,
    membersNo: selectedUsers.length + 1,
    membersIds: selectedUsers,
  };
  fetch(`/user/edit-group?groupId=${groupId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      showGroup();
      return response.json();
    })
    .then((data) => {
      alert(data.message);
    })
    .catch((err) => {
      console.log(err);
    });
}

createBtn.addEventListener("click", function () {
  showAllUser();
  groupFormDiv.style.display = "block";
  document.getElementById("overlay").style.display = "block";

  groupFormDiv.offsetHeight;
  document.getElementById("overlay").offsetHeight;

  groupFormDiv.style.opacity = "1";
  groupFormDiv.style.transform = "translateY(0)";
  document.getElementById("overlay").style.opacity = "1";
});

editBtn.addEventListener("click", function (event) {
  const groupId = event.target.id;
  getGroupDetails(groupId);
  editFormDiv.style.display = "block";
  document.getElementById("overlay").style.display = "block";

  editFormDiv.offsetHeight;
  document.getElementById("overlay").offsetHeight;

  editFormDiv.style.opacity = "1";
  editFormDiv.style.transform = "translateY(0)";
  document.getElementById("overlay").style.opacity = "1";
});

window.addEventListener("click", function (event) {
  if (
    event.target !== createBtn &&
    !groupFormDiv.contains(event.target) &&
    event.target !== editBtn &&
    !editFormDiv.contains(event.target)
  ) {
    groupFormDiv.style.display = "none";
    editFormDiv.style.display = "none";
    document.getElementById("overlay").style.display = "none";

    groupFormDiv.style.opacity = "0";
    editFormDiv.style.opacity = "0";
    groupFormDiv.style.transform = "translateY(-20px)";
    editFormDiv.style.transform = "translateY(-20px)";
    document.getElementById("overlay").style.opacity = "0";
  }
});

function setUser(userName) {
  document.getElementById("user-name").style.display = "block";
  document.getElementById("user-name").innerText = userName;
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token") === null) {
    window.location.href = "/public/signup.html";
  }
  showGroup();
  const groupNo = localStorage.getItem("groupId");
  if (groupNo) {
    const groupIdInt = parseInt(groupNo, 10);
    showGroupChat(groupIdInt);
    document.querySelector(".welcome").style.display = "none";
  } else {
    document.querySelector(".send-container").style.display = "none";
    document.querySelector(".chat-name").style.display = "none";
  }
});
