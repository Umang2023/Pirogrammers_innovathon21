document.addEventListener('DOMContentLoaded',async ()=>{
    var userData = await fetch('/user/current').then(res=>res.json())
    
    console.log(userData)
    var image = document.createElement('img')
    image.src=userData.pic
    console.log(userData.pic)

    document.querySelector('.image-div').appendChild(image)
})