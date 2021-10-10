let myEditor = ace.edit("editor");
let prob1Max = 100000;
let prob2Max = 2000000000;
let prob3Max = 200000;

let tleVerdict = "There are chances of Time Limit Exceeded!";
let intOverflow = "There are chances of integer overflow!";
let memoryOverflow = "There are chances of Memory Limit Exceeded";

function getLoops(codeData) {
    let n = codeData.length;
    let loopArr = [];
    codeData = codeData.replace(/\s/g, '');
    let loopCount = 1;
    for (let i = 0; i < n - 2; i++) {
        if (codeData[i] === 'f' && codeData[i + 1] === 'o' && codeData[i + 2] === 'r') {
            let str = "";
            i = i + 4;
            while (codeData[i] !== ')') {
                str += codeData[i];
                i++;
            }
            let obj = {
                parent: -1,
                loopNo: loopCount,
                loopContent: str 
            }
            loopCount++;
            loopArr.push(obj);
            i = i + 2;
            if (codeData[i] === 'f' && codeData[i + 1] === 'o' && codeData[i + 2] === 'r') {
                let str = "";
                i = i + 4;
                while (codeData[i] !== ')') {
                    str += codeData[i];
                    i++;
                }
                let obj = {
                    parent: loopCount - 1,
                    loopNo: loopCount,
                    loopContent: str 
                }
                loopCount++;
                loopArr.push(obj);
            }
        }
    }
    return loopArr;
}

function getJump(loopStr) {
    let multiply = 0, divide = 0, add = 0, subtract = 0;
    let jump;
    if (loopStr.includes('++')) {
        add = 1;
        jump = 1; 
    } else if (loopStr.includes('--')) {
        subtract = 1;
        jump = 1;
    } else if (loopStr.includes('+=')) {
        add = 1;
        jump = Number(loopStr.split('+=')[1]);
    } else if (loopStr.includes('-=')) {
        subtract = 1;
        jump = Number(loopStr.split('-=')[1]);
    } else if (loopStr.includes('+')) {
        add = 1;
        jump = Number(loopStr.split('+')[1]);
    } else if (loopStr.includes('-')) {
        subtract = 1;
        jump = Number(loopStr.split('-')[1]);
    } else if (loopStr.includes('*=')) {
        multiply = 1;
        jump = Number(loopStr.split('*=')[1]);
    } else if (loopStr.includes('/=')) {
        divide = 1;
        jump = Number(loopStr.split('/=')[1]);
    } else if (loopStr.includes('*')) {
        multiply = 1;
        jump = Number(loopStr.split('*')[1]);
    } else if (loopStr.includes('/')) {
        divide = 1;
        jump = Number(loopStr.split('/')[1]);
    }
    return [jump, multiply, divide, add, subtract];
}

function getEnd(loopStr) {
    let lessThan = 0, greaterThan = 0, lessEqual = 0, greaterEqual = 0;
    let endVar;
    if (loopStr.includes('<=')) {
        lessEqual = 1;
        endVar = loopStr.split('<=')[1];
    } else if (loopStr.includes('>=')) {
        greaterEqual = 1;
        endVar = loopStr.split('>=')[1];
    } else if (loopStr.includes('>')) {
        greaterThan = 1;
        endVar = loopStr.split('>')[1];
    } else {
        lessThan = 1;
        endVar = loopStr.split('<')[1];
    }

    endVar = endVar.replace(/\s/g, '');
    let compactCode = myEditor.getValue();
    compactCode = compactCode.replace(/\s/g, '');
    if (isNaN(endVar) === false) {
        end = Number(endVar);
    } else {
        let userDec = endVar + '=';
        if (compactCode.includes(userDec)) {
            let ind = compactCode.lastIndexOf(userDec);
            let temp = "";
            ind = ind + endVar.length + 1;
            while (compactCode[ind] !== ';') {
                temp += compactCode[ind];
                ind++;
            }
            end = Number(temp);
        } else {
            let probList = document.querySelector('.problem-list');
            for (let i = 0; i < probList.children.length; i++) {
                if (probList.children[i].style.backgroundColor !== '#f2f2f2;') {
                    if (i === 0) {
                        end = 100000;
                    } else if (i === 1) {
                        end = 2000000000;
                    } else {
                        end = 200000;
                    }
                }
            }
        }
    }

    return [end, lessThan, greaterThan, lessEqual, greaterEqual];
}

