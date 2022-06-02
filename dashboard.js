//choosing the elements from the DOM
const transferDiv = document.querySelector(".transfer-section")
const depositDiv = document.querySelector(".deposit-section")
const withdrawDiv = document.querySelector(".withdraw-section")
const showTransferDiv = document.querySelector(".transfer")
const showDepositDiv = document.querySelector(".deposit")
const showWithdrawDiv = document.querySelector(".withdraw")
const hideDivs = document.querySelectorAll(".fa-times")
const logoutBtn = document.querySelector(".logout")

const namee = document.querySelector(".name")
const accNum = document.querySelector(".account-number")
const accountBalance = document.querySelector(".my-money")
const moneySpent = document.querySelector(".expense")
const moneyEarned = document.querySelector(".income")

//transaction history
const transactionHistory = document.querySelector(".latest-transaction")

//Deposit
const depositField = document.querySelector(".deposit-money")
const depositBtn = document.querySelector(".deposit-btn")
const loadingDelay = document.querySelector(".loading")
const loadingText = document.querySelector(".loading-text")

//Withdraw
const withdrawField = document.querySelector(".withdraw-money")
const withdrawBtn = document.querySelector(".withdraw-btn")

//selecting transfer elements
const receiverFullname = document.querySelector(".receiver-account")
const receiverUsername = document.querySelector(".receiver-username")
const transferAmount = document.querySelector(".transfer-amount")
const transferBtn = document.querySelector(".transfer-btn")
let message = document.querySelector(".message")

//selecting loan elements 
const loanPackage = document.querySelector("#loan")
const loanAmount = document.querySelector(".loan-amount")
const loanReqBtn = document.querySelector(".loan-req-btn")
const loanMessageDiv = document.querySelector(".message-div")
let loanMessage = document.querySelector(".loan-message")



//adding events to my logging botton
logoutBtn.addEventListener("click", ()=>{
    loadingText.innerText = "logging out"
    loadingDelay.style.display = "flex"
    setTimeout(()=>{
        localStorage.removeItem("signedIn")
        loadingDelay.style.display = "none"
        location.href = "./index.html"
    },2000)
})

//actions to perform for fa-times icon in html when clicked
hideDivs.forEach((hideDiv)=>{
    hideDiv.addEventListener("click", ()=>{
        transferDiv.style.display = "none"
        depositDiv.style.display = "none"
        withdrawDiv.style.display = "none"
        loanMessageDiv.style.display="none"
    })
})

//this element pops out the transfer action section when clicked
showTransferDiv.addEventListener("click", ()=>{
    transferDiv.style.display = "flex"
    depositDiv.style.display = "none"
    withdrawDiv.style.display = "none"
})

//this element pops out the deposit action section when clicked
showDepositDiv.addEventListener("click", ()=>{
    transferDiv.style.display = "none"
    depositDiv.style.display = "flex"
    withdrawDiv.style.display = "none"
})

//this element pops out the withrawal action section when clicked
showWithdrawDiv.addEventListener("click", ()=>{
    transferDiv.style.display = "none"
    depositDiv.style.display = "none"
    withdrawDiv.style.display = "flex"
})

//getting  data from local storage
const savedUsers = JSON.parse(localStorage.getItem("user")) || []

//getting the current logged in user details
const currLoggedIn = JSON.parse(localStorage.getItem("signedIn"))

//updating new user dashboard to show their current details
function updateUserDashboard(){
    for(let i=0; i< savedUsers.length; i++){
        if(currLoggedIn.username === savedUsers[i].username){
            namee.innerText = savedUsers[i].fullName
            accNum.innerText = `Acc Num: ${savedUsers[i].accountNumber}`
            accountBalance.innerText = `$${savedUsers[i].amount}`
            moneyEarned.innerText = `$${savedUsers[i].income}`
            moneySpent.innerText = `$${savedUsers[i].expenses}`
        }
    }
}
//Invoking above function
updateUserDashboard()

//function for transaction history
function showTransactionHistory(){
    let matchedUserHistories = []
    
    const transHistories = JSON.parse(localStorage.getItem("deposit")) || []
    for(let transHistory of transHistories.reverse()){
        if(currLoggedIn.username === transHistory.username || currLoggedIn.username === transHistory.receiver){
            matchedUserHistories.push(transHistory)
        }

        //keeping the history shown on user dashboard to the maxomum of 5.
        if(matchedUserHistories.length > 5){
            matchedUserHistories.pop()
        }
    }

    //getting ready with displaying transaction history
    for(let matchedUserHistory of matchedUserHistories){
        
        //creating a paragragh element to display the history
        const historyPara = document.createElement("p")

        //appending the created element to the transaction history div created in html file
        transactionHistory.appendChild(historyPara)

        //checking if the current logged in user is a receiver so that i can display that they receive some money.
        if(currLoggedIn.username === matchedUserHistory.receiver && matchedUserHistory.transfer > 0){
            historyPara.style.color = "green"
            historyPara.innerText = `You recieved $${matchedUserHistory.transfer} from ${matchedUserHistory.username}.`
        }
        
        //now checking if current logged in user carried out other operation apart from recieving fund
        if(currLoggedIn.username === matchedUserHistory.username){
            
            //displaying history for deposit
            if(matchedUserHistory.deposit > 0){
                historyPara.style.color = "green"
                historyPara.innerText = `You deposited $${matchedUserHistory.deposit}.`
            }

            //displaying history for withdrawal
            if(matchedUserHistory.withdraw > 0){
                historyPara.style.color = "red"
                historyPara.innerText = `You withdraw $${matchedUserHistory.withdraw}.`
            }
            //displaying history for sending out money
            if(matchedUserHistory.transfer > 0){
                historyPara.style.color = "red"
                historyPara.innerText = `You transferred $${matchedUserHistory.transfer} to ${matchedUserHistory.receiver}.`
            }

            //for loan
            if(matchedUserHistory.loanAmount > 0){

                historyPara.style.color = "green"
                historyPara.innerText = `You loan request of $${matchedUserHistory.loanAmount} has been granted.`
            
            }
        }
    }    
}

