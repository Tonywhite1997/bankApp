const form = document.querySelector("#form");
const openMenu = document.querySelector(".fa-bars")
const closeMenu = document.querySelector(".fa-times")
const menuDiv = document.querySelector(".menu-div")
const usernameField = document.querySelector("#username")
let message = document.querySelector(".message")

//working on my nav slide up and down
openMenu.addEventListener("click", ()=>{
    menuDiv.style.top = "100px"
    menuDiv.style.height = "40vh"
    openMenu.style.display = "none"
    closeMenu.style.display = "initial"
})

closeMenu.addEventListener("click", ()=>{
    menuDiv.style.top = "-1000px"
    menuDiv.style.height = "0vh"
    openMenu.style.display = "initial"
    closeMenu.style.display = "none"


})

//writing a function to generate 10 random numbers for account number.
function generateAccNum(){
    return Math.floor(Math.random()* 10000000000)
};

//live checking of user existence
function checkUserExistence(){
    usernameField.addEventListener("input", ()=>{
        const database = JSON.parse(localStorage.getItem("user"))
        const matchedUser = database.find((user)=>{
        return usernameField.value === user.username
    })
        if(matchedUser){
            message.style.color = "red"
            message.innerText = "user exists. Try another"
        }
        if(!matchedUser){
            message.innerText = ""
        }
    })
}

//invoking the function above
checkUserExistence()


//Creating a function to get user registration details and save into the local storage
function getUserDetails(event){
    const fullName = event.target.fullname.value
    const username = event.target.username.value
    const email = event.target.email.value
    const password = event.target.password.value
    const confirmPassword = event.target.confirmPassword.value
    const accountNumber = generateAccNum()
    let userDetails = {
        fullName,
        username,
        email,
        password,
        confirmPassword,
        accountNumber,
        amount: 0,
        income: 0,
        expenses: 0
    };

    const savedUsers = JSON.parse(localStorage.getItem("user")) || []
    
    //checking user details validity
    if(!fullName || !username || !email || !password || !confirmPassword){
        alert("all fields required.")
        return
    }


    if(fullName.length < 10 || !fullName){
        return alert("username must be at least 10 characters")
    }

    if(username.length < 6){
        return alert("username must be at least 6 characters")
    }

    if(password !== confirmPassword){
        alert("password does not match.")
        return
    }

    if(password.length < 6){
        alert("choose longer password")
        return
    }

    for(let savedUser of savedUsers){
        if(username === savedUser.username){
            alert("User already exists.")
            return
        }
    }

    
    savedUsers.push(userDetails)
    localStorage.setItem("user", JSON.stringify(savedUsers))
    location.reload()
    alert("Registration succesful.")
    location.href = "./index.html"
};

//Adding a submit event to my sign up form
form.addEventListener("submit", (e)=>{
    e.preventDefault()
    getUserDetails(e)
})