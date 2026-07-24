document.addEventListener("DOMContentLoaded", () => {
    inicializarCrearCategoria();
});

function inicializarCrearCategoria() {
    const form = document.getElementById("formCrearCategoria");
    const btnCancelar = document.getElementById("btnCancelar");
    
    const txtNombre = document.getElementById("txtNombre");
    const txtDescripcion = document.getElementById("txtDescripcion");
    const selIvaSRI = document.getElementById("selIvaSRI");

    const RUTA_CONTROLLER = "../../../Backend/controllers/categoria_controller.php";

    // Retorno al catálogo general
    btnCancelar.addEventListener("click", () => {
        window.location.href = "ver_categorias.html";
    });

    form.onsubmit = (e) => {
        e.preventDefault();

        // Validaciones básicas del lado del cliente
        if (txtNombre.value.trim() === "") {
            alert("Por favor, ingresa un nombre válido para la categoría.");
            return;
        }

        if (selIvaSRI.value === "") {
            alert("Debes seleccionar una tarifa impositiva del SRI.");
            return;
        }

        const formData = new FormData();
        formData.append("accion", "REGISTRAR");
        formData.append("nombre", txtNombre.value.trim());
        formData.append("descripcion", txtDescripcion.value.trim());
        formData.append("id_ivaSRI", selIvaSRI.value);

        fetch(RUTA_CONTROLLER, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ Categoría registrada correctamente.");
                window.location.href = "ver_categorias.html";
            } else {
                alert("No se pudo registrar: " + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ Error de comunicación con el backend al registrar la categoría.");
        });
    };
}