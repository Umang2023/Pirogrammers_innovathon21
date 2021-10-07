function fillProfile(data) {
    let profImg = document.createElement('img');
    profImg.src = data.pic;
    profImg.classList.add('nav-prof-img')
    document.querySelector('.navbar-profile-img').appendChild(profImg);

    let myImg = document.createElement('img');
    myImg.src = data.pic;
    myImg.classList.add('profile-img');
    document.querySelector('.img-info').appendChild(myImg);

    let profName = "Name: " + data.name;
    let profEmail = "Email: " + data.email;
    document.querySelector('.name-info').innerHTML = profName;
    document.querySelector('.email-info').innerHTML = profEmail;

    let codeforcesContent = 'Codeforces: <a href="https://codeforces.com" target="_blank">Lord_Invincible</a>';
    let codechefContent = 'Codechef: <a href="https://codechef.com" target="_blank">Lord_Invincible</a>';
    let leetcodeContent = 'Leetcode: <a href="https://leetcode.com" target="_blank">Lord_Invincible</a>';
    let spojContent = 'Spoj: <a href="https://spoj.com" target="_blank">Lord_Invincible</a>';
    let atcoderContent = 'Atcoder: <a href="https://atcoder.jp" target="_blank">Lord_Invincible</a>';

    document.querySelector('.codeforces-handle').innerHTML = codeforcesContent;
    document.querySelector('.codechef-handle').innerHTML = codechefContent;
    document.querySelector('.leetcode-handle').innerHTML = leetcodeContent;
    document.querySelector('.spoj-handle').innerHTML = spojContent;
    document.querySelector('.atcoder-handle').innerHTML = atcoderContent;
}

function getProfileData() {
    fetch('/user/current').then((res) => {
        return res.json();
    }).then((data) => {
        fillProfile(data);
    })
}

window.onload = getProfileData();