/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA EL CRUD DE MENÚS (menus.js)
 * ==========================================================================
 */

// --- 1. LISTAR MENÚS (per0000013) ---
function inicializarVerMenus() {
    const tbody = document.getElementById("tbodyMenus");
    const btnRefrescar = document.getElementById("btnRefrescarMenus");
    const txtBuscar = document.getElementById("txtBuscarMenu");

    function cargarTabla() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">⏳ Cargando menús...</td></tr>';

       fetch("Backend/controllers/menu_controller.php?gestion_crud=true")
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    renderizarFilas(response.data);
                } else {
                    tbody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">${response.message}</td></tr>`;
                }
            }).catch(() => {
                tbody.innerHTML = '<tr><td colspan="5" style="color:red; text-align:center;">Error de conexión con el servidor.</td></tr>';
            });
    }

    function renderizarFilas(menus) {
        tbody.innerHTML = "";
        if (menus.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay menús registrados.</td></tr>';
            return;
        }
        menus.forEach(m => {
            const tr = document.createElement("tr");
            const estadoText = m.estado === 1 ? '<span style="color:green; font-weight:bold;">Activo</span>' : '<span style="color:red; font-weight:bold;">Inactivo</span>';
            tr.innerHTML = `
                <td style="padding: 12px;">${m.codigo_menu}</td>
                <td style="padding: 12px;"><b>${m.nombre}</b></td>
                <td style="padding: 12px;">${m.descripcion}</td>
                <td style="padding: 12px;">${estadoText}</td>
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

// --- 2. CREAR MENÚ (per0000014) ---
function inicializarCrearMenu() {
    const form = document.getElementById("formCrearMenu");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            formData.append("accion", "CREAR");

            fetch("Backend/controllers/menu_controller.php?gestion_crud=true", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("✅ Módulo/Menú creado con éxito.");
                        form.reset();
                    } else { alert("⚠️ Error: " + data.message); }
                });
        };
    }
    if (document.getElementById("btnCancelarCrearMenu")) {
        document.getElementById("btnCancelarCrearMenu").onclick = () => form.reset();
    }
}

// --- 3. EDITAR MENÚ (per0000015) ---
function inicializarEditarMenu() {
    const form = document.getElementById("formEditarMenu");
    const txtBuscar = document.getElementById("txtBuscarParaEditarMenu");
    const sugerencias = document.getElementById("listaSugerenciasEditarMenu");
    const contenedorForm = document.getElementById("contenedorFormEditarMenu");
    let menusLocales = [];

    fetch("Backend/controllers/menu_controller.php?gestion_crud=true").then(res => res.json()).then(res => { if(res.status==="success") menusLocales = res.data; });

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";
            if (query === "") { sugerencias.style.display = "none"; return; }

            const filtrados = menusLocales.filter(m => m.nombre.toLowerCase().includes(query));
            filtrados.forEach(m => {
                const item = document.createElement("div");
                item.style.padding = "10px"; item.style.cursor = "pointer"; item.style.borderBottom = "1px solid #eee";
                item.innerHTML = `📁 <b>${m.nombre}</b> <small style="color:#7f8c8d;">(${m.codigo_menu})</small>`;
                item.onclick = () => {
                    txtBuscar.value = m.nombre; sugerencias.style.display = "none";
                    document.getElementById("txtEditCodigoMenu").value = m.codigo_menu;
                    document.getElementById("txtEditMenuNombre").value = m.nombre;
                    document.getElementById("txtEditMenuDescripcion").value = m.descripcion;
                    document.getElementById("cmbEditMenuEstado").value = m.estado;
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
            const formData = new FormData(form);
            formData.append("accion", "EDITAR");

            fetch("Backend/controllers/menu_controller.php?gestion_crud=true", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("✅ Estructura de menú actualizada.");
                        txtBuscar.value = ""; contenedorForm.style.display = "none";
                        fetch("Backend/controllers/menu_controller.php?gestion_crud=true").then(res => res.json()).then(res => { if(res.status==="success") menusLocales = res.data; });
                    } else { alert("⚠️ Error: " + data.message); }
                });
        };
    }
    if (document.getElementById("btnCancelarEditarMenu")) {
        document.getElementById("btnCancelarEditarMenu").onclick = () => { txtBuscar.value = ""; contenedorForm.style.display = "none"; };
    }
}

// --- 4. BORRAR/INACTIVAR MENÚ (per0000016) ---
function inicializarEliminarMenu() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarMenu");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarMenu");
    const sugerencias = document.getElementById("listaSugerenciasEliminarMenu");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarMenu");
    let menusLocales = []; let idSeleccionado = null;

    fetch("Backend/controllers/menu_controller.php?gestion_crud=true").then(res => res.json()).then(res => { if(res.status==="success") menusLocales = res.data; });

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";
            if (query === "") { contenedorFicha.style.display = "none"; sugerencias.style.display = "none"; return; }

            const filtrados = menusLocales.filter(m => m.nombre.toLowerCase().includes(query));
            filtrados.forEach(m => {
                const item = document.createElement("div");
                item.style.padding = "10px"; item.style.cursor = "pointer"; item.style.borderBottom = "1px solid #eee";
                item.innerHTML = `❌ <b>${m.nombre}</b>`;
                item.onclick = () => {
                    txtBuscar.value = m.nombre; sugerencias.style.display = "none"; idSeleccionado = m.codigo_menu;
                    document.getElementById("lblDelCodigoMenu").textContent = m.codigo_menu;
                    document.getElementById("lblDelMenuNombre").textContent = m.nombre;
                    document.getElementById("lblDelMenuDescripcion").textContent = m.descripcion;
                    document.getElementById("lblDelMenuEstado").textContent = m.estado === 1 ? 'Activo' : 'Inactivo';
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
            formData.append("codigo_menu", idSeleccionado);
            formData.append("accion", "DESACTIVAR");

            fetch("Backend/controllers/menu_controller.php?gestion_crud=true", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("🔴 Módulo inhabilitado del menú.");
                        txtBuscar.value = ""; contenedorFicha.style.display = "none"; idSeleccionado = null;
                        fetch("Backend/controllers/menu_controller.php?gestion_crud=true").then(res => res.json()).then(res => { if(res.status==="success") menusLocales = res.data; });
                    } else { alert("⚠️ Error: " + data.message); }
                });
        };
    }
    if (document.getElementById("btnCancelarEliminarMenu")) {
        document.getElementById("btnCancelarEliminarMenu").onclick = () => { txtBuscar.value = ""; contenedorFicha.style.display = "none"; idSeleccionado = null; };
    }
}