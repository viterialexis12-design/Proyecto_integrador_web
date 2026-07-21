/**
 * ==========================================================================
 * LÓGICA DE VISUALIZACIÓN Y PAGINACIÓN DE USUARIOS (ver_usuario.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarVerUsuarios();
});

function inicializarVerUsuarios() {
    const tbody = document.getElementById("tbodyUsuarios");
    const btnRefrescar = document.getElementById("btnRefrescarUsuarios");
    const txtBuscar = document.getElementById("txtBuscarUsuario");
    const selectLimites = document.getElementById("selectLimitesUsuarios");
    
    // Elementos de la paginación
    const infoPaginacion = document.getElementById("infoPaginacionUsuarios");
    const btnPrev = document.getElementById("btnPrevUsuarios");
    const btnNext = document.getElementById("btnNextUsuarios");
    const contenedorPaginas = document.getElementById("contenedorPaginasUsuarios");

    // Variables de control de datos y paginación
    let usuariosLocales = [];      // Almacén de la base de datos completa
    let usuariosFiltrados = [];    // Almacén del subset activo por búsqueda
    let paginaActual = 1;
    let registrosPorPagina = 10;   // Límite estándar por defecto

    /**
     * Trae la lista actualizada de usuarios desde el controlador del Backend
     */
    function cargarTabla() {
        if (!tbody) return;
        if (txtBuscar) txtBuscar.value = ""; // Limpieza estética del buscador
        
        tbody.innerHTML = '<tr><td colspan="7" class="td-empty">⏳ Cargando usuarios...</td></tr>';

        fetch("../../../Backend/controllers/usuario_controller.php")
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success") {
                    usuariosLocales = response.data || [];
                    usuariosFiltrados = [...usuariosLocales]; // Clon inicial para el filtro
                    paginaActual = 1;                         // Resetear al inicio
                    actualizarVistaPaginada();
                } else {
                    tbody.innerHTML = `<tr><td colspan="7" class="td-empty td-error">⚠️ ${response.message || "No se encontraron registros."}</td></tr>`;
                    deshabilitarPaginacionCompleta();
                }
            })
            .catch((err) => {
                console.error("Error al obtener usuarios:", err);
                tbody.innerHTML = '<tr><td colspan="7" class="td-empty td-error">❌ Error al conectar con el servidor.</td></tr>';
                deshabilitarPaginacionCompleta();
            });
    }

    /**
     * Renderiza las filas en base al segmento de la página actual
     */
    function renderizarFilas(usuariosSegmento) {
        tbody.innerHTML = "";
        
        if (usuariosSegmento.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="td-empty">No se encontraron usuarios registrados.</td></tr>';
            return;
        }

        usuariosSegmento.forEach((u) => {
            const tr = document.createElement("tr");

            // Normalización y tratamiento de campos vacíos o nulos
            const n1 = u.nombre1 ? u.nombre1.trim() : "";
            const n2 = u.nombre2 ? u.nombre2.trim() : "";
            const a1 = u.apellido1 ? u.apellido1.trim() : "";
            const a2 = u.apellido2 ? u.apellido2.trim() : "";

            const nombreCompleto = [n1, n2, a1, a2].filter(Boolean).join(" ");

            const estadoTexto = parseInt(u.estado) === 1
                ? '<span class="badge badge-op-insert">Activo</span>'
                : '<span class="badge badge-op-delete">Inactivo</span>';

            tr.innerHTML = `
                <td><strong class="font-mono">#${u.id}</strong></td>
                <td><strong>${nombreCompleto || "S/N"}</strong></td>
                <td><code class="code-tag">${u.cedula || "—"}</code></td>
                <td>${u.correo || "—"}</td>
                <td class="font-mono">@${u.username}</td>
                <td><span class="badge badge-op-default">${u.nombre_rol || "Sin Rol"}</span></td>
                <td style="text-align: center;">${estadoTexto}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    /**
     * Calcula los índices de corte de la paginación y actualiza controles UI
     */
    function actualizarVistaPaginada() {
        const totalRegistros = usuariosFiltrados.length;
        
        // Obtener el límite del selector
        const limiteSeleccionado = selectLimites ? selectLimites.value : "10";
        registrosPorPagina = limiteSeleccionado === "todos" ? totalRegistros : parseInt(limiteSeleccionado);

        const totalPaginas = Math.ceil(totalRegistros / (registrosPorPagina || 1)) || 1;

        // Ajuste preventivo si la página actual excede el límite real
        if (paginaActual > totalPaginas) paginaActual = totalPaginas;
        if (paginaActual < 1) paginaActual = 1;

        // Corte de arreglo en memoria
        const indiceInicio = (paginaActual - 1) * registrosPorPagina;
        const indiceFin = Math.min(indiceInicio + registrosPorPagina, totalRegistros);
        const segmento = limiteSeleccionado === "todos" ? usuariosFiltrados : usuariosFiltrados.slice(indiceInicio, indiceFin);

        // Renderizado del bloque visible
        renderizarFilas(segmento);

        // Actualización de leyenda descriptiva
        if (infoPaginacion) {
            if (totalRegistros === 0) {
                infoPaginacion.textContent = "Mostrando 0 a 0 de 0 registros";
            } else {
                infoPaginacion.textContent = `Mostrando ${indiceInicio + 1} a ${indiceFin} de ${totalRegistros} registros`;
            }
        }

        // Control de estados activos de botones anterior / siguiente
        if (btnPrev) btnPrev.disabled = (paginaActual === 1 || limiteSeleccionado === "todos");
        if (btnNext) btnNext.disabled = (paginaActual === totalPaginas || limiteSeleccionado === "todos");

        generarBotonesNumericos(limiteSeleccionado === "todos" ? 1 : totalPaginas);
    }

    /**
     * Genera botones numéricos simétricos
     */
    function generarBotonesNumericos(totalPaginas) {
        if (!contenedorPaginas) return;
        contenedorPaginas.innerHTML = "";

        if (totalPaginas <= 1) return;

        for (let i = 1; i <= totalPaginas; i++) {
            const btnPagina = document.createElement("button");
            btnPagina.textContent = i;
            btnPagina.className = `page-btn ${i === paginaActual ? 'active' : ''}`;
            
            btnPagina.onclick = () => {
                paginaActual = i;
                actualizarVistaPaginada();
            };
            contenedorPaginas.appendChild(btnPagina);
        }
    }

    function deshabilitarPaginacionCompleta() {
        if (infoPaginacion) infoPaginacion.textContent = "Mostrando 0 a 0 de 0 registros";
        if (btnPrev) btnPrev.disabled = true;
        if (btnNext) btnNext.disabled = true;
        if (contenedorPaginas) contenedorPaginas.innerHTML = "";
    }

    // --- MANEJO DE EVENTOS ---

    if (btnRefrescar) {
        btnRefrescar.onclick = cargarTabla;
    }

    if (selectLimites) {
        selectLimites.onchange = () => {
            paginaActual = 1;
            actualizarVistaPaginada();
        };
    }

    if (btnPrev) {
        btnPrev.onclick = () => {
            if (paginaActual > 1) {
                paginaActual--;
                actualizarVistaPaginada();
            }
        };
    }

    if (btnNext) {
        btnNext.onclick = () => {
            const totalPaginas = Math.ceil(usuariosFiltrados.length / registrosPorPagina);
            if (paginaActual < totalPaginas) {
                paginaActual++;
                actualizarVistaPaginada();
            }
        };
    }

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const termino = e.target.value.toLowerCase().trim();

            if (termino === "") {
                usuariosFiltrados = [...usuariosLocales];
            } else {
                usuariosFiltrados = usuariosLocales.filter((u) => {
                    const n1 = u.nombre1 ? u.nombre1.toLowerCase() : "";
                    const n2 = u.nombre2 ? u.nombre2.toLowerCase() : "";
                    const a1 = u.apellido1 ? u.apellido1.toLowerCase() : "";
                    const a2 = u.apellido2 ? u.apellido2.toLowerCase() : "";
                    const cedula = u.cedula ? u.cedula.toLowerCase() : "";
                    const username = u.username ? u.username.toLowerCase() : "";
                    const correo = u.correo ? u.correo.toLowerCase() : "";

                    return (
                        n1.includes(termino) ||
                        n2.includes(termino) ||
                        a1.includes(termino) ||
                        a2.includes(termino) ||
                        cedula.includes(termino) ||
                        username.includes(termino) ||
                        correo.includes(termino)
                    );
                });
            }

            paginaActual = 1;
            actualizarVistaPaginada();
        };
    }

    cargarTabla();
}