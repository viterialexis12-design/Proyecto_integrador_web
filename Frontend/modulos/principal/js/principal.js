/**
 * ==========================================================================
 * CONTROLADOR PRINCIPAL DEL DASHBOARD
 * ==========================================================================
 */

function inicializarPrincipal() {
    console.log("Inicializando panel principal...");

    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    const btnToggleSidebar = document.getElementById("btnToggleSidebar");
    const sidebar = document.getElementById("sidebar");

    const btnToggleProfileMenu = document.getElementById("btnToggleProfileMenu");
    const profileDropdown = document.getElementById("profileDropdown");

    // 1. Ocultar / Mostrar Sidebar
    if (btnToggleSidebar && sidebar) {
        btnToggleSidebar.onclick = () => {
            sidebar.classList.toggle("collapsed");
        };
    }

    // 2. Toggle del Menú Desplegable del Perfil
    if (btnToggleProfileMenu && profileDropdown) {
        btnToggleProfileMenu.onclick = (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle("show");
        };

        // Cerrar el dropdown si se hace clic fuera de él
        document.addEventListener("click", (e) => {
            if (!e.target.closest("#userProfileWrapper")) {
                profileDropdown.classList.remove("show");
            }
        });
    }

    // 3. Cargar menú y vista inicial
    cargarMenuYDatosUsuario();
    renderiza_bienvenida();

    // 4. Cierre de Sesión
    if (btnCerrarSesion) {
        btnCerrarSesion.onclick = () => {
            fetch("Backend/controllers/cerrar_sesion.php")
                .then(() => navegarA('login'))
                .catch(err => console.error("Error al cerrar sesión:", err));
        };
    }

    // 5. Escuchar mensajes del iframe
    window.addEventListener("message", (evento) => {
        if (evento.data === "refrescarMenuLateral") {
            cargarMenuYDatosUsuario();
        }
    });
}

function renderiza_bienvenida() {
    const iframe = document.getElementById("moduloIframe");
    const template = document.getElementById("Carta_bienvenida");

    if (iframe && template) {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <link rel="stylesheet" href="Frontend/css/global.css">
            </head>
            <body style="margin: 0; padding: 0; height: 100vh; overflow: hidden;">
            </body>
            </html>
        `);
        doc.close();

        const clone = template.content.cloneNode(true);
        doc.body.appendChild(clone);
    }
}

function cargarMenuYDatosUsuario() {
    const dashNombreUsuario = document.getElementById("dashNombreUsuario");
    const dashRolUsuario = document.getElementById("dashRolUsuario");
    const dashFotoUsuario = document.getElementById("dashFotoUsuario");
    const menuDinamico = document.getElementById("menuDinamico");

    fetch("Backend/controllers/menu_controller.php")
        .then(response => {
            if (response.status === 401) {
                navegarA('login');
                throw new Error("Sesión inválida.");
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                if (dashNombreUsuario) dashNombreUsuario.textContent = data.usuario.username;
                if (dashRolUsuario) dashRolUsuario.textContent = data.usuario.nombre_rol;
                if (dashFotoUsuario && data.usuario.foto) dashFotoUsuario.src = data.usuario.foto;

                if (menuDinamico) {
                    renderizarMenuJerarquico(data.menus, menuDinamico);
                }
            } else {
                console.error("Error del controlador de menú:", data.message);
            }
        })
        .catch(error => console.warn(error.message));
}

function generarNombreCarpeta(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "_");
}

function renderizarMenuJerarquico(menusBD, contenedor) {
    contenedor.innerHTML = ""; 

    if (!menusBD || menusBD.length === 0) {
        contenedor.innerHTML = "<p style='color:#bbb; padding:10px;'>Sin permisos asignados</p>";
        return;
    }

    const padres = menusBD.filter(m => m.id_menuPadre === null || m.id_menuPadre == 0);
    const hijos = menusBD.filter(m => m.id_menuPadre !== null && m.id_menuPadre != 0);

    const mapaPadres = {};
    padres.forEach(p => { mapaPadres[p.id] = { nombre: p.nombre, submenus: [] }; });

    hijos.forEach(h => {
        const padreId = h.id_menuPadre;
        if (!mapaPadres[padreId]) {
            mapaPadres[padreId] = { nombre: `Módulo General (${padreId})`, submenus: [] };
        }
        mapaPadres[padreId].submenus.push(h);
    });

    Object.keys(mapaPadres).forEach(padreId => {
        const datosPadre = mapaPadres[padreId];
        if (datosPadre.submenus.length === 0) return;

        const menuBlock = document.createElement("div");
        menuBlock.className = "menu-block";

        const menuHeader = document.createElement("button");
        menuHeader.className = "menu-header-btn";
        menuHeader.innerHTML = `
            <span>${datosPadre.nombre}</span>
            <span class="arrow-icon">▼</span>
        `;

        const submenuContainer = document.createElement("div");
        submenuContainer.className = "submenu-container";
        submenuContainer.style.display = "none";

        datosPadre.submenus.forEach(sub => {
            const subLink = document.createElement("a");
            subLink.href = "#";
            subLink.className = "submenu-link";
            subLink.textContent = `🔹 ${sub.nombre}`;

            subLink.onclick = (e) => {
                e.preventDefault();
                const nombreCarpeta = generarNombreCarpeta(datosPadre.nombre);
                const rutaModuloHTML = `Frontend/modulos/${nombreCarpeta}/${sub.url}`;

                const txtTitulo = document.getElementById("seccionActualTitle");
                if (txtTitulo) {
                    txtTitulo.textContent = `${datosPadre.nombre} • ${sub.nombre}`;
                }

                const iframe = document.getElementById("moduloIframe");
                if (iframe) {
                    iframe.src = rutaModuloHTML;
                }
            };

            submenuContainer.appendChild(subLink);
        });

        menuHeader.onclick = () => {
            const estaAbierto = submenuContainer.style.display === "block";
            document.querySelectorAll('.submenu-container').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.arrow-icon').forEach(el => el.textContent = '▼');

            if (!estaAbierto) {
                submenuContainer.style.display = "block";
                menuHeader.querySelector(".arrow-icon").textContent = "▲";
            } else {
                submenuContainer.style.display = "none";
                menuHeader.querySelector(".arrow-icon").textContent = "▼";
            }
        };

        menuBlock.appendChild(menuHeader);
        menuBlock.appendChild(submenuContainer);
        contenedor.appendChild(menuBlock);
    });
}