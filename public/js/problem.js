const probEditCont = document.querySelector('.problem-editor-cont');
const probCont = document.querySelector('.problem-cont');
const separator = document.querySelector('.resize-bar');
const editCont = document.querySelector('.editor-cont');

let xCursorPos = 0;
let yCursorPos = 0;
let leftWidth = 0;
let rightWidth = 0;
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

const divResizing = function (e) {
    xCursorPos = e.clientX;
    yCursorPos = e.clientY;
    leftWidth = probCont.getBoundingClientRect().width;
    rightWidth = editCont.getBoundingClientRect().width;
    document.addEventListener("mousemove", mouseMoveHandlerLeft);
    document.addEventListener("mouseup", mouseUpHandlerLeft);
};

separator.addEventListener("mousedown", divResizing);

const mouseMoveHandlerLeft = function (e) {
    let dx = e.clientX - xCursorPos;
    let dy = e.clientY - yCursorPos;

    let newLeftWidth = leftWidth + dx;
    let newRightWidth = rightWidth - dx;
    if (newLeftWidth - originalLeftWidth > 100) {
        newLeftWidth = originalLeftWidth + 100;
        newRightWidth = originalRightWidth - 100;
    }
    if (newLeftWidth - originalLeftWidth < -100) {
        newLeftWidth = originalLeftWidth - 100;
        newRightWidth = originalRightWidth + 100;
    }
    probCont.style.width = `${newLeftWidth}px`;
    editCont.style.width = `${newRightWidth}px`;

    probCont.style.userSelect = "none";
    probCont.style.pointerEvents = "none";

    editCont.style.userSelect = "none";
    editCont.style.pointerEvents = "none";

    console.log({dx, dy});
    console.log({leftWidth, rightWidth});

    document.body.style.cursor = "col-resize";
};

const mouseUpHandlerLeft = function () {
    separator.style.removeProperty("cursor");
    document.body.style.removeProperty("cursor");

    probCont.style.removeProperty("user-select");
    probCont.style.removeProperty("pointer-events");

    editCont.style.removeProperty("user-select");
    editCont.style.removeProperty("pointer-events");

    document.removeEventListener("mousemove", mouseMoveHandlerLeft);
    document.removeEventListener("mouseup", mouseUpHandlerLeft);
};