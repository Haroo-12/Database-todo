let password = document.querySelector("#password")
let email = document.querySelector("#email")
let login = document.querySelector("#login")
let signup = document.querySelector("#signup")

login.addEventListener("click",async function asyn(){
    await firebase.auth().signInWithEmailAndPassword(email.value,password.value)
    .then(function(user){
console.log(user.user.uid)
localStorage.setItem("userId",user.user.uid)
window.location.replace("main.html")
    })
    .catch(function(error){
        console.log(error)
    })
})
signup .addEventListener("click",function(){
    window.location.replace("index.html")
 })