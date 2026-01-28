const seesaw = document.getElementById("seesaw");
const seesawCase =document.getElementById("seesaw-case");
const leftWeightDisplay =document.getElementById("left-weight");
const rightWeightDisplay =document.getElementById("right-weight");
const nextWeightDisplay =document.getElementById("next-weight");
const ghostObject = document.getElementById("ghost-object");
const angleDisplay =document.getElementById("angle-display");
const logList = document.getElementById("log-list");

let objects = [];
let angle = 0;

//decide first weight
let currentNextWeight = getRandomWeight();

nextWeightDisplay.innerText = currentNextWeight;

function getRandomWeight(){
    return Math.ceil(Math.random()*10);
}

function addLog(message){
    if(!logList) return;

    const entry = document.createElement('div');
    entry.classList.add('log-entry');

    const time = new Date().toLocaleTimeString();
    
    //create msg
    entry.innerHTML = `<strong style="color:#333">[${time}]</strong><br>${message}`;
    
    // fifo (first in first out)
    logList.prepend(entry);
}

function getWeightStyle(weight){
    let color;
    let size;

    if (weight <= 3) {
        color = '#3498db'; // Mavi (Hafif)
    } else if (weight <= 6) {
        color = '#2ecc71'; // yeşil (Orta)
    } else if (weight <= 8) {
        color = '#f39c12'; // Turuncu (Ağır)
    } else {
        color = '#e74c3c'; // Kırmızı (En Ağır)
    }
    
    size = 30 + (weight * 3);
    
    return { color: color, size: size};
}

seesawCase.addEventListener('mousemove',function(event){
    const rect = seesaw.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;

    const style = getWeightStyle(currentNextWeight);

    ghostObject.style.display ='flex';
    ghostObject.style.left = hoverX + 'px';
    ghostObject.style.top = '0px';

    ghostObject.style.width = style.size + 'px';
    ghostObject.style.height = style.size + 'px';
    ghostObject.style.backgroundColor = style.color;
    ghostObject.style.borderColor = style.color;
    ghostObject.style.opacity = '0.5';
    

    ghostObject.innerText = currentNextWeight + 'kg';
});


   /* */
    
seesawCase.addEventListener('mouseleave',function(){
    ghostObject.style.display = "none";
});


seesawCase.addEventListener('click',function(event){

    const rect = seesaw.getBoundingClientRect();
    const clickX = event.clientX - rect.left
    const centerX = rect.width/2;
    const distanceFromCenter = clickX - centerX;



    const weightElem = document.createElement('div');

    // deleted ().
    const weight = currentNextWeight;

    /*console.log("Click X:",clickX);
    console.log("Center X:",centerX);
    console.log("Distance from center:",distanceFromCenter); 
    console.log("Created weight: ",weight,"kg"); */

    const style = getWeightStyle(weight);

    weightElem.classList.add("weight-object");
    weightElem.innerText = weight + 'kg';
    weightElem.style.left = clickX + 'px';
    //dropping effect
    weightElem.style.bottom = '250px';
    weightElem.style.width = style.size + 'px';
    weightElem.style.height = style.size + 'px';
    weightElem.style.backgroundColor = style.color;

    seesaw.appendChild(weightElem);

    //browser rendering
    setTimeout(() => {weightElem.style.bottom = '10px';},50);


    objects.push({
        id: Date.now(),weight: weight,position: distanceFromCenter,element: weightElem});

    const side = distanceFromCenter < 0 ? "Left" : "Right";
    const distance = Math.round(Math.abs(distanceFromCenter));
    
    // call log func
    addLog(`Added <b>${weight}kg</b> to ${side}<br>Dist: ${distance}px`);
    
    updateSim();
    currentNextWeight = getRandomWeight();
    nextWeightDisplay.innerText=currentNextWeight;

    ghostObject.innerText = currentNextWeight + 'kg';

    //updating shadow preview
    const newStyle = getWeightStyle(currentNextWeight);
    ghostObject.innerText = currentNextWeight + 'kg';
    ghostObject.style.width = newStyle.size + 'px';
    ghostObject.style.height = newStyle.size + 'px';
    ghostObject.style.backgroundColor = newStyle.color;
    ghostObject.style.borderColor = newStyle.color;

    saveLocalStorage();
});

function updateSim(){
    let leftT = 0;
    let rightT = 0;
    let leftTotalW = 0;
    let rightTotalW = 0;

    //search all objects by one by
    objects.forEach(function(obj) {
        //for left objects
        if (obj.position<0){
            leftT += obj.weight * Math.abs(obj.position);
            leftTotalW += obj.weight;
        }
        //for right
        else {
            rightT += obj.weight * obj.position;
            rightTotalW += obj.weight;

        }
    });

//angle calculation from pdf
const sensitivty = 150;
let calAngle= (rightT - leftT) / sensitivty;

//limiting
if(calAngle>30) calAngle = 30;
if(calAngle< -30) calAngle = -30;
angle = calAngle;

seesaw.style.transform = `rotate(${angle}deg)`;

//should use if?? LOOK LATER!!!!!!!!!!!
leftWeightDisplay.innerText = leftTotalW;
rightWeightDisplay.innerText = rightTotalW;
angleDisplay.innerText = angle.toFixed(1)+"°";


//do not "" intead ``
console.log(`Left Torque : ${leftT}, Right Torque: ${rightT}, Angle : ${angle}`);

}

function saveLocalStorage(){

    const cleandata = objects.map(obj =>{
        return {
            id: obj.id,
            weight: obj.weight,
            position: obj.position
        };
    });
    localStorage.setItem("seesaw_data",JSON.stringify(cleandata));
}

function loadFromLocalStoroge(){
    const saved_data = localStorage.getItem("seesaw_data");

    if (saved_data){
        objects = JSON.parse(saved_data);

        objects.forEach(function(obj){
            //new div (same as previous but instant complete)
            const weightElem = document.createElement('div');
            weightElem.classList.add('weight-object');
            

            const style = getWeightStyle(obj.weight);
            const rect = seesaw.getBoundingClientRect();
            const centerX = rect.width/2;
            const leftPos = obj.position + centerX;

            weightElem.innerText = obj.weight + "kg";
            weightElem.style.width = style.size + 'px';
            weightElem.style.height = style.size + 'px';
            weightElem.style.backgroundColor = style.color;
            weightElem.style.left = leftPos + "px";
            weightElem.style.bottom = '10px';
            obj.element=weightElem
            //adding dom reference because cant take it from json
            seesaw.appendChild(weightElem);


        });

        updateSim();
        saveLocalStorage();
    }
}

const reset_button = document.getElementById('reset-btn');
if(reset_button){
    reset_button.addEventListener('click',function(){
        localStorage.removeItem('seesaw_data');
        location.reload();
    });
}




window.addEventListener("load",loadFromLocalStoroge);



