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

    console.log("güncel nesne listesi:",objects);



});


