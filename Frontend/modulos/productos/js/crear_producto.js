document.addEventListener("DOMContentLoaded", () => {
    inicializarCrearProducto();
});

function inicializarCrearProducto() {
    const form = document.getElementById("formCrearProducto");
    const btnCancelar = document.getElementById("btnCancelar");
    const selCategoria = document.getElementById("selCategoria");

    // Elementos del formulario
    const txtNombre = document.getElementById("txtNombre");
    const txtDescripcion = document.getElementById("txtDescripcion");
    const txtUnidadMedida = document.getElementById("txtUnidadMedida");
    const txtPrecioUnitario = document.getElementById("txtPrecioUnitario");
    const txtStockActual = document.getElementById("txtStockActual");

    const RUTA_PRODUCTO_CONTROLLER = "../../../Backend/controllers/producto_controller.php";
    const RUTA_CATEGORIA_CONTROLLER = "../../../Backend/controllers/categoria_controller.php";

    // Cargar las categorías en el select al iniciar la vista
    function cargarCategoriasActivas() {
        fetch(RUTA_CATEGORIA_CONTROLLER, { method: "GET" })
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    selCategoria.innerHTML = '<option value="" disabled selected>Seleccione una categoría...</option>';
                    
                    // Filtrar para mostrar únicamente las categorías activas (estado == 1)
                    const activas = response.data.filter(c => c.estado == 1);

                    if (activas.length === 0) {
                        selCategoria.innerHTML = '<option value="" disabled>No hay categorías activas disponibles</option>';
                        return;
                    }

                    activas.forEach(cat => {
                        const option = document.createElement("option");
                        option.value = cat.id;
                        option.textContent = cat.nombre;
                        selCategoria.appendChild(option);
                    });
                } else {
                    alert("Error al mapear el catálogo de categorías.");
                }
            })
            .catch(err => {
                console.error(err);
                alert("❌ Fallo crítico al obtener las categorías del servidor.");
            });
    }

    btnCancelar.addEventListener("click", () => {
        window.location.href = "ver_productos.html";
    });

    form.onsubmit = (e) => {
        e.preventDefault();

        // Validaciones en el cliente
        if (txtNombre.value.trim() === "") {
            alert("Proporciona un nombre válido para el producto.");
            return;
        }

        if (!selCategoria.value) {
            alert("Selecciona una categoría obligatoriamente.");
            return;
        }

        if (parseFloat(txtPrecioUnitario.value) < 0) {
            alert("El precio unitario no puede ser un valor negativo.");
            return;
        }

        const formData = new FormData();
        formData.append("accion", "REGISTRAR");
        formData.append("nombre", txtNombre.value.trim());
        formData.append("descripcion", txtDescripcion.value.trim());
        formData.append("id_categoria", selCategoria.value);
        formData.append("unidadMedida", txtUnidadMedida.value.trim().toUpperCase());
        formData.append("precioUnitario", parseFloat(txtPrecioUnitario.value));
        formData.append("stockActual", parseFloat(txtStockActual.value));

        fetch(RUTA_PRODUCTO_CONTROLLER, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ Producto registrado e incorporado al inventario con éxito.");
                txtStockActual.value = "";
                txtPrecioUnitario.value = "";
                txtUnidadMedida.value = "";
                txtDescripcion.value = "";
                txtNombre.value = "";
            } else {
                alert("Error del sistema: " + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ Error de red al intentar guardar el producto.");
        });
    };

    // Cargar dependencias de forma asíncrona
    cargarCategoriasActivas();
}
