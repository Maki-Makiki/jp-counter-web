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

var num_counter_block  = document.querySelector(".num-counter-block");

var date_counter_block  = document.querySelector(".date-counter-block");

var year_counter_fondo  = document.querySelector(".year-counter-number .num-fondo");
var year_counter        = document.querySelector(".year-counter-number .num-frente");
var year_counter_blur   = document.querySelector(".year-counter-number .num-frente-blur");
var year_name_Back      = document.querySelector(".year-counter-name .nombre-fondo");
var year_name_Text      = document.querySelector(".year-counter-name .nombre-frente");
var year_name_Blur      = document.querySelector(".year-counter-name .nombre-frente-blur");

var month_counter_fondo  = document.querySelector(".month-counter-number .num-fondo");
var month_counter        = document.querySelector(".month-counter-number .num-frente");
var month_counter_blur   = document.querySelector(".month-counter-number .num-frente-blur");
var month_name_Back      = document.querySelector(".month-counter-name .nombre-fondo");
var month_name_Text      = document.querySelector(".month-counter-name .nombre-frente");
var month_name_Blur      = document.querySelector(".month-counter-name .nombre-frente-blur");

var day_counter_fondo  = document.querySelector(".day-counter-number .num-fondo");
var day_counter        = document.querySelector(".day-counter-number .num-frente");
var day_counter_blur   = document.querySelector(".day-counter-number .num-frente-blur");
var day_name_Back      = document.querySelector(".day-counter-name .nombre-fondo");
var day_name_Text      = document.querySelector(".day-counter-name .nombre-frente");
var day_name_Blur      = document.querySelector(".day-counter-name .nombre-frente-blur");

var op_window = document.getElementsByClassName("op-window")[0];
var op_container = document.getElementsByClassName("op-container")[0];

var toolbar = document.getElementsByClassName("toolbar")[0];
var btn_options = document.getElementsByClassName("btn-options")[0];
var btn_refresh = document.getElementsByClassName("btn-refresh")[0];
var btn_time = document.getElementsByClassName("btn-time")[0];
var btn_fulscreen = document.getElementsByClassName("btn-fullscreen")[0];
var btn_counter_type = document.getElementsByClassName("btn-counter-type")[0];

var counter_type = 0;

var duration_txt= document.getElementsByClassName("dur-text")[0];

// Fechas del contador de años, meses y días
let calendarStartDate = null;
let calendarEndDate = null;

var btn_close = document.getElementsByClassName("btn-close")[0];

var optionsHidden = true;
var fullscreen = false;

function CallUpdateSecondSize(){
    setTimeout(() => {
        requestAnimationFrame(() => {
            UpdateSecondSize();
        });
    }, 200);
}

function UpdateSecondSize() {
    if (!btn_time) return;

    const rect = btn_time.getBoundingClientRect();
    const buttonSize = Math.min(rect.width, rect.height);

    const porcentaje = 0.45; // ajustable
    const fontSize = buttonSize * porcentaje;

    btn_time.style.setProperty(
        "--second-fomt-size",
        `${fontSize}px`
    );
}

let durlist = [
    {
        duration:125,
        text:"⅛"
    },    
    {
        duration:250,
        text:"¼"
    },    
    {
        duration:500,
        text:"½"
    },    
    {
        duration:1000,
        text:"1"
    },    
    {
        duration:2000,
        text:"2"
    },    
    {
        duration:4000,
        text:"4"
    },    
    {
        duration:8000,
        text:"8"
    },
]

function SetTimeButtonText(){
    for(let i=0; i<durlist.length; i++){
        if(GetDuration() == durlist[i].duration){
            duration_txt.textContent = durlist[i].text;
        }
    }
}

function ChangeCounterType(){
    console.log("ChangeCounterType()");
    if(counter_type == 0){
        counter_type = 1;
    }else{
        counter_type = 0;
    }

    detectCounterTypeChange();
}

function detectCounterTypeChange(){
    if(counter_type == 0){
        num_counter_block.classList.toggle("desaparecer", false);
        date_counter_block.classList.toggle("desaparecer", true);

    }else{
        num_counter_block.classList.toggle("desaparecer", true);
        date_counter_block.classList.toggle("desaparecer", false);
        
    }
}

function SetupCounterTypeBtn(){
    btn_counter_type.addEventListener('click', (e)=>{
        ChangeCounterType();
    });

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

    btn_fulscreen.addEventListener('click', (e) => {
        toggleFullScreen();
        fullscreen = !fullscreen;
        SetFullScreen(fullscreen);
    });
}

function SetFullScreen(value) {
    localStorage.setItem(
        "counter.fullscreen",
        String(Boolean(value))
    );
}

