document.addEventListener("DOMContentLoaded", () => {
    inicializarRegistrarEgreso();
});

function inicializarRegistrarEgreso() {
    const form = document.getElementById("formRegistrarEgreso");
    const btnCancelar = document.getElementById("btnCancelar");
    const selProducto = document.getElementById("selProducto");
    const txtCantidad = document.getElementById("txtCantidad");
    const txtObservacion = document.getElementById("txtObservacion");

    const RUTA_PRODUCTO_CONTROLLER = "../../../Backend/controllers/producto_controller.php";
    const RUTA_MOVIMIENTO_CONTROLLER = "../../../Backend/controllers/movimiento_controller.php";

    function cargarProductos() {
        fetch(RUTA_PRODUCTO_CONTROLLER, { method: "GET" })
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    selProducto.innerHTML = '<option value="" disabled selected>Seleccione el artículo...</option>';
                    
                    // Mostramos solo productos activos
                    const activos = response.data.filter(p => p.estado == 1);

                    activos.forEach(prod => {
                        const option = document.createElement("option");
                        option.value = prod.id;
                        // Guardamos el stock en un atributo de datos para validar en el cliente antes de enviar
                        option.dataset.stock = prod.stockActual; 
                        option.textContent = `${prod.nombre} (Stock disponible: ${parseFloat(prod.stockActual).toFixed(2)} ${prod.unidadMedida})`;
                        selProducto.appendChild(option);
                    });
                }
            });
    }

    btnCancelar.addEventListener("click", () => {
        window.location.href = "ver_inventario.html";
    });

    form.onsubmit = (e) => {
        e.preventDefault();

        const opcionSeleccionada = selProducto.options[selProducto.selectedIndex];
        const stockDisponible = parseFloat(opcionSeleccionada.dataset.stock);
        const cantidadEgreso = parseFloat(txtCantidad.value);

        // Validación en caliente: Evitar que saquen más de lo que hay físicamente
        if (cantidadEgreso > stockDisponible) {
            alert(`Inventario insuficiente. Solo tienes ${stockDisponible.toFixed(2)} unidades disponibles de este producto.`);
            return;
        }

        const formData = new FormData();
        formData.append("accion", "REGISTRAR_EGRESO");
        formData.append("id_producto", selProducto.value);
        formData.append("cantidad", cantidadEgreso);
        formData.append("observacion", txtObservacion.value.trim());

        fetch(RUTA_MOVIMIENTO_CONTROLLER, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ Egreso registrado correctamente. Ajuste de stock procesado por trigger.");
                window.location.href = "ver_inventario.html";
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ No se pudo conectar con el servidor.");
        });
    };

    cargarProductos();
}