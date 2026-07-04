document.addEventListener('DOMContentLoaded', () => {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) {
        window.location.href = '../index.html';
        return;
    }

    const usuario = JSON.parse(sessionData);
    document.getElementById('welcomeMessage').innerText = `Hola, ${usuario.nombre} (${usuario.rol})`;

    const opcionesMenu = [
        { id: 'inicio', texto: 'Inicio', permiso: 'ver_dashboard', render: renderInicio },
        { id: 'usuarios', texto: 'Gestión de Usuarios', permiso: 'crear_usuarios', render: renderUsuarios },
        { id: 'reportes', texto: 'Reportes Estadísticos', permiso: 'ver_reportes', render: renderReportes }
    ];

    const menuContenedor = document.getElementById('dynamicMenu');
    
    opcionesMenu.forEach(opcion => {
        if (usuario.permisos.includes(opcion.permiso)) {
            const link = document.createElement('a');
            link.href = '#';
            link.innerText = opcion.texto;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                opcion.render(); 
            });
            menuContenedor.appendChild(link);
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userSession');
        window.location.href = '../index.html';
    });
});


function renderInicio() {
    document.getElementById('mainContent').innerHTML = `
        <h2>Inicio</h2>
        <p>Bienvenido al sistema académico.</p>
    `;
}

function renderUsuarios() {
    document.getElementById('mainContent').innerHTML = `
        <h2>Gestión de Usuarios</h2>
        <p>Aquí puedes crear, editar y asignar roles a los usuarios.</p>
        <button class="btn">Nuevo Usuario</button>
        `;
}

function renderReportes() {
    document.getElementById('mainContent').innerHTML = `
        <h2>Reportes del Sistema</h2>
        <p>Visualización de logs de acceso y estadísticas.</p>
    `;
}