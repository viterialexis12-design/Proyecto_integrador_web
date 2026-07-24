/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA DESACTIVAR CLIENTES (borrar_clientes.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarBorrarCliente();
});

function inicializarBorrarCliente() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarCliente");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarCliente");
    const sugerencias = document.getElementById("listaSugerenciasEliminarCliente");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarCliente");
    const alertaEstado = document.getElementById("alertaClienteEstado");

    const RUTA_CONTROLLER = "../../../Backend/controllers/cliente_controller.php";

    let clientesLocales = [];
    let idSeleccionado = null;

    /**
     * Carga de datos base de clientes
     */
    function actualizarDatosLocales() {
        fetch(`${RUTA_CONTROLLER}?gestion_crud=true`)
            .then(res => res.json())
            .then(res => {
                if (res.status === "success" && Array.isArray(res.data)) {
                    clientesLocales = res.data;
                }
            })
            .catch(err => console.error("Error cargando la lista de clientes:", err));
    }
    actualizarDatosLocales();

    /**
     * Helper para formatear el nombre completo
     */
    function obtenerNombreCompleto(c) {
        if (c.razon_social) return c.razon_social; // En caso de ser empresa
        return `${c.apellido1 || ''} ${c.apellido2 || ''} ${c.nombre1 || ''} ${c.nombre2 || ''}`.trim().replace(/\s+/g, ' ');
    }

    /**
     * Buscador con filtrado predictivo
     */
    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";

            if (query === "") {
                contenedorFicha.style.display = "none";
                sugerencias.style.display = "none";
                return;
            }

            const filtrados = clientesLocales.filter(c => {
                const nombreCompleto = obtenerNombreCompleto(c).toLowerCase();
                const identificacion = (c.identificacion || '').toLowerCase();
                return nombreCompleto.includes(query) || identificacion.includes(query);
            });

            filtrados.forEach(c => {
                const item = document.createElement("div");
                item.style.padding = "10px";
                item.style.cursor = "pointer";
                item.style.borderBottom = "1px solid #eee";

                const nombreMostrar = obtenerNombreCompleto(c);
                const idDoc = c.identificacion || 'Sin ID';

                item.innerHTML = `❌ <b>${nombreMostrar}</b> <small style="color:#7f8c8d;">[${idDoc}]</small>`;

                item.onclick = () => {
                    txtBuscar.value = nombreMostrar;
                    sugerencias.style.display = "none";

                    idSeleccionado = c.id;

                    // Llenado dinámico de la ficha
                    document.getElementById("lblDelClienteNombre").textContent = nombreMostrar || "N/A";
                    document.getElementById("lblDelClienteIdentificacion").textContent = idDoc;
                    document.getElementById("lblDelClienteCorreo").textContent = c.correo || "No registrado";
                    document.getElementById("lblDelClienteEstado").textContent = parseInt(c.estado) === 1 ? 'Activo' : 'Inactivo';

                    // Si ya está inactivo, advertir y deshabilitar botón de confirmación
                    if (parseInt(c.estado) === 0) {
                        alertaEstado.style.display = "block";
                        alertaEstado.innerHTML = "ℹ️ <b>Información:</b> Este cliente ya se encuentra inhabilitado en el sistema.";

                        if (btnConfirmar) {
                            btnConfirmar.disabled = true;
                            btnConfirmar.style.backgroundColor = "#94a3b8";
                            btnConfirmar.style.cursor = "not-allowed";
                            btnConfirmar.style.opacity = "0.6";
                        }
                    } else {
                        alertaEstado.style.display = "none";

                        if (btnConfirmar) {
                            btnConfirmar.disabled = false;
                            btnConfirmar.style.backgroundColor = "#dc2626";
                            btnConfirmar.style.cursor = "pointer";
                            btnConfirmar.style.opacity = "1";
                        }
                    }

                    contenedorFicha.style.display = "block";
                };

                item.onmouseenter = () => item.style.backgroundColor = "#fdf2f2";
                item.onmouseleave = () => item.style.backgroundColor = "transparent";
                sugerencias.appendChild(item);
            });

            sugerencias.style.display = filtrados.length ? "block" : "none";
        };
    }

    /**
     * Procesar Inactivación de Cliente
     */
    if (btnConfirmar) {
        btnConfirmar.onclick = () => {
            if (!idSeleccionado) return;

            const formData = new FormData();
            formData.append("accion", "ELIMINAR");
            formData.append("id", idSeleccionado);

            fetch(RUTA_CONTROLLER, {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("Cliente desactivado correctamente.");

                        // Limpieza
                        txtBuscar.value = "";
                        contenedorFicha.style.display = "none";
                        if (alertaEstado) alertaEstado.style.display = "none";
                        idSeleccionado = null;

                        actualizarDatosLocales();
                    } else {
                        alert("Error al desactivar: " + data.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("❌ Fallo de red crítico al intentar aplicar la baja lógica del cliente.");
                });
        };
    }

    /**
     * Botón Cancelar
     */
    const btnCancelar = document.getElementById("btnCancelarEliminarCliente");
    if (btnCancelar) {
        btnCancelar.onclick = () => {
            txtBuscar.value = "";
            contenedorFicha.style.display = "none";
            if (alertaEstado) alertaEstado.style.display = "none";
            idSeleccionado = null;
        };
    }
}