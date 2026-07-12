function inicializarPrincipal() {
    console.log("🏠 Inicializando lógica de principal.js con control de permisos...");

    const dashNombreUsuario = document.getElementById("dashNombreUsuario");
    const dashRolUsuario = document.getElementById("dashRolUsuario");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    const menuDinamico = document.getElementById("menuDinamico");

    // 1. Cargar Datos de Usuario y Menús permitidos
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
                    dashRolUsuario.textContent = data.usuario.nombre_rol;
                }
                if (menuDinamico) {
                    renderizarMenuJerarquico(data.menus, menuDinamico);
                }
            } else {
                console.error("Error en datos del controlador:", data.message);
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
 * Construye el acordeón dinámico separando Padres de Hijos basándose en id_menuPadre
 */
function renderizarMenuJerarquico(menusBD, contenedor) {
    contenedor.innerHTML = ""; // Limpiar el contenedor del sidebar

    if (!menusBD || menusBD.length === 0) {
        contenedor.innerHTML = "<p style='color:#bbb; padding:10px;'>Sin permisos asignados</p>";
        return;
    }

    // Mapeo de carpetas basado estrictamente en el ID del menú padre
    const carpetasPorPadreId = {
        1: "usuarios",
        2: "roles",
        3: "menus",
        4: "permisos"
    };

    // 1. Extraer los menús principales (Padres: id_menuPadre es null)
    const padres = menusBD.filter(m => m.id_menuPadre === null);
    
    // 2. Extraer los submenús (Hijos: id_menuPadre tiene un valor)
    const hijos = menusBD.filter(m => m.id_menuPadre !== null);

    // Si por alguna razón la consulta solo trajo hijos debido a los permisos, 
    // reconstruimos los padres usando los IDs únicos presentes en los hijos.
    const mapaPadres = {};
    
    padres.forEach(p => {
        mapaPadres[p.id] = { nombre: p.nombre, submenus: [] };
    });

    hijos.forEach(h => {
        const padreId = h.id_menuPadre;
        if (!mapaPadres[padreId]) {
            // Plan de rescate si el padre no vino en la consulta de permisos
            let nombrePlanB = "Módulo ";
            if (parseInt(padreId) === 1) nombrePlanB += "Usuarios";
            if (parseInt(padreId) === 2) nombrePlanB += "Roles";
            if (parseInt(padreId) === 3) nombrePlanB += "Menús";
            if (parseInt(padreId) === 4) nombrePlanB += "Permisos";

            mapaPadres[padreId] = { nombre: nombrePlanB, submenus: [] };
        }
        mapaPadres[padreId].submenus.push(h);
    });

    // 3. Renderizar la estructura en el DOM
    Object.keys(mapaPadres).forEach(padreId => {
        const datosPadre = mapaPadres[padreId];
        
        // Omitir menús padres que no tengan submenús asignados para este rol
        if (datosPadre.submenus.length === 0) return;

        const menuBlock = document.createElement("div");
        menuBlock.className = "menu-block";

        // Botón del Menú Padre
        const menuHeader = document.createElement("button");
        menuHeader.className = "menu-header-btn";
        menuHeader.innerHTML = `
            <span>📁 ${datosPadre.nombre}</span>
            <span class="arrow-icon">▼</span>
        `;

        // Contenedor de Submenús
        const submenuContainer = document.createElement("div");
        submenuContainer.className = "submenu-container";
        submenuContainer.style.display = "none";

        // Iterar e insertar los links hijos
        datosPadre.submenus.forEach(sub => {
            const subLink = document.createElement("a");
            subLink.href = "#";
            subLink.className = "submenu-link";
            subLink.textContent = `🔹 ${sub.nombre}`;

            subLink.onclick = (e) => {
                e.preventDefault();
                
                // Resolver el nombre de la carpeta según el mapa
                const nombreCarpeta = carpetasPorPadreId[padreId] || "usuarios";
                
                // Construimos la ruta dinámica utilizando el campo exacto 'url' de tu volcado
                const rutaFisicaHTML = `Frontend/html/${nombreCarpeta}/${sub.url}`;

                console.log(`🔗 SPA cargando submenú ID ${sub.id} -> Ruta: ${rutaFisicaHTML}`);

                const txtTitulo = document.getElementById("seccionActualTitle");
                if (txtTitulo) {
                    txtTitulo.textContent = `${datosPadre.nombre} • ${sub.nombre}`;
                }

                // Inyección SPA pasándole la ruta real y el ID
                cargarVistaModuloGenerica(sub.id, rutaFisicaHTML);
            };

            submenuContainer.appendChild(subLink);
        });

        // Evento toggle del acordeón
        menuHeader.onclick = () => {
            const estaAbierto = submenuContainer.style.display === "block";

            // Cierra otros acordeones para mantener una interfaz limpia
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

/**
 * Carga el HTML en el panel central y mapea los disparadores JS con tus IDs reales
 */
function cargarVistaModuloGenerica(idSubmenu, rutaAutomatica) {
    const contenedorModulo = document.getElementById("vistaModulolContainer");
    if (!contenedorModulo) return;

    contenedorModulo.innerHTML = `<div class="loading-msg">⏳ Cargando módulo...</div>`;

    fetch(rutaAutomatica)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error físico al leer la ruta: ${rutaAutomatica}`);
            }
            return response.text();
        })
        .then(html => {
            contenedorModulo.innerHTML = html;

            // Mapeo estricto uno a uno según los IDs de tu INSERT de base de datos
            const subId = parseInt(idSubmenu);

            switch (subId) {
                // --- MÓDULO USUARIOS (id_menuPadre = 1) ---
                case 5: inicializarCrearUsuario(); break;
                case 6: inicializarActualizarUsuario(); break;
                case 7: inicializarVerUsuarios(); break;
                case 8: inicializarEliminarUsuario(); break;

                // --- MÓDULO ROLES (id_menuPadre = 2) ---
                case 9:  inicializarVerRoles(); break;
                case 10: inicializarActualizarRol(); break;   
                case 11: inicializarBorrarRol(); break;      
                case 12: inicializarCrearRol(); break;

                // --- MÓDULO MENÚS (id_menuPadre = 3) ---
                case 13: inicializarCrearMenu(); break;
                case 14: inicializarVerMenus(); break;
                case 15: inicializarActualizarMenu(); break;
                case 16: inicializarBorrarMenu(); break;    

                // --- MÓDULO PERMISOS (id_menuPadre = 4) ---
                case 17: inicializarCrearPermiso(); break;
                case 18: inicializarVerPermisos(); break;
                case 19: inicializarEliminarPermiso(); break;
                case 20: inicializarActualizarPermiso(); break;

                default:
                    console.log(`ℹ️ Vista renderizada sin disparador JS asociado (ID: ${subId}).`);
                    break;
            }
        })
        .catch(err => {
            console.error(err);
            contenedorModulo.innerHTML = `
                <div class="modulo-container" style="border-top: 4px solid #e74c3c; padding: 20px; background-color: #fff; border-radius:4px;">
                    <h3 style="color: #c0392b; margin-top:0;">⚠️ Archivo No Encontrado</h3>
                    <p>No se pudo cargar el archivo HTML en la ruta especificada.</p>
                    <hr style="border:0; border-top:1px solid #eee; margin:15px 0;">
                    <small style="color: #7f8c8d; display: block;">Ruta generada: <b>${rutaAutomatica}</b></small>
                    <small style="color: #95a5a6; display: block; margin-top:2px;">Por favor comprueba que el nombre del archivo coincida perfectamente con el campo <b>url</b> de tu base de datos.</small>
                </div>`;
        });
}