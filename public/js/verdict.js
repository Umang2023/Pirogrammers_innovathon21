let myEditor = ace.edit("editor");
let prob1Max = 100000;
let prob2Max = 2000000000;
let prob3Max = 200000;

let tleVerdict = 'There are chances of Time Limit Exceeded!';
let intOverflow = 'There are chances of Integer Overflow!';
let memoryOverflow = 'There are chances of Memory Limit Exceeded';
let rteError = 'There are chances of Run Time Error';
let tleFine = 'Looks like your code will not give Time Limit Exceeded Error';
let intFine = 'Looks like your code will not give Interger Overflow Error';
let memoryFine = 'Looks like your code will not give Memory Limit Exceeded Error';
let rteFine = 'Looks like your code will not give Run Time Error';

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

function getCurrentProb() {
    for (let i = 1; i < 4; i++) {
        if (!document.querySelector(`.problem-body${i}`).classList.contains('hidden')) {
            if (i === 1) {
                return 1;
            } else if (i === 2) {
                return 2;
            } else {
                return 3;
            }
        }
    }
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
            let currProb = getCurrentProb();
            if (currProb === 1) {
                end = 100000;
            } else if (currProb === 2) {
                end = 2000000000;
            } else {
                end = 200000;
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
        //console.log(totIter);
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
    return totIter;
    //console.log(totIter);
}

function checkTle(totIterNo) {
    if (totIterNo === Infinity) {
        return tleVerdict;
    }
    let currProb = getCurrentProb();
    let prob1Tle = 1000000000;
    let prob3Tle = 2000000000;
    if (currProb === 1 || currProb === 2) {
        if (totIterNo > prob1Tle) {
            return tleVerdict;
        } else {
            return tleFine;
        }
    } else {
        if (totIterNo > prob3Tle) {
            return tleVerdict;
        } else {
            return tleFine;
        }
    }
}

function checkIntOver() {
    let codeData = myEditor.getValue();
    codeData = codeData.replace(/\s/g, '');
    if (codeData.includes('longlongint') || codeData.includes('longlong')) {
        return intFine;
    } else {
        return intOverflow;
    }
}

function getMem() {
    let totMem = 0;
    let rteErrCheck = 0;
    let codeData = myEditor.getValue();
    codeData = codeData.replace(/\s/g, '');
    let longlongStr = 'longlongint';
    let longStr = 'longint';
    let intStr = 'int';

    let longlongIndSet = new Set();
    let longlongInd = codeData.indexOf(longlongStr, 0);
    while (longlongInd >= 0) {
        longlongIndSet.add(longlongInd);
        longlongInd = codeData.indexOf(longlongStr, longlongInd + 1);
    }
    for (let item of longlongIndSet) {
        let currMem = 0;
        while (1) {
            if (codeData[item] === ';') {
                currMem = 8;
                break;
            }
            if (codeData[item] === '[') {
                let str = '';
                item++;
                while (codeData[item] !== ']') {
                    str += codeData[item];
                    item++;
                }
                currMem = Number(str) * 8;
                if (Number(str) >= 1000000) {
                    rteErrCheck = 1;
                }
                break;
            }
            item++;
        }
        totMem += currMem;
    }

    let longIndSet = new Set();
    let longInd = codeData.indexOf(longStr, 0);
    while (longInd >= 0) {
        if (!longlongIndSet.has(longInd - 4)) {
            longIndSet.add(longInd);
        }
        longInd = codeData.indexOf(longStr, longInd + 1);
    }
    for (let item of longIndSet) {
        let currMem = 0;
        while (1) {
            if (codeData[item] === ';') {
                currMem = 4;
                break;
            }
            if (codeData[item] === '[') {
                let str = '';
                item++;
                while (codeData[item] !== ']') {
                    str += codeData[item];
                    item++;
                }
                currMem = Number(str) * 4;
                if (Number(str) >= 1000000) {
                    rteErrCheck = 1;
                }
                break;
            }
            item++;
        }
        totMem += currMem;
    }

    let intSet = new Set();
    let intInd = codeData.indexOf(intStr, 0);
    while (intInd >= 0) {
        if (!longlongIndSet.has(intInd - 8) && !longIndSet.has(intInd - 4)) {
            intSet.add(intInd);
        }
        intInd = codeData.indexOf(intStr, intInd + 1);
    }
    for (let item of intSet) {
        let currMem = 0;
        while (1) {
            if (codeData[item] === ';') {
                currMem = 4;
                break;
            }
            if (codeData[item] === '[') {
                let str = '';
                item++;
                while (codeData[item] !== ']') {
                    str += codeData[item];
                    item++;
                }
                currMem = Number(str) * 4;
                if (Number(str) >= 1000000) {
                    rteErrCheck = 1;
                }
                break;
            }
            item++;
        }
        totMem += currMem;
    }

    totMem -= 4;
    return [totMem, rteErrCheck];
}

function checkMem(totMem) {
    if (totMem >= 256 * 1024 *1024) {
        return memoryOverflow;
    } else {
        return memoryFine;
    }
}

function checkRte(rteErrCheck) {
    if (rteErrCheck === 1) {
        return rteError;
    } else {
        return rteFine;
    }
}

document.querySelector('.check-code').addEventListener('click', function() {
    document.querySelector('.pre-verdict').innerHTML = '<p>Pre Submit Verdicts:</p>';
    let codeData = myEditor.getValue();
    let loopArr = getLoops(codeData);
    let loopDetails = loopBreak(loopArr);
    console.log(loopDetails);

    let totIterNo = getIterNo(loopDetails);
    console.log('total iterations: ' + totIterNo);
    let tleMessage = checkTle(totIterNo);
    let pTagTle = document.createElement('p');
    pTagTle.innerHTML = tleMessage;
    document.querySelector('.pre-verdict').appendChild(pTagTle);

    let intMessage = checkIntOver();
    let pTagInt = document.createElement('p');
    pTagInt.innerHTML = intMessage;
    document.querySelector('.pre-verdict').appendChild(pTagInt);

    let [totMem, rteErrCheck] = getMem();
    console.log('total memory: ' + totMem);
    let memMessage = checkMem(totMem);
    let rteMessage = checkRte(rteErrCheck);
    let pTagMem = document.createElement('p');
    pTagMem.innerHTML = memMessage;
    document.querySelector('.pre-verdict').appendChild(pTagMem);
    let pTagRte = document.createElement('p');
    pTagRte.innerHTML = rteMessage;
    document.querySelector('.pre-verdict').appendChild(pTagRte);
})