var myVar;

const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`1@#$%^&*()-_=+[{]};:"<,>.?/\|';

function myFunction() {
  myVar = setTimeout(showPage, 2000);
}
function showPage() {
    document.querySelector(".center").style.display = "none";
    document.getElementById(".container").style.display = "block";
}

//initially
let password = "";
let passwordLength = 10;
let checkCount=0;
handleSlider();

//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}
function generateSymbol(){
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;
    
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0")
    }else{
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    }catch{
        copyMsg.innerText = "Failed!";
    }
    copyMsg.classList.add("active");
    
    setTimeout( () =>{
        copyMsg.classList.remove("active");
    },2000);
}


function shufflePassword(array){
    //Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i +1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str = "";
    array.forEach((el) => str += el);
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click' , () => {

    //none of the checkbox are selected
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //lets start the journey to find new password
    console.log("starting the journey")
    //remove old password
    password ="";



    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    // console.log("Compulsory addition done")

    //remaining addition

    for(let i=0; i<passwordLength - funcArr.length; i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        console.log(randIndex); 
        password += funcArr[randIndex]();
    }

    //shuffle password
    password = shufflePassword(Array.from(password));
    // console.log("Suffeling done and shuffled password is ", password)

    //show in UI
    passwordDisplay.value = password;

    //calculate Strength
    calcStrength();
});