const button = document.getElementById('google_signout');
    button.onclick = () =>{
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('email'), done =>{
        localStorage.clear();
        window.location.href = "http://localhost:3500/";
    });
}

async function getInfoProfile (){
    fetch("http://localhost:3500/api/auth/userInfo", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-token": localStorage.getItem("token"),
            }
        }
    ).then((res) => res.json()
    ).then(function (data) {
        console.log(data);
        document.getElementById("name").innerHTML = data.name;
        document.getElementById("token").innerHTML = localStorage.getItem("token");
        document.getElementById("img").src = data.img || 'https://www.forojeeprenegade.com/ext/dark1/memberavatarstatus/image/avatar.png';
        document.getElementById("loader").style.display = "none";
        document.body.style.background = "white";
        document.getElementById("home").removeAttribute("hidden");
    });
}

window.onload = () => {
    getInfoProfile();
}