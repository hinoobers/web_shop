const loginBtn = document.getElementById("auth");
if(document.cookie.includes("token")) {
    loginBtn.innerHTML = "Logout";
    loginBtn.href = "/auth/logout";
}