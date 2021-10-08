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

    var codeforcesContent = '', codechefContent = '', leetcodeContent = '', spojContent = '', atcoderContent = ''

    if (data.codeforces && data.codeforces.length > 0)
        codeforcesContent = `
        <div class="handle_name"> Codeforces </div> 
        <div class="handle_value">
            :<a href="https://codeforces.com/profile/${data.codeforces}" target="_blank"> ${data.codeforces}
        </a>
        </div>`;
    else {
        codeforcesContent = `
        <div class="handle_name"> Codeforces </div> 
        <div class="handle_value">: Not set </div>`;
    }

    if (data.codechef && data.codechef.length > 0)
        codechefContent = `
        <div class="handle_name"> CodeChef </div>
        <div class="handle_value"> 
            :<a href="https://codechef.com/users/${data.codechef}" target="_blank"> ${data.codechef}</a>
        </div>`;
    else {
        codechefContent = `
        <div class="handle_name"> CodeChef </div> 
        <div class="handle_value">: Not set </div>`;
    }
    if (data.leetcode && data.leetcode.length > 0)
        leetcodeContent = `
        <div class="handle_name"> Leetcode </div> 
        <div class="handle_value">
            :<a href="https://leetcode.com/${data.leetcode}" target="_blank"> ${data.leetcode}</a>
        </div>`;
    else {
        leetcodeContent = `
        <div class="handle_name"> Leetcode </div>
        <div class="handle_value">: Not set </div>`;
    }
    if (data.spoj && data.spoj.length > 0)
        spojContent = `
        <div class="handle_name"> Spoj </div> 
        <div class="handle_value">
            :<a href="https://spoj.com" target="_blank"> ${data.spoj}</a>
        </div>`;
    else {
        spojContent = `
        <div class="handle_name"> Spoj </div> 
        <div class="handle_value">: Not set</div>`;
    }
    if (data.atcoder && data.atcoder.length > 0)
        atcoderContent = `
        <div class="handle_name"> Atcoder </div> 
        <div class="handle_value">
            :<a href="https://atcoder.jp/users/${data.atcoder}" target="_blank"> ${data.atcoder}</a>
        </div>`;
    else {
        atcoderContent = `
        <div class="handle_name"> Atcoder </div> 
        <div class="handle_value">: Not set</div>`;
    }
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

function editHandles() {
    window.location.href = './setup'
}
window.onload = getProfileData();