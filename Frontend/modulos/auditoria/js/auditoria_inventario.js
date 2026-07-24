document.addEventListener("DOMContentLoaded", () => {
    let auditoriaTodas = [];
    let auditoriaFiltrada = [];
    let paginaActual = 1;
    let registrosPorPagina = 10;

    const tbody = document.getElementById("tbodyAuditoria");
    const filterTipo = document.getElementById("filterTipo");
    const fechaInicio = document.getElementById("fechaInicio");
    const fechaFin = document.getElementById("fechaFin");
    const btnFiltrar = document.getElementById("btnFiltrarAuditoria");
    const btnLimpiar = document.getElementById("btnLimpiarAuditoria");
    const inputBuscar = document.getElementById("inputBuscarAuditoria");
    const selectPageSize = document.getElementById("selectPageSize");
    const infoPaginacion = document.getElementById("infoPaginacion");
    const btnPaginacion = document.getElementById("btnPaginacion");

    const RUTA_BASE = "/ProyectoV3/Backend/controllers/movimiento_controller.php?accion=LISTAR_AUDITORIA";

    cargarAuditoria();

    btnFiltrar.addEventListener("click", () => {
        const tipo = filterTipo.value;
        const inicio = fechaInicio.value;
        const fin = fechaFin.value;

        let urlParams = "";
        if (tipo !== "") urlParams += `&tipo=${tipo}`;
        if (inicio !== "" && fin !== "") {
            urlParams += `&fecha_inicio=${inicio}&fecha_fin=${fin}`;
        }

        cargarAuditoria(urlParams);
    });

    btnLimpiar.addEventListener("click", () => {
        filterTipo.value = "";
        fechaInicio.value = "";
        fechaFin.value = "";
        inputBuscar.value = "";
        cargarAuditoria();
    });

    inputBuscar.addEventListener("input", () => {
        filtrarEnMemoria();
    });

    selectPageSize.addEventListener("change", (e) => {
        registrosPorPagina = parseInt(e.target.value);
        paginaActual = 1;
        renderizarTablaPaginada();
    });

    function cargarAuditoria(params = "") {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="td-empty">
                    Cargando historial de auditoría...
                </td>
            </tr>`;

        fetch(RUTA_BASE + params)
            .then(res => res.text())
            .then(texto => {
                try {
                    const res = JSON.parse(texto);

                    if (res.status === "success" && res.data) {
                        auditoriaTodas = res.data;
                        filtrarEnMemoria();
                    } else {
                        mostrarMensajeError("" + (res.message || "No se encontraron movimientos registrado."));
                    }
                } catch (err) {
                    console.error(err);
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="11" class="td-empty td-error">
                                <strong>Error de parsing JSON. Servidor respondió:</strong><br><pre class="json-debug">${texto}</pre>
                            </td>
                        </tr>`;
                    infoPaginacion.textContent = "Mostrando 0 - 0 de 0 movimientos";
                    btnPaginacion.innerHTML = "";
                }
            })
            .catch(err => {
                console.error(err);
                mostrarMensajeError("❌ Error de red al conectar con el servidor de auditoría.");
            });
    }

    function filtrarEnMemoria() {
        const termino = inputBuscar.value.toLowerCase().trim();

        auditoriaFiltrada = auditoriaTodas.filter(m => {
            const producto = (m.producto_nombre || "").toLowerCase();
            const responsable = (m.usuario_responsable || "").toLowerCase();
            const observacion = (m.observacion || "").toLowerCase();
            const proveedor = (m.proveedor || "").toLowerCase();
            const cliente = (m.identificacion_comprador || "").toLowerCase();
            const punto = (m.punto_emision_origen || "").toLowerCase();

            return producto.includes(termino) ||
                   responsable.includes(termino) ||
                   observacion.includes(termino) ||
                   proveedor.includes(termino) ||
                   cliente.includes(termino) ||
                   punto.includes(termino);
        });

        paginaActual = 1;
        renderizarTablaPaginada();
    }

    function renderizarTablaPaginada() {
        tbody.innerHTML = "";

        if (auditoriaFiltrada.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" class="td-empty">
                        No se registraron movimientos con los criterios aplicados.
                    </td>
                </tr>`;
            infoPaginacion.textContent = "Mostrando 0 - 0 de 0 movimientos";
            btnPaginacion.innerHTML = "";
            return;
        }

        const totalRegistros = auditoriaFiltrada.length;
        const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * registrosPorPagina;
        const fin = Math.min(inicio + registrosPorPagina, totalRegistros);
        const subconjunto = auditoriaFiltrada.slice(inicio, fin);

        subconjunto.forEach(m => {
            const tr = document.createElement("tr");

            let badgeClass = "badge-ingreso";
            if (m.tipo_movimiento_texto.includes("2")) badgeClass = "badge-egreso";
            else if (m.tipo_movimiento_texto.includes("3")) badgeClass = "badge-venta";

            let docRefHtml = "";
            if (m.numero_factura !== "N/A") {
                docRefHtml = `<span><b>Cliente:</b> ${m.identificacion_comprador !== "N/A" ? m.identificacion_comprador : 'Consumidor Final'}</span>`;
            } else if (m.proveedor !== "N/A") {
                docRefHtml = `<span>${m.proveedor}</span><br><small class="text-muted">Prov.</small>`;
            } else {
                docRefHtml = `<span class="text-disabled">N/A</span>`;
            }

            let accionesHtml = "";
            if (m.numero_factura !== "N/A" && m.id_factura) {
                accionesHtml = `
                    <button onclick="reimprimirFactura(${m.id_factura})" class="btn-ver-factura" title="Ver Factura Original ${m.numero_factura}">
                        📄 Ver Factura
                    </button>`;
            } else {
                accionesHtml = `<span class="text-disabled">-</span>`;
            }

            tr.innerHTML = `
                <td><strong>${m.producto_nombre}</strong></td>
                <td><span class="badge ${badgeClass}">${m.tipo_movimiento_texto}</span></td>
                <td style="text-align: right;" class="text-muted font-mono">${parseFloat(m.stock_anterior).toFixed(2)}</td>
                <td style="text-align: right;" class="font-bold text-primary">${parseFloat(m.cantidad_cambio).toFixed(2)} <span class="text-unit">${m.unidad_medida}</span></td>
                <td style="text-align: right;" class="font-bold text-success font-mono">${parseFloat(m.stock_posterior).toFixed(2)}</td>
                <td>${m.punto_emision_origen}</td>
                <td>${docRefHtml}</td>
                <td>${m.usuario_responsable}</td>
                <td class="td-obs" title="${m.observacion || ''}">
                    <i>${m.observacion || 'Sin observaciones'}</i>
                </td>
                <td class="text-date">${m.fecha_movimiento}</td>
                <td style="text-align: center;">${accionesHtml}</td>
            `;

            tbody.appendChild(tr);
        });

        infoPaginacion.textContent = `Mostrando ${inicio + 1} - ${fin} de ${totalRegistros} movimientos`;
        renderizarControlesPaginacion(totalPaginas);
    }

    function renderizarControlesPaginacion(totalPaginas) {
        btnPaginacion.innerHTML = "";

        if (totalPaginas <= 1) return;

        const btnPrev = document.createElement("button");
        btnPrev.className = "page-btn";
        btnPrev.textContent = "«";
        btnPrev.disabled = paginaActual === 1;
        btnPrev.onclick = () => {
            if (paginaActual > 1) {
                paginaActual--;
                renderizarTablaPaginada();
            }
        };
        btnPaginacion.appendChild(btnPrev);

        for (let i = 1; i <= totalPaginas; i++) {
            const btnPage = document.createElement("button");
            btnPage.className = `page-btn ${i === paginaActual ? 'active' : ''}`;
            btnPage.textContent = i;
            btnPage.onclick = () => {
                paginaActual = i;
                renderizarTablaPaginada();
            };
            btnPaginacion.appendChild(btnPage);
        }

        const btnNext = document.createElement("button");
        btnNext.className = "page-btn";
        btnNext.textContent = "»";
        btnNext.disabled = paginaActual === totalPaginas;
        btnNext.onclick = () => {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderizarTablaPaginada();
            }
        };
        btnPaginacion.appendChild(btnNext);
    }

    function mostrarMensajeError(mensaje) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="td-empty td-error">
                    ${mensaje}
                </td>
            </tr>`;
        infoPaginacion.textContent = "Mostrando 0 - 0 de 0 movimientos";
        btnPaginacion.innerHTML = "";
    }
});

window.reimprimirFactura = (idFactura) => {
    const urlPdf = `/ProyectoV3/Backend/controllers/reporte_factura_pdf.php?id=${idFactura}`;
    window.open(urlPdf, '_blank');
};