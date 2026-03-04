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

function TimeFormat(ms){
    //Time formatting function: sets the variable type to Date with reference to milliseconds
    const data = new Date(ms);
    //Format the text with at least 2 decimal places and always starts with 0 if the current time does not have 2 decimal places (01 instead of 1)
    const hour = data.getUTCHours().toString().padStart(2, "0");
    const min = data.getUTCMinutes().toString().padStart(2, "0");
    const seg = data.getUTCSeconds().toString().padStart(2, "0");
    const mseg = Math.floor(data.getUTCMilliseconds() / 10).toString().padStart(2, "0");
    return `${hour}:${min}:${seg}.${mseg}`;                     //Return time with correct format
}

function stopwatchState(){
    if(!running){
        running = !running;                                     //Start Stopwatch
        btnStartPauseEl.textContent = "Pause";                  //Change text from start/PAUSE/continue btn
        startTime = performance.now() - accumulatedTime;        //Sets the time stopwatch starts or calculate it to continue
        interval = setInterval(() => {                          //Update main time var every 10 milliseconds
            milliseconds = performance.now() - startTime;       //Calculate time elapsed since begin
            displayEl.textContent = TimeFormat(milliseconds);   //Change time in display and format it
        }, 10);
    }else{
        running = !running;                                     //Pause Stopwatch
        btnStartPauseEl.textContent = "Continue";               //Change text from start/pause/CONTINUE btn
        clearInterval(interval);                                //Pause update on main time var
        accumulatedTime = milliseconds;                         //Stores total time to calculate continue
    }
}

function setLap(){
    if(milliseconds > 0 && lastLapTime != milliseconds){
        lapCounter++;                                           //Increases lap count
        const currentSplit = milliseconds - lastLapTime;        //Sets the value of current split
        lapSplits.push(currentSplit);                           //Add it at the end of an array
        //set var for new row with lap number, split time and total time
        const newRow = tableRowCreator(lapCounter, TimeFormat(currentSplit), TimeFormat(milliseconds));
        newRow.setAttribute("data-index", lapCounter - 1);      //Set a index for reference so we check the fastest and slowest
        lapTableBodyEl.prepend(newRow);                         //Add the new lap line at the end of table body
        lastLapTime = milliseconds;                             //Reference the actual time for use in future
        updateTableHighlights();                                //Update table highlights
    }else{
        lapBtnEl.disabled = !running;                           //Change stopwatch state
        alert("Must be running to make a lap!");                //The user receives an alert to provide instructions
    }
}

function clearStopWatch(){
    clearInterval(interval);                                    //Pause update on main time var
    milliseconds = 0;                                           //clear vars
    lastLapTime = 0;
    accumulatedTime = 0;
    lapCounter = 0;
    lapSplits = [];
    running = false;                                            //Disable stopwatch
    lapTableBodyEl.innerHTML = "";                              //Clear tables
    displayEl.textContent = TimeFormat(0);                      //Clear display
    btnStartPauseEl.textContent = "Start";                      //Change main button text
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
        row.classList.remove("fastest-row", "slowest-row");
        cellNumber.textContent = `Lap #${idx + 1}`;
        if(lapSplits.length < 2) return;

        if(idx === minIdx){
            cellNumber.textContent += " Fastest";
            row.classList.add("fastest-row");
        }else if(idx === maxIdx){
            cellNumber.textContent += " Slowest";
            row.classList.add("slowest-row");
        }
    })
}