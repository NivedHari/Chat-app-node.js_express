const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const messageSpan = document.getElementById("message");

signupForm.addEventListener("submit", signup);
loginForm.addEventListener("submit", login);

function signup(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  const user = {
    name,
    email,
    phone,
    password,
  };
  fetch("http://localhost:3000/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status === 400) {
        messageSpan.style.color = "red";
      }
      if (response.status === 201) {
        messageSpan.style.color = "#11d918";
        signupForm.reset();
      }
      if (response.status === 500) {
        messageSpan.style.color = "red";
      }
      return response.json();
    })
    .then((data) => {
      messageSpan.textContent = data.message;
    })
    .catch((err) => {
      console.log(err);
    });
}

function login(event) {
  event.preventDefault();
  const email = document.getElementById("lEmail").value;
  const password = document.getElementById("lPassword").value;
  const user = { email, password };
  fetch("http://localhost:3000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then()
    .catch((err) => {
      console.log(err);
    });
}