//invoking the transaction history above.
showTransactionHistory()

//creating an object to store user actions on the dashboard
let latestTrans = {
    senderName: "",
    username: "",
    deposit: 0,
    withdraw: 0,
    transfer: 0,
    loanAmount: 0,
    loanPackage: "",
    receiver: "",
    receiverAcc: ""
}

//Creating a function for deposit
function depositMoney(){
    let updatedDetails = []
    const depositAmount = Number(depositField.value)
    if(!depositAmount || depositAmount < 1){
        return
    }
    const MatchedUser =savedUsers.find((savedUser)=>{
        return currLoggedIn.username === savedUser.username
    })
    savedUsers.filter((savedUser)=>{
        if(currLoggedIn.username !== savedUser.username){
            updatedDetails.push(savedUser)
        }
    })
    if(MatchedUser){
        latestTrans = {
            senderName: "",
            username: MatchedUser.username,
            deposit: depositAmount,
            withdraw: 0,
            transfer: 0,
            loanAmount: 0,
            loanPackage: "",
            receiver: "",
            receiverAcc: "" 
        }
        const oldTrans = JSON.parse(localStorage.getItem("deposit")) || []
        oldTrans.push(latestTrans)
        loadingText.innerText = "in progress"
        loadingDelay.style.display="flex"
        setTimeout(()=>{
            localStorage.setItem("deposit", JSON.stringify(oldTrans))
            loadingDelay.style.display="none"
            MatchedUser.amount += depositAmount
            MatchedUser.income += depositAmount
            updatedDetails.push(MatchedUser)
            localStorage.setItem("user", JSON.stringify(updatedDetails))

            location.reload()
        },2000)
    }
    
}

//writing the withdraw money function
function withdrawMoney(){
    let moreDetails = []
    const withdrawAmount = Number(withdrawField.value)
    const matchedUser = savedUsers.find((savedUser)=>{
        return currLoggedIn.username === savedUser.username
    })
    savedUsers.find((savedUser)=>{
        if(currLoggedIn.username !== savedUser.username){
            moreDetails.push(savedUser)
        }
    })
    if(matchedUser){
        if(withdrawAmount > matchedUser.amount){
            alert("Not enough fund")
            return
        }
        latestTrans = {
            senderName: "",
            username: matchedUser.username,
            deposit: 0,
            withdraw: withdrawAmount,
            transfer: 0,
            loanAmount: 0,
            loanPackage: "",
            receiver: "",
            receiverAcc: ""
        }
        const oldTrans = JSON.parse(localStorage.getItem("deposit")) || []
        oldTrans.push(latestTrans)
        localStorage.setItem("deposit", JSON.stringify(oldTrans))
        loadingText.innerText = "in progress"
        loadingDelay.style.display="flex"
        setTimeout(()=>{
            loadingDelay.style.display="none"
            matchedUser.amount -= withdrawAmount
            matchedUser.expenses += withdrawAmount
            moreDetails.push(matchedUser)
            localStorage.setItem("user", JSON.stringify(moreDetails))
            location.reload()
        },2000)
    }
}

//creating a function to check receiver's validity
function checkTransferAccExistence(){
    //checking the receiver of the transfer
    receiverUsername.addEventListener("input", ()=>{
        let matchedUser = savedUsers.find((savedUser)=>{
            return receiverUsername.value === savedUser.username
        })

        //if your trying to transfer money to yourself
        if(receiverUsername.value === currLoggedIn.username){
            message.innerText = "invalid operation."
            return
        }

        //if you enter a wrong username
        if(!matchedUser){
            message.style.color="red"
            receiverFullname.value = ""
            message.innerText="not found"
            return
        }

        //if user is found and it is not you. receiver fullname field automatically fills out.
        if(matchedUser){
            message.style.color="green"
            message.innerText=""
            receiverFullname.value = matchedUser.fullName
            return
        }
    })
}
//invoking the function above
checkTransferAccExistence()

