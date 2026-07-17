/**
 * ==========================================================================
 * LÓGICA DE REGISTRO DE USUARIOS (crear_usuario.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarCrearUsuario();
});

function inicializarCrearUsuario() {
    const form = document.getElementById("formCrearUsuario");
    const cmbRol = document.getElementById("cmbRol");
    const btnCancelar = document.getElementById("btnCancelarUsuario");
    const btnGuardar = document.getElementById("btnGuardarUsuario");
    const txtCedula = document.getElementById("txtCedula");
    const lblErrorCedula = document.getElementById("errorCedula");

    // Ruta unificada para los controladores
    const RUTA_ROL_CONTROLLER = "../../../Backend/controllers/rol_controller.php";
    const RUTA_USUARIO_CONTROLLER = "../../../Backend/controllers/usuario_controller.php";

    /**
     * Carga de forma dinámica los roles activos en el sistema.
     * Excluye estrictamente el rol Superadministrador (ID: 1) para mantener el rol único.
     */
    function cargarCatalogoRoles() {
        if (!cmbRol) return;

        fetch(RUTA_ROL_CONTROLLER)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success") {
                    cmbRol.innerHTML = '<option value="">-- Seleccione un Rol --</option>';

                    response.data.forEach((rol) => {
                        // REGLA DE NEGOCIO: Excluir el rol Super Administrador (ID: 1) de la interfaz de creación
                        if (parseInt(rol.id) === 1) {
                            return; 
                        }
                        
                        // Solo añadir roles que se encuentren activos en el sistema
                        if (parseInt(rol.estado) === 1) {
                            const option = document.createElement("option");
                            option.value = rol.id;
                            option.textContent = rol.nombre;
                            cmbRol.appendChild(option);
                        }
                    });
                } else {
                    console.error("Error al obtener catálogo de roles:", response.message);
                }
            })
            .catch((err) => {
                console.error("Error de conexión al obtener catálogo de roles:", err);
            });
    }

    // Inicializar el cargado de los roles
    cargarCatalogoRoles();

    // Sincronizar dinámicamente si hay actualizaciones de roles en tiempo real en la SPA
    document.addEventListener("cambioRoles", () => {
        cargarCatalogoRoles();
    });

    /**
     * Algoritmo de validación del décimo dígito (Módulo 10) para cédulas ecuatorianas
     */
    function validarCedulaEcuatoriana(cedula) {
        const digitos = cedula.trim();
        if (digitos.length !== 10 || isNaN(digitos)) {
            return false;
        }

        const codigoProvincia = parseInt(digitos.substring(0, 2), 10);
        if (codigoProvincia < 1 || codigoProvincia > 24) {
            return false;
        }

        const tercerDigito = parseInt(digitos[2], 10);
        if (tercerDigito >= 6) {
            return false;
        }

        const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let suma = 0;

        for (let i = 0; i < coeficientes.length; i++) {
            let valor = parseInt(digitos[i], 10) * coeficientes[i];
            if (valor >= 10) {
                valor -= 9;
            }
            suma += valor;
        }

        const digitoVerificadorEsperado = (Math.ceil(suma / 10) * 10) - suma;
        const digitoVerificadorReal = parseInt(digitos[9], 10);

        // Si la suma es múltiplo exacto de 10, el verificador es 0
        const residuo = suma % 10;
        const verificadorFinal = residuo === 0 ? 0 : digitoVerificadorEsperado;

        return verificadorFinal === digitoVerificadorReal;
    }

    // Validación interactiva de la cédula mientras se escribe
    if (txtCedula) {
        // Restringir entrada a solo números
        txtCedula.onkeypress = (e) => {
            if (e.key < "0" || e.key > "9") {
                e.preventDefault();
            }
        };

        txtCedula.oninput = () => {
            const cedulaValida = validarCedulaEcuatoriana(txtCedula.value);
            if (txtCedula.value.length === 10) {
                if (!cedulaValida) {
                    lblErrorCedula.style.display = "block";
                    txtCedula.style.borderColor = "#e74c3c";
                } else {
                    lblErrorCedula.style.display = "none";
                    txtCedula.style.borderColor = "#22c55e";
                }
            } else {
                lblErrorCedula.style.display = "none";
                txtCedula.style.borderColor = "#ccc";
            }
        };
    }

    // Procesamiento del formulario
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();

            const cedula = txtCedula ? txtCedula.value : "";
            const esValida = validarCedulaEcuatoriana(cedula);

            if (!esValida) {
                alert("⚠️ Por favor, ingresa una cédula de identidad ecuatoriana válida antes de registrar el usuario.");
                if (txtCedula) {
                    txtCedula.focus();
                    txtCedula.style.borderColor = "#e74c3c";
                }
                return;
            }

            // Desactivar botones para evitar reenvíos múltiples
            if (btnGuardar) {
                btnGuardar.disabled = true;
                btnGuardar.textContent = "⏳ Registrando...";
            }
            if (btnCancelar) btnCancelar.disabled = true;

            const formData = new FormData(form);
            formData.append("accion", "REGISTRAR");

            fetch(RUTA_USUARIO_CONTROLLER, {
                method: "POST",
                body: formData,
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    alert("✅ Usuario registrado con éxito en el sistema.");
                    form.reset();
                    if (txtCedula) txtCedula.style.borderColor = "#ccc";
                    
                    // Emitir evento global para que las listas o dashboards se actualicen reactivamente
                    document.dispatchEvent(new CustomEvent("cambioUsuarios"));
                } else {
                    alert("⚠️ Error: " + data.message);
                }
            })
            .catch((err) => {
                console.error("Error en la solicitud de registro de usuario:", err);
                alert("❌ Ocurrió un error al conectar con el servidor. Por favor, vuelve a intentarlo.");
            })
            .finally(() => {
                // Habilitar controles tras finalizar el ciclo de red
                if (btnGuardar) {
                    btnGuardar.disabled = false;
                    btnGuardar.textContent = "💾 Guardar Usuario";
                }
                if (btnCancelar) btnCancelar.disabled = false;
            });
        };
    }

    if (btnCancelar && form) {
        btnCancelar.onclick = (e) => {
            e.preventDefault();
            form.reset();
            if (txtCedula) {
                txtCedula.style.borderColor = "#ccc";
                lblErrorCedula.style.display = "none";
            }
        };
    }
}