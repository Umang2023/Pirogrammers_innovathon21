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

document.querySelector('.filter-apply-button').addEventListener('click',async ()=>{
    var questionSelected = document.getElementById('ques').value
    var verdictSelected = document.getElementById('verd').value
    var userSelected = document.getElementById('user-submission').value
    console.log(questionSelected,verdictSelected,userSelected)

    var data = await fetch(`/code/submissions?verdictSelected=${verdictSelected}&questionSelected=${questionSelected}&userSelected=${userSelected}`)
    .then(res=>res.json())

    console.log(data)
})

window.onload = getUserData();

