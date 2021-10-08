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

    var codeforcesContent='',codechefContent='',leetcodeContent='',spojContent='',atcoderContent=''

    if(data.codeforces && data.codeforces.length > 0)
    codeforcesContent = `Codeforces: <a href="https://codeforces.com/profile/${data.codeforces}" target="_blank">${data.codeforces}</a>`;


    if(data.codechef && data.codechef.length > 0)
    codechefContent = `Codechef: <a href="https://codechef.com/users/${data.codechef}" target="_blank">${data.codechef}</a>`;
    
    if(data.leetcode && data.leetcode.length > 0)
    leetcodeContent = `Leetcode: <a href="https://leetcode.com/${data.leetcode}" target="_blank">${data.leetcode}</a>`;
    
    if(data.spoj && data.spoj.length > 0)
    spojContent = `Spoj: <a href="https://spoj.com" target="_blank">${data.spoj}</a>`;
    
    if(data.atcoder && data.atcoder.length > 0)
    atcoderContent = `Atcoder: <a href="https://atcoder.jp/users/${data.atcoder}" target="_blank">${data.atcoder}</a>`;

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