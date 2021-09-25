function setUpSquareListeners() {
    let squareDivs = document.querySelectorAll(".square-div");
    squareDivs.forEach(squareDiv=>squareDiv.addEventListener("pointerdown", () => {
        squareDivs.forEach(squareDiv=>squareDiv.addEventListener("pointerover", animateOver))
    }));
    squareDivs.forEach(squareDiv=>squareDiv.addEventListener("pointerup", () => {
        squareDivs.forEach(squareDiv=>squareDiv.removeEventListener("pointerover", animateOver))
    }));
    squareDivs.forEach(squareDiv=>squareDiv.addEventListener("dblclick", () => {
        squareDivs.forEach(squareDiv=>squareDiv.addEventListener("pointerover", animateOver))
    }));
}

function updateSliderInput() {
    let sliderText = document.getElementById("slider-text");
    sliderText.textContent = `${slider.value} x ${slider.value}`;
    inputChange(slider.value);
}

function createSquareDivinContainer(numOfCreateRequests) {
    let squareDivContainer = document.querySelector("#square-div-container");
    while(numOfCreateRequests) {
        let squareDiv = document.createElement("div");
        squareDiv.classList.add("square-div");
        squareDivContainer.appendChild(squareDiv);
        numOfCreateRequests--;
        }
}

function animateOver(e) {
    if (drawType == 0) {
        normalDraw(e);
    } else if (drawType == 1) {
        rainbowDraw(e);
    } else if (drawType == 2) {
        eraserDraw(e);
    }
}

function normalDraw(e) {
    e.target.style.background = "black";
}

function rainbowDraw(e) {
    if (!e.target.getAttribute("style")) {
        rgb = `rgb(${generateRandomColor()},${generateRandomColor()},${generateRandomColor()})`;
        e.target.style.background = rgb;
        e.target.dataset.brightness = "100";
    } else {
        reduceBrightness(e);
    }
}

function eraserDraw(e) {
    e.target.style.background = null;
}

function reduceBrightness(e) {
    let brightness = e.target.getAttribute("data-brightness");
    brightness = brightness-10;
    e.target.dataset.brightness = brightness;
    e.target.style.filter = `brightness(${brightness}%)`;
}

function generateRandomColor() {
    return Math.round(Math.random()*265);
}

function createSquareStyle(squareRatio) {
    let style = ".square-div {"
    style += "display: flex;";
    style += `height: ${squareRatio}%;`;
    style += `width: ${squareRatio}%;`;
    style += "}";
    console.log(style);
    return style;
}

function setSquareStyle(numberOfSquares) {
    let squareRatio = (1/numberOfSquares)*100;
    let style = createSquareStyle(squareRatio);
    let sheet = document.styleSheets[0];
    let ruleLength = document.styleSheets[0].cssRules.length;
    console.log(document.styleSheets[0].cssRules)
    if (ruleLength>originalRuleLength) {
        sheet.deleteRule(ruleLength-1);
        ruleLength -= 1;
    }
    sheet.insertRule(style, ruleLength);
}

function removeExistingSquares() {
    let squareDivs = document.getElementsByClassName("square-div");
    while(squareDivs.length > 0){
        squareDivs[0].parentNode.removeChild(squareDivs[0]);
    }
}

function startNewPad() {
    let numberOfSquares = slider.value;
    removeExistingSquares();
    squaredNumber = numberOfSquares*numberOfSquares;
    setSquareStyle(numberOfSquares);
    createSquareDivinContainer(squaredNumber);
    setUpSquareListeners();
}

function inputChange(sliderInput) {
    console.log("functionCall")
    setTimeout(function () {
        if (sliderInput == slider.value) {
            startNewPad();
            console.log("start");
        }
    }, 2000);
}

function determineButton(e) {
    let buttonId = e.path[0].id;
    
    if (buttonId == "black") {
        drawType = 0;
    } else if (buttonId == "rainbow"){
        drawType = 1;
    } else if (buttonId == "eraser") {
        drawType = 2;
    } 

    let selectedButtons = Array.from(document.getElementsByClassName("selected"));
    if(selectedButtons){
        selectedButtons.forEach(button => button.classList.remove("selected"));
    }
    e.target.classList.add("selected");
}

let drawType = 0;

let toggleDraw = undefined;
// Used by setSquareStyle to determine whether or not to delete the last rule index added by the game
const originalRuleLength = document.styleSheets[0].cssRules.length; 
let slider = document.getElementById("slider");
startNewPad();
slider.oninput = () => updateSliderInput();

let button = document.querySelectorAll(".draw-buttons");
button.forEach(button => button.addEventListener("click", determineButton));

let resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", startNewPad);