//writing a function for transfer
function makeTransfer(){
    let unmatchedUserData = []
    let updateTransferDetails = []
    const leavingAmount = Number(transferAmount.value)
    if(!receiverUsername.value){
        alert("please enter receiver username to continue.")
        return
    }
    const matchedUser = savedUsers.find((savedUser)=>{
        return receiverUsername.value === savedUser.username
    })
    if(!matchedUser){
        return
    }
    savedUsers.find((savedUser)=>{
        if(receiverUsername.value !== savedUser.username){
            updateTransferDetails.push(savedUser)
        }
    })
    const senderData = savedUsers.find((savedUser)=>{
        return currLoggedIn.username === savedUser.username
    })
    savedUsers.find((savedUser)=>{
        if(senderData.username !== savedUser.username){
            unmatchedUserData.push(savedUser)
        }
    })
    if(leavingAmount > senderData.amount){
        alert("not enough fund")
        return;
    }
    if(senderData){
        senderData.amount -= leavingAmount 
        senderData.expenses += leavingAmount
        unmatchedUserData.push(senderData)
        localStorage.setItem("user", JSON.stringify(unmatchedUserData))
    }
    if(matchedUser){
        latestTrans = {
            senderName: senderData.fullName, 
            username: senderData.username,
            deposit: 0,
            withdraw: 0,
            transfer: leavingAmount,
            loanAmount: 0,
            loanPackage: "",
            receiver: matchedUser.username,
            receiverAcc: matchedUser.accountNumber
        }
        
        const oldTrans = JSON.parse(localStorage.getItem("deposit")) || []
        oldTrans.push(latestTrans)
        localStorage.setItem("deposit", JSON.stringify(oldTrans))
        loadingText.innerText = "in progress"
        loadingDelay.style.display="flex"
        setTimeout(()=>{
            loadingDelay.style.display="none"
            matchedUser.amount += leavingAmount 
            matchedUser.income += leavingAmount
            updateTransferDetails.push(matchedUser)
            localStorage.setItem("user", JSON.stringify(updateTransferDetails))
            location.reload()
        },2000)
    }


}

//creating a loan request function
function requestLoan(){
    //creating a new array
    let unmatchedUserDetails = []

    const loanReqAmount = Number(loanAmount.value)
    const loanReqPackage = loanPackage.value
    
    //checking if amount bigger than 0 is entered.
    if(loanReqAmount < 1){
        alert("please choose amount bigger than 0")
        return
    }

    //checking if loan package selected is valid
    if(!loanReqPackage){
        alert("please select a package to continue.")
        return
    }

    //getting the data of the current logged in user
    const matchedUser = savedUsers.find((savedUser)=>{
        return currLoggedIn.username === savedUser.username
    })

    //pushing the data of the users that are not currently logged in to an array
    savedUsers.find((savedUser)=>{
        if(currLoggedIn.username !== savedUser.username){
            unmatchedUserDetails.push(savedUser)
        }
    })

    //if data of currently logged in user is found, then do these
    if(matchedUser){
        //updating the database according to user choices
        latestTrans = {
            senderName: "",
            username: matchedUser.username,
            deposit: 0,
            withdraw: 0,
            transfer: 0,
            loanAmount: loanReqAmount,
            loanPackage: loanReqPackage,
            receiver: "",
            receiverAcc: ""
        }
        const oldTrans = JSON.parse(localStorage.getItem("deposit")) || []
        oldTrans.push(latestTrans)
        localStorage.setItem("deposit", JSON.stringify(oldTrans))
        loadingText.innerText = "in progress"
        loadingDelay.style.display="flex"
        setTimeout(()=>{
            loadingDelay.style.display="none"

            //window pops out to tell the user the amount and package of their loan
            loanMessage.innerText = `Your loan request of $${loanReqAmount} for the duration of ${loanReqPackage} is under review. Your account will be credited after 30 seconds.`
            loanMessageDiv.style.display="flex"
        },2000)


        //setting a timeout to grant the loan request and update user dashboard after 30 seconds
        matchedUser.amount += 0 
        matchedUser.income += 0
        setTimeout(()=>{
            matchedUser.amount += loanReqAmount 
            matchedUser.income += loanReqAmount
            unmatchedUserDetails.push(matchedUser)
            localStorage.setItem("user", JSON.stringify(unmatchedUserDetails))
            loanMessage.innerText = `Your loan request of $${loanReqAmount} has been granted. Please reload this page to access the fund.`
            loanMessageDiv.style.display="flex"
            // location.reload()
        },30000)
    }
    
}

//adding the deposit function created above to this botton onclick
depositBtn.addEventListener("click", ()=>{
    depositMoney()    
})

//adding the withdrawal function created above to this botton onclick
withdrawBtn.addEventListener("click", ()=>{
    withdrawMoney()
})

//adding the makeTransfer function created above to this botton onclick
transferBtn.addEventListener("click", ()=>{
    makeTransfer()
})

//adding the requestLoan function created above to this botton onclick
loanReqBtn.addEventListener("click", ()=>{
    requestLoan()
})
