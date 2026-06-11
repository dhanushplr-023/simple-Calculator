const display = document.getElementById("display");
const expression = document.getElementById("expression");

const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");

const themeToggle = document.getElementById("themeToggle");
const copyBtn = document.getElementById("copyBtn");

const buttons = document.querySelectorAll(".buttons button");

let currentExpression = "";
let lastResult = false;

let lastSavedExpression = "";
let lastSavedResult = "";

/* Load History */
renderHistory();

/* Button Clicks */

buttons.forEach(button => {

button.addEventListener("click", () => {

const value = button.textContent;

switch(value){

case "AC":
currentExpression = "";
display.textContent = "0";
expression.textContent = "";
break;

case "DEL":
currentExpression =
currentExpression.slice(0,-1);

display.textContent =
currentExpression || "0";
break;

case "=":
calculate();
break;

case "📋":
copyResult();
break;

default:

if(lastResult && !isNaN(value)){
currentExpression = value;
lastResult = false;
}else{
currentExpression += value;
}

display.textContent =
currentExpression;
}

});

});

/* Calculate */

function calculate() {

    if (!currentExpression.trim()) return;

    try {

        let exp = currentExpression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");

        let result = eval(exp);

        expression.textContent =
            currentExpression + " =";

        if (
            currentExpression === lastSavedExpression &&
            result.toString() === lastSavedResult
        ) {

            const saveAgain = confirm(
                "This calculation already exists in history.\n\nDo you want to save it again?"
            );

            if (saveAgain) {
                saveHistory(currentExpression, result);
            }

        } else {

            saveHistory(currentExpression, result);

            lastSavedExpression =
                currentExpression;

            lastSavedResult =
                result.toString();
        }

        display.textContent = result;

        currentExpression =
            result.toString();

        lastResult = true;

    } catch {

        display.textContent = "Error";

        setTimeout(() => {

            display.textContent = "0";

            currentExpression = "";

        }, 1000);

    }
}

/* Copy Result */

function copyResult(){

navigator.clipboard.writeText(
display.textContent
);

}

/* Theme Toggle */

themeToggle.addEventListener("click",()=>{

document.body.classList.toggle("dark");

themeToggle.textContent =
document.body.classList.contains("dark")
? "☀️"
: "🌙";

});

/* History */

function saveHistory(exp, result) {

    let history =
        JSON.parse(
            localStorage.getItem("calcHistory")
        ) || [];

    const now = new Date();

    const timestamp =
        now.toLocaleDateString("en-IN") +
        " | " +
        now.toLocaleTimeString("en-IN");

    const calculationName =
        `Calculation #${history.length + 1}`;

    history.unshift({
        name: calculationName,
        expression: exp,
        result: result,
        time: timestamp
    });

    if (history.length > 50) {
        history.pop();
    }

    localStorage.setItem(
        "calcHistory",
        JSON.stringify(history)
    );

    renderHistory();
}

function renderHistory() {

    const history =
        JSON.parse(
            localStorage.getItem("calcHistory")
        ) || [];

    historyList.innerHTML = "";

    history.forEach(item => {

        const li =
            document.createElement("li");

        li.innerHTML = `
            <div class="history-card">

                <div class="history-title">
                    ${item.name}
                </div>

                <div class="history-time">
                    ${item.time}
                </div>

                <div class="history-expression">
                    ${item.expression}
                </div>

                <div class="history-result">
                    = ${item.result}
                </div>

            </div>
        `;

        historyList.appendChild(li);
    });
}

clearHistory.addEventListener("click",()=>{

localStorage.removeItem(
"calcHistory"
);

renderHistory();

});

/* Keyboard Support */

document.addEventListener("keydown",(e)=>{

const key = e.key;

if("0123456789".includes(key)){

if(lastResult){
currentExpression = key;
lastResult = false;
}else{
currentExpression += key;
}

display.textContent =
currentExpression;
}

if("+-*/.%".includes(key)){

currentExpression += key;

display.textContent =
currentExpression;
}

if(key === "Enter"){
calculate();
}

if(key === "Backspace"){

currentExpression =
currentExpression.slice(0,-1);

display.textContent =
currentExpression || "0";
}

if(key === "Escape"){

currentExpression = "";

display.textContent = "0";

expression.textContent = "";
}

});