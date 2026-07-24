/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA DESACTIVAR CATEGORÍAS (borrar_categorias.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarBorrarCategoria();
});

function inicializarBorrarCategoria() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarCategoria");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarCategoria");
    const sugerencias = document.getElementById("listaSugerenciasEliminarCategoria");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarCategoria");
    const alertaEstado = document.getElementById("alertaCategoriaEstado");

    const RUTA_CONTROLLER = "../../../Backend/controllers/categoria_controller.php";

    let categoriasLocales = [];
    let idSeleccionado = null;

    /**
     * Carga de datos base de categorías desde el controlador
     */
    function actualizarDatosLocales() {
        fetch(`${RUTA_CONTROLLER}?gestion_crud=true`)
            .then(res => res.json())
            .then(res => {
                if (res.status === "success" && Array.isArray(res.data)) {
                    categoriasLocales = res.data;
                }
            })
            .catch(err => console.error("Error cargando la lista de categorías:", err));
    }
    actualizarDatosLocales();

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

            const filtrados = categoriasLocales.filter(cat => {
                const nombre = (cat.nombre || '').toLowerCase();
                const descripcion = (cat.descripcion || '').toLowerCase();
                return nombre.includes(query) || descripcion.includes(query);
            });

            filtrados.forEach(cat => {
                const item = document.createElement("div");
                item.style.padding = "10px";
                item.style.cursor = "pointer";
                item.style.borderBottom = "1px solid #eee";

                const descBreve = cat.descripcion 
                    ? (cat.descripcion.length > 35 ? cat.descripcion.substring(0, 35) + '...' : cat.descripcion)
                    : 'Sin descripción';

                item.innerHTML = `❌ <b>${cat.nombre}</b> <small style="color:#7f8c8d;">[${descBreve}]</small>`;

                item.onclick = () => {
                    txtBuscar.value = cat.nombre;
                    sugerencias.style.display = "none";

                    idSeleccionado = cat.id;

                    // Llenado dinámico de la ficha
                    document.getElementById("lblDelCategoriaNombre").textContent = cat.nombre || "N/A";
                    document.getElementById("lblDelCategoriaDescripcion").textContent = cat.descripcion || "Sin descripción adjunta.";
                    document.getElementById("lblDelCategoriaEstado").textContent = parseInt(cat.estado) === 1 ? 'Activa' : 'Inactiva';

                    // Si la categoría ya está inactiva, advertir y deshabilitar botón de confirmación
                    if (parseInt(cat.estado) === 0) {
                        alertaEstado.style.display = "block";
                        alertaEstado.innerHTML = "ℹ️ <b>Información:</b> Esta categoría ya se encuentra inhabilitada en el sistema.";

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
     * Procesar Inactivación de Categoría
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
                        alert("Categoría desactivada correctamente.");

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
                    alert("❌ Fallo de red al intentar comunicarse con el controlador.");
                });
        };
    }

    /**
     * Botón Cancelar
     */
    const btnCancelar = document.getElementById("btnCancelarEliminarCategoria");
    if (btnCancelar) {
        btnCancelar.onclick = () => {
            txtBuscar.value = "";
            contenedorFicha.style.display = "none";
            if (alertaEstado) alertaEstado.style.display = "none";
            idSeleccionado = null;
        };
    }
}