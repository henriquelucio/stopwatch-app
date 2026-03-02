let startTime;
let interval;
let accumulatedTime = 0;
let milliseconds = 0;
let lastLapTime = 0;
let lapCounter = 0;
let running = false;

//Reference to handle HTML elements
const displayEl = document.getElementById("display");
const btnStartPauseEl = document.getElementById("btn-start-pause");
const lapBtnEl = document.getElementById("btn-lap");
const lapTableEl = document.getElementById("lap-table");
const lapTableBodyEl = document.getElementById("lap-table-body");
const restartBtnEl = document.getElementById("btn-restart");

//Events
btnStartPauseEl.addEventListener("click", stopwatchState);
lapBtnEl.addEventListener("click", setLap);
restartBtnEl.addEventListener("click", clearStopWatch);

//Time format function
function TimeFormat(ms){
    const data = new Date(ms);
    const hour = data.getUTCHours().toString().padStart(2, "0");
    const min = data.getUTCMinutes().toString().padStart(2, "0");
    const seg = data.getUTCSeconds().toString().padStart(2, "0");
    const mseg = Math.floor(data.getUTCMilliseconds() / 10).toString().padStart(2, "0");
    return `${hour}:${min}:${seg}.${mseg}`;
}

function stopwatchState(){
    if(!running){
        //Start the stopwatch
        running = !running;
        btnStartPauseEl.textContent = "Pause";

        startTime = performance.now() - accumulatedTime;

        interval = setInterval(() => {
            milliseconds = performance.now() - startTime;
            displayEl.textContent = TimeFormat(milliseconds);
        }, 10);
    }else{
        //pause the stopwatch
        running = !running;
        btnStartPauseEl.textContent = "Continue";
        clearInterval(interval);

        accumulatedTime = milliseconds;
    }
}

function setLap(){
    if(milliseconds > 0 && lastLapTime != milliseconds){
        lapCounter++;
        const currentSplit = milliseconds - lastLapTime;
        const newRow = tableRowCreator(lapCounter, TimeFormat(currentSplit), TimeFormat(milliseconds));
        lapTableBodyEl.prepend(newRow);
        lastLapTime = milliseconds;
    }else{
        lapBtnEl.disable = !running;
        alert("Must be running to make a lap!");
    }
}

function clearStopWatch(){
    clearInterval(interval);
    milliseconds = 0;                       //zero var and disable
    lastLapTime = 0;
    accumulatedTime = 0;
    lapCounter = 0;
    running = false;        
    lapTableBodyEl.innerHTML = "";          //Clear tables
    displayEl.textContent = TimeFormat(0);  //Clear display
    btnStartPauseEl.textContent = "Start";  //Change main button text
}

function tableRowCreator(lapCounter, currentSplit, milliseconds){
    const row = document.createElement("tr");

    const cellNumber = document.createElement("td");
    const cellSplit = document.createElement("td");
    const cellTotal = document.createElement("td");

    cellNumber.textContent = `Lap #${lapCounter}`;
    cellSplit.textContent = currentSplit;
    cellTotal.textContent = milliseconds;

    row.appendChild(cellNumber);
    row.appendChild(cellSplit);
    row.appendChild(cellTotal);

    return row;
}