let milliseconds = 0;
let interval;
let running = false;

//reference to handle HTML elements
const displayEl = document.getElementById("display");
const btnStartPauseEl = document.getElementById("btn-start-pause");
const lapBtnEl = document.getElementById("btn-lap");
const lapListEl = document.getElementById("lap-list");
const restartBtnEl = document.getElementById("btn-restart");

//events
btnStartPauseEl.addEventListener("click", stopwatchState);
lapBtnEl.addEventListener("click", setLap);
restartBtnEl.addEventListener("click", clearStopWatch);

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
        interval = setInterval(() => {
            milliseconds += 10;
            displayEl.textContent = TimeFormat(milliseconds);
        }, 10);
    }else{
        //pause the stopwatch
        running = !running;
        btnStartPauseEl.textContent = "Continue";
        clearInterval(interval);
    }
}

function setLap(){
    if(milliseconds > 0 && running){
        const li = document.createElement("li");
        li.textContent = `Volta:  ${TimeFormat(milliseconds)}`;
        lapListEl.appendChild(li);
    }else{
        lapBtnEl.disable = !running;
        alert("Must be running to make a lap!");
    }
}

function clearStopWatch(){
    clearInterval(interval);
    milliseconds = 0;
    running = false;
    displayEl.textContent = TimeFormat(0);
    btnStartPauseEl.textContent = "Start";
    lapListEl.innerHTML = "";
}