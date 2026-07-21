document.addEventListener("DOMContentLoaded", () => {
    let ventasTodas = [];
    let ventasFiltradas = [];
    let paginaActual = 1;
    let registrosPorPagina = 10;

    const tbody = document.getElementById("tbodyVentasGenerales");
    const inputBuscar = document.getElementById("buscarClienteG");
    const inputDesde = document.getElementById("fechaDesdeG");
    const inputHasta = document.getElementById("fechaHastaG");
    const btnFiltrar = document.getElementById("btnFiltrarG");
    const btnLimpiar = document.getElementById("btnLimpiarG");
    const selectPageSize = document.getElementById("selectPageSize");
    const infoPaginacion = document.getElementById("infoPaginacion");
    const btnPaginacion = document.getElementById("btnPaginacion");

    cargarVentasGenerales();

    btnFiltrar.addEventListener("click", () => {
        const cliente = inputBuscar.value.trim();
        const desde = inputDesde.value;
        const hasta = inputHasta.value;

        let urlParams = "";
        if (cliente !== "") {
            urlParams = `&cliente=${encodeURIComponent(cliente)}`;
            inputDesde.value = "";
            inputHasta.value = "";
        } else if (desde !== "" && hasta !== "") {
            urlParams = `&desde=${desde}&hasta=${hasta}`;
        }

        cargarVentasGenerales(urlParams);
    });

    btnLimpiar.addEventListener("click", () => {
        inputBuscar.value = "";
        inputDesde.value = "";
        inputHasta.value = "";
        cargarVentasGenerales();
    });

    inputBuscar.addEventListener("input", () => {
        filtrarEnMemoria();
    });

    selectPageSize.addEventListener("change", (e) => {
        registrosPorPagina = parseInt(e.target.value);
        paginaActual = 1;
        renderizarTablaPaginada();
    });

    function cargarVentasGenerales(params = "") {
        const RUTA_BASE = "/ProyectoV3/Backend/controllers/factura_controller.php?ventas_generales=true";

        fetch(RUTA_BASE + params)
            .then(res => res.json())
            .then(res => {
                if (res.status === "success") {
                    ventasTodas = res.data || [];
                    ventasFiltradas = [...ventasTodas];
                    paginaActual = 1;
                    renderizarTablaPaginada();
                } else {
                    mostrarMensajeError("⚠️ " + (res.message || "No se encontraron registros."));
                }
            })
            .catch(err => {
                console.error(err);
                mostrarMensajeError("❌ Error de red al conectar con el servidor.");
            });
    }

    function filtrarEnMemoria() {
        const termino = inputBuscar.value.toLowerCase().trim();

        ventasFiltradas = ventasTodas.filter(v => {
            const clienteMatch = (v.cliente_nombre_completo || "").toLowerCase().includes(termino);
            const rucMatch = (v.cliente_identificacion || "").toLowerCase().includes(termino);
            const secuencialMatch = (v.factura_secuencial || "").toString().includes(termino);
            const usuarioMatch = (v.usuario_nombre_completo || "").toLowerCase().includes(termino);
            const puntoMatch = (v.punto_emision_nombre || "").toLowerCase().includes(termino);
            
            return clienteMatch || rucMatch || secuencialMatch || usuarioMatch || puntoMatch;
        });

        paginaActual = 1;
        renderizarTablaPaginada();
    }

    function renderizarTablaPaginada() {
        tbody.innerHTML = "";

        if (ventasFiltradas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="td-empty">
                        No se encontraron registros con los criterios ingresados.
                    </td>
                </tr>`;
            infoPaginacion.textContent = "Mostrando 0 - 0 de 0 ventas";
            btnPaginacion.innerHTML = "";
            return;
        }

        const totalRegistros = ventasFiltradas.length;
        const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * registrosPorPagina;
        const fin = Math.min(inicio + registrosPorPagina, totalRegistros);
        const subconjunto = ventasFiltradas.slice(inicio, fin);

        subconjunto.forEach(v => {
            const secuencial = String(v.factura_secuencial).padStart(9, '0');
            const nroComprobante = `${v.punto_emision_codigo}-001-${secuencial}`;
            const totalFormateado = parseFloat(v.total_factura).toFixed(2);

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td><span class="factura-num">${nroComprobante}</span></td>
                <td>${v.fecha_emision}</td>
                <td><code class="id-code">${v.punto_emision_nombre || 'Matriz'}</code></td>
                <td><span class="usuario-tag">👤 ${v.usuario_nombre_completo}</span></td>
                <td>${v.cliente_nombre_completo}</td>
                <td class="td-total">$${totalFormateado}</td>
                <td class="td-acciones">
                    <button class="btn-pdf" onclick="reimprimirFactura(${v.factura_id})">
                        📄 Ver PDF
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        infoPaginacion.textContent = `Mostrando ${inicio + 1} - ${fin} de ${totalRegistros} ventas`;
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
                <td colspan="7" class="td-empty" style="color: #dc2626; font-weight: 500;">
                    ${mensaje}
                </td>
            </tr>`;
        infoPaginacion.textContent = "Mostrando 0 - 0 de 0 ventas";
        btnPaginacion.innerHTML = "";
    }
});

window.reimprimirFactura = (idFactura) => {
    const urlPdf = `/ProyectoV3/Backend/controllers/reporte_factura_pdf.php?id=${idFactura}`;
    window.open(urlPdf, '_blank');
};