//codeforces data fetch
var userName = '';
Chart.defaults.font.size = 16;
Chart.defaults.font.family = '"Times New Roman", Times, serif';
Chart.defaults.font.weight = 900;
function capitalizeFirstLetter(string) {
    if (string.length > 0) {
        string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
}
function compare(a, b) {
    return b.y - a.y;
}
function comparator(a, b) {
    return a.x - b.x;
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
            console.log(data.result[0].lastName, typeof (data.result[0].lastName));
            let profName = capitalizeFirstLetter(data.result[0].firstName);
            if (data.result[0].lastName) {
                profName += " " + capitalizeFirstLetter(data.result[0].lastName);
            }
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
        fillProblemTags();
    })
}

window.onload = getUserData();


//Charts work
function generateRatingChart(rating_change_graph) {
    let labels = [];
    let datapoints = []
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
    console.table(labels.length)
    console.table(datapoints.length)
    let currDate = new Date();
    var shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format;
    let month = shortMonthName(currDate)
    let day = currDate.getUTCDate();
    let year = currDate.getUTCFullYear();
    let newDate = "";
    newDate = day + " " + month + " " + year;
    labels.push(newDate);
    const data = {
        labels: labels,
        datasets: [{
            label: 'Rating Change',
            borderColor: 'rgb(0, 0, 0)',
            data: datapoints,
            backgroundColor: 'rgba(0,0,153,0.5)',
            pointBackgroundColor: 'rgb(0, 0, 153)',
            pointBorderColor: 'rgb(0, 0, 153)',
            fill: true
        }]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            // backgroundColor: 'rgb(255, 255, 255)',
            // color: 'rgb(0,0,0)'
            layout: {
                padding: 10
            },
            scales: {
                y: {
                    ticks: {
                        color: 'rgb(0,0,0)'
                    },
                    title: {
                        color: 'rgb(0,0,0)',
                        display: true,
                        text: 'Rating'
                    }
                },
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgb(0,0,0)'
                    },
                    title: {
                        color: 'rgb(0,0,0)',
                        display: true,
                        text: 'Date'
                    }
                }
            }

        }
    };

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}
function fillProblemTags() {
    fetch(`https://codeforces.com/api/user.status?handle=${userName}&from=1`)
        .then(res => res.json())
        .then((data) => {
            let arr = [];
            let dtype = [];
            let i = 0;
            let nmap = new Map();
            var accepted = 0;
            var wrong_answer = 0;
            var tle = 0;
            var memory_limit = 0;
            var runtime_error = 0;
            var acceptedSet = new Set()
            var rating_wise_submissions = new Map()
            data.result.forEach(function (element) {

                if (element.verdict === "OK") {
                    i += 1;
                    arr[i] = element.problem.tags;
                }
                var unique = element.problem.contestId.toString() + element.problem.index
                if (element.verdict === "OK" && !acceptedSet.has(unique)) {
                    ++accepted;
                    // console.log(element)
                    acceptedSet.add(unique)
                    var questionRating = element.problem.rating;
                    if (rating_wise_submissions.has(questionRating)) {
                        rating_wise_submissions.set(questionRating, rating_wise_submissions.get(questionRating) + 1)
                    }
                    else {
                        rating_wise_submissions.set(questionRating, 1);
                    }

                }
                if (element.verdict === "TIME_LIMIT_EXCEEDED")
                    tle += 1;
                if (element.verdict === "WRONG_ANSWER")
                    wrong_answer += 1;
                if (element.verdict === "MEMORY_LIMIT_EXCEEDED")
                    memory_limit += 1;
                if (element.verdict === "RUNTIME_ERROR")
                    runtime_error += 1;
            });
            i = 0;
            arr.forEach(function (element) {
                element.forEach(function (str) {
                    if (nmap.has(str) == false)
                        nmap.set(str, 1);
                    else {
                        let v = nmap.get(str);
                        nmap.set(str, v + 1);
                    }
                })
            })
            for (let [key, value] of nmap) {
                //console.log(key + ' = ' + value);
                let nkey = capitalizeFirstLetter(key);
                dtype[i] = { label: nkey, y: value };
                i += 1;
            }
            dtype.sort(compare);
            generateTagChart(dtype);
            //console.table(dtype);
            //console.log(accepted, tle, wrong_answer, memory_limit, runtime_error);
            let subms = [];
            subms.push({ label: "Accepted", y: accepted });
            subms.push({ label: "Wrong Answer", y: wrong_answer });
            subms.push({ label: "Time Limit Exceeded", y: tle });
            subms.push({ label: "Memory Limit Exceeded", y: memory_limit });
            subms.push({ label: "Runtime Error", y: runtime_error });

            //console.table(subms);
            generateSubmissionRadGraph(subms);
            var list_rating_wise_submissions = []
            const iterator = rating_wise_submissions[Symbol.iterator]();
            for (const item of iterator) {
                if (item[0] != undefined && item[1] != undefined) {
                    var temp_object = {
                        x: item[0],
                        y: item[1]
                    }
                    list_rating_wise_submissions.push(temp_object)
                }

            }

            list_rating_wise_submissions.sort(comparator)
            // console.log(list_rating_wise_submissions)
            generateBarGraph(list_rating_wise_submissions)
        })
}
function generateTagChart(submissionsObj) {
    let labels = [];
    let datapoints = [];

    submissionsObj.forEach((submission) => {

        labels.push(submission.label);
        datapoints.push(submission.y);

    })
    const data = {
        labels: labels,
        datasets: [{
            label: 'Number of problems solved',

            data: datapoints,
            backgroundColor: [
                'rgba(229, 0, 206, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 51, 51, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(0, 199, 53, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(153, 0, 153, 1)'
            ],
            borderColor: [
                'rgba(229, 0, 206, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 51, 51, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(0, 199, 53, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(153, 0, 153, 1)'
            ],
            pointBackgroundColor: 'rgb(0, 0, 153)',
            pointBorderColor: 'rgb(0, 0, 153)',
            fill: true
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',

            scales: {
                x: {
                    ticks: {
                        color: 'rgb(0,0,0)'
                    },
                    title: {
                        color: 'rgb(0,0,0)',
                        display: true,
                        text: 'Number of problems solved'
                    }
                },
                y: {
                    ticks: {
                        color: 'rgb(0,0,0)'
                    },
                    title: {
                        color: 'rgb(0,0,0)',
                        display: true,
                        text: 'Problem Tag'
                    }
                }
            }

        }
    };
    var myChart = new Chart(
        document.getElementById('tags'),
        config
    );
}

function generateSubmissionRadGraph(submissions) {
    let labels = [];
    let datapoints = [];
    submissions.forEach((submission) => {
        labels.push(submission.label);
        datapoints.push(submission.y);

    })
    const data = {
        labels: labels,
        datasets: [{
            label: 'Submissions History',

            data: datapoints,
            backgroundColor: [
                'rgba(0, 199, 53, 1)',
                'rgba(255, 51, 51, 1)',

                'rgba(255, 205, 86, 1)',

                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',

            ],
            borderColor: [
                'rgba(0, 199, 53, 1)',
                'rgba(255, 51, 51, 1)',

                'rgba(255, 205, 86, 1)',

                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            pointBackgroundColor: 'rgb(0, 0, 153)',
            pointBorderColor: 'rgb(0, 0, 153)',
            fill: true
        }]
    };
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            // layout: {
            //     padding: 10
            // }
        }
    };
    var myChart = new Chart(
        document.getElementById('submissions'),
        config
    );
}

