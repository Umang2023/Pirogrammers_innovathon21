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
        console.log(forIndex,i)
        getIterationStart(data[i])
    }

    console.log(data)
}

function getIterationStart(data)
{
    data = data.replace(/\s/g,'')
    var startingValue =  data.substring(
        data.indexOf("=") + 1, 
        data.indexOf(";")
    );

    startingValue = parseInt(startingValue)
    console.log(startingValue)
    return startingValue;
}

function getIterationEnd(data)
{

}

function getIterationChange(data)
{

}