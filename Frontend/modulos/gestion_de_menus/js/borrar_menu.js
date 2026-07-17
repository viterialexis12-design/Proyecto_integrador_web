/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA DESACTIVAR MENÚS (borrar_menu.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarBorrarMenu();
});

function inicializarBorrarMenu() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarMenu");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarMenu");
    const sugerencias = document.getElementById("listaSugerenciasEliminarMenu");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarMenu");
    const alertaHijos = document.getElementById("alertaHijosMenu");

    let menusLocales = []; 
    let idSeleccionado = null;

    /**
     * Carga de datos base (Ajustado con la ruta relativa del Iframe)
     */
    function actualizarDatosLocales() {
        fetch("../../../Backend/controllers/menu_controller.php?gestion_crud=true")
            .then(res => res.json())
            .then(res => { 
                if (res.status === "success") menusLocales = res.data; 
            })
            .catch(err => console.error("Error cargando menús locales:", err));
    }
    actualizarDatosLocales();

    /**
     * Buscador y lógica de selección
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

            const filtrados = menusLocales.filter(m => m.nombre.toLowerCase().includes(query));
            filtrados.forEach(m => {
                const item = document.createElement("div");
                item.style.padding = "10px"; 
                item.style.cursor = "pointer"; 
                item.style.borderBottom = "1px solid #eee";
                
                const tipoText = (m.id_menuPadre === null || m.id_menuPadre === "" || m.id_menuPadre == 0) ? "Menú Principal" : "Submenú";
                item.innerHTML = `❌ <b>${m.nombre}</b> <small style="color:#7f8c8d;">[${tipoText}]</small>`;
                
                item.onclick = () => {
                    txtBuscar.value = m.nombre; 
                    sugerencias.style.display = "none"; 
                    
                    idSeleccionado = m.id;
                    
                    // Llenado de la ficha visual
                    document.getElementById("lblDelMenuNombre").textContent = m.nombre;
                    document.getElementById("lblDelMenuDescripcion").textContent = m.descripcion || "Sin descripción";
                    document.getElementById("lblDelMenuEstado").textContent = parseInt(m.estado) === 1 ? 'Activo' : 'Inactivo';
                    
                    // Obtener nombre del padre de forma amigable
                    if (m.id_menuPadre) {
                        const padreObj = menusLocales.find(p => String(p.id) === String(m.id_menuPadre));
                        document.getElementById("lblDelMenuPadre").textContent = padreObj ? padreObj.nombre : "Desconocido";
                    } else {
                        document.getElementById("lblDelMenuPadre").textContent = "— (Es un menú principal)";
                    }

                    // ==========================================
                    // REGLA DE PROTECCIÓN: Gestión de Menús
                    // ==========================================
                    const esGestionMenusPadre = m.nombre.toLowerCase().includes("gestión de menús") || m.nombre.toLowerCase().includes("gestion de menus");
                    const esGestionMenusHijo = m.url && m.url.includes("menu");

                    if (esGestionMenusPadre || esGestionMenusHijo) {
                        // 1. Bloquear botón de confirmación
                        if (btnConfirmar) {
                            btnConfirmar.disabled = true;
                            btnConfirmar.style.backgroundColor = "#95a5a6";
                            btnConfirmar.style.cursor = "not-allowed";
                            btnConfirmar.style.opacity = "0.6";
                        }

                        // 2. Transformar alerta a color azul (Informativo de protección)
                        alertaHijos.style.backgroundColor = "#e8f4fd";
                        alertaHijos.style.borderLeftColor = "#2196f3";
                        alertaHijos.style.color = "#0d47a1";
                        alertaHijos.innerHTML = "🛡️ <b>Módulo Protegido:</b> Este menú es crucial para la administración del sistema. Por seguridad, no se permite dar de baja ni desactivar este módulo.";
                        alertaHijos.style.display = "block";

                    } else {
                        // Si es un menú normal, reestablecemos el botón de confirmación
                        if (btnConfirmar) {
                            btnConfirmar.disabled = false;
                            btnConfirmar.style.backgroundColor = "#e74c3c";
                            btnConfirmar.style.cursor = "pointer";
                            btnConfirmar.style.opacity = "1";
                        }

                        // Evaluar si es padre y tiene hijos para la advertencia en cascada tradicional (Rojo)
                        const tieneHijos = menusLocales.some(h => String(h.id_menuPadre) === String(m.id));
                        const esPadre = (m.id_menuPadre === null || m.id_menuPadre === "" || m.id_menuPadre == 0);

                        if (tieneHijos && esPadre) {
                            alertaHijos.style.backgroundColor = "#f8d7da";
                            alertaHijos.style.borderLeftColor = "#dc3545";
                            alertaHijos.style.color = "#721c24";
                            alertaHijos.innerHTML = "⚠️ <b>¡Atención!</b> Este es un menú principal. Al desactivarlo, también se darán de baja de forma automática todos sus menús hijos vinculados.";
                            alertaHijos.style.display = "block";
                        } else {
                            alertaHijos.style.display = "none";
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
     * Acción de desactivar / dar de baja
     */
    if (btnConfirmar) {
        btnConfirmar.onclick = () => {
            if (!idSeleccionado) return;
            
            const formData = new FormData();
            formData.append("id", idSeleccionado);
            formData.append("accion", "DESACTIVAR");

            fetch("../../../Backend/controllers/menu_controller.php?gestion_crud=true", { 
                method: "POST", 
                body: formData 
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("🔴 Módulo inhabilitado con éxito.");
                        
                        // Resetear la interfaz
                        txtBuscar.value = ""; 
                        contenedorFicha.style.display = "none"; 
                        if (alertaHijos) alertaHijos.style.display = "none";
                        idSeleccionado = null;
                        
                        // Sincronizar datos locales
                        actualizarDatosLocales(); 

                        // Notificar a la app principal para refrescar el menú lateral
                        if (window.parent) {
                            window.parent.postMessage("refrescarMenuLateral", "*");
                        }
                    } else { 
                        alert("⚠️ Error del sistema: " + data.message); 
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("❌ Error de conexión con el servidor.");
                });
        };
    }

    /**
     * Botón Cancelar
     */
    if (document.getElementById("btnCancelarEliminarMenu")) {
        document.getElementById("btnCancelarEliminarMenu").onclick = () => { 
            txtBuscar.value = ""; 
            contenedorFicha.style.display = "none"; 
            if (alertaHijos) alertaHijos.style.display = "none";
            idSeleccionado = null; 
        };
    }
}