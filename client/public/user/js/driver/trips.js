//Steps
let step = -1;

for (let x of trips)
{
    if (x.status >= 3) step += 1;
    console.log(x.status >= 3, x.id)
}
setStep(step);

const form = document.getElementById('form');
const inputs = document.getElementById('inputs');
const button = document.getElementById('button');
const active = document.querySelectorAll(".stepper-item");

let currentTrip = 0;
for (let e of active)
{
    if (e.classList.contains("active")) currentTrip = e.getAttribute('value');
}

if (step <= 0)
{
    inputs.style.display = "none";
    inputs.querySelector('input').value = "start";
    button.innerText = "Iniciar viaje";
}

form.action += currentTrip