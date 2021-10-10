var yourOnly_checkbox = document.getElementById('your')
var userSubmission = document.getElementById('user-submission')
var submissionList = document.querySelector('.submission-list')

document.addEventListener('DOMContentLoaded',async ()=>{
    if(yourOnly_checkbox.checked)
    {
        userSubmission.disabled = true
    }

    var data = await fetch(`/code/submissions`)
    .then(res=>res.json())

    fillSubmissionList(data.data)

})

async function fillSubmissionList(data)
{
    var i=3;
    while(submissionList.children.length > i)
    {
        submissionList.removeChild(submissionList.children[i])
    }

    // data.forEach(element => {
        
    // });
}

yourOnly_checkbox.addEventListener('change',()=>{
    if(yourOnly_checkbox.checked)
    {
        userSubmission.disabled = true
    }
    else
    {
        userSubmission.disabled = false
    }
})

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

