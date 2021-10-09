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
        var startingValue = getIterationStart(data[i]);
        var endValue = getTotalIterations(data[i])
        console.log("total iterations = " , Math.abs(endValue - startingValue + 1))
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

    startingValue = parseInt(startingValue)
    // console.log(startingValue)
    return startingValue;
}

function getIterationEnd(data)
{

}

function getIterationChange(data)
{

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