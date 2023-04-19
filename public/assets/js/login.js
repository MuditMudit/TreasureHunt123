const login = document.getElementById('login-form')
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
if (getCookie('userToken')) {
    window.location.href = '/treasureHunt'
}
function validateLog() {
    const email = document.getElementById("email-log").value
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        showErrorLog("You have entered an invalid email address!")
        return (false)
    }
    const password = document.getElementById("password-log").value

    const userCred = {
        email,
        password,
    }
    postDataLog('/login/', userCred)
}
function showErrorLog(e) {
    const errorArea = document.getElementById('errorArea')
    errorArea.innerHTML = `<div style="color:red; text-align:center;">${e}</div>`
    setTimeout(() => {
        errorArea.innerHTML = ''
    }, 4000)
}
function setCookieLog(cname, cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (5 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
async function postDataLog(url, data) {
    $.ajax({
        type: 'POST',
        url,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json'
    }).then(async (response) => {
        const userToken = response.data;
        await setCookieLog('userToken', userToken);
        window.location.href = '/treasureHunt';
    })
}

