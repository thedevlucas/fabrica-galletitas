let roomType = "small";
let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth(),
    active = date;

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

//set plan
let plan = plans.find(x => x.id == params.id)
document.getElementById("planName").textContent = `Pack ${plan.name}`
document.getElementById("planId").value = plan.id

//Set hor
let hourList = document.querySelector(".times .list");
let timeInput = document.getElementById("time");
const setHorarios = () => {
    const horarios = [
        '08:00:00', '09:00:00', '10:00:00', '11:00:00', 
        '12:00:00', '13:00:00', '14:00:00', '15:00:00', 
        '16:00:00', '17:00:00'
    ];

    const horariosDisponibles = horarios.filter(horario => {
        const reserva = reserves.find(x => {
            const date = new Date(x.date);
            return x.time == horario && (active.getDate() === date.getDate() && date.getMonth() === active.getMonth() && date.getFullYear() === active.getFullYear());
        });
        
        return !reserva || reserves.filter(x => x.type == roomType).length < rooms.find(x => x.type == roomType).quantity;
    });

    let spanTag = "";
    for (let x of horarios)
    {
        
        if (horariosDisponibles.find(x2 => x2 == x))
        {
            spanTag += `<span>${x.substring(0, 5)}</span>`;
        }
        else
        {
            spanTag += `<span class="occuped">${x.substring(0, 5)}</span>`;
        }
    }
    hourList.innerHTML = spanTag;

    hourList.querySelectorAll("span").forEach(e => {
        if (e.className != "occuped")
        {
            e.addEventListener("click", () => {
                hourList.querySelectorAll("span").forEach(e2 => {
                    e2.textContent = e2.textContent.substring(0, 5)
                });

                timeInput.value = e.textContent;
                e.textContent = e.textContent + " ⬤";
                validateForm();
            });
        }
    })
}

//Calendario
let dateInput = document.getElementById("date");

let curD = new Date(active);
curD.setDate(curD.getDate()-1);
dateInput.value = curD.toISOString().split("T")[0];

const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        const today = new Date();
        const currentDate = new Date(currYear, currMonth, i);

        if (active.getDate() === i && currMonth === active.getMonth() && currYear === active.getFullYear())
        {
            liTag += `<li class="active">${i}</li>`;
        }
        else if 
        (
            currentDate < today ||  // Fecha pasada
            (currYear === today.getFullYear() && currMonth > today.getMonth() + 1) ||
            (currYear > today.getFullYear() && currMonth > today.getMonth() - 11)
        )
        {
            liTag += `<li class="inactive">${i}</li>`;
        }
        else
        {
            liTag += `<li>${i}</li>`;
        }
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    document.querySelectorAll(".days li").forEach(e => {
        if (e.className != "inactive")
        {
            e.addEventListener("click", () => {
                document.querySelectorAll(".days li").forEach(e2 => {
                    e2.classList.remove("active");
                });
    
                e.classList.add("active");
                
                active = new Date(currYear, currMonth, Number(e.textContent));
                dateInput.value = active.toISOString().split("T")[0];
                timeInput.value = undefined;
                setHorarios();
                validateForm();
            })
        }
    })

    setHorarios();
};
renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});

//Selc cancha
let canchas = document.querySelectorAll(".cancha");
let canchaInput = document.getElementById("type");

canchaInput.value = roomType;

canchas.forEach((e) => {
    e.addEventListener("click", (e2) => {
        canchas.forEach((e3) => {
            e3.classList.remove("selected");
        })

        e.classList.add("selected");
        roomType = e.getAttribute("value");
        canchaInput.value = roomType;
        setHorarios();
        validateForm();
    })
})

//Validate
const form = document.getElementById('form');
const inputs = form.querySelectorAll('input');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', function(event) {
    if (!validateForm()) {
        event.preventDefault();
    }
    //event.preventDefault();
});

inputs.forEach(input => {
    input.addEventListener('keyup', function() {
        validateForm();
    });
});

function validateForm() {
    const name = form.name.value.trim();
    const lastname = form.lastname.value.trim();
    const phone = form.phone.value.trim();
    const players = form.players.value.trim();
    const date = form.date.value;
    const planId = form.planId.value.trim();
    const time = form.time.value;

    if (!name || !lastname || !phone || !players || !date || !planId || !time) {
        showError("Complete todos los campos.");
        return false;
    }

    if (players > rooms.find(x => x.type === roomType).capacity)
    {
        showError("Los jugadores no pueden ser mayor a la capacidad del campo.");
        return false;
    }

    const currentDate = new Date();
    const inputDate = new Date(date);
    const maxDate = new Date();

    inputDate.setDate(inputDate.getDate() + 1);
    maxDate.setMonth(currentDate.getMonth() + 1);

    if (inputDate < currentDate || inputDate > maxDate) {
        showError("La fecha debe estar entre hoy y dentro de un mes.");
        return false;
    }

    const [inputHours, inputMinutes] = time.split(':').map(Number);
    if (inputHours < 8 || (inputHours >= 17 && inputMinutes > 0)) {
        showError("La hora debe estar entre las 08:00 y las 17:00.");
        return false;
    }

    showError(false);
    return true;
}

function showError(message) {
    errorMessage.style.visibility = message ? "visible" : "hidden";
    errorMessage.textContent = message;
}