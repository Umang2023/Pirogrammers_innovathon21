const probEditCont = document.querySelector('.problem-editor-cont');
const probCont = document.querySelector('.problem-cont');
const separator = document.querySelector('.resize-bar');
const editCont = document.querySelector('.editor-cont');

let xCursorPos = 0;
let yCursorPos = 0;
let originalLeftWidth;
let originalRightWidth;

function setWidthOnLoad() {
    let maxWidth = probEditCont.getBoundingClientRect().width;
    let eachWidth = (maxWidth - 20) / 2;
    originalLeftWidth = eachWidth;
    originalRightWidth = eachWidth;
    eachWidth = (eachWidth * 100) / maxWidth;
    probCont.style.width = `${eachWidth}%`;
    editCont.style.width = `${eachWidth}%`;
}

window.onload = setWidthOnLoad();