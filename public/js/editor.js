var userTheme = document.getElementById('themes');
var editor = ace.edit("editor");

import {checker} from './checker.js'

setInterval(async () => {
    var codeWritten = editor.getValue()
    
    var savedCode = await fetch('/code/saveCode',{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            code:codeWritten,
        })
    })
    .then(res=>res.json())

    // console.log(savedCode)
}, 1000*30);

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

async function loadEditor(theme) {
    // var editor = ace.edit("editor");
    editor.setTheme(`ace/theme/${theme}`);
    document.getElementById('editor').style.fontSize='16px';
    
    var previousCode = await fetch('/code/previous').then(res=>res.json())

    if(!previousCode.data || previousCode.data.length == 0)
        setTemplate();
    else
    {
        // console.log(previousCode)
        var EditSession = require("ace/edit_session").EditSession;
        // editor.setValue(previousCode.data)
        var cpp = new EditSession(previousCode.data)
        editor.setSession(cpp);
        editor.session.setMode("ace/mode/c_cpp");
    }
        
}

function setTemplate() {
    // var editor = ace.edit("editor");
    var EditSession = require("ace/edit_session").EditSession;
    var cpp = new EditSession("#include <iostream>\r\n" +
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

document.querySelector('.submit-code').addEventListener('click',async ()=>{
    var codeWritten = editor.getValue();
    var language = 'cpp17'
    var inputGiven = document.getElementById('input_box').value;
    // console.log(inputGiven)
    checker(codeWritten)
    document.getElementById('output_box').value = 'Running...'
    var output = await fetch('/code/compileCode',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            codeWritten,
            language,
            inputGiven
        })
    })
    .then(res=>res.json())

    var savedCode = await fetch('/code/saveCode',{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            code:codeWritten,
        })
    })
    .then(res=>res.json())

    console.log(savedCode)
    document.getElementById('output_box').value = output.data.output;

})

window.onload = getDashboardData();

