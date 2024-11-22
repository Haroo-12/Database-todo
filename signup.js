
let password = document.querySelector("#password")
let email = document.querySelector("#email")
let nameuser = document.querySelector("#name")
let age = document.querySelector("#age")
let Googlesignin = document.querySelector("#googlesignin")
let submit = document.querySelector("#submit")
let imageupload = document.querySelector("#uploadimage")
submit.addEventListener("click", async function asyn(){
   var check = false;

let files = imageupload.files[0]
if(!files){
   alert("image does not exist")
}
else if(email.value==""){
   alert("please email already exist")
}

else{
await firebase.database().ref("users").get()
.then(function(snap){
   console.log(snap)
   let user = Object.values(snap.val())
   for(let i = 0 ; i<user.length;i++){
      console.log(user[i].email)
      if(user[i].email==email.value){
         check = true
         break;
      }
   }
})
if(check==true){
   alert("already register with this email")
}
else{
   console.log(files)
   var cloudname = "ddjskejk9"
   var unsignedupload = "server"
   const URL = 'https://api.cloudinary.com/v1_1/' + cloudname + "/upload"
   const formData = new FormData()
   formData.append("upload_preset", unsignedupload)
   formData.append("file", files)
   try{
      fetch(URL, {
         method: "POST",
         body: formData,
   
      })
      .then((resp) => resp.json())
      .then(async (data) => {
         console.log(data.secure_url)
         await firebase.auth().createUserWithEmailAndPassword(email.value,password.value)
         .then(async function(user){
             console.log(user.user.uid)
             let obj = {
                 name:nameuser.value,
                 email:email.value,
                 password:password.value,
                 userId : user.user.uid,
                 age:age.value,
                 photo:data.secure_url,
             }
            await firebase.database().ref("users").child(user.user.uid) .set(obj)
            localStorage.setItem("userId",user.user.uid)
            window.location.replace("main.html")
         })
         .catch(function(error){
         console.log(error)
         })
   })
}
   catch(e){
   alert(e.message)
   }  
}

}

})
Googlesignin.addEventListener("click", async function(){

  var provider = new firebase.auth.GoogleAuthProvider()
    provider.setCustomParameters({
       prompt: 'select_account' // Forces the account chooser to show
  });
  await firebase.auth().signInWithPopup(provider)
       .then(async (result) => {
          console.log(result)
          var user = result.user
          var obj = {
             email: user.email,
             "name": user.displayName,
             "photo": user.photoURL,
           "userId": user.uid
 
     }
        console.log(obj)
          await firebase.database().ref("users").child(user.uid).set(obj)
          localStorage.setItem("userId", user.uid)
        window.location.replace("main.html")
 
 
       })
       .catch((e) => {
        console.log(e)
 
     })
})

// async function Googlesignin(){

// }