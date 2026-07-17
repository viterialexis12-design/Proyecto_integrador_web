document.addEventListener("DOMContentLoaded", () => {
    inicializarEditarPermiso();
});
function inicializarEditarPermiso() {
    const txtBuscarRol = document.getElementById("txtBuscarRolPermiso");
    const sugerenciasRol = document.getElementById("listaSugerenciasRol");
    const formMatriz = document.getElementById("formMatrizPermisos");
    const txtRolId = document.getElementById("txtRolSeleccionadoId");
    const listaModulos = document.getElementById("listaModulosEdicion");
    const contenedorPaginacion = document.getElementById("paginacionEdicionPermisos");

    const RUTA_ROL_CONTROLLER = "../../../Backend/controllers/rol_controller.php";
    const RUTA_PERMISO_CONTROLLER = "../../../Backend/controllers/permiso_controller.php";

    let rolesLocales = [];

    // Configuración de Paginación y Estado Persistente
    const ITEMS_POR_PAGINA = 6;
    let paginaActual = 1;
    let bloquesModulosProcesados = []; // Estructura jerárquica de módulos
    let estadoPermisosTemporales = {}; // Guarda { id_menu: true/false } para persistir cambios entre páginas

    // 1. Descargar catálogo completo en memoria para búsquedas instantáneas
    fetch(RUTA_ROL_CONTROLLER)
        .then((res) => res.json())
        .then((response) => {
            if (response.status === "success") {
                rolesLocales = response.data;
            }
        })
        .catch((err) => console.error("Error cargando roles:", err));

    // 2. Evento de escritura del Buscador Predictivo
    if (txtBuscarRol) {
        txtBuscarRol.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerenciasRol.innerHTML = "";

            if (query === "") {
                sugerenciasRol.style.display = "none";
                return;
            }

            const filtrados = rolesLocales.filter(
                (rol) =>
                    (rol.nombre || "").toLowerCase().includes(query) ||
                    (rol.descripcion || "").toLowerCase().includes(query)
            );

            filtrados.forEach((rol) => {
                const item = document.createElement("div");
                item.style.padding = "10px 15px";
                item.style.cursor = "pointer";
                item.style.borderBottom = "1px solid #f1f5f9";
                item.innerHTML = `👤 <b>${rol.nombre}</b> <br> <small style="color:#64748b;">${rol.descripcion || "Sin descripción"}</small>`;

                item.onclick = () => {
                    txtBuscarRol.value = rol.nombre;
                    sugerenciasRol.style.display = "none";
                    txtRolId.value = rol.id;
                    paginaActual = 1; // Reiniciamos a la primera página con cada búsqueda
                    estadoPermisosTemporales = {}; // Reiniciamos el estado persistente

                    cargarEstructuraYPermisos(rol.id);
                };

                item.onmouseenter = () => (item.style.backgroundColor = "#f8fafc");
                item.onmouseleave = () => (item.style.backgroundColor = "transparent");
                sugerenciasRol.appendChild(item);
            });

            sugerenciasRol.style.display = filtrados.length ? "block" : "none";
        };

        document.addEventListener("click", (e) => {
            if (e.target !== txtBuscarRol) sugerenciasRol.style.display = "none";
        });
    }

    // 3. Obtener combinatoria completa de Menús
    function cargarEstructuraYPermisos(idRol) {
        listaModulos.innerHTML =
            '<div style="grid-column:1/-1; text-align:center; color:#64748b; padding:20px;">⏳ Cargando matriz interactiva...</div>';
        contenedorPaginacion.innerHTML = "";
        formMatriz.style.display = "block";

        fetch(`${RUTA_PERMISO_CONTROLLER}?id_rol_matriz=${idRol}`)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success") {
                    // Inicializar el estado de los permisos en memoria temporal
                    response.data.forEach((item) => {
                        const idMenu = parseInt(item.id_menu_catalogo, 10);
                        estadoPermisosTemporales[idMenu] = parseInt(item.tiene_permiso, 10) === 1;
                    });

                    procesarEstructuraJerarquica(response.data);
                    renderizarMatrizCheckboxes(parseInt(idRol, 10));
                } else {
                    listaModulos.innerHTML = `<div style="grid-column:1/-1; color:#ef4444; padding:20px;">⚠️ ${response.message}</div>`;
                }
            })
            .catch(() => {
                listaModulos.innerHTML = '<div style="grid-column:1/-1; color:#ef4444; padding:20px;">❌ Error al conectar con el servidor.</div>';
            });
    }

    // 4. Procesar la estructura en jerarquía (Bloques y submenús)
    function procesarEstructuraJerarquica(data) {
        bloquesModulosProcesados = [];
        const mapasPadres = {};
        const submenusHuerfanos = [];

        data.forEach((item) => {
            const idPadre = item.id_menuPadre ? parseInt(item.id_menuPadre, 10) : 0;
            const idMenu = parseInt(item.id_menu_catalogo, 10);

            if (idPadre === 0) {
                mapasPadres[idMenu] = {
                    id_menu: idMenu,
                    nombre_menu: item.nombre_menu,
                    submenus: [],
                };
            } else {
                submenusHuerfanos.push({
                    id_menu: idMenu,
                    id_padre: idPadre,
                    nombre_menu: item.nombre_menu,
                });
            }
        });

        submenusHuerfanos.forEach((sub) => {
            if (mapasPadres[sub.id_padre]) {
                mapasPadres[sub.id_padre].submenus.push(sub);
            }
        });

        Object.keys(mapasPadres).forEach((key) => {
            bloquesModulosProcesados.push(mapasPadres[key]);
        });
    }

    // 5. Dibujar la estructura paginada con persistencia de estados
    function renderizarMatrizCheckboxes(idRolActual) {
        listaModulos.innerHTML = "";
        contenedorPaginacion.innerHTML = "";

        if (bloquesModulosProcesados.length === 0) {
            listaModulos.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#64748b; padding:20px;">No hay módulos de menú cargados en el sistema.</div>';
            return;
        }

        // Segmentar módulos por página
        const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
        const indiceFin = indiceInicio + ITEMS_POR_PAGINA;
        const itemsPagina = bloquesModulosProcesados.slice(indiceInicio, indiceFin);
        const totalPaginas = Math.ceil(bloquesModulosProcesados.length / ITEMS_POR_PAGINA);

        itemsPagina.forEach((bloque) => {
            const idBloquePadre = parseInt(bloque.id_menu, 10);
            const cardMenu = document.createElement("div");
            cardMenu.style.background = "#ffffff";
            cardMenu.style.border = "1px solid #e2e8f0";
            cardMenu.style.borderRadius = "8px";
            cardMenu.style.overflow = "hidden";
            cardMenu.style.display = "flex";
            cardMenu.style.flexDirection = "column";

            // Determinar si el elemento padre es intocable (Módulo de Permisos = ID 4)
            const esPadreProtegido = idRolActual === 1 && idBloquePadre === 4;
            // Leer estado desde el almacén temporal de memoria
            const isPadreChecked = estadoPermisosTemporales[idBloquePadre] || esPadreProtegido;

            const headerPadre = document.createElement("div");
            headerPadre.style.backgroundColor = "#f1f5f9";
            headerPadre.style.padding = "12px 15px";
            headerPadre.style.borderBottom = "1px solid #e2e8f0";
            headerPadre.style.display = "flex";
            headerPadre.style.alignItems = "center";
            headerPadre.style.justifyContent = "space-between";

            headerPadre.innerHTML = `
                <label style="font-weight: bold; color: #1e293b; display: flex; align-items: center; gap: 8px; cursor:${esPadreProtegido ? "not-allowed" : "pointer"}; margin: 0;">
                    <input type="checkbox" data-id="${idBloquePadre}" class="chk-padre chk-padre-${idBloquePadre}" 
                           ${isPadreChecked ? "checked" : ""} 
                           ${esPadreProtegido ? "disabled" : ""}>
                    📁 ${bloque.nombre_menu} ${esPadreProtegido ? '<small style="color:#ef4444;">(Requerido)</small>' : ""}
                </label>
                <span style="font-size: 0.75rem; background: #cbd5e1; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Módulo</span>
            `;

            cardMenu.appendChild(headerPadre);

            const cuerpoSubmenus = document.createElement("div");
            cuerpoSubmenus.style.padding = "12px 15px";
            cuerpoSubmenus.style.flexGrow = "1";

            if (bloque.submenus.length === 0) {
                cuerpoSubmenus.innerHTML = `<div style="color: #94a3b8; font-size: 0.85rem; font-style: italic;">Sin submenús asignados</div>`;
            } else {
                bloque.submenus.forEach((sub) => {
                    const idHijo = parseInt(sub.id_menu, 10);
                    // Regla de congelamiento para SA (1): "Ver Permisos" (18) y "Actualizar Permiso" (20)
                    const esHijoProtegido = idRolActual === 1 && (idHijo === 18 || idHijo === 20);
                    const isHijoChecked = estadoPermisosTemporales[idHijo] || esHijoProtegido;

                    const itemSub = document.createElement("div");
                    itemSub.style.padding = "6px 0";
                    itemSub.innerHTML = `
                        <label style="color: #334155; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; cursor:${esHijoProtegido ? "not-allowed" : "pointer"}; margin: 0;">
                            <input type="checkbox" data-id="${idHijo}" class="chk-hijo chk-hijo-de-${idBloquePadre}" 
                                   ${isHijoChecked ? "checked" : ""} 
                                   ${esHijoProtegido ? "disabled" : ""}>
                            🔹 ${sub.nombre_menu} ${esHijoProtegido ? '<b style="color:#ef4444; font-size:0.75rem;">(Protegido)</b>' : ""}
                        </label>
                    `;

                    cuerpoSubmenus.appendChild(itemSub);
                });
            }

            cardMenu.appendChild(cuerpoSubmenus);
            listaModulos.appendChild(cardMenu);

            // --- LÓGICA DE ACTUALIZACIÓN DEL ESTADO TEMPORAL Y CASCADA INTERACTIVA ---
            const chkPadre = headerPadre.querySelector(`.chk-padre-${idBloquePadre}`);
            const chksHijos = cuerpoSubmenus.querySelectorAll(`.chk-hijo-de-${idBloquePadre}:not([disabled])`);

            if (chkPadre && !chkPadre.disabled) {
                chkPadre.addEventListener("change", function () {
                    const status = this.checked;
                    // Sincronizar en el estado temporal general de la memoria
                    estadoPermisosTemporales[idBloquePadre] = status;

                    chksHijos.forEach((ch) => {
                        ch.checked = status;
                        const idHijo = parseInt(ch.dataset.id, 10);
                        estadoPermisosTemporales[idHijo] = status;
                    });
                });
            }

            chksHijos.forEach((chkHijo) => {
                chkHijo.addEventListener("change", function () {
                    const idHijo = parseInt(this.dataset.id, 10);
                    estadoPermisosTemporales[idHijo] = this.checked;

                    if (this.checked && chkPadre) {
                        chkPadre.checked = true;
                        estadoPermisosTemporales[idBloquePadre] = true;
                    }
                });
            });
        });

        // Dibujar botones de control de paginación
        if (totalPaginas > 1) {
            // Botón Anterior
            const btnPrev = document.createElement("button");
            btnPrev.type = "button";
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
                    renderizarMatrizCheckboxes(idRolActual);
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
            btnNext.type = "button";
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
                    renderizarMatrizCheckboxes(idRolActual);
                }
            };

            contenedorPaginacion.appendChild(btnPrev);
            contenedorPaginacion.appendChild(txtInfo);
            contenedorPaginacion.appendChild(btnNext);
        }
    }

    // 6. Envío Consolidado al Servidor (Poder de guardado sin pérdidas)
    formMatriz.onsubmit = (e) => {
        e.preventDefault();

        const idRolActual = parseInt(txtRolId.value, 10);
        
        // Creamos un nuevo FormData vacío
        const formData = new FormData();
        formData.append("id_rol", idRolActual);
        formData.append("accion", "GUARDAR_MATRIZ");

        // Reglas de protección estáticas al guardar por seguridad (para SuperAdministrador)
        if (idRolActual === 1) {
            estadoPermisosTemporales[4] = true;  // Módulo de permisos principal
            estadoPermisosTemporales[18] = true; // Submenú ver permisos
            estadoPermisosTemporales[20] = true; // Submenú actualizar permisos
        }

        // Añadimos solo los IDs que se encuentren marcados en nuestra memoria temporal
        let tieneAlgúnPermiso = false;
        Object.keys(estadoPermisosTemporales).forEach((idMenu) => {
            if (estadoPermisosTemporales[idMenu] === true) {
                formData.append("menus[]", idMenu);
                tieneAlgúnPermiso = true;
            }
        });

        if (!tieneAlgúnPermiso) {
            if (!confirm("⚠️ Has desmarcado todos los menús. El rol se quedará sin accesos. ¿Deseas continuar?")) {
                return;
            }
        }

        fetch(RUTA_PERMISO_CONTROLLER, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    alert("✅ Matriz de permisos actualizada exitosamente para el rol.");
                    if (window.parent) {
                            window.parent.postMessage("refrescarMenuLateral", "*");
                        }
                    const evento = new CustomEvent("cambioPermisos");
                    document.dispatchEvent(evento);

                    cargarEstructuraYPermisos(txtRolId.value);
                } else {
                    alert("⚠️ Error: " + data.message);
                }
            })
            .catch(() => alert("❌ Hubo un fallo al intentar actualizar la matriz de permisos."));
    };

    document.getElementById("btnCancelarMatriz").onclick = () => {
        txtBuscarRol.value = "";
        txtRolId.value = "";
        formMatriz.style.display = "none";
        estadoPermisosTemporales = {};
    };
}