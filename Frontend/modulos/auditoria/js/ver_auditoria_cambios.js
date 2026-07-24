/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA AUDITORÍA DE CAMBIOS EN DATOS (ver_auditoria_cambios.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarVerAuditoria();
});

function inicializarVerAuditoria() {
    const tbody = document.getElementById("tbodyAuditorias");
    const btnRefrescar = document.getElementById("btnRefrescarAuditoria");
    const txtBuscar = document.getElementById("txtBuscarAuditoria");
    const selectFiltroTabla = document.getElementById("selectFiltroTabla");
    const fechaInicioInput = document.getElementById("fechaInicio");
    const fechaFinInput = document.getElementById("fechaFin");
    const selectLimites = document.getElementById("selectLimites");

    // Modal
    const modalDetalle = document.getElementById("modalDetalleAuditoria");
    const btnCerrarModal = document.getElementById("btnCerrarModal");
    const jsonAnteriorBox = document.getElementById("jsonAnterior");
    const jsonNuevoBox = document.getElementById("jsonNuevo");

    // Elementos del paginador
    const btnPrevPage = document.getElementById("btnPrevPage");
    const btnNextPage = document.getElementById("btnNextPage");
    const contenedorNumerosPagina = document.getElementById("contenedorNumerosPagina");
    const infoPaginacion = document.getElementById("infoPaginacion");

    // Variables de Estado
    let datosCrudosServidor = [];
    let datosFiltrados = [];
    let paginaActual = 1;
    let filasPorPagina = 5;

    /**
     * Solicita las auditorías al controlador PHP
     */
    function cargarTabla() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="6" class="td-empty"> Cargando historial de auditoría...</td></tr>';

        const params = new URLSearchParams();
        if (selectFiltroTabla && selectFiltroTabla.value) {
            params.append("tabla", selectFiltroTabla.value);
        }
        if (fechaInicioInput && fechaInicioInput.value) {
            params.append("fecha_inicio", fechaInicioInput.value);
        }
        if (fechaFinInput && fechaFinInput.value) {
            params.append("fecha_fin", fechaFinInput.value);
        }

        const url = `/ProyectoV3/Backend/controllers/auditoria_controller.php?${params.toString()}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Error en la respuesta de red");
                return res.json();
            })
            .then(response => {
                if (response.status === "success") {
                    datosCrudosServidor = response.data || [];
                    procesarYFiltrarDatos();
                } else {
                    tbody.innerHTML = `<tr><td colspan="6" class="td-empty td-error">${response.message || 'No se encontraron registros.'}</td></tr>`;
                    actualizarControlesPaginador(0, 0, 0);
                }
            })
            .catch(err => {
                console.error("Error al obtener auditorías:", err);
                tbody.innerHTML = '<tr><td colspan="6" class="td-empty td-error">❌ Error de conexión con el servidor.</td></tr>';
                actualizarControlesPaginador(0, 0, 0);
            });
    }

    /**
     * Aplica el filtro del buscador en tiempo real
     */
    function procesarYFiltrarDatos() {
        const termino = txtBuscar ? txtBuscar.value.toLowerCase().trim() : "";

        if (termino === "") {
            datosFiltrados = datosCrudosServidor;
        } else {
            datosFiltrados = datosCrudosServidor.filter(item => {
                const usuario = (item.usuario_nombre || "").toLowerCase();
                const username = (item.username || "").toLowerCase();
                const tabla = (item.tabla_afectada || "").toLowerCase();
                const registroId = String(item.registro_id || "");
                const operacion = (item.operacion || "").toLowerCase();

                return (
                    usuario.includes(termino) ||
                    username.includes(termino) ||
                    tabla.includes(termino) ||
                    registroId.includes(termino) ||
                    operacion.includes(termino)
                );
            });
        }

        paginaActual = 1;
        renderizarPagina();
    }

    /**
     * Genera la estructura HTML de la página actual
     */
    function renderizarPagina() {
        tbody.innerHTML = "";
        const totalRegistros = datosFiltrados.length;

        if (totalRegistros === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="td-empty">No se encontraron registros de auditoría.</td></tr>';
            actualizarControlesPaginador(0, 0, 0);
            return;
        }

        let inicioIndice = (paginaActual - 1) * (filasPorPagina === "todos" ? totalRegistros : filasPorPagina);
        let finIndice = filasPorPagina === "todos" ? totalRegistros : inicioIndice + filasPorPagina;

        const subconjunto = datosFiltrados.slice(inicioIndice, finIndice);

        subconjunto.forEach(item => {
            const tr = document.createElement("tr");

            const badgeOp = obtenerBadgeOperacionHTML(item.operacion);
            const fechaFormateada = item.fecha_movimiento || "—";
            const usuarioTexto = item.usuario_nombre ? `${item.usuario_nombre} <small class="text-muted">(@${item.username})</small>` : "SISTEMA";

            tr.innerHTML = `
                <td class="text-date">${fechaFormateada}</td>
                <td><strong>${usuarioTexto}</strong></td>
                <td><code class="code-tag">${item.tabla_afectada}</code></td>
                <td>${badgeOp}</td>
                <td><strong class="font-mono">#${item.registro_id}</strong></td>
                <td style="text-align: center;">
                    <button class="btn-ver-json" data-id="${item.id}">
                        Comparar
                    </button>
                </td>
            `;

            const btnVer = tr.querySelector(".btn-ver-json");
            btnVer.onclick = () => abrirModalJson(item);

            tbody.appendChild(tr);
        });

        const registroFinReal = Math.min(finIndice, totalRegistros);
        actualizarControlesPaginador(inicioIndice + 1, registroFinReal, totalRegistros);
    }

    /**
     * Retorna la etiqueta formateada para la operación
     */
    function obtenerBadgeOperacionHTML(operacion) {
        switch (operacion) {
            case 'INSERT':
                return '<span class="badge badge-op-insert">INSERT</span>';
            case 'UPDATE':
                return '<span class="badge badge-op-update">UPDATE</span>';
            case 'LOGICAL_DELETE':
                return '<span class="badge badge-op-delete">🚫 DESACTIVADO</span>';
            case 'REACTIVATE':
                return '<span class="badge badge-op-reactivate">REACTIVADO</span>';
            default:
                return `<span class="badge badge-op-default">${operacion}</span>`;
        }
    }

    /**
     * Despliega el modal con los objetos JSON formateados
     */
    function abrirModalJson(item) {
        let jsonAntesTexto = "N/A (Creación de registro)";
        let jsonNuevoTexto = "N/A (Eliminación)";

        if (item.valor_anterior) {
            try {
                const parsed = typeof item.valor_anterior === 'string' ? JSON.parse(item.valor_anterior) : item.valor_anterior;
                jsonAntesTexto = JSON.stringify(parsed, null, 4);
            } catch (e) {
                jsonAntesTexto = item.valor_anterior;
            }
        }

        if (item.valor_nuevo) {
            try {
                const parsed = typeof item.valor_nuevo === 'string' ? JSON.parse(item.valor_nuevo) : item.valor_nuevo;
                jsonNuevoTexto = JSON.stringify(parsed, null, 4);
            } catch (e) {
                jsonNuevoTexto = item.valor_nuevo;
            }
        }

        jsonAnteriorBox.textContent = jsonAntesTexto;
        jsonNuevoBox.textContent = jsonNuevoTexto;
        modalDetalle.style.display = "flex";
    }

    function cerrarModal() {
        modalDetalle.style.display = "none";
    }

    /**
     * Actualiza el estado visual del paginador
     */
    function actualizarControlesPaginador(inicio, fin, total) {
        if (filasPorPagina === "todos" || total === 0) {
            infoPaginacion.textContent = `Mostrando ${total} de ${total} registros`;
            btnPrevPage.disabled = true;
            btnNextPage.disabled = true;
            contenedorNumerosPagina.innerHTML = "";
            return;
        }

        infoPaginacion.textContent = `Mostrando ${inicio} a ${fin} de ${total} registros`;
        const totalPaginas = Math.ceil(total / filasPorPagina);

        btnPrevPage.disabled = (paginaActual === 1);
        btnNextPage.disabled = (paginaActual === totalPaginas);

        contenedorNumerosPagina.innerHTML = "";
        for (let i = 1; i <= totalPaginas; i++) {
            const btnNum = document.createElement("button");
            btnNum.textContent = i;
            btnNum.className = `page-btn ${i === paginaActual ? 'active' : ''}`;

            btnNum.onclick = () => {
                paginaActual = i;
                renderizarPagina();
            };

            contenedorNumerosPagina.appendChild(btnNum);
        }
    }

    // --- Vinculación de Eventos ---

    if (btnRefrescar) btnRefrescar.onclick = cargarTabla;
    if (txtBuscar) txtBuscar.oninput = procesarYFiltrarDatos;
    if (selectFiltroTabla) selectFiltroTabla.onchange = cargarTabla;
    if (fechaInicioInput) fechaInicioInput.onchange = cargarTabla;
    if (fechaFinInput) fechaFinInput.onchange = cargarTabla;

    if (selectLimites) {
        selectLimites.onchange = (e) => {
            const val = e.target.value;
            filasPorPagina = val === "todos" ? "todos" : parseInt(val);
            paginaActual = 1;
            renderizarPagina();
        };
    }

    if (btnPrevPage) {
        btnPrevPage.onclick = () => {
            if (paginaActual > 1) {
                paginaActual--;
                renderizarPagina();
            }
        };
    }

    if (btnNextPage) {
        btnNextPage.onclick = () => {
            const totalPaginas = Math.ceil(datosFiltrados.length / (filasPorPagina === "todos" ? datosFiltrados.length : filasPorPagina));
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderizarPagina();
            }
        };
    }

    if (btnCerrarModal) btnCerrarModal.onclick = cerrarModal;

    window.onclick = (e) => {
        if (e.target === modalDetalle) cerrarModal();
    };

    // Carga inicial
    cargarTabla();
}