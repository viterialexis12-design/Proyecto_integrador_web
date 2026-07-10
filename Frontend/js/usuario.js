// --- 1. FUNCIÓN PARA EL LISTADO (ver_usuarios.html) ---
function inicializarVerUsuarios() {
    const tbody = document.getElementById("tbodyUsuarios");
    const btnRefrescar = document.getElementById("btnRefrescarUsuarios");
    const txtBuscar = document.getElementById("txtBuscarUsuario");

    function cargarTabla() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">⏳ Cargando usuarios...</td></tr>';

        fetch("Backend/controllers/usuario_controller.php")
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    renderizarFilas(response.data);
                } else {
                    tbody.innerHTML = `<tr><td colspan="8" style="color:red; text-align:center;">${response.message}</td></tr>`;
                }
            })
            .catch(err => {
                console.error(err);
                tbody.innerHTML = '<tr><td colspan="8" style="color:red; text-align:center;">Error al conectar con el servidor.</td></tr>';
            });
    }

    function renderizarFilas(usuarios) {
        tbody.innerHTML = "";
        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay usuarios registrados.</td></tr>';
            return;
        }

        usuarios.forEach(u => {
            const tr = document.createElement("tr");
            const estadoTexto = u.estado === '1' ? '<span style="color:green; font-weight:bold;">Activo</span>' : '<span style="color:red; font-weight:bold;">Inactivo</span>';
            
            tr.innerHTML = `
                <td style="padding: 12px 15px;">${u.id_usuario}</td>
                <td style="padding: 12px 15px;">${u.nombre1} ${u.apellido1}</td>
                <td style="padding: 12px 15px;">${u.cedula}</td>
                <td style="padding: 12px 15px;">${u.correo}</td>
                <td style="padding: 12px 15px;">${u.username}</td>
                <td style="padding: 12px 15px;">${u.nombre_rol || 'Sin Rol'}</td>
                <td style="padding: 12px 15px;">${estadoTexto}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Eventos de la lista
    if (btnRefrescar) btnRefrescar.onclick = cargarTabla;
    
    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const termino = e.target.value.toLowerCase();
            const filas = tbody.querySelectorAll("tr");
            filas.forEach(fila => {
                const textoFila = fila.textContent.toLowerCase();
                fila.style.display = textoFila.includes(termino) ? "" : "none";
            });
        };
    }

    cargarTabla();
}

// --- 2. FUNCIÓN PARA CREAR (crear_usuario.html) ---
function inicializarCrearUsuario() {
    const form = document.getElementById("formCrearUsuario");
    const cmbRol = document.getElementById("cmbRol");
    const btnCancelar = document.getElementById("btnCancelarUsuario");

    if (cmbRol) {
        fetch("Backend/controllers/rol_controller.php")
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    cmbRol.innerHTML = '<option value="">-- Seleccione un Rol --</option>';
                    response.data.forEach(rol => {
                        cmbRol.innerHTML += `<option value="${rol.id_rol}">${rol.nombre}</option>`;
                    });
                }
            });
    }

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            fetch("Backend/controllers/usuario_controller.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    alert("✅ Usuario registrado con éxito.");
                    form.reset();

                    cargarVistaModuloGenerica('MENU000001', 'PER0000001');
                } else {
                    alert("⚠️ Error: " + data.message);
                }
            });
        };
    }

    if (btnCancelar) {
        btnCancelar.onclick = () => cargarVistaModuloGenerica('MENU000001', 'PER0000001');
    }
}

function prepararEdicionUsuario(idUsuario) {
    // Almacenamos temporalmente en sessionStorage el ID del usuario a editar
    sessionStorage.setItem("id_usuario_editar", idUsuario);
    // Saltamos al formulario de edición (PERM0000003)
    cargarVistaModuloGenerica('MNU0000001', 'PERM000003');
}

function prepararEliminacionUsuario(idUsuario) {
    sessionStorage.setItem("id_usuario_eliminar", idUsuario);
    // Saltamos a la pantalla de confirmación de baja (PERM0000004)
    cargarVistaModuloGenerica('MNU0000001', 'PERM000004');
}
// ==========================================================================
// 💡 NUEVA LOGICA PARA EDITAR CON BUSCADOR PROPIO (per0000002.html)
// ==========================================================================
function inicializarEditarUsuario() {
    const form = document.getElementById("formEditarUsuario");
    const cmbRol = document.getElementById("cmbEditRol");
    const btnCancelar = document.getElementById("btnCancelarEditarUsuario");
    
    const txtBuscar = document.getElementById("txtBuscarParaEditar");
    const contenedorSugerencias = document.getElementById("listaSugerenciasEditar");
    const contenedorForm = document.getElementById("contenedorFormEditar");

    let usuariosLocales = []; // Almacenará la lista temporal para filtrar rápido

    // 1. Cargar roles primero
    if (cmbRol) {
        fetch("Backend/controllers/rol_controller.php")
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    cmbRol.innerHTML = '<option value="">-- Seleccione un Rol --</option>';
                    response.data.forEach(rol => {
                        cmbRol.innerHTML += `<option value="${rol.id_rol}">${rol.nombre}</option>`;
                    });
                    // Una vez listos los roles, descargamos el catálogo de usuarios para buscar
                    cargarCatalogoUsuarios();
                }
            });
    }

    function cargarCatalogoUsuarios() {
        fetch("Backend/controllers/usuario_controller.php")
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    usuariosLocales = response.data;
                }
            });
    }

    // 2. Escuchar lo que escribe el usuario en la barra
    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            contenedorSugerencias.innerHTML = "";
            
            if (query === "") {
                contenedorSugerencias.style.display = "none";
                return;
            }

            // Filtrar coincidencias por nombre, apellido, cédula o username
            const filtrados = usuariosLocales.filter(u => 
                u.nombre1.toLowerCase().includes(query) || 
                u.apellido1.toLowerCase().includes(query) || 
                u.cedula.includes(query) || 
                u.username.toLowerCase().includes(query)
            );

            if (filtrados.length === 0) {
                contenedorSugerencias.innerHTML = `<div style="padding: 10px; color: #95a5a6; font-style: italic;">No se encontraron resultados</div>`;
            } else {
                filtrados.forEach(u => {
                    const item = document.createElement("div");
                    item.style.padding = "10px 15px";
                    item.style.cursor = "pointer";
                    item.style.borderBottom = "1px solid #f1f5f9";
                    item.innerHTML = `👤 <b>${u.nombre1} ${u.apellido1}</b> <small style="color:#7f8c8d;">(${u.cedula} - ${u.username})</small>`;
                    
                    // Al hacer clic en una sugerencia, rellenamos el formulario y lo mostramos
                    item.onclick = () => {
                        txtBuscar.value = `${u.nombre1} ${u.apellido1} (${u.username})`;
                        contenedorSugerencias.style.display = "none";
                        cargarUsuarioEnFormulario(u.id_usuario);
                    };
                    
                    // Efecto hover visual
                    item.onmouseenter = () => item.style.backgroundColor = "#f1f5f9";
                    item.onmouseleave = () => item.style.backgroundColor = "transparent";
                    
                    contenedorSugerencias.appendChild(item);
                });
            }
            contenedorSugerencias.style.display = "block";
        };
    }

    function cargarUsuarioEnFormulario(idUsuario) {
        fetch(`Backend/controllers/usuario_controller.php?id=${idUsuario}`)
            .then(res => res.json())
            .then(response => {
                if (response.status === "success" && response.data) {
                    const u = response.data;
                    document.getElementById("txtEditIdUsuario").value = u.id_usuario;
                    document.getElementById("txtEditNombre1").value = u.nombre1;
                    document.getElementById("txtEditNombre2").value = u.nombre2 || '';
                    document.getElementById("txtEditApellido1").value = u.apellido1;
                    document.getElementById("txtEditApellido2").value = u.apellido2 || '';
                    document.getElementById("txtEditCedula").value = u.cedula;
                    document.getElementById("txtEditFechaNac").value = u.fecha_nacimiento || '';
                    document.getElementById("txtEditTelefono").value = u.telefono || '';
                    document.getElementById("txtEditCorreo").value = u.correo;
                    document.getElementById("txtEditUsername").value = u.username;
                    document.getElementById("cmbEditRol").value = u.id_rol;
                    document.getElementById("cmbEditEstado").value = u.estado;

                    contenedorForm.style.display = "block"; // Desplegamos el formulario
                }
            });
    }

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            formData.append("accion", "EDITAR");

            fetch("Backend/controllers/usuario_controller.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    alert("✅ Usuario actualizado correctamente.");
                    txtBuscar.value = "";
                    contenedorForm.style.display = "none";
                    cargarCatalogoUsuarios(); // Recargar caché
                } else {
                    alert("⚠️ Error: " + data.message);
                }
            });
        };
    }

    if (btnCancelar) {
        btnCancelar.onclick = () => {
            txtBuscar.value = "";
            contenedorForm.style.display = "none";
        };
    }
}

// ==========================================================================
// 💡 NUEVA LOGICA PARA BORRAR CON BUSCADOR PROPIO (per0000003.html)
// ==========================================================================
function inicializarEliminarUsuario() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminar");
    const btnCancelar = document.getElementById("btnCancelarEliminar");
    const txtBuscar = document.getElementById("txtBuscarParaEliminar");
    const contenedorSugerencias = document.getElementById("listaSugerenciasEliminar");
    const contenedorFicha = document.getElementById("contenedorFichaEliminar");

    let usuariosLocales = [];
    let idSeleccionado = null;

    // Cargar catálogo inicial de usuarios activos o globales
    fetch("Backend/controllers/usuario_controller.php")
        .then(res => res.json())
        .then(response => {
            if (response.status === "success") usuariosLocales = response.data;
        });

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            contenedorSugerencias.innerHTML = "";
            
            if (query === "") {
                contenedorSugerencias.style.display = "none";
                return;
            }

            const filtrados = usuariosLocales.filter(u => 
                u.nombre1.toLowerCase().includes(query) || 
                u.apellido1.toLowerCase().includes(query) || 
                u.cedula.includes(query) || 
                u.username.toLowerCase().includes(query)
            );

            if (filtrados.length === 0) {
                contenedorSugerencias.innerHTML = `<div style="padding: 10px; color: #95a5a6; font-style: italic;">No se encontraron resultados</div>`;
            } else {
                filtrados.forEach(u => {
                    const item = document.createElement("div");
                    item.style.padding = "10px 15px";
                    item.style.cursor = "pointer";
                    item.style.borderBottom = "1px solid #f1f5f9";
                    item.innerHTML = `❌ <b>${u.nombre1} ${u.apellido1}</b> <small style="color:#e74c3c;">(${u.username})</small>`;
                    
                    item.onclick = () => {
                        txtBuscar.value = `${u.nombre1} ${u.apellido1}`;
                        contenedorSugerencias.style.display = "none";
                        idSeleccionado = u.id_usuario;
                        mostrarFichaBaja(u.id_usuario);
                    };

                    item.onmouseenter = () => item.style.backgroundColor = "#fdf2f2";
                    item.onmouseleave = () => item.style.backgroundColor = "transparent";
                    contenedorSugerencias.appendChild(item);
                });
            }
            contenedorSugerencias.style.display = "block";
        };
    }

    function mostrarFichaBaja(idUsuario) {
        fetch(`Backend/controllers/usuario_controller.php?id=${idUsuario}`)
            .then(res => res.json())
            .then(response => {
                if (response.status === "success" && response.data) {
                    const u = response.data;
                    document.getElementById("lblDelIdUsuario").textContent = u.id_usuario;
                    document.getElementById("lblDelNombreCompleto").textContent = `${u.nombre1} ${u.apellido1}`;
                    document.getElementById("lblDelCedula").textContent = u.cedula;
                    document.getElementById("lblDelUsername").textContent = u.username;
                    document.getElementById("lblDelEstado").textContent = u.estado === 'A' ? 'Activo' : 'Inactivo';
                    
                    contenedorFicha.style.display = "block"; // Desplegamos la confirmación
                }
            });
    }

    if (btnConfirmar) {
        btnConfirmar.onclick = () => {
            if (!idSeleccionado) return;

            const formData = new FormData();
            formData.append("id_usuario", idSeleccionado);
            formData.append("accion", "DESACTIVAR");

            fetch("Backend/controllers/usuario_controller.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    alert("🔴 Cuenta de usuario desactivada con éxito.");
                    txtBuscar.value = "";
                    contenedorFicha.style.display = "none";
                    idSeleccionado = null;
                    // Recargar catálogo local
                    fetch("Backend/controllers/usuario_controller.php")
                        .then(res => res.json())
                        .then(res => { if (res.status === "success") usuariosLocales = res.data; });
                } else {
                    alert("⚠️ Error: " + data.message);
                }
            });
        };
    }

    if (btnCancelar) {
        btnCancelar.onclick = () => {
            txtBuscar.value = "";
            contenedorFicha.style.display = "none";
            idSeleccionado = null;
        };
    }
}