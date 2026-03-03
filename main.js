let startTime;
let interval;
let accumulatedTime = 0;
let milliseconds = 0;
let lastLapTime = 0;
let lapCounter = 0;
let running = false;
let lapSplits = [];

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

        interval = setInterval(() => {                          //Update display every 10 milliseconds
            milliseconds = performance.now() - startTime;
            displayEl.textContent = TimeFormat(milliseconds);
        }, 10);
    }else{
        running = !running;                                     //Pause Stopwatch
        btnStartPauseEl.textContent = "Continue";
        clearInterval(interval);                                //Pause display update

        accumulatedTime = milliseconds;                         //Stores total time to continue
    }
}

function setLap(){
    if(milliseconds > 0 && lastLapTime != milliseconds){
        lapCounter++;
        const currentSplit = milliseconds - lastLapTime;
        lapSplits.push(currentSplit);
        const newRow = tableRowCreator(lapCounter, TimeFormat(currentSplit), TimeFormat(milliseconds));
        newRow.setAttribute("data-index", lapCounter - 1);
        lapTableBodyEl.prepend(newRow);
        lastLapTime = milliseconds;
        updateTableHighlights();
    }else{
        lapBtnEl.disabled = !running;
        alert("Must be running to make a lap!");
    }
}

function clearStopWatch(){
    clearInterval(interval);
    milliseconds = 0;                       //zero var and disable
    lastLapTime = 0;
    accumulatedTime = 0;
    lapCounter = 0;
    lapSplits = [];
    running = false;        
    lapTableBodyEl.innerHTML = "";          //Clear tables
    displayEl.textContent = TimeFormat(0);  //Clear display
    btnStartPauseEl.textContent = "Start";  //Change main button text
}

function getExtreme(){                                          //Create a Index for fastest and slowest lap
    if (lapSplits.length < 2) return {minIdx: -1, maxIdx: -1};  //Check if has at least 2 laps

    let minIdx = 0;
    let maxIdx = 0;

    for(let i = 1; i < lapSplits.length; i++){                  //Loop to set index
        if (lapSplits[i] < lapSplits[minIdx]) minIdx = i;       //Fastest Index
        if (lapSplits[i] > lapSplits[maxIdx]) maxIdx = i;       //Slowest Index
    }

    return {minIdx, maxIdx};
}

function tableRowCreator(lapNum, split, total){
    const row = document.createElement("tr");

    const cellNumber = document.createElement("td");
    cellNumber.classList.add("lap-id");
    const cellSplit = document.createElement("td");
    const cellTotal = document.createElement("td");

    cellNumber.textContent = `Lap #${lapNum}`;
    cellSplit.textContent = split;
    cellTotal.textContent = total;

    row.appendChild(cellNumber);
    row.appendChild(cellSplit);
    row.appendChild(cellTotal);

    return row;
}

function updateTableHighlights(){
    const {minIdx, maxIdx} = getExtreme();
    const rows = lapTableBodyEl.querySelectorAll("tr");

    rows.forEach(row => {
        const idx = parseInt(row.getAttribute("data-index"));
        const cellNumber = row.querySelector(".lap-id");

        cellNumber.textContent = `Lap #${idx + 1}`;

        if(lapSplits.length < 2) return;

        if(idx === minIdx){
            cellNumber.textContent += " Fastest";
        }else if(idx === maxIdx){
            cellNumber.textContent += " Slowest";
        }
    })
}