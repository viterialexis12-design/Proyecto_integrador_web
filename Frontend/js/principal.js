function inicializarPrincipal() {
    console.log("🏠 Inicializando lógica de principal.js...");

    const dashNombreUsuario = document.getElementById("dashNombreUsuario");
    const dashRolUsuario = document.getElementById("dashRolUsuario");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    const menuDinamico = document.getElementById("menuDinamico");

    // 1. Cargar Datos de Usuario y Menús desde el Controlador
    fetch("Backend/controllers/menu_controller.php")
        .then(response => {
            if (response.status === 401) {
                navegarA('login');
                throw new Error("Acceso denegado: Sesión inválida.");
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                // A) Pintar datos del perfil
                if (dashNombreUsuario) dashNombreUsuario.textContent = data.usuario.username;
                if (dashRolUsuario) {
                    dashRolUsuario.textContent = (data.usuario.id_rol === 'ROL0000001') ? "Administrador" : "Usuario";
                }

                // B) Renderizar los Menús y Permisos en el Sidebar
                if (menuDinamico) {
                    renderizarMenuAcordeon(data.menus, menuDinamico);
                }
            } else {
                console.error("Error en datos:", data.message);
            }
        })
        .catch(error => console.warn(error.message));

    // 2. Controlar Cierre de Sesión
    if (btnCerrarSesion) {
        btnCerrarSesion.onclick = () => {
            fetch("Backend/controllers/cerrar_sesion.php")
                .then(() => navegarA('login'))
                .catch(err => console.error("Error al cerrar sesión:", err));
        };
    }
}

/**
 * Genera la estructura de acordeón para los menús y sus sub-elementos
 */
function renderizarMenuAcordeon(menus, contenedor) {
    contenedor.innerHTML = ""; // Limpiar contenedor

    if (!menus || menus.length === 0) {
        contenedor.innerHTML = "<p style='color:#bbb; padding:10px;'>Sin menús asignados</p>";
        return;
    }

    menus.forEach(menu => {
        // Crear el contenedor del bloque del menú
        const menuBlock = document.createElement("div");
        menuBlock.className = "menu-block";

        // Crear el botón del Menú Principal
        const menuHeader = document.createElement("button");
        menuHeader.className = "menu-header-btn";
        menuHeader.innerHTML = `
            <span>📁 ${menu.nombre}</span>
            <span class="arrow-icon">▼</span>
        `;

        // Crear el contenedor oculto para los Permisos (Submenú)
        const submenuContainer = document.createElement("div");
        submenuContainer.className = "submenu-container";
        submenuContainer.style.display = "none"; // Cerrado por defecto

        const permisosReales = menu.permisos || [];
        // Cuando ligues los permisos reales de la BD, mapearemos menu.permisos.forEach(...)
        permisosReales.forEach(permiso => {
            const subLink = document.createElement("a");
            subLink.href = "#";
            subLink.className = "submenu-link";
            subLink.textContent = `🔹 ${permiso.nombre_permiso}`;

            subLink.onclick = (e) => {
                e.preventDefault();
                console.log(`Abriendo módulo: ${permiso.id_permiso} - ${permiso.nombre_permiso}`);
                const txtTitulo = document.getElementById("seccionActualTitle");
                if (txtTitulo) {
                    txtTitulo.textContent = `${menu.nombre} • ${permiso.nombre_permiso}`;
                }

                // 🔥 2. LA PIEZA FALTANTE: Llamamos a la función que inyecta el HTML
                // Le pasamos el código de menú (ej: MNU0000001) y el ID del permiso (ej: PER0000001)
                cargarVistaModuloGenerica(menu.codigo_menu, permiso.id_permiso);
            };

            submenuContainer.appendChild(subLink);
        });

        // 💥 LÓGICA DEL DESPLEGABLE (Expandir / Contraer)
        menuHeader.onclick = () => {
            const estaAbierto = submenuContainer.style.display === "block";

            // Cerrar todos los demás menús primero si quieres efecto acordeón estricto (opcional)
            document.querySelectorAll('.submenu-container').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.arrow-icon').forEach(el => el.textContent = '▼');

            // Alternar el actual
            if (!estaAbierto) {
                submenuContainer.style.display = "block";
                menuHeader.querySelector(".arrow-icon").textContent = "▲";
            } else {
                submenuContainer.style.display = "none";
                menuHeader.querySelector(".arrow-icon").textContent = "▼";
            }
        };

        // Armar el bloque e inyectarlo al sidebar
        menuBlock.appendChild(menuHeader);
        menuBlock.appendChild(submenuContainer);
        contenedor.appendChild(menuBlock);
    });
}

