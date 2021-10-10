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

let elem
document.addEventListener('DOMContentLoaded', function () {
    elem = document.querySelector(".chips");
    let elems = document.querySelectorAll(".chips");
    const options = {
        placeholder: "Enter tag",
        secondaryPlaceholder: "More tags?",
    };
    let instances = M.Chips.init(elems, options);
    M.AutoInit();
});

function getProblems(data) {
    let number = document.querySelector('.problem-no').value;
    let minDif = document.querySelector('.problem-min-dif').value;
    let maxDif = document.querySelector('.problem-max-dif').value;
    let datas = data.result.problems;
    let count = 0;
    for (let i = 0; count < number && i < datas.length; i++) {
        if (datas[i].rating >= minDif && datas[i].rating <= maxDif) {
            let div = document.createElement('a');
            div.classList.add('practice-card');
            div.classList.add('z-depth-3');
            div.text = `${datas[i].contestId}: ${datas[i].name}`;
            div.href = `https://codeforces.com/problemset/problem/${datas[i].contestId}/${datas[i].index}`
            div.target = '_blank';
            document.querySelector('.practice-list').appendChild(div);
            console.log(datas[i].rating);
            count++;
        }
    }
    probUrl = 'https://codeforces.com/api/problemset.problems?';
}

let probUrl = 'https://codeforces.com/api/problemset.problems?';
document.querySelector('.get-prob-but').addEventListener('click', function () {
    document.querySelector('.practice-list').innerHTML = '';
    let instance = M.Chips.getInstance(elem).chipsData;
    if (instance.length > 0) {
        probUrl += 'tags=';
        for (let i = 0; i < instance.length; i++) {
            probUrl += instance[i].tag + ';';
        }
    }
    console.log(probUrl);
    fetch(probUrl).then((res) => {
        return res.json();
    }).then((data) => {
        getProblems(data)
    })
})