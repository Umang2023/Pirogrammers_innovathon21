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
    // console.log(data.data)

})

async function fillSubmissionList(data)
{
    var i=4;
    while(submissionList.children.length > i)
    {
        submissionList.removeChild(submissionList.children[i-1])
    }

    data.forEach(element => {
        var idDiv = document.createElement('div')
        idDiv.innerHTML = element._id
        
        var questionDiv = document.createElement('div')
        questionDiv.innerHTML = element.question
        
        var userDiv = document.createElement('div')
        userDiv.innerHTML = element.userHandle[0].codeforces

        var verdictDiv = document.createElement('div')
        verdictDiv.innerHTML = element.verdict

        submissionList.appendChild(idDiv)
        submissionList.appendChild(questionDiv)
        submissionList.appendChild(userDiv)
        submissionList.appendChild(verdictDiv)
    });
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

    // console.log(data)
    fillSubmissionList(data.data)
})

window.onload = getUserData();