function getStart(loopStr) {
    start = Number(loopStr.split('=')[1]);
    return [start];
}

function loopBreak(loopArr) {
    let n = loopArr.length;
    let loopDetails = [];
    for (let i = 0; i < n; i++) {
        let str = loopArr[i].loopContent;
        let [jump, multiply, divide, add, subtract] = getJump(str.split(';')[2]);
        let [end, lessThan, greaterThan, lessEqual, greaterEqual] = getEnd(str.split(';')[1]);
        let [start] = getStart(str.split(';')[0]);
        let obj = {
            start: start,
            end: end,
            jump: jump,
            multiply: multiply,
            divide: divide,
            add: add,
            subtract: subtract,
            lessThan: lessThan,
            greaterThan: greaterThan,
            lessEqual: lessEqual,
            greaterEqual: greaterEqual,
            loopNo: loopArr[i].loopNo,
            parent: loopArr[i].parent
        }
        loopDetails.push(obj);
    }
    
    return loopDetails;
}

function getIterNo(loopDetails) {
    let totIter = 0;
    let iterTrack = [];
    console.log(loopDetails.length);
    for (let i = 0; i < loopDetails.length; i++) {
        let start = loopDetails[i].start;
        let end = loopDetails[i].end;
        let jump = loopDetails[i].jump;
        if (loopDetails[i].add === 1) {
            if (start > end) {
                return Infinity;
            }
            if (start === end && loopDetails[i].lessEqual === 0) {
                return Infinity;
            }
            if (loopDetails[i].greaterEqual === 1 || loopDetails[i].greaterThan === 1) {
                totIter++;
                iterTrack.push(1);
                continue;
            }
            let currIter = end - start;
            if (loopDetails[i].lessEqual === 1) {
                currIter++;
            }
            totIter += Math.ceil(currIter / jump);
            iterTrack.push(Math.ceil(currIter / jump));
        } else if (loopDetails[i].subtract === 1) {
            if (start < end) {
                return Infinity;
            }
            if (start === end && loopDetails[i].greaterEqual === 0) {
                return Infinity;
            }
            if (loopDetails[i].lessEqual === 1 || loopDetails[i].lessThan === 1) {
                totIter++;
                iterTrack.push(1);
                continue;
            }
            let currIter = start - end;
            if (loopDetails[i].greaterEqual === 1) {
                currIter++;
            }
            totIter += Math.ceil(currIter / jump);
            iterTrack.push(Math.ceil(currIter / jump));
        } else if (loopDetails[i].multiply === 1) {
            if (start > end) {
                return Infinity;
            }
            if (start === end && loopDetails[i].lessEqual === 0) {
                return Infinity;
            }
            if (loopDetails[i].greaterEqual === 1 || loopDetails[i].greaterThan === 1) {
                totIter++;
                iterTrack.push(1);
                continue;
            }
            let currIter = end - start;
            if (loopDetails[i].lessEqual === 1) {
                currIter++;
            }
            totIter += Math.ceil(Math.log(currIter) / Math.log(jump));
            iterTrack.push(Math.ceil(Math.log(currIter) / Math.log(jump)));
        } else {
            if (start < end) {
                return Infinity;
            }
            if (start === end && loopDetails[i].greaterEqual === 0) {
                return Infinity;
            }
            if (loopDetails[i].lessEqual === 1 || loopDetails[i].lessThan === 1) {
                totIter++;
                iterTrack.push(1);
                continue;
            }
            let currIter = start - end;
            if (loopDetails[i].greaterEqual === 1) {
                currIter++;
            }
            totIter += Math.ceil(Math.log(currIter) / Math.log(jump));
            iterTrack.push(Math.ceil(Math.log(currIter) / Math.log(jump)));
        }

        if (loopDetails[i].parent !== -1) {
            let firstIter = iterTrack[loopDetails[i].parent - 1];
            let secondIter = iterTrack[i];
            totIter = totIter - firstIter - secondIter;
            totIter += (firstIter * secondIter);
        }
    }
    console.log(totIter);
}

