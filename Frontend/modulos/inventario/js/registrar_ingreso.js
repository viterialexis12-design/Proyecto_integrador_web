document.addEventListener("DOMContentLoaded", () => {
    inicializarRegistrarIngreso();
});

function inicializarRegistrarIngreso() {
    const form = document.getElementById("formRegistrarIngreso");
    const btnCancelar = document.getElementById("btnCancelar");
    const selProducto = document.getElementById("selProducto");
    
    const txtCantidad = document.getElementById("txtCantidad");
    const txtProveedor = document.getElementById("txtProveedor");
    const txtObservacion = document.getElementById("txtObservacion");

    const RUTA_PRODUCTO_CONTROLLER = "../../../Backend/controllers/producto_controller.php";
    const RUTA_MOVIMIENTO_CONTROLLER = "../../../Backend/controllers/movimiento_controller.php";

    // 1. Cargar el catálogo dinámico de productos activos
    function cargarProductosActivos() {
        fetch(RUTA_PRODUCTO_CONTROLLER, { method: "GET" })
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    selProducto.innerHTML = '<option value="" disabled selected>Seleccione el artículo...</option>';
                    
                    // Solo permitimos ingresar stock a productos que no estén dados de baja
                    const activos = response.data.filter(p => p.estado == 1);

                    if (activos.length === 0) {
                        selProducto.innerHTML = '<option value="" disabled>No hay productos activos configurados</option>';
                        return;
                    }

                    activos.forEach(prod => {
                        const option = document.createElement("option");
                        option.value = prod.id;
                        option.textContent = `${prod.nombre} (Stock actual: ${parseFloat(prod.stockActual).toFixed(2)} ${prod.unidadMedida})`;
                        selProducto.appendChild(option);
                    });
                } else {
                    alert("Error al mapear el catálogo de productos.");
                }
            })
            .catch(err => {
                console.error(err);
                alert("❌ Fallo de red al conectar con el inventario de productos.");
            });
    }

    btnCancelar.addEventListener("click", () => {
        window.location.href = "ver_inventario.html";
    });

    // 2. Enviar la transacción al controlador de movimientos
    form.onsubmit = (e) => {
        e.preventDefault();

        if (!selProducto.value) {
            alert("Selecciona un producto del catálogo para continuar.");
            return;
        }

        const cantidadIngreso = parseFloat(txtCantidad.value);
        if (isNaN(cantidadIngreso) || cantidadIngreso <= 0) {
            alert("La cantidad a ingresar debe ser estrictamente mayor a cero.");
            return;
        }

        const formData = new FormData();
        formData.append("accion", "INGRESAR_MERCADERIA");
        formData.append("id_producto", selProducto.value);
        formData.append("cantidad", cantidadIngreso);
        formData.append("nombreProveedor", txtProveedor.value.trim());
        formData.append("observacion", txtObservacion.value.trim());

        fetch(RUTA_MOVIMIENTO_CONTROLLER, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ Ingreso de mercadería registrado con éxito. Stock actualizado por trigger.");
                window.location.href = "ver_inventario.html";
            } else {
                alert("Operación rechazada: " + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ Falla crítica de red al intentar reportar el movimiento.");
        });
    };

    // Inicializar el cargado del selector secundario
    cargarProductosActivos();
}