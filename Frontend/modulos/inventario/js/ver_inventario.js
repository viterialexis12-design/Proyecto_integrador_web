document.addEventListener("DOMContentLoaded", () => {
    let inventarioTodos = [];
    let inventarioFiltrado = [];
    let paginaActual = 1;
    let registrosPorPagina = 10;

    const tbody = document.getElementById("tbodyInventario");
    const chkSoloAlertas = document.getElementById("chkSoloAlertas");
    const panelContadorAlertas = document.getElementById("panelContadorAlertas");
    const txtContadorMensaje = document.getElementById("txtContadorMensaje");
    
    const inputBuscar = document.getElementById("inputBuscarInventario");
    const btnLimpiar = document.getElementById("btnLimpiarInventario");
    const selectPageSize = document.getElementById("selectPageSize");
    const infoPaginacion = document.getElementById("infoPaginacion");
    const btnPaginacion = document.getElementById("btnPaginacion");

    const RUTA_CONTROLLER = "../../../Backend/controllers/producto_controller.php";

    cargarInventario();

    chkSoloAlertas.addEventListener("change", () => {
        cargarInventario(chkSoloAlertas.checked);
    });

    inputBuscar.addEventListener("input", () => {
        filtrarEnMemoria();
    });

    btnLimpiar.addEventListener("click", () => {
        inputBuscar.value = "";
        filtrarEnMemoria();
    });

    selectPageSize.addEventListener("change", (e) => {
        registrosPorPagina = parseInt(e.target.value);
        paginaActual = 1;
        renderizarTablaPaginada();
    });

    function cargarInventario(soloAlertas = false) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="td-empty">
                     Consultando existencias en bodega...
                </td>
            </tr>`;

        const urlFetch = soloAlertas ? `${RUTA_CONTROLLER}?alerta=1` : RUTA_CONTROLLER;

        fetch(urlFetch, { method: "GET" })
            .then(res => res.json())
            .then(response => {
                if (response.status === "success" && response.data) {
                    inventarioTodos = response.data;
                    evaluarAlertasGlobales(inventarioTodos, soloAlertas);
                    filtrarEnMemoria();
                } else {
                    mostrarMensajeError("" + (response.message || "Error al obtener existencias."));
                }
            })
            .catch(err => {
                console.error(err);
                mostrarMensajeError("❌ No se pudo conectar con el controlador de inventario.");
            });
    }

    function evaluarAlertasGlobales(productos, filtradoAlertasActivo) {
        let contadorCriticos = 0;

        productos.forEach(prod => {
            const stock = parseFloat(prod.stockActual);
            if (stock <= 5.00 && prod.estado == 1) {
                contadorCriticos++;
            }
        });

        if (!filtradoAlertasActivo) {
            if (contadorCriticos > 0) {
                txtContadorMensaje.innerHTML = `¡Atención! Hay <strong>${contadorCriticos}</strong> producto(s) con stock crítico por debajo del límite de reposición (5 unidades).`;
                panelContadorAlertas.style.display = "block";
            } else {
                panelContadorAlertas.style.display = "none";
            }
        }
    }

    function filtrarEnMemoria() {
        const termino = inputBuscar.value.toLowerCase().trim();

        inventarioFiltrado = inventarioTodos.filter(prod => {
            const id = (prod.id || "").toString().toLowerCase();
            const nombre = (prod.nombre || "").toLowerCase();
            const descripcion = (prod.descripcion || "").toLowerCase();
            const categoria = (prod.categoria_nombre || "").toLowerCase();

            return id.includes(termino) || 
                   nombre.includes(termino) || 
                   descripcion.includes(termino) || 
                   categoria.includes(termino);
        });

        paginaActual = 1;
        renderizarTablaPaginada();
    }

    function renderizarTablaPaginada() {
        tbody.innerHTML = "";

        if (inventarioFiltrado.length === 0) {
            const mensajeVacio = chkSoloAlertas.checked 
                ? '🎉 ¡Excelente! Ningún producto está por debajo del stock mínimo.' 
                : 'No se encontraron registros de inventario con los criterios ingresados.';

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="td-empty">
                        ${mensajeVacio}
                    </td>
                </tr>`;
            infoPaginacion.textContent = "Mostrando 0 - 0 de 0 registros";
            btnPaginacion.innerHTML = "";
            return;
        }

        const totalRegistros = inventarioFiltrado.length;
        const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * registrosPorPagina;
        const fin = Math.min(inicio + registrosPorPagina, totalRegistros);
        const subconjunto = inventarioFiltrado.slice(inicio, fin);

        subconjunto.forEach(prod => {
            const tr = document.createElement("tr");
            const stock = parseFloat(prod.stockActual);
            const esCritico = stock <= 5.00 && prod.estado == 1;

            if (esCritico) {
                tr.classList.add("row-critical");
            }

            let badgeStock = `<span class="badge badge-success">Normal</span>`;
            if (prod.estado == 0) {
                badgeStock = `<span class="badge badge-danger">Inactivo</span>`;
            } else if (stock === 0) {
                badgeStock = `<span class="badge badge-exhausted">Agotado (0)</span>`;
            } else if (stock <= 5.00) {
                badgeStock = `<span class="badge badge-warning-urgent">Reposición Urgente</span>`;
            }

            const textoDescripcion = prod.descripcion 
                ? prod.descripcion 
                : 'Sin especificaciones';

            tr.innerHTML = `
                <td><code class="id-code">${prod.id}</code></td>
                <td>
                    <span class="prod-nombre ${esCritico ? 'critical-text' : ''}">${prod.nombre}</span>
                    <small class="prod-desc">${textoDescripcion}</small>
                </td>
                <td><span class="categoria-label">${prod.categoria_nombre || 'General'}</span></td>
                <td style="text-align: right;" class="font-mono">$${parseFloat(prod.precioUnitario).toFixed(4)}</td>
                <td style="text-align: right;" class="font-mono font-bold ${esCritico ? 'critical-stock' : ''}">
                    ${stock.toFixed(2)}
                </td>
                <td style="text-align: center;"><code class="id-code">${prod.unidadMedida}</code></td>
                <td style="text-align: center;">${badgeStock}</td>
            `;

            tbody.appendChild(tr);
        });

        infoPaginacion.textContent = `Mostrando ${inicio + 1} - ${fin} de ${totalRegistros} registros`;
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
        infoPaginacion.textContent = "Mostrando 0 - 0 de 0 registros";
        btnPaginacion.innerHTML = "";
    }
});