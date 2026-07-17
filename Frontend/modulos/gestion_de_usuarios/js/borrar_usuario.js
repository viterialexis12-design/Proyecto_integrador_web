/**
 * ==========================================================================
 * LÓGICA DE INACTIVACIÓN DE USUARIOS (eliminar_usuario.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarEliminarUsuario();
});

function inicializarEliminarUsuario() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminar");
    const btnCancelar = document.getElementById("btnCancelarEliminar");
    const txtBuscar = document.getElementById("txtBuscarParaEliminar");
    const contenedorSugerencias = document.getElementById("listaSugerenciasEliminar");
    const contenedorFicha = document.getElementById("contenedorFichaEliminar");

    // Elementos de aviso y acciones
    const divAvisoBloqueo = document.getElementById("divAvisoBloqueo");
    const divAccionesEliminar = document.getElementById("divAccionesEliminar");

    // Rutas relativas ajustadas para la estructura jerárquica de la SPA
    const RUTA_USUARIO_CONTROLLER = "../../../Backend/controllers/usuario_controller.php";

    let usuariosLocales = [];
    let idSeleccionado = null;

    /**
     * Cargar el catálogo completo de usuarios
     */
    function cargarUsuarios() {
        fetch(RUTA_USUARIO_CONTROLLER)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success") {
                    usuariosLocales = response.data;
                }
            })
            .catch((err) => console.error("Error al cargar el catálogo de usuarios:", err));
    }

    // Inicializar carga original
    cargarUsuarios();

    // Sincronizar catálogo local cuando ocurran cambios de usuarios en otros módulos
    document.addEventListener("cambioUsuarios", () => {
        cargarUsuarios();
    });

    // Eventos de búsqueda interactiva en tiempo real
    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            contenedorSugerencias.innerHTML = "";

            if (query === "") {
                contenedorSugerencias.style.display = "none";
                return;
            }

            const filtrados = usuariosLocales.filter(
                (u) =>
                    (u.nombre1 && u.nombre1.toLowerCase().includes(query)) ||
                    (u.apellido1 && u.apellido1.toLowerCase().includes(query)) ||
                    (u.cedula && u.cedula.includes(query)) ||
                    (u.username && u.username.toLowerCase().includes(query))
            );

            if (filtrados.length === 0) {
                contenedorSugerencias.innerHTML = `<div style="padding: 10px; color: #94a3b8; font-style: italic; font-size: 0.9rem;">No se encontraron resultados</div>`;
            } else {
                filtrados.forEach((u) => {
                    const item = document.createElement("div");
                    item.style.padding = "10px 15px";
                    item.style.cursor = "pointer";
                    item.style.borderBottom = "1px solid #f1f5f9";
                    item.style.fontSize = "0.95rem";
                    item.innerHTML = `❌ <b>${u.nombre1} ${u.apellido1}</b> <small style="color:#e74c3c;">(${u.username})</small>`;

                    item.onclick = () => {
                        txtBuscar.value = `${u.nombre1} ${u.apellido1} (${u.username})`;
                        contenedorSugerencias.style.display = "none";
                        idSeleccionado = u.id; 
                        mostrarFichaBaja(u.id);
                    };

                    item.onmouseenter = () => (item.style.backgroundColor = "#f1f5f9");
                    item.onmouseleave = () => (item.style.backgroundColor = "transparent");

                    contenedorSugerencias.appendChild(item);
                });
            }
            contenedorSugerencias.style.display = "block";
        };
    }

    /**
     * Recupera y expone la ficha informativa de baja para confirmar la desactivación del usuario
     */
    function mostrarFichaBaja(idUsuario) {
        fetch(`${RUTA_USUARIO_CONTROLLER}?id=${idUsuario}`)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success" && response.data) {
                    const u = response.data;
                    document.getElementById("lblDelIdUsuario").textContent = u.id;
                    document.getElementById("lblDelNombreCompleto").textContent = `${u.nombre1} ${u.apellido1}`;
                    document.getElementById("lblDelCedula").textContent = u.cedula;
                    document.getElementById("lblDelUsername").textContent = u.username;
                    document.getElementById("lblDelEstado").textContent = parseInt(u.estado) === 1 ? "Activo" : "Inactivo";

                    // ==========================================================
                    // REGLA DE SEGURIDAD ESTRICTA: Bloqueo de Superadministrador
                    // ==========================================================
                    if (parseInt(u.id_rol) === 1) {
                        divAvisoBloqueo.style.display = "block";
                        divAccionesEliminar.style.display = "none";
                    } else {
                        divAvisoBloqueo.style.display = "none";
                        divAccionesEliminar.style.display = "flex";
                    }

                    contenedorFicha.style.display = "block";
                }
            })
            .catch((err) => console.error("Error al obtener la ficha de baja del usuario:", err));
    }

    if (btnConfirmar) {
        btnConfirmar.onclick = () => {
            if (!idSeleccionado) return;

            // Bloquear temporalmente el botón para prevenir spamming de clicks
            btnConfirmar.disabled = true;
            btnConfirmar.textContent = "⏳ Desactivando...";

            const formData = new FormData();
            formData.append("id", idSeleccionado);
            formData.append("accion", "DESACTIVAR");

            fetch(RUTA_USUARIO_CONTROLLER, {
                method: "POST",
                body: formData,
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    alert("✅ Cuenta de usuario desactivada con éxito.");
                    if (txtBuscar) txtBuscar.value = "";
                    contenedorFicha.style.display = "none";
                    idSeleccionado = null;
                    
                    // Disparar evento para actualizar las vistas y catálogos de otros componentes de la SPA
                    document.dispatchEvent(new CustomEvent("cambioUsuarios"));
                } else {
                    alert("⚠️ Error: " + data.message);
                }
            })
            .catch((err) => {
                console.error("Error al enviar la baja:", err);
                alert("❌ Error de red al intentar desactivar la cuenta.");
            })
            .finally(() => {
                btnConfirmar.disabled = false;
                btnConfirmar.textContent = "🔴 Confirmar Inactivación";
            });
        };
    }

    if (btnCancelar) {
        btnCancelar.onclick = () => {
            if (txtBuscar) txtBuscar.value = "";
            contenedorFicha.style.display = "none";
            idSeleccionado = null;
        };
    }
}