/**
 * ==========================================================================
 * LÓGICA DE INACTIVACIÓN / BAJA DE ROLES (borrar_roles.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarBorrarRoles();
});

function inicializarBorrarRoles() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarRol");
    const btnCancelar = document.getElementById("btnCancelarEliminarRol");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarRol");
    const sugerencias = document.getElementById("listaSugerenciasEliminarRol");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarRol");
    const msgProtegido = document.getElementById("msgProtegidoRol");
    
    let rolesLocales = [];
    let idSeleccionado = null;

    /**
     * Consume la API de backend para actualizar los datos en memoria
     */
    function actualizarMemoriaRoles() {
        fetch("../../../Backend/controllers/rol_controller.php")
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    rolesLocales = res.data;
                }
            })
            .catch(err => console.error("Error cargando roles base:", err));
    }

    // Carga inicial al arrancar el módulo
    actualizarMemoriaRoles();

    // Sincronizar memoria interna ante cambios globales del sistema
    document.addEventListener("cambioRoles", () => {
        actualizarMemoriaRoles();
    });

    if (txtBuscar && sugerencias) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";

            if (query === "") {
                if (contenedorFicha) contenedorFicha.style.display = "none";
                sugerencias.style.display = "none";
                return;
            }

            const filtrados = rolesLocales.filter((r) => r.nombre && r.nombre.toLowerCase().includes(query));
            
            filtrados.forEach((r) => {
                const item = document.createElement("div");
                item.style.padding = "10px 15px";
                item.style.cursor = "pointer";
                item.style.borderBottom = "1px solid #f1f5f9";
                item.style.fontSize = "0.95rem";
                item.innerHTML = `❌ <b>${r.nombre}</b>`;
                
                item.onclick = () => {
                    txtBuscar.value = r.nombre;
                    sugerencias.style.display = "none";
                    
                    // Asignación de datos seleccionados
                    idSeleccionado = r.id;
                    document.getElementById("lblDelIdRol").textContent = r.id;
                    document.getElementById("lblDelRolNombre").textContent = r.nombre;
                    document.getElementById("lblDelRolDesc").textContent = r.descripcion || "Sin descripción";
                    document.getElementById("lblDelRolEstado").textContent = parseInt(r.estado) === 1 ? "Activo" : "Inactivo";
                    
                    // REGLA DE NEGOCIO: Bloqueo inquebrantable del Super Administrador (ID: 1)
                    if (parseInt(r.id) === 1) {
                        if (msgProtegido) msgProtegido.style.display = "block";
                        if (btnConfirmar) {
                            btnConfirmar.disabled = true;
                            btnConfirmar.style.backgroundColor = "#95a5a6";
                            btnConfirmar.style.cursor = "not-allowed";
                            btnConfirmar.textContent = "🔒 Acción Bloqueada";
                        }
                    } else {
                        if (msgProtegido) msgProtegido.style.display = "none";
                        if (btnConfirmar) {
                            btnConfirmar.disabled = false;
                            btnConfirmar.style.backgroundColor = "#e74c3c";
                            btnConfirmar.style.cursor = "pointer";
                            btnConfirmar.textContent = "🔴 Confirmar Inactivación";
                        }
                    }
                    
                    if (contenedorFicha) contenedorFicha.style.display = "block";
                };
                
                item.onmouseenter = () => (item.style.backgroundColor = "#fdf2f2");
                item.onmouseleave = () => (item.style.backgroundColor = "transparent");
                sugerencias.appendChild(item);
            });
            
            sugerencias.style.display = filtrados.length ? "block" : "none";
        };

        // Cerrar lista flotante de sugerencias al pulsar fuera
        document.addEventListener("click", (e) => {
            if (e.target !== txtBuscar && e.target !== sugerencias) {
                sugerencias.style.display = "none";
            }
        });
    }

    // Acción de inhabilitación de roles
    if (btnConfirmar) {
        btnConfirmar.onclick = () => {
            if (!idSeleccionado) return;
            
            // Salvaguarda redundante de seguridad antes del fetch
            if (parseInt(idSeleccionado) === 1) {
                alert("⛔ Error de Seguridad: El Super Administrador es vital para la integridad de la base de datos y no puede ser desactivado.");
                return;
            }

            // Confirmación secundaria del usuario
            const confirmacion = confirm(`¿Está completamente seguro de desactivar este rol? Los usuarios asignados a él perderán sus permisos inmediatos.`);
            if (!confirmacion) return;

            // Bloqueo visual de controles
            btnConfirmar.disabled = true;
            btnConfirmar.textContent = "⏳ Desactivando...";
            if (btnCancelar) btnCancelar.disabled = true;

            const formData = new FormData();
            formData.append("id", idSeleccionado);
            formData.append("accion", "DESACTIVAR");

            fetch("../../../Backend/controllers/rol_controller.php", {
                method: "POST",
                body: formData,
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    alert("🔴 Rol inhabilitado correctamente del sistema.");
                    limpiarFormulario();
                    
                    // Sincronizar memoria y alertar al resto del ecosistema SPA
                    actualizarMemoriaRoles();
                    document.dispatchEvent(new CustomEvent("cambioRoles"));
                } else {
                    alert("⚠️ Error: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error al inactivar el rol:", error);
                alert("❌ Error de conexión. No se pudo cambiar el estado del rol en el servidor.");
            })
            .finally(() => {
                // Restaurar estado de los botones si ocurre un fallo o se limpia la acción
                btnConfirmar.disabled = false;
                btnConfirmar.style.backgroundColor = "#e74c3c";
                btnConfirmar.textContent = "🔴 Confirmar Inactivación";
                if (btnCancelar) btnCancelar.disabled = false;
            });
        };
    }

    if (btnCancelar) {
        btnCancelar.onclick = () => limpiarFormulario();
    }

    function limpiarFormulario() {
        if (txtBuscar) txtBuscar.value = "";
        if (contenedorFicha) contenedorFicha.style.display = "none";
        idSeleccionado = null;
    }
}