function generateBarGraph(submissions) {
    let labels = [];
    let datapoints = [];
    submissions.forEach((submission) => {

        labels.push(submission.x);
        datapoints.push(submission.y);

    })
    const data = {
        labels: labels,
        datasets: [{
            label: 'Rating wise submissions',

            data: datapoints,
            backgroundColor: [
                'rgba(229, 0, 206, 1)',
                'rgba(0, 199, 53, 1)',
                'rgba(255, 51, 51, 1)',

                'rgba(255, 205, 86, 1)',

                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(153, 0, 153, 1)'

            ],
            borderColor: [
                'rgba(229, 0, 206, 1)',
                'rgba(0, 199, 53, 1)',
                'rgba(255, 51, 51, 1)',

                'rgba(255, 205, 86, 1)',

                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(153, 0, 153, 1)'
            ],
            pointBackgroundColor: 'rgb(0, 0, 153)',
            pointBorderColor: 'rgb(0, 0, 153)',
            fill: true
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            // animations: {
            //     tension: {
            //         duration: 1000,
            //         easing: 'linear',
            //         from: 1,
            //         to: 0,
            //         loop: true
            //     }
            // },
            // layout: {
            //     padding: 10
            // },
            scales: {
                y: {
                    ticks: {
                        color: 'rgb(0,0,0)'
                    },
                    title: {
                        color: 'rgb(0,0,0)',
                        display: true,
                        text: 'Number of problems solved'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgb(0,0,0)'
                    },
                    title: {
                        color: 'rgb(0,0,0)',
                        display: true,
                        text: 'Problem Rating'
                    }
                }
            }
        }
    };
    var myChart = new Chart(
        document.getElementById('rating-subm'),
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