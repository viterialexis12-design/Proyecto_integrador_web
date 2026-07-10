/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA EL CRUD DE PERMISOS (permisos.js)
 * ==========================================================================
 */

// --- 1. LISTAR PERMISOS (per0000013) ---
function inicializarVerPermisos() {
    const tbody = document.getElementById("tbodyPermisos");
    const btnRefrescar = document.getElementById("btnRefrescarPermisos");
    const txtBuscar = document.getElementById("txtBuscarPermiso");

    function cargarTabla() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">⏳ Cargando permisos...</td></tr>';

        // Pasamos gestión_crud para que devuelva el listado plano completo
        fetch("Backend/controllers/permiso_controller.php?gestion_crud=true")
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    renderizarFilas(response.data);
                } else {
                    tbody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">${response.message}</td></tr>`;
                }
            }).catch(() => {
                tbody.innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Error de conexión con el servidor.</td></tr>';
            });
    }

    function renderizarFilas(permisos) {
        tbody.innerHTML = "";
        if (permisos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay permisos registrados.</td></tr>';
            return;
        }
        permisos.forEach(p => {
            const tr = document.createElement("tr");
            tr.style.borderBottom = "1px solid #e2e8f0";
            const estadoText = p.estado == 1 
                ? '<span style="color:green; font-weight:bold;">🟢 Activo</span>' 
                : '<span style="color:red; font-weight:bold;">🔴 Inactivo</span>';
            
            tr.innerHTML = `
                <td style="padding: 12px 15px;"><code>${p.id_permiso}</code></td>
                <td style="padding: 12px 15px;">
                    <b>${p.nombre_permiso}</b><br>
                    <small style="color:#7f8c8d;">${p.descripcion || ''}</small>
                </td>
                <td style="padding: 12px 15px;"><span class="badge" style="background:#e1e1e1; padding:4px 8px; border-radius:4px;">📁 ${p.nombre_menu || p.codigo_menu}</span></td>
                <td style="padding: 12px 15px;">${estadoText}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    if (btnRefrescar) btnRefrescar.onclick = cargarTabla;
    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            tbody.querySelectorAll("tr").forEach(tr => {
                tr.style.display = tr.textContent.toLowerCase().includes(term) ? "" : "none";
            });
        };
    }
    cargarTabla();
}

// --- AUXILIAR: CARGA MENÚS PARA LOS BUSCADORES PREDICTIVOS ---
function asociarBuscadorMenus(idInputTexto, idInputOculto, idContenedorSugerencias) {
    const txtMenu = document.getElementById(idInputTexto);
    const hdnMenu = document.getElementById(idInputOculto);
    const divSugerencias = document.getElementById(idContenedorSugerencias);
    if (!txtMenu || !divSugerencias) return;

    let menusLocales = [];
    // Solicitamos los menús al controlador de menús con gestión_crud
    fetch("Backend/controllers/menu_controller.php?gestion_crud=true")
        .then(res => res.json())
        .then(res => { if(res.status === "success") menusLocales = res.data; });

    txtMenu.oninput = (e) => {
        const query = e.target.value.toLowerCase().trim();
        divSugerencias.innerHTML = "";
        hdnMenu.value = ""; // Resetea el ID oculto si cambia el texto
        if (query === "") { divSugerencias.style.display = "none"; return; }

        const filtrados = menusLocales.filter(m => m.nombre.toLowerCase().includes(query) && m.estado == 1);
        filtrados.forEach(m => {
            const item = document.createElement("div");
            item.style.padding = "10px"; item.style.cursor = "pointer"; item.style.borderBottom = "1px solid #eee";
            item.innerHTML = `📁 <b>${m.nombre}</b> <small style="color:#7f8c8d;">(${m.codigo_menu})</small>`;
            item.onclick = () => {
                txtMenu.value = m.nombre;
                hdnMenu.value = m.codigo_menu;
                divSugerencias.style.display = "none";
            };
            item.onmouseenter = () => item.style.backgroundColor = "#f1f5f9";
            item.onmouseleave = () => item.style.backgroundColor = "transparent";
            divSugerencias.appendChild(item);
        });
        divSugerencias.style.display = filtrados.length ? "block" : "none";
    };

    // Cerrar sugerencias si se hace clic fuera
    document.addEventListener("click", (e) => {
        if (e.target !== txtMenu) divSugerencias.style.display = "none";
    });
}

// --- 2. CREAR PERMISO (per0000014) ---
function inicializarCrearPermiso() {
    const form = document.getElementById("formCrearPermiso");
    
    // Activamos el buscador predictivo de menús para el formulario de creación
    asociarBuscadorMenus("txtMenuAsociadoCrear", "txtMenuCodigoCrear", "sugerenciasMenuCrear");

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const codigoMenu = document.getElementById("txtMenuCodigoCrear").value;
            
            if (!codigoMenu) {
                alert("⚠️ Por favor, seleccione un menú válido de la lista de sugerencias.");
                return;
            }

            const formData = new FormData(form);
            formData.append("accion", "CREAR");

            fetch("Backend/controllers/permiso_controller.php", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("✅ Permiso creado con éxito.");
                        form.reset();
                    } else { alert("⚠️ Error: " + data.message); }
                });
        };
    }
    if (document.getElementById("btnCancelarCrearPermiso")) {
        document.getElementById("btnCancelarCrearPermiso").onclick = () => form.reset();
    }
}

// --- 3. EDITAR PERMISO (per0000015) ---
function inicializarEditarPermiso() {
    const form = document.getElementById("formEditarPermiso");
    const txtBuscar = document.getElementById("txtBuscarParaEditarPermiso");
    const sugerencias = document.getElementById("listaSugerenciasEditarPermiso");
    const contenedorForm = document.getElementById("contenedorFormEditarPermiso");
    let permisosLocales = [];

    // Cargar los permisos actuales para el buscador principal
    function recargarPermisosLocales() {
        fetch("Backend/controllers/permiso_controller.php?gestion_crud=true")
            .then(res => res.json())
            .then(res => { if(res.status === "success") permisosLocales = res.data; });
    }
    recargarPermisosLocales();

    // Activar buscador interno de cambio de menú
    asociarBuscadorMenus("txtMenuAsociadoEditar", "txtMenuCodigoEditar", "sugerenciasMenuEditar");

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";
            if (query === "") { sugerencias.style.display = "none"; return; }

            const filtrados = permisosLocales.filter(p => p.nombre_permiso.toLowerCase().includes(query));
            filtrados.forEach(p => {
                const item = document.createElement("div");
                item.style.padding = "10px"; item.style.cursor = "pointer"; item.style.borderBottom = "1px solid #eee";
                item.innerHTML = `🔑 <b>${p.nombre_permiso}</b> <small style="color:#7f8c8d;">(${p.id_permiso})</small>`;
                item.onclick = () => {
                    txtBuscar.value = p.nombre_permiso; 
                    sugerencias.style.display = "none";
                    
                    // Llenar campos del formulario
                    document.getElementById("txtEditIdPermiso").value = p.id_permiso;
                    document.getElementById("txtEditPermisoNombre").value = p.nombre_permiso;
                    document.getElementById("txtEditPermisoDesc").value = p.descripcion || "";
                    document.getElementById("txtMenuAsociadoEditar").value = p.nombre_menu || p.codigo_menu;
                    document.getElementById("txtMenuCodigoEditar").value = p.codigo_menu;
                    document.getElementById("cmbEditPermisoEstado").value = p.estado;
                    
                    contenedorForm.style.display = "block";
                };
                item.onmouseenter = () => item.style.backgroundColor = "#f1f5f9";
                item.onmouseleave = () => item.style.backgroundColor = "transparent";
                sugerencias.appendChild(item);
            });
            sugerencias.style.display = filtrados.length ? "block" : "none";
        };
    }

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            if (!document.getElementById("txtMenuCodigoEditar").value) {
                alert("⚠️ Debe seleccionar un menú contenedor válido.");
                return;
            }

            const formData = new FormData(form);
            formData.append("accion", "EDITAR");

            fetch("Backend/controllers/permiso_controller.php", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("✅ Parámetros del permiso actualizados.");
                        txtBuscar.value = ""; 
                        contenedorForm.style.display = "none";
                        recargarPermisosLocales();
                    } else { alert("⚠️ Error: " + data.message); }
                });
        };
    }
    if (document.getElementById("btnCancelarEditarPermiso")) {
        document.getElementById("btnCancelarEditarPermiso").onclick = () => { txtBuscar.value = ""; contenedorForm.style.display = "none"; };
    }
}

// --- 4. BORRAR / INACTIVAR PERMISO (per0000016) ---
function inicializarEliminarPermiso() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarPermiso");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarPermiso");
    const sugerencias = document.getElementById("listaSugerenciasEliminarPermiso");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarPermiso");
    let permisosLocales = []; 
    let idSeleccionado = null;

    function recargarPermisosLocales() {
        fetch("Backend/controllers/permiso_controller.php?gestion_crud=true")
            .then(res => res.json())
            .then(res => { if(res.status === "success") permisosLocales = res.data; });
    }
    recargarPermisosLocales();

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";
            if (query === "") { contenedorFicha.style.display = "none"; sugerencias.style.display = "none"; return; }

            const filtrados = permisosLocales.filter(p => p.nombre_permiso.toLowerCase().includes(query));
            filtrados.forEach(p => {
                const item = document.createElement("div");
                item.style.padding = "10px"; item.style.cursor = "pointer"; item.style.borderBottom = "1px solid #eee";
                item.innerHTML = `❌ <b>${p.nombre_permiso}</b>`;
                item.onclick = () => {
                    txtBuscar.value = p.nombre_permiso; sugerencias.style.display = "none"; 
                    idSeleccionado = p.id_permiso;
                    
                    document.getElementById("lblDelIdPermiso").textContent = p.id_permiso;
                    document.getElementById("lblDelPermisoNombre").textContent = p.nombre_permiso;
                    document.getElementById("lblDelPermisoDesc").textContent = p.descripcion || "Sin descripción";
                    document.getElementById("lblDelPermisoMenu").textContent = p.nombre_menu || p.codigo_menu;
                    document.getElementById("lblDelPermisoEstado").textContent = p.estado == 1 ? '🟢 Activo' : '🔴 Inactivo';
                    
                    contenedorFicha.style.display = "block";
                };
                item.onmouseenter = () => item.style.backgroundColor = "#fdf2f2";
                item.onmouseleave = () => item.style.backgroundColor = "transparent";
                sugerencias.appendChild(item);
            });
            sugerencias.style.display = filtrados.length ? "block" : "none";
        };
    }

    if (btnConfirmar) {
        btnConfirmar.onclick = () => {
            if (!idSeleccionado) return;
            const formData = new FormData();
            formData.append("id_permiso", idSeleccionado);
            formData.append("accion", "DESACTIVAR");

            fetch("Backend/controllers/permiso_controller.php", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("🔴 Permiso inactivado correctamente.");
                        txtBuscar.value = ""; contenedorFicha.style.display = "none"; idSeleccionado = null;
                        recargarPermisosLocales();
                    } else { alert("⚠️ Error: " + data.message); }
                });
        };
    }
    if (document.getElementById("btnCancelarEliminarPermiso")) {
        document.getElementById("btnCancelarEliminarPermiso").onclick = () => { txtBuscar.value = ""; contenedorFicha.style.display = "none"; idSeleccionado = null; };
    }
}