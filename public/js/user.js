const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", signup);

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
  console.log(user);
}
