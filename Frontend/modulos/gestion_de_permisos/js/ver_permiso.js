/**
 * ==========================================================================
 * LÓGICA DE CONSULTA DE MATRIZ DE PERMISOS CON PAGINACIÓN (ver_permisos.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarVerPermiso();
});

function inicializarVerPermiso() {
    const txtBuscarRol = document.getElementById("txtBuscarRolVerPermiso");
    const sugerenciasRol = document.getElementById("listaSugerenciasRolVerPermiso");
    const contenedorArbol = document.getElementById("contenedorArbolPermisos");
    const listaJerarquia = document.getElementById("listaModulosJerarquia");
    const contenedorPaginacion = document.getElementById("paginacionPermisos");

    const RUTA_ROL_CONTROLLER = "../../../Backend/controllers/rol_controller.php";
    const RUTA_PERMISO_CONTROLLER = "../../../Backend/controllers/permiso_controller.php";

    let rolesLocales = [];
    let ultimoRolConsultadoId = null;

    // Configuración de paginación
    const ITEMS_POR_PAGINA = 6; 
    let paginaActual = 1;
    let bloquesModulosProcesados = []; // Aquí guardaremos los módulos ya estructurados en un array

    /**
     * Carga el catálogo de roles para habilitar la búsqueda predictiva instantánea
     */
    function cargarRoles() {
        fetch(RUTA_ROL_CONTROLLER)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success") {
                    rolesLocales = response.data;
                }
            })
            .catch((err) => console.error("Error al cargar roles:", err));
    }

    cargarRoles();

    // Sincronización de eventos
    document.addEventListener("cambioRoles", () => {
        cargarRoles();
        if (ultimoRolConsultadoId) {
            cargarPermisosPorRol(ultimoRolConsultadoId);
        }
    });

    document.addEventListener("cambioPermisos", () => {
        if (ultimoRolConsultadoId) {
            cargarPermisosPorRol(ultimoRolConsultadoId);
        }
    });

    // Lógica del Buscador Predictivo
    if (txtBuscarRol) {
        txtBuscarRol.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerenciasRol.innerHTML = "";

            if (query === "") {
                sugerenciasRol.style.display = "none";
                contenedorArbol.style.display = "none";
                ultimoRolConsultadoId = null;
                return;
            }

            const filtrados = rolesLocales.filter(
                (rol) =>
                    (rol.nombre || "").toLowerCase().includes(query) ||
                    (rol.descripcion || "").toLowerCase().includes(query)
            );

            if (filtrados.length === 0) {
                sugerenciasRol.innerHTML = `<div style="padding: 10px 15px; color:#94a3b8; font-style: italic; font-size: 0.9rem;">No se encontraron roles coincidentes</div>`;
            } else {
                filtrados.forEach((rol) => {
                    const item = document.createElement("div");
                    item.style.padding = "10px 15px";
                    item.style.cursor = "pointer";
                    item.style.borderBottom = "1px solid #f1f5f9";
                    item.innerHTML = `👤 <b>${rol.nombre}</b> <br> <small style="color:#64748b;">${rol.descripcion || "Sin descripción"}</small>`;

                    item.onclick = () => {
                        txtBuscarRol.value = rol.nombre;
                        sugerenciasRol.style.display = "none";
                        ultimoRolConsultadoId = rol.id;
                        paginaActual = 1; // Reiniciamos a la primera página con cada nueva consulta

                        cargarPermisosPorRol(rol.id);
                    };

                    item.onmouseenter = () => (item.style.backgroundColor = "#f8fafc");
                    item.onmouseleave = () => (item.style.backgroundColor = "transparent");
                    sugerenciasRol.appendChild(item);
                });
            }

            sugerenciasRol.style.display = "block";
        };

        document.addEventListener("click", (e) => {
            if (e.target !== txtBuscarRol) sugerenciasRol.style.display = "none";
        });
    }

    /**
     * Consulta al controlador de permisos los accesos asignados
     */
    function cargarPermisosPorRol(idRol) {
        listaJerarquia.innerHTML =
            '<div style="grid-column: 1 / -1; text-align:center; color:#64748b; font-style:italic; padding: 20px;">⏳ Organizando estructura de accesos...</div>';
        contenedorPaginacion.innerHTML = "";
        contenedorArbol.style.display = "block";

        fetch(`${RUTA_PERMISO_CONTROLLER}?id_rol=${idRol}`)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success") {
                    // Primero procesamos toda la jerarquía en un array global
                    procesarEstructuraJerarquica(response.data);
                    // Renderizamos la página actual
                    renderizarPaginaActual();
                } else {
                    listaJerarquia.innerHTML = `<div style="grid-column: 1 / -1; color:#ef4444; font-weight:bold; padding: 20px;">⚠️ ${response.message}</div>`;
                }
            })
            .catch(() => {
                listaJerarquia.innerHTML =
                    '<div style="grid-column: 1 / -1; color:#ef4444; padding: 20px;">❌ Error al conectar con el servidor de permisos.</div>';
            });
    }

    /**
     * Procesa la colección plana del Backend y arma la jerarquía completa en memoria
     */
    function procesarEstructuraJerarquica(data) {
        bloquesModulosProcesados = [];

        if (!data || data.length === 0) {
            return;
        }

        const mapasPadres = {};
        const submenusHuerfanos = [];
        const idsMenusRegistrados = new Set();

        // Paso 1: Eliminar duplicados
        const dataLimpia = data.filter((item) => {
            const idMenu = item.id_menu_catalogo || item.id_menu || item.id;
            if (idsMenusRegistrados.has(idMenu)) return false;
            idsMenusRegistrados.add(idMenu);
            return true;
        });

        // Paso 2: Clasificar los Menús Padre
        dataLimpia.forEach((item) => {
            const idPadre = item.id_menuPadre ? parseInt(item.id_menuPadre, 10) : 0;
            const idMenu = item.id_menu_catalogo || item.id_menu || item.id;
            const nombreMenu = item.nombre_menu || item.nombre;

            if (idPadre === 0) {
                mapasPadres[idMenu] = {
                    id: idMenu,
                    nombre_menu: nombreMenu,
                    submenus: [],
                };
            } else {
                submenusHuerfanos.push({
                    ...item,
                    id_padre: idPadre,
                    nombre_menu: nombreMenu,
                    id_final: idMenu
                });
            }
        });

        // Paso 3: Asociar submenús a sus padres
        submenusHuerfanos.forEach((sub) => {
            const idPadre = sub.id_padre;

            if (mapasPadres[idPadre]) {
                mapasPadres[idPadre].submenus.push(sub);
            } else {
                const claveHuerfano = "modulo_general_huerfanos";
                
                if (!mapasPadres[claveHuerfano]) {
                    mapasPadres[claveHuerfano] = {
                        id: claveHuerfano,
                        nombre_menu: "Otros Accesos Asignados",
                        submenus: [],
                    };
                }
                
                const yaExiste = mapasPadres[claveHuerfano].submenus.some(s => (s.id_menu_catalogo || s.id) === sub.id_final);
                if (!yaExiste) {
                    mapasPadres[claveHuerfano].submenus.push(sub);
                }
            }
        });

        // Convertimos el mapa estructurado a un arreglo indexable
        Object.keys(mapasPadres).forEach((key) => {
            const bloque = mapasPadres[key];
            // No agregamos el bloque huérfano si no contiene ningún elemento
            if (bloque.submenus.length === 0 && key === "modulo_general_huerfanos") {
                return;
            }
            bloquesModulosProcesados.push(bloque);
        });
    }

    /**
     * Renderiza la página de módulos seleccionada y dibuja los controles de paginación
     */
    function renderizarPaginaActual() {
        listaJerarquia.innerHTML = "";
        contenedorPaginacion.innerHTML = "";

        if (bloquesModulosProcesados.length === 0) {
            listaJerarquia.innerHTML =
                '<div style="grid-column: 1 / -1; color:#64748b; font-style: italic; text-align:center; padding: 40px 20px;">Este rol no cuenta con ningún acceso asignado actualmente.</div>';
            return;
        }

        // Calcular índices de rebanado de array (Slice)
        const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
        const indiceFin = indiceInicio + ITEMS_POR_PAGINA;
        const itemsPagina = bloquesModulosProcesados.slice(indiceInicio, indiceFin);
        const totalPaginas = Math.ceil(bloquesModulosProcesados.length / ITEMS_POR_PAGINA);

        // Paso 1: Renderizar los elementos de la página actual
        itemsPagina.forEach((bloque) => {
            const cardMenu = document.createElement("div");
            cardMenu.style.background = "#ffffff";
            cardMenu.style.border = "1px solid #e2e8f0";
            cardMenu.style.borderRadius = "8px";
            cardMenu.style.overflow = "hidden";
            cardMenu.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
            cardMenu.style.display = "flex";
            cardMenu.style.flexDirection = "column";

            const headerPadre = document.createElement("div");
            headerPadre.style.backgroundColor = "#f1f5f9";
            headerPadre.style.padding = "12px 15px";
            headerPadre.style.borderBottom = "1px solid #e2e8f0";
            headerPadre.style.display = "flex";
            headerPadre.style.justifyContent = "space-between";
            headerPadre.style.alignItems = "center";
            headerPadre.innerHTML = `
                <span style="font-weight: bold; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                    📁 ${bloque.nombre_menu}
                </span>
                <span style="font-size: 0.75rem; background: #cbd5e1; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Módulo</span>
            `;
            cardMenu.appendChild(headerPadre);

            const cuerpoSubmenus = document.createElement("div");
            cuerpoSubmenus.style.padding = "12px 15px";
            cuerpoSubmenus.style.flexGrow = "1";

            if (bloque.submenus.length === 0) {
                cuerpoSubmenus.innerHTML = `<div style="color: #94a3b8; font-size: 0.85rem; font-style: italic; padding: 5px 0;">Sin submenús asignados</div>`;
            } else {
                bloque.submenus.forEach((sub) => {
                    const itemSub = document.createElement("div");
                    itemSub.style.padding = "8px 12px";
                    itemSub.style.margin = "6px 0";
                    itemSub.style.borderRadius = "4px";
                    itemSub.style.backgroundColor = "#f8fafc";
                    itemSub.style.borderLeft = "3px solid #3b82f6";
                    itemSub.style.display = "flex";
                    itemSub.style.justifyContent = "space-between";
                    itemSub.style.alignItems = "center";
                    itemSub.style.fontSize = "0.9rem";
                    itemSub.innerHTML = `
                        <span style="color: #334155; font-weight: 500;">🔹 ${sub.nombre_menu}</span>
                        <span style="font-size: 0.75rem; color: #94a3b8; font-family: monospace;">ID: ${sub.id_final}</span>
                    `;
                    cuerpoSubmenus.appendChild(itemSub);
                });
            }

            cardMenu.appendChild(cuerpoSubmenus);
            listaJerarquia.appendChild(cardMenu);
        });

        // Paso 2: Dibujar Controles de la Paginación (solo si hay más de 1 página)
        if (totalPaginas > 1) {
            // Botón Anterior
            const btnPrev = document.createElement("button");
            btnPrev.innerText = "◀ Anterior";
            btnPrev.disabled = paginaActual === 1;
            btnPrev.style.padding = "8px 16px";
            btnPrev.style.border = "1px solid #cbd5e1";
            btnPrev.style.borderRadius = "4px";
            btnPrev.style.backgroundColor = paginaActual === 1 ? "#f1f5f9" : "#ffffff";
            btnPrev.style.color = paginaActual === 1 ? "#94a3b8" : "#334155";
            btnPrev.style.cursor = paginaActual === 1 ? "not-allowed" : "pointer";
            btnPrev.style.fontSize = "0.9rem";
            btnPrev.style.fontWeight = "500";
            btnPrev.onclick = () => {
                if (paginaActual > 1) {
                    paginaActual--;
                    renderizarPaginaActual();
                }
            };

            // Indicador de Progreso
            const txtInfo = document.createElement("span");
            txtInfo.style.fontSize = "0.9rem";
            txtInfo.style.color = "#475569";
            txtInfo.style.fontWeight = "600";
            txtInfo.innerText = `Página ${paginaActual} de ${totalPaginas}`;

            // Botón Siguiente
            const btnNext = document.createElement("button");
            btnNext.innerText = "Siguiente ▶";
            btnNext.disabled = paginaActual === totalPaginas;
            btnNext.style.padding = "8px 16px";
            btnNext.style.border = "1px solid #cbd5e1";
            btnNext.style.borderRadius = "4px";
            btnNext.style.backgroundColor = paginaActual === totalPaginas ? "#f1f5f9" : "#ffffff";
            btnNext.style.color = paginaActual === totalPaginas ? "#94a3b8" : "#334155";
            btnNext.style.cursor = paginaActual === totalPaginas ? "not-allowed" : "pointer";
            btnNext.style.fontSize = "0.9rem";
            btnNext.style.fontWeight = "500";
            btnNext.onclick = () => {
                if (paginaActual < totalPaginas) {
                    paginaActual++;
                    renderizarPaginaActual();
                }
            };

            // Ensamblar controles
            contenedorPaginacion.appendChild(btnPrev);
            contenedorPaginacion.appendChild(txtInfo);
            contenedorPaginacion.appendChild(btnNext);
        }
    }
}