document.querySelector('.check-code').addEventListener('click', function() {
    let codeData = myEditor.getValue();
    let loopArr = getLoops(codeData);
    let loopDetails = loopBreak(loopArr);
    console.log(loopDetails);

    getIterNo(loopDetails);
})

// let arr = [];
//     let loopDetails = [];
//     for (let i = 0; i < getLoops.length; i++) {
//         let curr = getLoops[i].split(';');
//         let start, end, jump;
//         let jumpCases = curr[2];
//         let multiply = 0, divide = 0;
//         if (jumpCases.includes('++') || jumpCases.includes('--')) {
//             jump = 1; 
//         } else if (jumpCases.includes('+=')) {
//             jump = Number(jumpCases.split('+=')[1]);
//         } else if (jumpCases.includes('-=')) {
//             jump = Number(jumpCases.split('-=')[1]);
//         } else if (jumpCases.includes('+')) {
//             jump = Number(jumpCases.split('+')[1]);
//         } else if (jumpCases.includes('-')) {
//             jump = Number(jumpCases.split('-')[1]);
//         } else if (jumpCases.includes('*=')) {
//             multiply = 1;
//             jump = Number(jumpCases.split('*=')[1]);
//         } else if (jumpCases.includes('/=')) {
//             divide = 1;
//             jump = Number(jumpCases.split('/=')[1]);
//         } else if (jumpCases.includes('*')) {
//             multiply = 1;
//             jump = Number(jumpCases.split('*')[1]);
//         } else if (jumpCases.includes('/')) {
//             divide = 1;
//             jump = Number(jumpCases.split('/')[1]);
//         }

//         let lessThan = 0, greaterThan = 0, lessEqual = 0, greaterEqual = 0;
//         let endCases = curr[1];
//         let endVar;
//         if (endCases.includes('<=')) {
//             lessEqual = 1;
//             endVar = endCases.split('<=')[1];
//         } else if (endCases.includes('>=')) {
//             greaterEqual = 1;
//             endVar = endCases.split('>=')[1];
//         } else if (endCases.includes('>')) {
//             greaterThan = 1;
//             endVar = endCases.split('>')[1];
//         } else {
//             lessThan = 1;
//             endVar = endCases.split('<')[1];
//         }

//         endVar = endVar.replace(/\s/g, '');
//         if (isNaN(endVar) === false) {
//             end = Number(endVar);
//         } else {
//             let compactCode = x.replace(/\s/g,'');
//             let len = compactCode.length;
//             let userDec = endVar + '=';
//             let inpDec = '>>' + endVar;
//             if (compactCode.includes(userDec)) {
//                 let ind = compactCode.lastIndexOf(userDec);
//                 let temp = "";
//                 ind = ind + endVar.length + 1;
//                 while (compactCode[ind] !== ';') {
//                     temp += compactCode[ind];
//                     ind++;
//                 }
//                 end = Number(temp);
//             } else {
//                 end = 100000;
//             }
//         }
//         start = Number(curr[0].split('=')[1]);
//         let obj = {
//             start: start,
//             end: end,
//             jump: jump,
//             multiply: multiply,
//             divide: divide,
//             lessThan: lessThan,
//             lessEqual: lessEqual,
//             greaterThan: greaterThan,
//             greaterEqual: greaterEqual
//         }
//         arr.push(obj);
//     }
//     console.log({arr});