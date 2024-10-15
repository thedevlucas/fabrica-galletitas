const sidebarr = document.querySelector('#sidebar .side-menu');

if (user.group == 'cliente')
{
    let html = `
    <li>
        <a href="/user/store">
            <i class='bx bx-plus' ></i>
            <span class="text">Gestionar Local</span>
        </a>
    </li>
    <li>
        <a href="/user/pedidos">
            <i class='bx bx-store-alt'></i>
            <span class="text">Gestionar pedidos</span>
        </a>
    </li>`

    sidebarr.insertAdjacentHTML('beforeend', html)
}