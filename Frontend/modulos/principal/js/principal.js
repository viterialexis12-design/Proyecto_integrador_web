/**
 * ==========================================================================
 * CONTROLADOR PRINCIPAL DEL DASHBOARD (Frontend/modulos/principal/js/principal.js)
 * ==========================================================================
 */

function inicializarPrincipal() {
    console.log("🏠 Inicializando panel principal con soporte de módulos Iframe...");

    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    // 1. Cargar el menú de inmediato
    cargarMenuYDatosUsuario();
    renderiza_bienvenida();

    // 2. Configurar el evento de cierre de sesión
    if (btnCerrarSesion) {
        btnCerrarSesion.onclick = () => {
            fetch("Backend/controllers/cerrar_sesion.php")
                .then(() => navegarA('login'))
                .catch(err => console.error("Error al cerrar sesión:", err));
        };
    }

    // 3. COMUNICACIÓN ENTRE EL IFRAME Y EL CONTENEDOR PADRE
    // Si un submódulo (por ejemplo, "crear_menu.html") modifica los menús en la BD,
    // enviará un mensaje al documento padre para refrescar la barra lateral en tiempo real.
    window.addEventListener("message", (evento) => {
        if (evento.data === "refrescarMenuLateral") {
            console.log("🔄 Mensaje recibido desde el iframe: Recargando menú lateral...");
            cargarMenuYDatosUsuario();
        }
    });
}
function renderiza_bienvenida() {
    const iframe = document.getElementById("moduloIframe");
    const template = document.getElementById("Carta_bienvenida");

    if (iframe && template) {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        
        // 1. Inicializamos un documento HTML limpio dentro del iframe (Corregida la etiqueta <body>)
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

        // 2. Inyectamos el contenido clonado del template
        const clone = template.content.cloneNode(true);
        doc.body.appendChild(clone);
    }
}
function cargarMenuYDatosUsuario() {
    const dashNombreUsuario = document.getElementById("dashNombreUsuario");
    const dashRolUsuario = document.getElementById("dashRolUsuario");
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
                
                if (menuDinamico) {
                    renderizarMenuJerarquico(data.menus, menuDinamico);
                }
            } else {
                console.error("Error del controlador de menú:", data.message);
            }
        })
        .catch(error => console.warn(error.message));
}

/**
 * Convierte un título ("Gestión de Menús") en una ruta física en minúsculas y snake_case ("gestion_de_menus")
 */
function generarNombreCarpeta(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
        .replace(/[^a-z0-9\s-]/g, "")    // Eliminar caracteres raros
        .trim()
        .replace(/\s+/g, "_");          // Espacios a guiones bajos
}

/**
 * Dibuja el menú lateral dinámicamente y configura las acciones del Iframe
 */
function renderizarMenuJerarquico(menusBD, contenedor) {
    contenedor.innerHTML = ""; 

    if (!menusBD || menusBD.length === 0) {
        contenedor.innerHTML = "<p style='color:#bbb; padding:10px;'>Sin permisos asignados</p>";
        return;
    }

    // Clasificación de padres y submenús
    const padres = menusBD.filter(m => m.id_menuPadre === null || m.id_menuPadre == 0);
    const hijos = menusBD.filter(m => m.id_menuPadre !== null && m.id_menuPadre != 0);

    const mapaPadres = {};
    
    padres.forEach(p => {
        mapaPadres[p.id] = { nombre: p.nombre, submenus: [] };
    });

    hijos.forEach(h => {
        const padreId = h.id_menuPadre;
        if (!mapaPadres[padreId]) {
            mapaPadres[padreId] = { nombre: `Módulo General (${padreId})`, submenus: [] };
        }
        mapaPadres[padreId].submenus.push(h);
    });

    // Construcción del HTML dinámico en el DOM
    Object.keys(mapaPadres).forEach(padreId => {
        const datosPadre = mapaPadres[padreId];
        
        if (datosPadre.submenus.length === 0) return;

        const menuBlock = document.createElement("div");
        menuBlock.className = "menu-block";

        const menuHeader = document.createElement("button");
        menuHeader.className = "menu-header-btn";
        menuHeader.innerHTML = `
            <span>📁 ${datosPadre.nombre}</span>
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
                
                // 📂 CÁLCULO DINÁMICO DE RUTA MODULAR
                const nombreCarpeta = generarNombreCarpeta(datosPadre.nombre);
                // Ejemplo de ruta física final: Frontend/modulos/gestion_de_menus/crear_menu.html
                const rutaModuloHTML = `Frontend/modulos/${nombreCarpeta}/${sub.url}`;

                // Actualizar título de la sección activa
                const txtTitulo = document.getElementById("seccionActualTitle");
                if (txtTitulo) {
                    txtTitulo.textContent = `${datosPadre.nombre} • ${sub.nombre}`;
                }

                // Cargar el HTML directamente dentro del iframe
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