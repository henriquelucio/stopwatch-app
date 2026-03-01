let milliseconds = 0;
let lap;
let running = true;

const display = document.getElementById("display");
const btnStartPause = document.getElementById("btn-start-pause");
const lapList = document.getElementById("lap-list");

function TimeFormat(ms){
    const data = new Date(ms);
    const min = data.getUTCMinutes().toString().padStart(2, "0");
    const seg = data.getUTCSeconds().toString().padStart(2, "0");
    const mseg = Math.floor(data.getUTCMilliseconds() / 10).toString().padStart(2, "0");
    return `${min}:${seg}.${mseg}`;
}