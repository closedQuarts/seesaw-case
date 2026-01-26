const seesaw = document.getElementById("seesaw");
const seesawCase =document.getElementById("seesaw-case");
const leftWeightDisplay =document.getElementById("left-weight");
const rightWeightDisplay =document.getElementById("right-weight");

let objects = [];
let angle = 0;

function getRandomWeight(){
    return Math.ceil(Math.random()*10);
}

seesaw.addEventListener('click',function(event){
    const rect = seesaw.getBoundingClientRect();
    const clickX = event.clientX - rect.left
    const centerX = rect.width/2;
    const distanceFromCenter = clickX - centerX;

    const weightElem = document.createElement('div');

    console.log("Click X:",clickX);
    console.log("Center X:",centerX);
    console.log("Distance from center:",distanceFromCenter);

    const weight = getRandomWeight();
    console.log("Created weight: ",weight,"kg");

    weightElem.classList.add("weight-object");
    weightElem.innerText = weight + 'kg';
    weightElem.style.left = clickX + 'px';
    seesaw.appendChild(weightElem);

    objects.push({
        id: Date.now(),weight: weight,position: distanceFromCenter,element: weightElem
    });

    console.log("Object List",objects);
    updateSim();

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
const sensitivty = 50;
let calAngle= (rightT - leftT) / sensitivty;

//limiting
if(calAngle>30) calAngle = 30;
if(calAngle< -30) calAngle = -30;
angle = calAngle;

seesaw.style.transform = `rotate(${angle}deg)`;

leftTotalW.innerText = leftTotalW;
rightTotalW.innerText = rightTotalW;

console.log("Left Torque : ${LeftT}, Right Toruqe: ${RightT}, Angle : ${angle} ");

}





