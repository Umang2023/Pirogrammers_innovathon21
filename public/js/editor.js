var userTheme = document.getElementById('themes');

userTheme.addEventListener('change', () => {
    var themeChoosen = userTheme.value;

    if (themeChoosen === 'solarized_light') {
        loadEditor('solarized_light')
    }
    else if (themeChoosen === 'clouds') {
        loadEditor('clouds')
    }
    else if (themeChoosen === 'solarized_dark') {
        loadEditor('solarized_dark')
    }
    else if (themeChoosen === 'tomorrow_night_blue') {
        loadEditor('tomorrow_night_blue')
    } else {
        loadEditor('monokai')
    }

})
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
        loadEditor('monokai');
    })
}
function loadEditor(theme) {
    var editor = ace.edit("editor");
    editor.setTheme(`ace/theme/${theme}`);

    setTemplate();
}

function setTemplate() {
    var editor = ace.edit("editor");
    var EditSession = require("ace/edit_session").EditSession;
    var cpp = new EditSession("#include < iostream >\r\n" +
        "using namespace std;\r\n" +
        "\r\n" +
        "int main() {\r\n" +
        "\t// your code goes here\r\n" +
        "\treturn 0;\r\n" +
        "}\r\n");
    // and then to load document into editor, just call
    editor.setSession(cpp);
    editor.session.setMode("ace/mode/c_cpp");
}

window.onload = getDashboardData();

