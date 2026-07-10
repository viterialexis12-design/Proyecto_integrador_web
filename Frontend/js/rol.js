/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA EL CRUD DE ROLES (roles.js)
 * ==========================================================================
 */

// --- 1. VER ROLES (per0000005) ---
function inicializarVerRoles() {
    const tbody = document.getElementById("tbodyRoles");
    const btnRefrescar = document.getElementById("btnRefrescarRoles");
    const txtBuscar = document.getElementById("txtBuscarRol");

    function cargarTabla() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">⏳ Cargando roles...</td></tr>';

        fetch("Backend/controllers/rol_controller.php")
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    renderizarFilas(response.data);
                } else {
                    tbody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">${response.message}</td></tr>`;
                }
            }).catch(() => {
                tbody.innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Error de conexión.</td></tr>';
            });
    }

    function renderizarFilas(roles) {
        tbody.innerHTML = "";
        if (roles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay roles registrados.</td></tr>';
            return;
        }
        roles.forEach(r => {
            const tr = document.createElement("tr");
            const estado = r.estado === 1 ? '<span style="color:green; font-weight:bold;">Activo</span>' : '<span style="color:red; font-weight:bold;">Inactivo</span>';
            tr.innerHTML = `
                <td style="padding: 12px 15px;">${r.id_rol}</td>
                <td style="padding: 12px 15px;"><b>${r.nombre}</b></td>
                <td style="padding: 12px 15px;">${r.descripcion || '<em style="color:#aaa;">Sin descripción</em>'}</td>
                <td style="padding: 12px 15px;">${estado}</td>
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

// --- 2. CREAR ROL (per0000006) ---
function inicializarCrearRol() {
    const form = document.getElementById("formCrearRol");
    const btnCancelar = document.getElementById("btnCancelarCrearRol");

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            formData.append("accion", "CREAR");

            fetch("Backend/controllers/rol_controller.php", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("✅ Rol registrado exitosamente.");
                        form.reset();
                    } else { alert("⚠️ Error: " + data.message); }
                });
        };
    }
    if (btnCancelar) btnCancelar.onclick = () => form.reset();
}

// --- 3. ACTUALIZAR ROL (per0000007) ---
function inicializarEditarRol() {
    const form = document.getElementById("formEditarRol");
    const txtBuscar = document.getElementById("txtBuscarParaEditarRol");
    const sugerencias = document.getElementById("listaSugerenciasEditarRol");
    const contenedorForm = document.getElementById("contenedorFormEditarRol");
    let rolesLocales = [];

    fetch("Backend/controllers/rol_controller.php").then(res => res.json()).then(res => { if(res.status==="success") rolesLocales = res.data; });

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";
            if (query === "") { sugerencias.style.display = "none"; return; }

            const filtrados = rolesLocales.filter(r => r.nombre.toLowerCase().includes(query));
            filtrados.forEach(r => {
                const item = document.createElement("div");
                item.style.padding = "10px"; item.style.cursor = "pointer"; item.style.borderBottom = "1px solid #eee";
                item.innerHTML = `🔑 <b>${r.nombre}</b>`;
                item.onclick = () => {
                    txtBuscar.value = r.nombre; sugerencias.style.display = "none";
                    document.getElementById("txtEditIdRol").value = r.id_rol;
                    document.getElementById("txtEditRolNombre").value = r.nombre;
                    document.getElementById("txtEditRolDescripcion").value = r.descripcion || '';
                    document.getElementById("cmbEditRolEstado").value = r.estado;
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

            fetch("Backend/controllers/rol_controller.php", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("✅ Rol actualizado correctamente.");
                        txtBuscar.value = ""; contenedorForm.style.display = "none";
                        fetch("Backend/controllers/rol_controller.php").then(res => res.json()).then(res => { if(res.status==="success") rolesLocales = res.data; });
                    } else { alert("⚠️ Error: " + data.message); }
                });
        };
    }
    if (document.getElementById("btnCancelarEditarRol")) {
        document.getElementById("btnCancelarEditarRol").onclick = () => { txtBuscar.value = ""; contenedorForm.style.display = "none"; };
    }
}

// --- 4. BORRAR/INACTIVAR ROL (per0000008) ---
function inicializarEliminarRol() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarRol");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarRol");
    const sugerencias = document.getElementById("listaSugerenciasEliminarRol");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarRol");
    let rolesLocales = []; let idSeleccionado = null;

    fetch("Backend/controllers/rol_controller.php").then(res => res.json()).then(res => { if(res.status==="success") rolesLocales = res.data; });

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";
            if (query === "") { contenedorFicha.style.display = "none"; sugerencias.style.display = "none"; return; }

            const filtrados = rolesLocales.filter(r => r.nombre.toLowerCase().includes(query));
            filtrados.forEach(r => {
                const item = document.createElement("div");
                item.style.padding = "10px"; item.style.cursor = "pointer"; item.style.borderBottom = "1px solid #eee";
                item.innerHTML = `❌ <b>${r.nombre}</b>`;
                item.onclick = () => {
                    txtBuscar.value = r.nombre; sugerencias.style.display = "none"; idSeleccionado = r.id_rol;
                    document.getElementById("lblDelIdRol").textContent = r.id_rol;
                    document.getElementById("lblDelRolNombre").textContent = r.nombre;
                    document.getElementById("lblDelRolDesc").textContent = r.descripcion || 'Sin descripción';
                    document.getElementById("lblDelRolEstado").textContent = r.estado === 1 ? 'Activo' : 'Inactivo';
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
            formData.append("id_rol", idSeleccionado);
            formData.append("accion", "DESACTIVAR");

            fetch("Backend/controllers/rol_controller.php", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("🔴 Rol inhabilitado correctamente.");
                        txtBuscar.value = ""; contenedorFicha.style.display = "none"; idSeleccionado = null;
                        fetch("Backend/controllers/rol_controller.php").then(res => res.json()).then(res => { if(res.status==="success") rolesLocales = res.data; });
                    } else { alert("⚠️ Error: " + data.message); }
                });
        };
    }
    if (document.getElementById("btnCancelarEliminarRol")) {
        document.getElementById("btnCancelarEliminarRol").onclick = () => { txtBuscar.value = ""; contenedorFicha.style.display = "none"; idSeleccionado = null; };
    }
}