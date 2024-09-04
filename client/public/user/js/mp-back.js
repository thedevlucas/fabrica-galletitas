let Status = document.getElementById('status');
let Title = document.getElementById('title');
let Description = document.getElementById('description');

let queryParams = new URLSearchParams(window.location.search);
let xhr = new XMLHttpRequest();

xhr.open("POST", "/user/mp/status", true);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.send(`payment_id=${queryParams.get('payment_id')}&status=${queryParams.get('status')}`);
xhr.onreadystatechange = (e) => {
    if (xhr.readyState !== 4) return;
    if( xhr.status != 200) return setStatus(false, "Error en la pagina", "Lo sentimos, parece que ha ocurrido un error en la página web. Por favor, póngase en contacto con un administrador para que podamos solucionar el problema lo antes posible. Gracias por su comprensión.");

    const json = JSON.parse(xhr.responseText);
    setStatus(json.status, json.title, json.description);
};

function setStatus(status, title, description) {
    if (status)
    {
        Status.classList.add("success");
        Title.textContent = title;
        Description.textContent = description;
    }
    else
    {
        Status.classList.add("error");
        Title.textContent = title;
        Description.textContent = description;
    }
}