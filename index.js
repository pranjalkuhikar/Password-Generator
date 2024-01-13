const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const indicator = document.querySelector("[data-indicator]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const generateButtton = document.querySelector(".generateButtton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let checkCount = 0;
let password = "";
let passwordLength = 10;
handleSlider();
setIndicator("#ccc");

// Slider
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// Strength Color
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if ((hasLower || hasUpper) && (hasNum || hasSym) && password >= 6) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// Copy
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

// Input Password
function getRanInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateUppercase() {
  return String.fromCharCode(getRanInteger(65, 90));
}

function generateLowercase() {
  return String.fromCharCode(getRanInteger(97, 123));
}

function generateRandomNumber() {
  return getRanInteger(0, 9);
}

function generateSymbol() {
  return symbols.charAt(getRanInteger(0, symbols.length));
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  // Special Condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

//Generate Password
generateButtton.addEventListener("click", () => {
  // None of the checkbox selected
  if (checkCount == 0) return;
  // Special Condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // Remove Password
  console.log("Starting the Journey");
  password = "";
  // Put that checkbox checked
  let funArr = [];
  if (uppercaseCheck.checked) {
    funArr.push(generateUppercase);
  }
  if (lowercaseCheck.checked) {
    funArr.push(generateLowercase);
  }
  if (numbersCheck.checked) {
    funArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funArr.push(generateSymbol);
  }

  // New Password
  // Compulsary
  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }
  // Remaining
  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let ranIdx = getRanInteger(0, funArr.length);
    password += funArr[ranIdx]();
  }
  // Shuffle the password
  function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str = "";
    array.forEach((el) => {
      str += el;
    });
    return str;
  }
  password = shufflePassword(Array.from(password));
  // Show in UI
  passwordDisplay.value = password;
  // Strength
  calcStrength();
});
