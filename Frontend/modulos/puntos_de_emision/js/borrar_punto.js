/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA DESACTIVAR PUNTOS DE EMISIÓN (borrar_punto.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarBorrarPunto();
});

function inicializarBorrarPunto() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarPunto");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarPunto");
    const sugerencias = document.getElementById("listaSugerenciasEliminarPunto");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarPunto");
    const alertaPunto = document.getElementById("alertaPuntoEmision");

    const RUTA_CONTROLLER = "../../../Backend/controllers/puntoEmision_controller.php";

    let puntosLocales = [];
    let idSeleccionado = null;

    /**
     * Carga de datos base de puntos de emisión
     */
    function actualizarDatosLocales() {
        fetch(`${RUTA_CONTROLLER}?gestion_crud=true`)
            .then(res => res.json())
            .then(res => {
                if (res.status === "success" && Array.isArray(res.data)) {
                    puntosLocales = res.data;
                }
            })
            .catch(err => console.error("Error cargando puntos de emisión:", err));
    }
    actualizarDatosLocales();

    /**
     * Buscador y filtrado dinámico
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

            const filtrados = puntosLocales.filter(p =>
                (p.nombre && p.nombre.toLowerCase().includes(query)) ||
                (p.codigoSRI && p.codigoSRI.toLowerCase().includes(query))
            );

            filtrados.forEach(p => {
                const item = document.createElement("div");
                item.style.padding = "10px";
                item.style.cursor = "pointer";
                item.style.borderBottom = "1px solid #eee";

                item.innerHTML = `❌ <b>${p.nombre}</b> <small style="color:#7f8c8d;">[Código SRI: ${p.codigoSRI || 'N/A'}]</small>`;

                item.onclick = () => {
                    txtBuscar.value = p.nombre;
                    sugerencias.style.display = "none";

                    idSeleccionado = p.id;

                    // Poblar la ficha de datos
                    document.getElementById("lblDelPuntoNombre").textContent = p.nombre || "Sin nombre";
                    document.getElementById("lblDelPuntoCodigo").textContent = p.codigoSRI || "N/A";
                    document.getElementById("lblDelPuntoEstado").textContent = parseInt(p.estado) === 1 ? 'Activo' : 'Inactivo';

                    // Si ya está inactivo, deshabilitamos el botón para evitar redundancia
                    if (parseInt(p.estado) === 0) {
                        alertaPunto.style.display = "block";
                        alertaPunto.innerHTML = "ℹ️ <b>Información:</b> Este punto de emisión ya se encuentra desactivado.";
                        alertaPunto.style.backgroundColor = "#e0f2fe";
                        alertaPunto.style.borderLeftColor = "#0284c7";
                        alertaPunto.style.color = "#075985";

                        if (btnConfirmar) {
                            btnConfirmar.disabled = true;
                            btnConfirmar.style.backgroundColor = "#94a3b8";
                            btnConfirmar.style.cursor = "not-allowed";
                            btnConfirmar.style.opacity = "0.6";
                        }
                    } else {
                        alertaPunto.style.display = "none";

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
     * Procesar Inactivación (Baja Lógica)
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
                        alert("Punto de emisión desactivado correctamente.");

                        // Limpieza del formulario
                        txtBuscar.value = "";
                        contenedorFicha.style.display = "none";
                        if (alertaPunto) alertaPunto.style.display = "none";
                        idSeleccionado = null;

                        actualizarDatosLocales();
                    } else {
                        alert("Error del sistema: " + data.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("❌ Error de conexión al intentar dar de baja el punto de emisión.");
                });
        };
    }

    /**
     * Botón Cancelar
     */
    const btnCancelar = document.getElementById("btnCancelarEliminarPunto");
    if (btnCancelar) {
        btnCancelar.onclick = () => {
            txtBuscar.value = "";
            contenedorFicha.style.display = "none";
            if (alertaPunto) alertaPunto.style.display = "none";
            idSeleccionado = null;
        };
    }
}