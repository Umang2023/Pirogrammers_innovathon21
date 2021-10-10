document.addEventListener('DOMContentLoaded',async ()=>{
    var data = await fetch('/code/submissions/')
    .then(res=>res.json())

    // console.log('hre')
    console.log(data)

    var code = document.createElement('textarea')
    code.innerHTML = data.data.code
    code.style.height = '700px'
    code.style.width = '700px'

    document.querySelector('body').appendChild(code)
})