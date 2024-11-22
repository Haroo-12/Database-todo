






let names = document.querySelector("#name")
let email = document.querySelector("#email")
let dp = document.querySelector("#dp")
var maincontent = document.getElementById("maincontent")
var input = document.getElementById("input")
var addbtn = document.getElementById("addbtn")
var deletebtn = document.getElementById("deletebtn")
var updatebtn = document.getElementById("updatebtn")
let logout = document.getElementById("logout")
// var changetheme = document.getElementById("changetheme")

var selectedItem = "";

var checkbox = document.getElementById("checkbox")
var checkBoxSelected = false;
//add 
addbtn.addEventListener("click", function () {
    if (input.value) {
        var li = document.createElement("li")

        var checkBox = document.createElement("input")
        checkBox.type = "checkbox"
        checkBox.style.margin = "10px"

        var b = document.createElement("b")
        b.innerText = input.value
        b.style.display = "inline-block"
        b.style.margin = "10px"
        b.style.width = "400px"
        b.style.overflow = "hidden"

        var key = firebase.database().ref("todos").push().key


        var editbtn = document.createElement("button")

        var editicon = document.createElement("i")
        editicon.classList.add("fa-pen")
        editicon.classList.add("fa-solid")

        editbtn.appendChild(editicon)
        editbtn.setAttribute("onclick", 'edittext(this)')
editbtn.setAttribute("id",key)

        var deletebtn = document.createElement("button")
        var deleteicon = document.createElement("i")
        deleteicon.classList.add("fa-trash-can")
        deleteicon.classList.add("fa-solid")
        deletebtn.appendChild(deleteicon)
        deletebtn.setAttribute("onclick", 'deletetext(this)')
        deletebtn.setAttribute("id",key)

       

        li.appendChild(checkBox)
        li.appendChild(b)
        li.appendChild(editbtn)
        li.appendChild(deletebtn)
        maincontent.appendChild(li)
        addfirebase(input.value,key)
       

    






    }
})

async function addfirebase(val,key){

var userId = localStorage.getItem("userId")
var obj ={
    "todo" :val,
    "todo_key":key,
}
console.log(obj.todo_key)
await firebase.database().ref("todos").child(userId).child(key).set(obj)
input.value = ""
setItem()
}

 async function deletetext(e) {
    var userId = localStorage.getItem("userId")
    console.log(e.parentNode)
    e.parentNode.remove()
    setItem()
    console.log(e.id)
    await firebase.database().ref("todos").child(userId).child(e.id).remove()

}
//edit 
function edittext(e) {

    input.value = e.parentNode.childNodes[1].innerText
    addbtn.style.display = "none"
    deletebtn.style.display = "none"
    updatebtn.style.display = "inline"
    input.focus()
    selectedItem = e.parentNode.childNodes[1]
    console.log(selectedItem)

    // var inputfield  = document.createElement("input")
    // e.parentNode.childNodes[1].remove()
    // e.parentNode.childNodes[1].appendChild(inputfield)



}
//update
updatebtn.addEventListener("click", async function () {
    if (input.value) {
        selectedItem.innerText = input.value
        var key = selectedItem.parentNode.children[2].id
        var userId = localStorage.getItem("userId")

       
        addbtn.style.display = "inline"
        deletebtn.style.display = "inline"
        updatebtn.style.display = "none"
        await firebase.database().ref("todos").child(userId).child(key).update({
            "todo":input.value, 
        })
        setItem()
        input.value = ""

    }
})

//checkbopx
checkbox.addEventListener("click", function () {
    for (var item of maincontent.children) {
        console.log(item.children[0].checked)
        item.children[0].checked =!checkBoxSelected

    }
    checkBoxSelected =!checkBoxSelected
})


deletebtn.addEventListener("click", function () {
    for(var i=0;i<maincontent.children.length;i++){

        if(maincontent.children[i].children[0].checked){
            maincontent.children[i].remove()
            i = i-1
           
        }

    }
    checkBoxSelected = false;
    checkbox.checked = false;
    setItem()
})

//local storage data store 
function setItem(){
    var todoItem =[]

    for(var item of maincontent.children){
       
        todoItem.push(item.children[1].innerText)
    }
    console.log(todoItem)
    localStorage.setItem("TODO",JSON.stringify(todoItem))

}

function SetFirstTime(value){
    var li = document.createElement("li")

    var checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    checkBox.style.margin = "10px"

    var b = document.createElement("b")
    b.innerText = value.todo
    b.style.display = "inline-block"
    b.style.margin = "10px"
    b.style.width = "400px"
    b.style.overflow = "hidden"



    var editbtn = document.createElement("button")

    var editicon = document.createElement("i")
    editicon.classList.add("fa-pen")
    editicon.classList.add("fa-solid")

    editbtn.appendChild(editicon)
    editbtn.setAttribute("onclick", 'edittext(this)')
    console.log(value.todo)
    editbtn.setAttribute("id",value.todo_key)

    var deletebtn = document.createElement("button")
    var deleteicon = document.createElement("i")
    deleteicon.classList.add("fa-trash-can")
    deleteicon.classList.add("fa-solid")
    deletebtn.appendChild(deleteicon)
    deletebtn.setAttribute("id",value.todo_key)

    deletebtn.setAttribute("onclick", 'deletetext(this)')
   
    li.appendChild(checkBox)
    li.appendChild(b)
    li.appendChild(editbtn)
    li.appendChild(deletebtn)
    maincontent.appendChild(li)
   
}

 async function getItem(){
    // var todo = JSON.parse(localStorage.getItem("TODO"))
    // console.log(todo)

    // for(var item of todo){
    //     SetFirstTime(item)

    // }
    var userId = localStorage.getItem("userId")
await firebase.database().ref("todos").child(userId).get()
.then(function(snap){
    console.log(snap.val())
    var values = Object.values(snap.val())
        for(var item of values){
        SetFirstTime(item)

    }
})
.catch(function(error){
    console.log(error         )
})
}

getItem()
window.onload = function(){
    var usserid = localStorage.getItem("userId")
    if (usserid) {
        getuserdata()
    }
    else{
        window.location.href = "signup.html"
    }
}
async function getuserdata(){
    var userId = localStorage.getItem("userId")
    await firebase.database().ref("users").child(userId).get()
    .then(function(snap){

console.log(snap.val())
names.innerText = snap.val().name

email.innerText = snap.val().email
dp.src = snap.val().photo
    })
    .catch(function(error){
console.log(error)
    })
}
logout.addEventListener("click",async function(){
    try{
await firebase.auth().signOut();
localStorage.clear();
window.location.replace("login.html")

    }
    catch(error){
console.log(error)
    }
})