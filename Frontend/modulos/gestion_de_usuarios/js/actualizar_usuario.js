/**
 * ==========================================================================
 * LÓGICA DE ACTUALIZACIÓN DE USUARIOS (actualizar_usuario.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarActualizarUsuario();
});

function inicializarActualizarUsuario() {
    const form = document.getElementById("formEditarUsuario");
    const cmbRol = document.getElementById("cmbEditRol");
    const cmbEstado = document.getElementById("cmbEditEstado");
    const btnCancelar = document.getElementById("btnCancelarEditarUsuario");
    const btnGuardar = document.getElementById("btnGuardarEditarUsuario");

    const txtBuscar = document.getElementById("txtBuscarParaEditar");
    const contenedorSugerencias = document.getElementById("listaSugerenciasEditar");
    const contenedorForm = document.getElementById("contenedorFormEditar");

    const txtCedula = document.getElementById("txtEditCedula");
    const lblErrorCedula = document.getElementById("errorEditCedula");

    // Rutas unificadas para resolver el ruteo relativo de los subdirectorios
    const RUTA_ROL_CONTROLLER = "../../../Backend/controllers/rol_controller.php";
    const RUTA_USUARIO_CONTROLLER = "../../../Backend/controllers/usuario_controller.php";

    let usuariosLocales = []; // Almacén temporal de usuarios cargados

    /**
     * Cargar catálogo de roles dinámicamente
     */
    function cargarCatalogoRoles() {
        if (!cmbRol) return;

        fetch(RUTA_ROL_CONTROLLER)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success") {
                    cmbRol.innerHTML = '<option value="">-- Seleccione un Rol --</option>';
                    response.data.forEach((rol) => {
                        // Agregamos todos los roles activos disponibles
                        if (parseInt(rol.estado) === 1) {
                            cmbRol.innerHTML += `<option value="${rol.id}">${rol.nombre}</option>`;
                        }
                    });
                    // Una vez con los roles inicializados en el DOM, cacheamos los usuarios
                    cargarCatalogoUsuarios();
                }
            })
            .catch((err) => console.error("Error al cargar roles:", err));
    }

    function cargarCatalogoUsuarios() {
        fetch(RUTA_USUARIO_CONTROLLER)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success") {
                    usuariosLocales = response.data;
                }
            })
            .catch((err) => console.error("Error al cargar usuarios:", err));
    }

    // Inicializar el cargado de la interfaz
    cargarCatalogoRoles();

    // Sincronizar el catálogo si ocurren cambios de creación/eliminación de usuarios en la SPA
    document.addEventListener("cambioUsuarios", () => {
        cargarCatalogoUsuarios();
    });

    /**
     * Algoritmo de validación de módulo 10 (Cédula de Identidad Ecuatoriana)
     */
    function validarCedulaEcuatoriana(cedula) {
        const digitos = cedula.trim();
        if (digitos.length !== 10 || isNaN(digitos)) {
            return false;
        }

        const codigoProvincia = parseInt(digitos.substring(0, 2), 10);
        if (codigoProvincia < 1 || codigoProvincia > 24) {
            return false;
        }

        const tercerDigito = parseInt(digitos[2], 10);
        if (tercerDigito >= 6) {
            return false;
        }

        const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let suma = 0;

        for (let i = 0; i < coeficientes.length; i++) {
            let valor = parseInt(digitos[i], 10) * coeficientes[i];
            if (valor >= 10) {
                valor -= 9;
            }
            suma += valor;
        }

        const digitoVerificadorEsperado = (Math.ceil(suma / 10) * 10) - suma;
        const digitoVerificadorReal = parseInt(digitos[9], 10);

        const residuo = suma % 10;
        const verificadorFinal = residuo === 0 ? 0 : digitoVerificadorEsperado;

        return verificadorFinal === digitoVerificadorReal;
    }

    // Restricciones en vivo para el input de la cédula al actualizar
    if (txtCedula) {
        txtCedula.onkeypress = (e) => {
            if (e.key < "0" || e.key > "9") {
                e.preventDefault();
            }
        };

        txtCedula.oninput = () => {
            const cedulaValida = validarCedulaEcuatoriana(txtCedula.value);
            if (txtCedula.value.length === 10) {
                if (!cedulaValida) {
                    lblErrorCedula.style.display = "block";
                    txtCedula.style.borderColor = "#e74c3c";
                } else {
                    lblErrorCedula.style.display = "none";
                    txtCedula.style.borderColor = "#22c55e";
                }
            } else {
                lblErrorCedula.style.display = "none";
                txtCedula.style.borderColor = "#ccc";
            }
        };
    }

    // Buscador interactivo en tiempo real
    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            contenedorSugerencias.innerHTML = "";

            if (query === "") {
                contenedorSugerencias.style.display = "none";
                return;
            }

            const filtrados = usuariosLocales.filter(
                (u) =>
                    (u.nombre1 && u.nombre1.toLowerCase().includes(query)) ||
                    (u.apellido1 && u.apellido1.toLowerCase().includes(query)) ||
                    (u.cedula && u.cedula.includes(query)) ||
                    (u.username && u.username.toLowerCase().includes(query))
            );

            if (filtrados.length === 0) {
                contenedorSugerencias.innerHTML = `<div style="padding: 10px; color: #94a3b8; font-style: italic; font-size:0.9rem;">No se encontraron resultados</div>`;
            } else {
                filtrados.forEach((u) => {
                    const item = document.createElement("div");
                    item.style.padding = "10px 15px";
                    item.style.cursor = "pointer";
                    item.style.borderBottom = "1px solid #f1f5f9";
                    item.style.fontSize = "0.95rem";
                    item.innerHTML = `<b>${u.nombre1} ${u.apellido1}</b> <small style="color:#64748b;">(${u.cedula} - ${u.username})</small>`;

                    item.onclick = () => {
                        txtBuscar.value = `${u.nombre1} ${u.apellido1} (${u.username})`;
                        contenedorSugerencias.style.display = "none";
                        cargarUsuarioEnFormulario(u.id);
                    };

                    item.onmouseenter = () => (item.style.backgroundColor = "#f1f5f9");
                    item.onmouseleave = () => (item.style.backgroundColor = "transparent");

                    contenedorSugerencias.appendChild(item);
                });
            }
            contenedorSugerencias.style.display = "block";
        };
    }

    /**
     * Mapea un usuario al formulario y aplica restricciones si se trata del SA (ID de rol 1)
     */
    function cargarUsuarioEnFormulario(idUsuario) {
        fetch(`${RUTA_USUARIO_CONTROLLER}?id=${idUsuario}`)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success" && response.data) {
                    const u = response.data;

                    document.getElementById("txtEditIdUsuario").value = u.id;
                    document.getElementById("txtEditNombre1").value = u.nombre1;
                    document.getElementById("txtEditNombre2").value = u.nombre2 || "";
                    document.getElementById("txtEditApellido1").value = u.apellido1;
                    document.getElementById("txtEditApellido2").value = u.apellido2 || "";
                    document.getElementById("txtEditCedula").value = u.cedula;
                    document.getElementById("txtEditFechaNac").value = u.fecha_nacimiento || "";
                    document.getElementById("txtEditTelefono").value = u.telefono || "";
                    document.getElementById("txtEditCorreo").value = u.correo;
                    document.getElementById("txtEditUsername").value = u.username;

                    cmbRol.value = u.id_rol;
                    cmbEstado.value = u.estado;

                    // Ocultar cualquier error previo en la carga
                    if (lblErrorCedula) lblErrorCedula.style.display = "none";
                    if (txtCedula) txtCedula.style.borderColor = "#ccc";

                    // ==========================================================
                    // CONTROL ESTRICTO: Bloquear edición de Rol y Estado si es SA
                    // ==========================================================
                    if (parseInt(u.id_rol) === 1) {
                        cmbRol.disabled = true;
                        cmbEstado.disabled = true;
                        cmbRol.style.backgroundColor = "#f1f5f9";
                        cmbRol.style.color = "#64748b";
                        cmbEstado.style.backgroundColor = "#f1f5f9";
                        cmbEstado.style.color = "#64748b";
                        
                        // Añadir indicador visual o tooltip explicativo
                        cmbRol.title = "No se puede degradar el rol del Super Administrador.";
                        cmbEstado.title = "No se puede desactivar al Super Administrador.";
                    } else {
                        cmbRol.disabled = false;
                        cmbEstado.disabled = false;
                        cmbRol.style.backgroundColor = "white";
                        cmbRol.style.color = "#000";
                        cmbEstado.style.backgroundColor = "white";
                        cmbEstado.style.color = "#000";
                        
                        cmbRol.removeAttribute("title");
                        cmbEstado.removeAttribute("title");
                    }

                    contenedorForm.style.display = "block";
                }
            })
            .catch((err) => console.error("Error al obtener detalles del usuario:", err));
    }

    // Procesamiento y envío de cambios
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();

            const cedulaVal = txtCedula ? txtCedula.value : "";
            if (!validarCedulaEcuatoriana(cedulaVal)) {
                alert("Por favor, ingresa una cédula ecuatoriana válida antes de registrar las modificaciones.");
                if (txtCedula) {
                    txtCedula.focus();
                    txtCedula.style.borderColor = "#e74c3c";
                }
                return;
            }

            // Deshabilitar temporalmente para evitar peticiones redundantes
            if (btnGuardar) {
                btnGuardar.disabled = true;
                btnGuardar.textContent = " Guardando...";
            }
            if (btnCancelar) btnCancelar.disabled = true;

            // Habilitamos momentáneamente los campos select si estaban bloqueados
            // para que FormData los incluya de forma correcta en el payload.
            const rolBloqueado = cmbRol.disabled;
            if (rolBloqueado) {
                cmbRol.disabled = false;
                cmbEstado.disabled = false;
            }

            const formData = new FormData(form);
            formData.append("accion", "EDITAR");

            // Volvemos a congelarlos inmediatamente
            if (rolBloqueado) {
                cmbRol.disabled = true;
                cmbEstado.disabled = true;
            }

            fetch(RUTA_USUARIO_CONTROLLER, {
                method: "POST",
                body: formData,
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    alert("✅ Usuario actualizado correctamente.");
                    if (txtBuscar) txtBuscar.value = "";
                    contenedorForm.style.display = "none";
                    form.reset();
                    
                    // Emitir evento para refrescar componentes dependientes en la SPA
                    document.dispatchEvent(new CustomEvent("cambioUsuarios"));
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch((err) => {
                console.error("Error al guardar cambios de usuario:", err);
                alert("❌ Ocurrió un error de red al intentar actualizar el usuario.");
            })
            .finally(() => {
                if (btnGuardar) {
                    btnGuardar.disabled = false;
                    btnGuardar.textContent = "Guardar Cambios";
                }
                if (btnCancelar) btnCancelar.disabled = false;
            });
        };
    }

    if (btnCancelar) {
        btnCancelar.onclick = () => {
            if (txtBuscar) txtBuscar.value = "";
            contenedorForm.style.display = "none";
            form.reset();
            if (txtCedula) {
                txtCedula.style.borderColor = "#ccc";
                lblErrorCedula.style.display = "none";
            }
        };
    }
}