function cargarVistaModuloGenerica(codigoMenu, idPermiso) {
    const contenedorModulo = document.getElementById("vistaModulolContainer");
    if (!contenedorModulo) return;

    // Mensaje de carga temporal
    contenedorModulo.innerHTML = `<div class="loading-msg">⏳ Cargando módulo...</div>`;

    // 1. Convertimos a minúsculas para evitar problemas de compatibilidad en servidores
    const folder = codigoMenu.toLowerCase().trim();
    const file = idPermiso.toLowerCase().trim();

    // 2. DECLARACIÓN CORRECTA DE LA RUTA
    const rutaAutomatica = `Frontend/html/${folder}/${file}.html`;

    console.log(`📂 SPA intentando cargar la ruta generada: ${rutaAutomatica}`);

    // 3. Petición Fetch usando la variable ya declarada
    fetch(rutaAutomatica)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se encontró el archivo físico en: ${rutaAutomatica}`);
            }
            return response.text();
        })
        .then(html => {
            // Inyectamos el HTML de forma limpia en el panel derecho
            contenedorModulo.innerHTML = html;

            // 4. DISPARADORES DE ACCESIBILIDAD PARA EL CRUD DE USUARIOS
            const permisoID = idPermiso.toUpperCase().trim();

            if (permisoID === 'PER0000004') {
                inicializarVerUsuarios(); // Activa la tabla
            } else if (permisoID === 'PER0000001') {
                inicializarCrearUsuario(); // Activa la creación
            } else if (permisoID === 'PER0000002') {
                inicializarEditarUsuario(); // ⚡ Activa el autocompletado y guardado del formulario de edición
            } else if (permisoID === 'PER0000003') {
                inicializarEliminarUsuario(); // ⚡ Activa la confirmación de la baja lógica
            }

            if (permisoID === 'PER0000009') {
                inicializarVerRoles();
            } else if (permisoID === 'PER0000010') {
                inicializarCrearRol();
            } else if (permisoID === 'PER0000011') {
                inicializarEditarRol();
            } else if (permisoID === 'PER0000012') {
                inicializarEliminarRol();
            }

            if (permisoID === 'PER0000005') {
                inicializarVerMenus();
            } else if (permisoID === 'PER0000007') {
                inicializarCrearMenu();
            } else if (permisoID === 'PER0000006') {
                inicializarEditarMenu();
            } else if (permisoID === 'PER0000008') {
                inicializarEliminarMenu();
            }

            else if (permisoID === 'PER0000013') {
                inicializarVerPermisos();
            } else if (permisoID === 'PER0000016') {
                inicializarCrearPermiso();
            } else if (permisoID === 'PER0000014') {
                inicializarEditarPermiso();
            } else if (permisoID === 'PER0000015') {
                inicializarEliminarPermiso();
            }

        })
        .catch(err => {
            console.error(err);
            contenedorModulo.innerHTML = `
                <div class="modulo-container" style="border-top: 4px solid #e74c3c; padding: 20px; background-color: #fff;">
                    <h3 style="color: #c0392b;">⚠️ Error al Cargar Módulo</h3>
                    <p>No se pudo renderizar la vista solicitada.</p>
                    <small style="color: #7f8c8d; display: block; margin-top: 5px;">Ruta intentada: <b>${rutaAutomatica}</b></small>
                    <small style="color: #95a5a6; display: block;">Verifica que la carpeta y el archivo existan exactamente con esos nombres.</small>
                </div>`;
        });
}