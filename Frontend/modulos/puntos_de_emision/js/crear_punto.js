document.addEventListener("DOMContentLoaded", () => {
    inicializarFormularioPunto();
});

function inicializarFormularioPunto() {
    const form = document.getElementById("formPuntoEmision");
    const tituloFormulario = document.getElementById("tituloFormulario");
    const btnCancelar = document.getElementById("btnCancelar");
    
    // Elementos del DOM del formulario
    const txtId = document.getElementById("txtPuntoId");
    const txtNombre = document.getElementById("txtNombre");
    const txtCodigoSRI = document.getElementById("txtCodigoSRI");
    const txtSecuencial = document.getElementById("txtSecuencial");
    const selEstado = document.getElementById("selEstado");
    const txtIdEmpresa = document.getElementById("txtIdEmpresa");
    const txtIdUsuario = document.getElementById("txtIdUsuario");

    const RUTA_CONTROLLER = "../../../Backend/controllers/puntoEmision_controller.php";

    // Detectar si estamos editando buscando el parámetro ?id=X en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idPuntoEdicion = urlParams.get("id");
    let modoEdicion = false;

    if (idPuntoEdicion) {
        modoEdicion = true;
        tituloFormulario.textContent = "✏️ Editar Punto de Emisión";
        cargarDatosParaEditar(idPuntoEdicion);
    }

    btnCancelar.addEventListener("click", () => {
        window.location.href = "ver_puntos.html";
    });

    function cargarDatosParaEditar(id) {
        fetch(`${RUTA_CONTROLLER}?id=${id}`)
            .then(res => res.json())
            .then(response => {
                if (response.status === "success" && response.data) {
                    const p = response.data;
                    txtId.value = p.id;
                    txtNombre.value = p.nombre;
                    txtCodigoSRI.value = p.codigoSRI;
                    txtSecuencial.value = p.secuencial;
                    selEstado.value = p.estado;
                    txtIdEmpresa.value = p.id_empresa;
                    txtIdUsuario.value = p.id_usuario || "";
                } else {
                    alert("⚠️ No se pudieron cargar los datos del punto de emisión.");
                    window.location.href = "ver_puntos.html";
                }
            })
            .catch(() => alert("❌ Error crítico al recuperar datos del servidor."));
    }

    form.onsubmit = (e) => {
        e.preventDefault();

        // Validación manual rápida de la regla de longitud del código SRI
        if (txtCodigoSRI.value.trim().length !== 3) {
            alert("⚠️ El código SRI debe contener exactamente 3 caracteres numéricos.");
            return;
        }

        const formData = new FormData();
        
        // Mapear la acción correcta según el estado lógico detectado por la URL
        if (modoEdicion) {
            formData.append("id", txtId.value);
            formData.append("accion", "EDITAR");
        } else {
            formData.append("accion", "REGISTRAR");
        }

        formData.append("nombre", txtNombre.value.trim());
        formData.append("codigoSRI", txtCodigoSRI.value.trim());
        formData.append("secuencial", txtSecuencial.value);
        formData.append("estado", selEstado.value);
        formData.append("id_empresa", txtIdEmpresa.value);
        formData.append("id_usuario", txtIdUsuario.value.trim());

        fetch(RUTA_CONTROLLER, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                alert(`✅ Punto de emisión ${modoEdicion ? 'actualizado' : 'registrado'} correctamente.`);
                window.location.href = "ver_puntos.html";
            } else {
                alert("⚠️ Error en el proceso: " + data.message);
            }
        })
        .catch(() => alert("❌ Error crítico en el canal de red al procesar el formulario."));
    };
}