function GetFullScreen() {
    const stored = localStorage.getItem("counter.fullscreen");

    // La preferencia guardada por el usuario tiene prioridad.
    if (stored !== null) {
        return stored === "true";
    }

    // Si no hay preferencia guardada, usar el JSON.
    if (typeof window.counterFullscreen === "boolean") {
        return window.counterFullscreen;
    }

    return true;
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

        // CONTADOR ORIGINAL: no cambia su cálculo.
        TotalDaysCalculated = Math.floor(TotalDays * progress);
        UpdateCounter();

        // NUEVO CONTADOR: años, meses y días de calendario.
        UpdateCalendarCounter(progress);

        if (progress < 1) {
            loop();
        } else {
            // Resultado final exacto del contador original.
            TotalDaysCalculated = TotalDays;
            UpdateCounter();

            // Resultado final exacto del contador de calendario.
            UpdateCalendarCounter(1);

            loopTimeout = null;
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

//CODIGO Years Months Days

// Crea una fecha local a medianoche, sin depender de la hora actual.
function NormalizeDate(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}

// Suma meses conservando el día original siempre que sea posible.
// Si el día no existe en el mes destino, utiliza el último día de ese mes.
function AddCalendarMonths(date, months) {
    const totalMonths =
        date.getFullYear() * 12 +
        date.getMonth() +
        months;

    const year = Math.floor(totalMonths / 12);
    const month = totalMonths - year * 12;

    const lastDay = new Date(year, month + 1, 0).getDate();
    const day = Math.min(date.getDate(), lastDay);

    return new Date(year, month, day);
}

// Diferencia entre dos fechas expresada en días de calendario.
// UTC evita errores de 23 o 25 horas por cambios de horario.
function GetCalendarDayDifference(start, end) {
    const startUTC = Date.UTC(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
    );

    const endUTC = Date.UTC(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
    );

    return Math.round(
        (endUTC - startUTC) / 86400000
    );
}

// Calcula años, meses y días completos entre dos fechas.
function GetYearsMonthsDays(start, end) {
    if (end < start) {
        return { years: 0, months: 0, days: 0 };
    }

    let years = end.getFullYear() - start.getFullYear();

    let anchor = AddCalendarMonths(start, years * 12);

    // Ajustar si todavía no se ha alcanzado el aniversario.
    if (anchor > end) {
        years--;
        anchor = AddCalendarMonths(start, years * 12);
    }

    let months = 0;

    while (months < 11) {
        const nextAnchor = AddCalendarMonths(
            start,
            years * 12 + months + 1
        );

        if (nextAnchor > end) break;

        months++;
        anchor = nextAnchor;
    }

    const days = GetCalendarDayDifference(anchor, end);

    return { years, months, days };
}

// Actualiza exclusivamente los números de años, meses y días.
function UpdateCalendarCounter(progress) {
    if (!calendarStartDate || !calendarEndDate) return;

    // Interpolar por días de calendario, evitando errores de horario.
    const totalCalendarDays = GetCalendarDayDifference(
        calendarStartDate,
        calendarEndDate
    );

    const elapsedCalendarDays = Math.floor(
        totalCalendarDays * Math.min(Math.max(progress, 0), 1)
    );

    const intermediateDate = new Date(
        calendarStartDate.getFullYear(),
        calendarStartDate.getMonth(),
        calendarStartDate.getDate() + elapsedCalendarDays
    );

    // Garantizar el resultado final exacto.
    const currentDate = progress >= 1
        ? calendarEndDate
        : intermediateDate;

    const result = GetYearsMonthsDays(
        calendarStartDate,
        currentDate
    );

    year_counter.textContent = result.years;
    year_counter_blur.textContent = result.years;

    month_counter.textContent = result.months;
    month_counter_blur.textContent = result.months;

    day_counter.textContent = result.days;
    day_counter_blur.textContent = result.days;
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

function SetYearsMonthsDays(){
    year_name_Text.textContent = `${"YEARS"}-`;   
    year_name_Blur.textContent = `${"YEARS"}-`;    

    month_name_Text.textContent = `${"MONTHS"}-`;   
    month_name_Blur.textContent = `${"MONTHS"}-`; 
  
    day_name_Text.textContent = `${"DAYS"}-`;
    day_name_Blur.textContent = `${"DAYS"}-`;
}

function SetupCounterSettings(JSONData){
    window.counterTick = JSONData.config.ticks;
    window.counterDuration = JSONData.config.duration //in milisecond
    window.counterFullscreen = JSONData.config.fullscreen;
}

function SetupCounterNumbers(JSONPersonData) {

    today = new Date();
    const personDate = new Date(JSONPersonData.date);

    // CONTADOR ORIGINAL: se mantiene intacto.
    difference = today.getTime() - personDate.getTime();
    TotalDays = Math.floor(difference / (1000 * 3600 * 24));

    // NUEVO CONTADOR: fechas normalizadas al día de calendario.
    calendarStartDate = NormalizeDate(personDate);
    calendarEndDate = NormalizeDate(today);

    const tickTime = GetTickTime();
    const duration = GetDuration();

    const totalTicks = duration / tickTime;

    speed_number = TotalDays / totalTicks;

    console.log("TotalDays =", TotalDays);
    console.log("duration =", duration);
    console.log("tickTime =", tickTime);
    console.log("totalTicks =", totalTicks);
    console.log("speed_number =", speed_number);

    console.log(
        "Calendar duration =",
        GetYearsMonthsDays(calendarStartDate, calendarEndDate)
    );
}

async function StartCounter(){

    //start setup

    //get config data
    const dataJSON = await fetchData();
    if (!dataJSON) return;
    console.log("StartCounter() => dataJSON", dataJSON); 

    SetupCounterSettings(dataJSON)
    SetupOptionBtn();
    SetupCounterTypeBtn()
    CreateOptions(dataJSON);
    StartFullScreenCheck();

    //seconds rezise
    CallUpdateSecondSize();
    window.addEventListener("resize", CallUpdateSecondSize);
    window.addEventListener("load", CallUpdateSecondSize);

    //get custom parameters
    params = GetParams();
    console.log("GetParams() => params", params);

    // usar dataJSON acá
    personData = GetPersonData(dataJSON, params) 
    console.log("GetPersonData() => personData", personData);

    if (!personData) return;
    SetName(personData);
    SetYearsMonthsDays();
    
    SetupCounterNumbers(personData);
    //start the counter loop
    SetTimeButtonText();
    StartLoop();
}

StartCounter();

