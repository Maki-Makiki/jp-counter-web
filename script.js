// jp date 5/4/2021
const MakiDate = new Date("November 01, 2016");
const jpDate = new Date("April 05, 2021");
const LauraDate = new Date("January 02, 1996");

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('type');
var counterType = myParam;

// creating today date
var today = new Date();

var pagina = document.getElementsByClassName("pagina")[0];

var counter_fondo = document.getElementsByClassName("num-fondo")[0];
var counter = document.getElementsByClassName("num-frente")[0];
var counter_blur = document.getElementsByClassName("num-frente-blur")[0];

var name_Back = document.getElementsByClassName("nombre")[0];
var name_Text = document.getElementsByClassName("nombre-frente")[0];
var name_Blur = document.getElementsByClassName("nombre-frente-blur")[0];

console.log( "today " + today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear() );
console.log( "JP date " + jpDate.getDay() + "/" +  jpDate.getMonth() + "/" + jpDate.getFullYear() );
console.log( "MK date " + MakiDate.getDay() + "/" +  MakiDate.getMonth() + "/" + MakiDate.getFullYear() );

let difference = 0;
let TotalDays = 0;

var TotalDaysCalculated = 0;
var time = 1;
var duration = 300 //in milisecond


console.log("counter type = " + counterType);

switch(counterType){
    case "maki":
        difference = today.getTime() - MakiDate.getTime() ;
        TotalDays = Math.floor(difference / (1000 * 3600 * 24));
        setName("MK-");
        break;
    case "laura":
        difference = today.getTime() - LauraDate.getTime() ;
        TotalDays = Math.floor(difference / (1000 * 3600 * 24));
        setName("LL-");
        break;

    default:
        difference = today.getTime() - jpDate.getTime() ;
        TotalDays = Math.floor(difference / (1000 * 3600 * 24));
        setName("JP-");
        break;
}

var speed_number = 0;
speed_number = Math.ceil(TotalDays/duration);

console.log("Total Days = " + TotalDays);
console.log("difference = " + difference);
console.log("speed_number = " + speed_number);
console.log("TotalDaysCalculated = " + TotalDaysCalculated);

tick();

// counter.textContent = TotalDays;

function setName(namePerson){
    name_Back.textContent = namePerson;
    name_Text.textContent = namePerson;
    name_Blur.textContent = namePerson;
}


function tick()
{
    setTimeout(() => {
        if(TotalDaysCalculated < TotalDays){
            TotalDaysCalculated += speed_number
            updateCounter();
            tack();
        }else{
            TotalDaysCalculated = TotalDays
            updateCounter();
        }
    }, time);
}

function tack()
{
    setTimeout(() => {
        if(TotalDaysCalculated < TotalDays){
            TotalDaysCalculated += speed_number
            updateCounter();
            tick();
        }else{
            TotalDaysCalculated = TotalDays
            updateCounter();
        }        
    }, time);
}

window.addEventListener("resize", (e)=>{
    resizetext(counter_fondo, [counter, counter_blur])
    resizetext(name_Back, [name_Text, name_Blur])
})

function updateCounter(){
    if(TotalDaysCalculated > TotalDays){TotalDaysCalculated = TotalDays;}
    counter.textContent = TotalDaysCalculated;
    counter_blur.textContent = TotalDaysCalculated;
}

/** reescala el texto segun el tamaño de la pantalla
 * 
 * @param {HTMLElement} elemento 
 * @param {[HTMLElement]} lista 
 */
function resizetext(elemento, lista){
    console.log("rezisetext()")
    pagina.style.setProperty("--multy", window.innerHeight > window.innerWidth ? 1 : 1.5);
    elemento.style.setProperty("--font-size", elemento.clientHeight + "px");
    
    for (const element of lista) {
        element.style.setProperty("--font-size", elemento.clientHeight + "px");
        element.style.setProperty("--ancho", elemento.clientWidth + "px");
    }
}

setTimeout(() => { 
    window.dispatchEvent(new Event("resize")); 
}, 10);

setTimeout(() => { 
    window.dispatchEvent(new Event("resize")); 
}, 100);

setTimeout(() => { 
    window.dispatchEvent(new Event("resize")); 
}, 500);

setTimeout(() => { 
    window.dispatchEvent(new Event("resize")); 
}, 1000);

window.dispatchEvent(new Event("resize"));
