export function checker(data){
    // console.log(data)
    data=data.split('\n')
    for(var i=0; i<data.length; ++i)
    {
        data[i]=data[i].replace(/\r/g,'')
        data[i]=data[i].replace(/\t/g,'')
    }
    
    for(var i=0; i<data.length; ++i)
    {
        var forIndex = data[i].search('for')
        if(forIndex == -1) continue
        // console.log(forIndex,i)
        var [startingValue,direction] = getIterationStart(data[i]);
        
        // this direction signifies whether the loop is increasing or decreasing
        // direction = false => increasing
        // direction = true => decreasing
        // for now i am considering increasing loop only
        // once all the functionalities for increasing will be completed
        // the same will be done for decreasing as well

        // console.log("sv = " + startingValue + " dir = " + direction)

        var endValue = getTotalIterations(data[i])

        var [symbol,number] = getIterationChange(data[i])
        console.log("symbol = " + symbol + " number = " + number + " total = " + Math.abs(endValue - startingValue + 1) + " end = " + endValue + " start = " + startingValue)
        var totalIterations = countIterations(Math.abs(endValue - startingValue + 1) , number, symbol)
        console.log("total iterations = " , totalIterations)
    }

    // console.log(data)
}

function getIterationStart(data)
{
    data = data.replace(/\s/g,'')
    var startingValue =  data.substring(
        data.indexOf("=") + 1, 
        data.indexOf(";")
    );

    var lastSemicolon = data.lastIndexOf(";")
    var containsNegative = false

    for(var i=lastSemicolon; i<data.length; ++i)
    {
        if(data[i] == '-')
        {
            containsNegative=true
            break
        }
    }

    startingValue = parseInt(startingValue)
    // console.log(startingValue)
    return [startingValue,containsNegative];
}

function getIterationEnd(data)
{
    
}

function getIterationChange(data)
{
    data = data.replace(/\s/g,'')
    var lastSemicolon = data.lastIndexOf(";")
    var symbol=0;

    for(var i=lastSemicolon; i<data.length; ++i)
    {
        if(data[i] == '+')
        {
            symbol=0;
            break;
        }
        else if(data[i] == '-')
        {
            symbol=1;
            break;
        }
        else if(data[i] == '*')
        {
            symbol=2;
            break;
        }
        else if(data[i] == '/')
        {
            symbol=3;
            break;
        }
    }

    var numberString = data.substring(lastSemicolon)
    numberString = numberString.replace(/[^0-9]/g,'')
    var number = parseInt(numberString)

    return [symbol,number]
}

function getTotalIterations(data)
{
    data = data.replace('int','')
    data = data.replace(/\s/g,'')
    data = data.replace('for(','for(var ')
    // console.log(data)
    var left = 0, right = 1e9 ;
    var ans=0;
    while(left < right)
    {
        var mid = Math.floor(left + (right - left)/2);
        // console.log(mid)
        if(evaluateAnswer(data,mid) == true)
        {
            ans = mid;
            left = mid+1;
        }
        else
        {
            right = mid-1;
        }

    }
    // evaluateAnswer(data,2)
    // console.log("ans = ",ans)
    return ans;
}

function evaluateAnswer(data, start)
{
    // console.log('in')
    var first_equal_index = data.indexOf('=')
    var first_semicolon_index = data.indexOf(';')
    start = start.toString()
    data = data.substring(0,first_equal_index+1) + start + data.substring(first_semicolon_index)
    // console.log(data)

    var flag = false
    data = data + "{flag = true; break}"
    eval(data)
    // console.log(flag)
    return flag
}

function countIterations(total, number, symbol)
{
    if(number == 0)
    {
        return 1e9
    }

    if(total == 0 || total == 1)
    return total

    var toDivide=1;
    if(symbol == 0 || symbol == 1)
    {
        return Math.floor(total/number)
    }
    else
    {
        return Math.floor(Math.log10(total) / Math.log10(number));
    }
}