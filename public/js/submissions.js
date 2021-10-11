var yourOnly_checkbox = document.getElementById('your')
var userSubmission = document.getElementById('user-submission')
var submissionList = document.querySelector('.submission-list')

document.addEventListener('DOMContentLoaded', async () => {
    if (yourOnly_checkbox.checked) {
        userSubmission.disabled = true
    }

    var data = await fetch(`/code/submissions`)
        .then(res => res.json())

    fillSubmissionList(data.data)
    // console.log(data.data)

})
/*
function addSubmissions() {
    let noMsg = document.getElementById('no-subm-msg')
    noMsg.remove();
    let id = document.createElement('div');
    id.setAttribute('class', 'submission-cell');
    let idHeading = document.createElement('h4');
    idHeading.innerHTML = 'ID'
    id.appendChild(idHeading);
    document.querySelector('.submission-list').appendChild(id)


    let Question = document.createElement('div');
    Question.setAttribute('class', 'submission-cell');
    let QuestionHeading = document.createElement('h4');
    QuestionHeading.innerHTML = 'Question'
    Question.appendChild(QuestionHeading);
    document.querySelector('.submission-list').appendChild(Question)


    let User = document.createElement('div');
    User.setAttribute('class', 'submission-cell');
    let UserHeading = document.createElement('h4');
    UserHeading.innerHTML = 'User'
    User.appendChild(UserHeading);
    document.querySelector('.submission-list').appendChild(User)


    let Verdict = document.createElement('div');
    Verdict.setAttribute('class', 'submission-cell');
    let VerdictHeading = document.createElement('h4');
    VerdictHeading.innerHTML = 'Verdict'
    Verdict.appendChild(VerdictHeading);
    document.querySelector('.submission-list').appendChild(Verdict)


    let Time = document.createElement('div');
    Time.setAttribute('class', 'submission-cell');
    let TimeHeading = document.createElement('h4');
    TimeHeading.innerHTML = 'Time'
    Time.appendChild(TimeHeading);
    document.querySelector('.submission-list').appendChild(Time)

}*/

function addSubmissions() {
    let noMsg = document.getElementById('no-subm-msg')
    if (noMsg) {
        noMsg.remove();
        let id = document.createElement('div');
        id.setAttribute('class', 'submission-cell');
        let idHeading = document.createElement('h4');
        idHeading.innerHTML = 'ID'
        id.appendChild(idHeading);
        document.querySelector('.submission-list').appendChild(id)


        let Question = document.createElement('div');
        Question.setAttribute('class', 'submission-cell');
        let QuestionHeading = document.createElement('h4');
        QuestionHeading.innerHTML = 'Question'
        Question.appendChild(QuestionHeading);
        document.querySelector('.submission-list').appendChild(Question)


        let User = document.createElement('div');
        User.setAttribute('class', 'submission-cell');
        let UserHeading = document.createElement('h4');
        UserHeading.innerHTML = 'User'
        User.appendChild(UserHeading);
        document.querySelector('.submission-list').appendChild(User)


        let Verdict = document.createElement('div');
        Verdict.setAttribute('class', 'submission-cell');
        let VerdictHeading = document.createElement('h4');
        VerdictHeading.innerHTML = 'Verdict'
        Verdict.appendChild(VerdictHeading);
        document.querySelector('.submission-list').appendChild(Verdict)


        let Time = document.createElement('div');
        Time.setAttribute('class', 'submission-cell');
        let TimeHeading = document.createElement('h4');
        TimeHeading.innerHTML = 'Time'
        Time.appendChild(TimeHeading);
        document.querySelector('.submission-list').appendChild(Time)
    }
}

async function fillSubmissionList(data) {
    if (!data || (data.length == 0)) {
        // document.querySelector('.submission-cell').classList.add('null-class');
        // let msg = document.createElement('p')
        // msg.innerHTML = 'You have not made any submissions.'
        // msg.setAttribute('class', 'no-subm-msg')
        document.querySelector('.submission-list').innerHTML = '<p id="no-subm-msg">You have not made any submissions.</p>';
        document.querySelector('.submission-list').classList.add('temp-class');

        return;
    }
    addSubmissions();
    // document.querySelector('.submission-cell').classList.remove('null-class');
    // document.querySelector('.submission-list').classList.remove('temp-class');
    if (document.querySelector('.submission-list').classList.contains('temp-class'))
        document.querySelector('.submission-list').classList.remove('temp-class');
    var i = 5;
    console.log(data)
    // console.log(submissionList.children)
    while (submissionList.children.length > i) {
        submissionList.removeChild(submissionList.children[i])
    }
    // console.log(submissionList.children)
    // console.log(submissionList.children.length)

    data.forEach((element, index) => {

        var idDiv = document.createElement('a')
        idDiv.innerHTML = element._id
        idDiv.style = "padding-top:4%"
        idDiv.href = `/submissions/${element._id}`
        idDiv.target = '_blank'
        idDiv.classList.add('submission-cell')

        if (index % 2 == 0)
            idDiv.classList.add('submission-bg-color')

        var questionDiv = document.createElement('div')
        questionDiv.innerHTML = element.question
        questionDiv.style = "padding-top:4%"
        questionDiv.classList.add('submission-cell')

        if (index % 2 == 0)
            questionDiv.classList.add('submission-bg-color')

        var userDiv = document.createElement('div')
        userDiv.innerHTML = element.userHandle[0].codeforces
        userDiv.style = "padding-top:4%"
        userDiv.classList.add('submission-cell')

        if (index % 2 == 0)
            userDiv.classList.add('submission-bg-color')

        var verdictDiv = document.createElement('div')
        verdictDiv.innerHTML = element.verdict
        verdictDiv.style = "padding-top:4%"
        verdictDiv.classList.add('submission-cell')

        if (index % 2 == 0)
            verdictDiv.classList.add('submission-bg-color')

        var timeDiv = document.createElement('div')
        var t = new Date(element.time)
        timeDiv.innerHTML = t.toLocaleString()
        timeDiv.style = "padding-top:4%"
        timeDiv.classList.add('submission-cell')

        if (index % 2 == 0)
            timeDiv.classList.add('submission-bg-color')

        submissionList.appendChild(idDiv)
        submissionList.appendChild(questionDiv)
        submissionList.appendChild(userDiv)
        submissionList.appendChild(verdictDiv)
        submissionList.appendChild(timeDiv)

    });

}

yourOnly_checkbox.addEventListener('change', async () => {
    if (yourOnly_checkbox.checked) {
        userSubmission.disabled = true
    }
    else {
        var data = await fetch(`/code/submissions?userSelected=All`)
            .then(res => res.json())

        console.log('here is checked change')
        console.log(data.data)
        fillSubmissionList(data.data)
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

document.querySelector('.filter-apply-button').addEventListener('click', async () => {
    var questionSelected = document.getElementById('ques').value
    var verdictSelected = document.getElementById('verd').value
    var userSelected = document.getElementById('user-submission').value

    if (!userSelected) {
        if (!yourOnly_checkbox.checked)
            userSelected = 'All'
    }

    console.log(questionSelected, verdictSelected, userSelected)

    var data = await fetch(`/code/submissions?verdictSelected=${verdictSelected}&questionSelected=${questionSelected}&userSelected=${userSelected}`)
        .then(res => res.json())

    // console.log(data)
    fillSubmissionList(data.data)
})


window.onload = getUserData();

