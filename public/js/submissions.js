function fillNavbar(data) {
    let profImg = document.createElement('img');
    profImg.src = data.pic;
    profImg.classList.add('nav-prof-img')
    document.querySelector('.navbar-profile-img').appendChild(profImg);
}

function getUserData() {
    fetch('/user/current').then((res) => {
        return res.json();
    }).then((data) => {
        fillNavbar(data);
    })
}

window.onload = getUserData();

