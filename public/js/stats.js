//codeforces data fetch
var userName = '';
function capitalizeFirstLetter(string) {
    if (string.length > 0) {
        string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
}
function getCfData() {
    fetch(`https://codeforces.com/api/user.rating?handle=${userName}`)
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            var rating_change_graph = []
            data.result.forEach((element) => {
                var temp_object = {
                    x: new Date(element.ratingUpdateTimeSeconds * 1000),
                    y: element.newRating
                }
                rating_change_graph.push(temp_object);
            })
            console.log(rating_change_graph);
            generateRatingChart(rating_change_graph);
            fillUserInfo();
        })
}
function fillUserInfo() {
    fetch(`https://codeforces.com/api/user.info?handles=${userName}`)
        .then(res => res.json())
        .then((data) => {
            console.log(data)
            let myImg = document.createElement('img');
            myImg.src = data.result[0].avatar;
            myImg.setAttribute('class', 'cf-profile-img');
            document.querySelector('.cf-profile-img-div').appendChild(myImg);

            let profName = capitalizeFirstLetter(data.result[0].firstName) + " " +
                capitalizeFirstLetter(data.result[0].lastName);
            // profName.setAttribute('class', 'cf-name');
            document.querySelector('.cf-name-div').innerHTML = profName;

            let currRating = data.result[0].rating;
            let maxRating = data.result[0].maxRating;
            let currRank = data.result[0].rank;
            let maxRank = data.result[0].maxRank;
            let friends = data.result[0].friendOfCount;
            document.querySelector('.current-rating-div').innerHTML = `Current Rating : ${currRating}`;
            document.querySelector('.current-rank-div').innerHTML = `Current Rank : ${currRank}`;
            document.querySelector('.max-rating-div').innerHTML = `Max Rating : ${maxRating}`;
            document.querySelector('.max-rank-div').innerHTML = `Max Rank : ${maxRank}`;
            document.querySelector('.friend-count').innerHTML = `Friends : ${friends}`;


        })
}
function fillNavbar(data) {
    let profImg = document.createElement('img');
    profImg.src = data.pic;
    profImg.classList.add('nav-prof-img')
    document.querySelector('.navbar-profile-img').appendChild(profImg);

    userName = data.codeforces;
}

function getUserData() {
    fetch('/user/current').then((res) => {
        return res.json();
    }).then((data) => {
        fillNavbar(data);
        getCfData();
    })
}

window.onload = getUserData();


//Charts work
function generateRatingChart(rating_change_graph) {
    let labels = [];
    let datapoints = [0]
    rating_change_graph.forEach((change) => {
        let dateObj = change.x;

        var shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format;
        let month = shortMonthName(dateObj)
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();

        let newDate = "";
        newDate = day + " " + month + " " + year;
        // console.log(newDate)
        labels.push(newDate);
        datapoints.push(change.y);
    })
    const data = {
        labels: labels,
        datasets: [{
            label: 'Rating Change',
            borderColor: 'rgb(0, 0, 0)',
            data: datapoints,
            backgroundColor: 'rgb(0, 0, 0)',
            pointBackgroundColor: 'rgb(0, 0, 153)',
            pointBorderColor: 'rgb(0, 0, 153)'
        }]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            // backgroundColor: 'rgb(255, 255, 255)',
            // color: 'rgb(0,0,0)'
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}


// var ctx = document.getElementById('myChart');
// var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });