/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA DESACTIVAR PRODUCTOS (borrar_producto.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarBorrarProducto();
});

function inicializarBorrarProducto() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarProducto");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarProducto");
    const sugerencias = document.getElementById("listaSugerenciasEliminarProducto");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarProducto");
    const alertaEstado = document.getElementById("alertaProductoEstado");

    const RUTA_CONTROLLER = "../../../Backend/controllers/producto_controller.php";

    let productosLocales = [];
    let idSeleccionado = null;

    /**
     * Carga de datos base de productos
     */
    function actualizarDatosLocales() {
        fetch(`${RUTA_CONTROLLER}?gestion_crud=true`)
            .then(res => res.json())
            .then(res => {
                if (res.status === "success" && Array.isArray(res.data)) {
                    productosLocales = res.data;
                }
            })
            .catch(err => console.error("Error cargando la lista de productos:", err));
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

            const filtrados = productosLocales.filter(p => {
                const nombre = (p.nombre || '').toLowerCase();
                const codigo = (p.codigoPrincipal || p.codigo || '').toLowerCase();
                return nombre.includes(query) || codigo.includes(query);
            });

            filtrados.forEach(p => {
                const item = document.createElement("div");
                item.style.padding = "10px";
                item.style.cursor = "pointer";
                item.style.borderBottom = "1px solid #eee";

                const codigoMostrar = p.codigoPrincipal || p.codigo || 'S/C';

                item.innerHTML = `❌ <b>${p.nombre}</b> <small style="color:#7f8c8d;">[Cód: ${codigoMostrar}]</small>`;

                item.onclick = () => {
                    txtBuscar.value = p.nombre;
                    sugerencias.style.display = "none";

                    idSeleccionado = p.id;

                    // Formateo de valores numéricos
                    const stockVal = p.stockActual !== undefined ? parseFloat(p.stockActual).toFixed(2) : '0.00';
                    const unidad = p.unidadMedida || '';
                    const precioVal = p.precioUnitario !== undefined ? parseFloat(p.precioUnitario).toFixed(4) : '0.0000';

                    // Llenado dinámico de la ficha
                    document.getElementById("lblDelProductoNombre").textContent = p.nombre || "N/A";
                    document.getElementById("lblDelProductoCodigo").textContent = codigoMostrar;
                    document.getElementById("lblDelProductoStock").textContent = `${stockVal} ${unidad}`.trim();
                    document.getElementById("lblDelProductoPrecio").textContent = `$${precioVal}`;
                    document.getElementById("lblDelProductoEstado").textContent = parseInt(p.estado) === 1 ? 'Activo' : 'Inactivo';

                    // Si el producto ya está inactivo, advertir y deshabilitar confirmación
                    if (parseInt(p.estado) === 0) {
                        alertaEstado.style.display = "block";
                        alertaEstado.innerHTML = "ℹ️ <b>Información:</b> Este producto ya se encuentra inhabilitado en el sistema.";

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
     * Procesar Inactivación de Producto
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
                        alert("Producto desactivado correctamente.");

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
                    alert("❌ Falla crítica de red al comunicarse con el backend.");
                });
        };
    }

    /**
     * Botón Cancelar
     */
    const btnCancelar = document.getElementById("btnCancelarEliminarProducto");
    if (btnCancelar) {
        btnCancelar.onclick = () => {
            txtBuscar.value = "";
            contenedorFicha.style.display = "none";
            if (alertaEstado) alertaEstado.style.display = "none";
            idSeleccionado = null;
        };
    }
}