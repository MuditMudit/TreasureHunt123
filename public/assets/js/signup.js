function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
const signUp = document.getElementById('signup-form')
if (getCookie('userToken').trim()) {
    window.location.href = '/login'
}
function validate() {
    const email = document.getElementById("email").value
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        showError("You have entered an invalid email address!")
        return (false)
    }
    const name = document.getElementById("name").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm_password").value
    if (password !== confirmPassword) {
        document.getElementById("name").value = ''
        document.getElementById("email").value = ''
        document.getElementById("password").value = ''
        document.getElementById("confirm_password").value = ''
        showError('Please check the password again')
    }
    const userCred = {
        name,
        email,
        password,
    }
    postData('/auth/signup/', userCred)
}
function showError(e) {
    const errorArea = document.getElementById('errorArea')
    errorArea.innerHTML = `<div style="color:red; text-align:center;">${e}</div>`
    setTimeout(() => {
        errorArea.innerHTML = ''
    }, 4000)
}
function setCookie(cname, cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (5 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
async function postData(url, data) {
    $.ajax({
        type: 'POST',
        url,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json'
    }).then((response) => {
        if (response.status = "success") {
            setCookie('userToken', response.data)
            window.location.href = '/treasure'
        } else {
            window.alert("Error : " + response.message);
        }

    })
}
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () =>
container.classList.add('right-panel-active'));

signInButton.addEventListener('click', () =>
container.classList.remove('right-panel-active'));