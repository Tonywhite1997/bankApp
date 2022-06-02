const openMenu = document.querySelector(".fa-bars")
const closeMenu = document.querySelector(".fa-times")
const menuDiv = document.querySelector(".menu-div")
const openAccountButton = document.querySelector(".open-account")
const username = document.querySelector("#username")
const password = document.querySelector("#password")
const loginBtn = document.querySelector(".login")
const signupBtn = document.querySelector(".sign-up")
const loadingDelay = document.querySelector(".loading")
let loadingText = document.querySelector(".loading-text")



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

signupBtn.addEventListener("click", ()=>{
    location.href = "./signup.html"
})

openAccountButton.addEventListener("click", ()=>{
    location.href = "./signup.html"
})

//Validating user sign in
function validateSignIn(){
    //creating object for user login details
    const signedInUser = {
        username: username.value,
        password: password.value
    }

    //checking if the key exist in local storage
    if(localStorage.getItem("user")){
        const savedUsers = JSON.parse(localStorage.getItem("user")) || []
        //filtering the account that matched user details
        const matchedUser = savedUsers.filter((savedUser)=>{
            return username.value === savedUser.username && password.value === savedUser.password
        })
        //If there is one matched account in the local storage, do this.
        if(matchedUser.length){
            loadingDelay.style.display = "flex"
            loadingText.innerText = "logging in..."
            setTimeout(()=>{
                loadingDelay.style.display = "none"
                location.href="./dashboard.html"
                //saving user login details if it is valid
                localStorage.setItem("signedIn", JSON.stringify(signedInUser))
            },2000)
        }
        else{
            alert("Invalid credentials")
        }
    }
    else{
        alert("Invalid credentials")
    }
}

//Adding a click event tp my login button
loginBtn.addEventListener("click", ()=>{
    validateSignIn()
})


