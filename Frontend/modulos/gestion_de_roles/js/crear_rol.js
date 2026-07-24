/**
 * ==========================================================================
 * LÓGICA PARA EL REGISTRO DE NUEVOS ROLES (crear_rol.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarCrearRol();
});

function inicializarCrearRol() {
    const form = document.getElementById("formCrearRol");
    const btnCancelar = document.getElementById("btnCancelarCrearRol");
    const btnGuardar = document.getElementById("btnGuardarRol");

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();

            // Bloquear botón para evitar duplicados accidentales
            if (btnGuardar) {
                btnGuardar.disabled = true;
                btnGuardar.textContent = " Guardando...";
            }

            const formData = new FormData(form);
            // Agregamos la acción requerida por tu controlador PHP
            formData.append("accion", "CREAR");

            // Ajustamos el path relativo al Backend
            fetch("../../../Backend/controllers/rol_controller.php", {
                method: "POST",
                body: formData
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    alert("✅ Rol registrado exitosamente.");
                    form.reset();
                    
                    // Disparamos el evento global para que la tabla de ver_roles se auto-actualice si está activa
                    document.dispatchEvent(new CustomEvent("cambioRoles"));
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch((error) => {
                console.error("Error al registrar rol:", error);
                alert("❌ Error de conexión. No se pudo registrar el rol en el servidor.");
            })
            .finally(() => {
                // Restaurar estado original del botón de guardado
                if (btnGuardar) {
                    btnGuardar.disabled = false;
                    btnGuardar.innerHTML = "Guardar Rol";
                }
            });
        };
    }

    // Comportamiento del botón limpiar
    if (btnCancelar && form) {
        btnCancelar.onclick = (e) => {
            e.preventDefault();
            form.reset();
        };
    }
}