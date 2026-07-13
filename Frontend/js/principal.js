function inicializarPrincipal() {
    console.log("🏠 Inicializando lógica de principal.js 100% Dinámica...");

    const dashNombreUsuario = document.getElementById("dashNombreUsuario");
    const dashRolUsuario = document.getElementById("dashRolUsuario");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    const menuDinamico = document.getElementById("menuDinamico");

    // 1. Cargar Datos de Usuario y Menús permitidos desde el controlador
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
                if (dashNombreUsuario) dashNombreUsuario.textContent = data.usuario.username;
                if (dashRolUsuario) dashRolUsuario.textContent = data.usuario.nombre_rol;
                
                if (menuDinamico) {
                    renderizarMenuJerarquico(data.menus, menuDinamico);
                }
            } else {
                console.error("Error en datos del controlador:", data.message);
            }
        })
        .catch(error => console.warn(error.message));

    if (btnCerrarSesion) {
        btnCerrarSesion.onclick = () => {
            fetch("Backend/controllers/cerrar_sesion.php")
                .then(() => navegarA('login'))
                .catch(err => console.error("Error al cerrar sesión:", err));
        };
    }
}

/**
 * Normaliza textos para convertirlos en nombres válidos de carpetas en minúsculas y sin acentos
 * Ejemplo: "Gestión de Menús" -> "gestion_de_menus"
 */
function generarNombreCarpeta(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
        .replace(/[^a-z0-9\s-]/g, "")    // Eliminar caracteres especiales
        .trim()
        .replace(/\s+/g, "_");          // Reemplazar espacios por guiones bajos
}

/**
 * Construye el acordeón de menús de forma 100% dinámica basándose en la BD
 */
function renderizarMenuJerarquico(menusBD, contenedor) {
    contenedor.innerHTML = ""; 

    if (!menusBD || menusBD.length === 0) {
        contenedor.innerHTML = "<p style='color:#bbb; padding:10px;'>Sin permisos asignados</p>";
        return;
    }

    // 1. Clasificación pura por id_menuPadre
    const padres = menusBD.filter(m => m.id_menuPadre === null || m.id_menuPadre == 0);
    const hijos = menusBD.filter(m => m.id_menuPadre !== null && m.id_menuPadre != 0);

    const mapaPadres = {};
    
    padres.forEach(p => {
        mapaPadres[p.id] = { nombre: p.nombre, submenus: [] };
    });

    // Plan de rescate adaptativo si el backend no envía el registro del padre pero sí el del hijo
    hijos.forEach(h => {
        const padreId = h.id_menuPadre;
        if (!mapaPadres[padreId]) {
            // Genera un nombre estimado basado en el hermano si no se encuentra el objeto Padre
            mapaPadres[padreId] = { nombre: `Módulo General (${padreId})`, submenus: [] };
        }
        mapaPadres[padreId].submenus.push(h);
    });

    // 2. Dibujar estructura en el DOM
    Object.keys(mapaPadres).forEach(padreId => {
        const datosPadre = mapaPadres[padreId];
        
        // Omitir carpetas vacías para el rol
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
                
                // 📂 CÁLCULO DINÁMICO DE CARPETA
                const nombreCarpeta = generarNombreCarpeta(datosPadre.nombre);
                const rutaFisicaHTML = `Frontend/html/${nombreCarpeta}/${sub.url}`;

                const txtTitulo = document.getElementById("seccionActualTitle");
                if (txtTitulo) {
                    txtTitulo.textContent = `${datosPadre.nombre} • ${sub.nombre}`;
                }

                // Ejecutar carga pasando el nombre del archivo para mapear su JS
                cargarVistaModuloGenerica(sub.url, rutaFisicaHTML);
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

/**
 * Carga de forma SPA los contenidos HTML e inicializa dinámicamente sus JS correspondientes
 */
function cargarVistaModuloGenerica(nombreArchivoUrl, rutaAutomatica) {
    const contenedorModulo = document.getElementById("vistaModulolContainer");
    if (!contenedorModulo) return;

    contenedorModulo.innerHTML = `<div class="loading-msg">⏳ Cargando módulo...</div>`;

    fetch(rutaAutomatica)
        .then(response => {
            if (!response.ok) throw new Error(`Error físico al leer la ruta: ${rutaAutomatica}`);
            return response.text();
        })
        .then(html => {
            contenedorModulo.innerHTML = html;

            // 🔮 INICIALIZACIÓN DE JS 100% DINÁMICA sin Switch-Case
            // Ejemplo: cambia 'crear_usuario.html' a la cadena 'CrearUsuario'
            if (nombreArchivoUrl) {
                const nombreLimpio = nombreArchivoUrl.replace('.html', '');
                const nombreFuncionJs = "inicializar" + nombreLimpio
                    .split('_')
                    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                    .join('');

                // Buscamos si la función existe en el contexto global del navegador (window)
                if (typeof window[nombreFuncionJs] === "function") {
                    console.log(`🚀 Ejecutando inicializador dinámico: ${nombreFuncionJs}()`);
                    window[nombreFuncionJs]();
                } else {
                    console.log(`ℹ️ Vista cargada. No se encontró la función global: ${nombreFuncionJs}()`);
                }
            }
        })
        .catch(err => {
            console.error(err);
            contenedorModulo.innerHTML = `
                <div class="modulo-container" style="border-top: 4px solid #e74c3c; padding: 20px; background-color: #fff; border-radius:4px;">
                    <h3 style="color: #c0392b; margin-top:0;">⚠️ Módulo No Disponible</h3>
                    <p>No se pudo localizar el archivo de interfaz en el servidor.</p>
                    <hr style="border:0; border-top:1px solid #eee; margin:15px 0;">
                    <small style="color: #7f8c8d; display: block;">Ruta esperada: <b>${rutaAutomatica}</b></small>
                    <small style="color: #95a5a6; display: block; margin-top:2px;">Verifica que la carpeta en "Frontend/html/" se llame igual al módulo padre y el archivo coincida con la URL.</small>
                </div>`;
        });
}