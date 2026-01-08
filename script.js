// jp date 5/4/2021
const JSON_DIR = "./data.json";
var params = {};
var personData = {};

//contador interno para acumular decimales
let internalCounter = 0;
let startTime = 0;
let loopTimeout = null;

// creating today date
var today = new Date();

let difference = 0;
let TotalDays = 0;

var TotalDaysCalculated = 0;
var time = 1;
var duration = 300 //in milisecond
var speed_number = 0;

var pagina = document.getElementsByClassName("pagina")[0];

var counter_fondo = document.getElementsByClassName("num-fondo")[0];
var counter = document.getElementsByClassName("num-frente")[0];
var counter_blur = document.getElementsByClassName("num-frente-blur")[0];

var name_Back = document.getElementsByClassName("nombre-fondo")[0];
var name_Text = document.getElementsByClassName("nombre-frente")[0];
var name_Blur = document.getElementsByClassName("nombre-frente-blur")[0];

var op_window = document.getElementsByClassName("op-window")[0];
var op_container = document.getElementsByClassName("op-container")[0];

var toolbar = document.getElementsByClassName("toolbar")[0];
var btn_options = document.getElementsByClassName("btn-options")[0];
var btn_refresh = document.getElementsByClassName("btn-refresh")[0];
var btn_time = document.getElementsByClassName("btn-time")[0];
var btn_fulscreen = document.getElementsByClassName("btn-fullscreen")[0];

var duration_txt= document.getElementsByClassName("dur-text")[0];

let durlist = [
    {
        duration:125,
        text:"1/8"
    },    
    {
        duration:250,
        text:"1/4"
    },    
    {
        duration:500,
        text:"1/2"
    },    
    {
        duration:1000,
        text:"1s"
    },    
    {
        duration:2000,
        text:"2s"
    },    
    {
        duration:4000,
        text:"4s"
    },    
    {
        duration:8000,
        text:"8s"
    },
]

var btn_close = document.getElementsByClassName("btn-close")[0];

var optionsHidden = true;
var fullscreen = false;

function SetTimeButtonText(){
    for(let i=0; i<durlist.length; i++){
        if(GetDuration() == durlist[i].duration){
            duration_txt.textContent = durlist[i].text;
        }
    }
}

function SetupOptionBtn(){
    btn_options.addEventListener('click', (e)=>{
        toolbar.classList.toggle('hidden', optionsHidden);
        op_window.classList.toggle('hidden', !optionsHidden);
        optionsHidden = !optionsHidden;
    });

    btn_close.addEventListener('click', (e)=>{
        toolbar.classList.toggle('hidden', optionsHidden);
        op_window.classList.toggle('hidden', !optionsHidden);
        optionsHidden = !optionsHidden;
    });

    btn_refresh.addEventListener('click', (e)=>{
        toolbar.classList.toggle('hidden', false);
        op_window.classList.toggle('hidden', true);
        optionsHidden = true;

        StartLoop();
    });

    btn_time.addEventListener('click', (e)=>{

        let actualDurIndex = -1

        for(let i=0; i<durlist.length; i++){
            if(GetDuration() == durlist[i].duration){
                actualDurIndex = i;
                break;
            }
        }

        if(actualDurIndex+1 < durlist.length){
            SetDuration(durlist[actualDurIndex+1].duration)
        }else{
            SetDuration(durlist[0].duration)
        }

         SetTimeButtonText();
    });

    btn_fulscreen.addEventListener('click', (e)=>{
        toggleFullScreen();
        fullscreen = !fullscreen;        
    });
}

function SetFullScreen(value) {
    value = Boolean(value);
    if (!Boolean.isFinite(value) || value <= 0) return;

    localStorage.setItem("counter.fullscreen", value);
}

function GetFullScreen() {
    const DEFAULT_DURATION = true; // ms

    //localStorage (persistente)
    const stored = localStorage.getItem("counter.fullscreen");
    if (stored !== null) {
        const value = Boolean(stored);
        if (Boolean(value)) {
            return value;
        }
    }

    if (typeof fullscreen === "boolean") {
        return duration;
    }

    //fallback absoluto
    return DEFAULT_DURATION;
}

function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
        if (document.documentElement.msRequestFullscreen){
            document.documentElement.msRequestFullscreen();
        }else if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
            w.scroll({top: -50, behavior: 'smooth'});
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }else if (document.webkitEnterFullscreen) {
            vid.webkitEnterFullscreen(); //for iphone this code worked
        }

    } else {
        if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.cancelFullScreen) {
            document.exitFullScreen();
        } else if (document.exitFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen ) {
            document.webkitExitFullscreen ();
        } else if (document.webkitCancelFullscreen ) {
            document.webkitCancelFullscreen ();
        }
    }
}

function StartFullScreenCheck(){
    if(GetFullScreen()){
        toggleFullScreen();
    }
}

/**
 * 
 * @param {Object} JSONData - datos de data.json ya importados
 * @param {[Object]} JSONData.people - datos de data.json ya importados
 */
function CreateOptions(JSONData){
    for(let i=0; i<JSONData.people.length; i++){
        InstanceOption(JSONData.people[i])
    }
}

