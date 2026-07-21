document.addEventListener("DOMContentLoaded", () => {
    inicializarCrearCliente();
});

function inicializarCrearCliente() {
    const form = document.getElementById("formCrearCliente");
    const btnCancelar = document.getElementById("btnCancelar");
    
    const selTipoIdentificacion = document.getElementById("selTipoIdentificacion");
    const txtIdentificacion = document.getElementById("txtIdentificacion");
    const txtNombre1 = document.getElementById("txtNombre1");
    const txtNombre2 = document.getElementById("txtNombre2");
    const txtApellido1 = document.getElementById("txtApellido1");
    const txtApellido2 = document.getElementById("txtApellido2");
    const txtCorreo = document.getElementById("txtCorreo");
    const txtTelefono = document.getElementById("txtTelefono");
    const txtDireccion = document.getElementById("txtDireccion");

    const RUTA_CONTROLLER = "../../../Backend/controllers/clientes_controller.php";

    btnCancelar.addEventListener("click", () => {
        window.location.href = "ver_clientes.html";
    });

    // Pequeño ajuste dinámico de longitud según el tipo de documento seleccionado
    selTipoIdentificacion.addEventListener("change", () => {
        const tipo = selTipoIdentificacion.value;
        if (tipo === "05") { // Cédula
            txtIdentificacion.maxLength = 10;
            txtIdentificacion.minLength = 10;
        } else if (tipo === "04") { // RUC
            txtIdentificacion.maxLength = 13;
            txtIdentificacion.minLength = 13;
        } else {
            txtIdentificacion.removeAttribute("maxLength");
            txtIdentificacion.removeAttribute("minLength");
        }
    });

    form.onsubmit = (e) => {
        e.preventDefault();

        // Validaciones rápidas del lado del cliente
        const identificacion = txtIdentificacion.value.trim();
        const tipoId = selTipoIdentificacion.value;

        if (tipoId === "05" && identificacion.length !== 10) {
            alert("⚠️ La cédula debe tener exactamente 10 dígitos.");
            return;
        }
        if (tipoId === "04" && identificacion.length !== 13) {
            alert("⚠️ El RUC debe tener exactamente 13 dígitos.");
            return;
        }

        const formData = new FormData();
        formData.append("accion", "REGISTRAR");
        formData.append("tipoIdentificacion", tipoId);
        formData.append("identificacion", identificacion);
        formData.append("nombre1", txtNombre1.value.trim());
        formData.append("nombre2", txtNombre2.value.trim());
        formData.append("apellido1", txtApellido1.value.trim());
        formData.append("apellido2", txtApellido2.value.trim());
        formData.append("correo", txtCorreo.value.trim());
        formData.append("telefono", txtTelefono.value.trim());
        formData.append("direccion", txtDireccion.value.trim());

        fetch(RUTA_CONTROLLER, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ Cliente registrado exitosamente.");
                window.location.href = "ver_clientes.html";
            } else {
                alert("⚠️ No se pudo registrar: " + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ Error de comunicación con el servidor al intentar registrar al cliente.");
        });
    };
}