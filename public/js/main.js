let switchCtn = document.querySelector("#switch-cnt");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchCircle = document.querySelectorAll(".switch__circle");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");
let nameSignUp = document.querySelector("#nameSignUp");

let getButtons = (e) =>{e.preventDefault()
    // nameSignUp.classList.toggle("is-hidden");
}

let changeForm = (e) => {

    switchCtn.classList.add("is-gx");
    setTimeout(function(){
        switchCtn.classList.remove("is-gx");
    }, 1500)

    switchCtn.classList.toggle("is-txr");
    switchCircle[0].classList.toggle("is-txr");
    switchCircle[1].classList.toggle("is-txr");

    switchC1.classList.toggle("is-hidden");
    switchC2.classList.toggle("is-hidden");
    aContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-z200");
}

let mainF = (e) => {
    changeView();
    for (var i = 0; i < allButtons.length; i++)
        allButtons[i].addEventListener("click", getButtons );
    for (var i = 0; i < switchBtn.length; i++)
        switchBtn[i].addEventListener("click", changeForm)
}

window.addEventListener("load", mainF);

function handleCredentialResponse(response) {
    // Google Token : ID_TOKEN
    console.log('id_token ',response.credential);
    const body = { id_token: response.credential };
    fetch("http://localhost:3500/api/auth/google", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    })
    .then((resp) => resp.json())
    .then((resp) => {
        console.log(resp);
        localStorage.setItem("email", resp.user.email);
        localStorage.setItem("token", resp.token);
        changeView();
    })
    .catch(console.warn);
}

function changeView() {
    if (localStorage.getItem("token") && localStorage.getItem("email")) {
        window.location.href = "http://localhost:3500/home.html";
    }
}

const btnSingIn = document.querySelector("#btnSingIn");
const btnSingUp = document.querySelector("#btnSingUp");
const btnSuccesLogin = document.querySelector("#succesLogin");

btnSingUp.addEventListener("click", (e) => {
    e.preventDefault();
    const name = document.querySelector("#nameSignUp").value;
    const email = document.querySelector("#emailSignUp").value;
    const password = document.querySelector("#passwordSignUp").value;
    if (!email && !password && !name) {
        return swal("Error!", "Name, Email and password are required!", "error");
    }
    const body = { name, email, password };
    fetch("http://localhost:3500/api/auth/signUp", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    })
    .then((resp) => resp.json())
    .then((resp) => {
        console.log(resp);
        if(resp.status === 'success'){
        swal("Success!", "User created successfully!", "success");
        document.querySelector("#emailSignIn").value = email;
        btnSuccesLogin.click();
        }else{
            swal("Error!", resp.message, "error");
        }
    })
    .catch(console.warn);
});

btnSingIn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.querySelector("#emailSignIn").value;
    const password = document.querySelector("#passwordSignIn").value;
    if (!email && !password) {
        return swal("Error!", "Email and password are required!", "error");
    }
    const body = { email, password };

    fetch("http://localhost:3500/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp);
            if(resp.token){
                localStorage.setItem("email", resp.user.email);
                localStorage.setItem("token", resp.token);
                changeView();
            }else{
                swal("Error!", resp.message, "error");
            }
        })
        .catch(console.warn);

});