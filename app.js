const seesaw = document.getElementById("seesaw");
const seesawCase =document.getElementById("seesaw-case");
const leftWeightDisplay =document.getElementById("left-weight");
const rightWeightDisplay =document.getElementById("right-weight");
const nextWeightDisplay =document.getElementById("next-weight");
const ghostObject = document.getElementById("ghost-object");
const angleDisplay =document.getElementById("angle-display");

let objects = [];
let angle = 0;

//decide first weight
let currentNextWeight = getRandomWeight();

nextWeightDisplay.innerText = currentNextWeight;

function getRandomWeight(){
    return Math.ceil(Math.random()*10);
}

seesawCase.addEventListener('mousemove',function(event){
    const rect = seesaw.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;

    ghostObject.style.display ='flex';
    ghostObject.style.left = hoverX + 'px';

    const hoverY = event.clientY - rect.top;
    ghostObject.style.top = hoverY + 'px';

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

    weightElem.classList.add("weight-object");
    weightElem.innerText = weight + 'kg';
    weightElem.style.left = clickX + 'px';
    
    //dropping effect
    weightElem.style.bottom = '250px';

    seesaw.appendChild(weightElem);

    //browser rendering
    setTimeout(() => {weightElem.style.bottom = '10px';},50);


    objects.push({
        id: Date.now(),weight: weight,position: distanceFromCenter,element: weightElem});

    //console.log("Object List",objects);
    updateSim();
    currentNextWeight = getRandomWeight();
    nextWeightDisplay.innerText=currentNextWeight;

    ghostObject.innerText = currentNextWeight + 'kg';

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
            weightElem.innerText = obj.weight + "kg";

            const rect = seesaw.getBoundingClientRect();
            const centerX = rect.width/2;
            const leftPos = obj.position + centerX;

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