/**
 * 
 * @param {Object} personData 
 * @param {string} personData.name - string nombre de la persona 
 * @param {string} personData.code - sting codigo de la persona
 * @param {string} personData.date - string fecha de la persona en ingles
 * @param {HTMLElement} container - contenedor donde instanciar el control
 */
function InstanceOption(personData){

    let option_element = document.createElement("div");
    option_element.classList.add("option");
    option_element.innerHTML =
            `<div class="op-name">${personData.code}</div>
            <div class="op-separator">-</div>
            <div class="op-date">${personData.date}</div>`

    op_container.appendChild(option_element);

    option_element.addEventListener('click', (e)=>{
        location.href = location.href.split("?")[0] + `?type=${personData.code}`;
    });
}

function StartLoop() {
    // cortar loop anterior si existe
    if (loopTimeout !== null) {
        clearTimeout(loopTimeout);
        loopTimeout = null;
    }

    startTime = performance.now();
    loop();
}

function loop() {
    loopTimeout = setTimeout(() => {
        const now = performance.now();
        const elapsed = now - startTime;

        const duration = GetDuration();
        const progress = Math.min(elapsed / duration, 1);

        TotalDaysCalculated = Math.floor(TotalDays * progress);
        UpdateCounter();

        if (progress < 1) {
            loop();
        } else {
            TotalDaysCalculated = TotalDays;
            UpdateCounter();
            loopTimeout = null; // loop terminado
        }
    }, GetTickTime());
}

function GetTickTime() {
    const DEFAULT_TICK = 1; // ms, ajustá a gusto

    const tick = window.counterTick;

    if (typeof tick !== "number" || tick <= 0) {
        return DEFAULT_TICK;
    }

    // console.log("window.counterTick =>", window.counterTick)
    return tick;
}

function SetDuration(value) {
    value = Number(value);
    if (!Number.isFinite(value) || value <= 0) return;

    localStorage.setItem("counter.duration", value);
}

function GetDuration() {
    const DEFAULT_DURATION = 1000; // ms

    //first localStorage (persistente)
    const stored = localStorage.getItem("counter.duration");
    if (stored !== null) {
        const value = Number(stored);
        if (Number.isFinite(value) && value > 0) {
            return value;
        }
    }

    //if no local store window.counterDuration (runtime / JSON)
    const duration = window.counterDuration;
    if (typeof duration === "number" && duration > 0) {
        return duration;
    }

    //finaly fallback absoluto
    return DEFAULT_DURATION;
}


function UpdateCounter(){
    if(TotalDaysCalculated > TotalDays){TotalDaysCalculated = TotalDays;}
    counter.textContent = TotalDaysCalculated;
    counter_blur.textContent = TotalDaysCalculated;
}

//CODIGO NUEVO
async function fetchData() {
    try {
        const response = await fetch(JSON_DIR);
        if (!response.ok) {
            throw new Error("No se pudo cargar el JSON con los datos");
        }

        return await response.json();

    } catch (error) {
        console.error("Error Accediendo al JSON con los datos:", error);
        return null;
    }
}

function GetParams(){
    const urlParams = new URLSearchParams(window.location.search);

    return {
        type: urlParams.get('type')?.toUpperCase() ?? "JP"
    };
}

function GetPersonData(JSONData, params){
    for(let i = 0; i<JSONData.people.length; i++){
        if(JSONData.people[i].code.toUpperCase() == params.type.toUpperCase()){
            return JSONData.people[i];
        }
    }
}

function SetName(JSONPersonData){
    name_Text.textContent = `${JSONPersonData.code}-`;
    name_Blur.textContent = `${JSONPersonData.code}-`;
}

function SetupCounterSettings(JSONData){
    window.counterTick = JSONData.config.ticks;
    window.counterDuration = JSONData.config.duration //in milisecond
}

function SetupCounterNumbers(JSONPersonData){

    today = new Date();
    const personDate = new Date(JSONPersonData.date);

    difference = today.getTime() - personDate.getTime();
    TotalDays = Math.floor(difference / (1000 * 3600 * 24));

    const tickTime = GetTickTime();
    const duration = GetDuration();

    const totalTicks = duration / tickTime;

    speed_number = TotalDays / totalTicks;

    console.log("TotalDays =", TotalDays);
    console.log("duration =", duration);
    console.log("tickTime =", tickTime);
    console.log("totalTicks =", totalTicks);
    console.log("speed_number =", speed_number);
}

async function StartCounter(){

    //start setup

    //get config data
    const dataJSON = await fetchData();
    if (!dataJSON) return;
    console.log("StartCounter() => dataJSON", dataJSON); 

    SetupCounterSettings(dataJSON)
    SetupOptionBtn();
    CreateOptions(dataJSON)
    StartFullScreenCheck();

    //get custom parameters
    params = GetParams();
    console.log("GetParams() => params", params);

    // usar dataJSON acá
    personData = GetPersonData(dataJSON, params) 
    console.log("GetPersonData() => personData", personData);

    if (!personData) return;
    SetName(personData);
    
    SetupCounterNumbers(personData);
    //start the counter loop
    SetTimeButtonText();
    StartLoop();
}

StartCounter();

