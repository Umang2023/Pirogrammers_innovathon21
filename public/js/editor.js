function fillDashboard(data) {
    let profImg = document.createElement('img');
    profImg.src = data.pic;
    profImg.classList.add('nav-prof-img')
    document.querySelector('.navbar-profile-img').appendChild(profImg);

}

function getDashboardData() {
    fetch('/user/current').then((res) => {
        return res.json();
    }).then((data) => {
        fillDashboard(data);
    })
}

window.onload = getDashboardData();
