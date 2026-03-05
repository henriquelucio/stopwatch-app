let startTime;
let interval;
let accumulatedTime = 0;
let milliseconds = 0;
let lastLapTime = 0;
let running = false;
let lapData = [];

//Reference to handle HTML elements
const startPauseBtnEl = document.getElementById("btn-start-pause");
const lapBtnEl = document.getElementById("btn-lap");
const restartBtnEl = document.getElementById("btn-restart");
const displayEl = document.getElementById("display");
const lapTableBodyEl = document.getElementById("lap-table-body");

//Events
startPauseBtnEl.addEventListener("click", stopwatchState);
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
    running = !running;                                         //Toggle stopwatch state
    if(running){
        startPauseBtnEl.textContent = "Pause";                  //Change text from start/PAUSE/continue btn
        startTime = performance.now() - accumulatedTime;        //Sets the time stopwatch starts or calculate it to continue
        interval = setInterval(() => {                          //Update main time var every 10 milliseconds
            milliseconds = performance.now() - startTime;       //Calculate time elapsed since begin
            displayEl.textContent = TimeFormat(milliseconds);   //Change time in display and format it
        }, 10);
            lapBtnEl.disabled = false;                          //Enable lap button
    }else{
        startPauseBtnEl.textContent = "Continue";               //Change text from start/pause/CONTINUE btn
        clearInterval(interval);                                //Pause update on main time var
        accumulatedTime = milliseconds;                         //Stores total time to calculate continue
    }
}

function setLap(){
    if(milliseconds > 0 && lastLapTime != milliseconds){
        const currentSplit = milliseconds - lastLapTime;        //Sets the value of current split
        const lapNumber = lapData.length + 1;                   //Use array index for set lap number
        //Creates row
        const {row, cellNumber} = tableRowCreator(TimeFormat(currentSplit), TimeFormat(milliseconds));
        cellNumber.textContent = `Lap #${lapNumber}`;           //Set lap text
        lapData.push({                                          //Save data and html tags reference in array
            splitMs: currentSplit,                              //split time
            rowEl: row,                                         //tag <tr>
            cellNumEl: cellNumber,                              //tag <td> of number
            lapIndex: lapNumber                                 //lap number
        });
        lapTableBodyEl.prepend(row);                            //Add the new lap line at the end of table body
        lastLapTime = milliseconds;                             //Reference the actual time for use in future
        updateTableHighlights();                                //Update table highlights
        if(!running){                                           //Check running state
            lapBtnEl.disabled = true;                           //Disable lap button
        }
    }else{
        alert("Must be running to make a lap!");                //The user receives an alert to provide instructions
    }
}

function clearStopWatch(){
    clearInterval(interval);                                    //Pause update on main time var
    milliseconds = 0;                                           //clear vars
    lastLapTime = 0;
    accumulatedTime = 0;
    lapData = [];
    running = false;                                            //Disable stopwatch
    lapTableBodyEl.innerHTML = "";                              //Clear tables
    displayEl.textContent = TimeFormat(0);                      //Clear display
    startPauseBtnEl.textContent = "Start";                      //Change main button text
    lapBtnEl.disabled = true;                                   //Disable lap button
}

function tableRowCreator(split, total){                         //Creates a row to show lap info
    const row = document.createElement("tr");
    const cellNumber = document.createElement("td");
    const cellSplit = document.createElement("td");
    const cellTotal = document.createElement("td");
               
    cellSplit.textContent = split;
    cellTotal.textContent = total;

    row.appendChild(cellNumber);
    row.appendChild(cellSplit);
    row.appendChild(cellTotal);

    return {row, cellNumber};
}

function getExtreme(){                                          //Create a Index for fastest and slowest lap
    if (lapData.length < 2) return {minIdx: -1, maxIdx: -1};    //Check if has at least 2 laps
    let minIdx = 0;                                             
    let maxIdx = 0;
    for(let i = 1; i < lapData.length; i++){                    //Loop to set index
        if (lapData[i].splitMs < lapData[minIdx].splitMs) minIdx = i;       //Fastest Index
        if (lapData[i].splitMs > lapData[maxIdx].splitMs) maxIdx = i;       //Slowest Index
    }
    return {minIdx, maxIdx};
}

function updateTableHighlights(){                               //Update table to show fastest and slowest lap
    const {minIdx, maxIdx} = getExtreme();                      //Get index from function
    lapData.forEach((lap, index) => {                           
        lap.rowEl.classList.remove("fastest-row", "slowest-row");
        lap.cellNumEl.textContent = `Lap #${lap.lapIndex}`;
        if(lapData.length < 2) return;
        if(index === minIdx){
            lap.cellNumEl.textContent += " Fastest";
            lap.rowEl.classList.add("fastest-row");
        }else if(index === maxIdx){
            lap.cellNumEl.textContent += " Slowest";
            lap.rowEl.classList.add("slowest-row");
        }
    })
}