document.addEventListener("DOMContentLoaded", () => {
    let productosTodos = [];
    let productosFiltrados = [];
    let paginaActual = 1;
    let registrosPorPagina = 10;

    const tbody = document.getElementById("tbodyProductos");
    const inputBuscar = document.getElementById("inputBuscar");
    const selectPageSize = document.getElementById("selectPageSize");
    const infoPaginacion = document.getElementById("infoPaginacion");
    const btnPaginacion = document.getElementById("btnPaginacion");

    const RUTA_CONTROLLER = "../../../Backend/controllers/producto_controller.php";

    cargarCatalogoProductos();

    inputBuscar.addEventListener("input", () => {
        filtrarProductos();
    });

    selectPageSize.addEventListener("change", (e) => {
        registrosPorPagina = parseInt(e.target.value);
        paginaActual = 1;
        renderizarTablaPaginada();
    });

    function cargarCatalogoProductos() {
        fetch(RUTA_CONTROLLER, { method: "GET" })
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    productosTodos = response.data || [];
                    productosFiltrados = [...productosTodos];
                    renderizarTablaPaginada();
                } else {
                    mostrarMensajeError("No se pudo cargar el inventario: " + response.message);
                }
            })
            .catch(err => {
                console.error(err);
                mostrarMensajeError("❌ Error crítico de comunicación con el controlador de productos.");
            });
    }

    function filtrarProductos() {
        const termino = inputBuscar.value.toLowerCase().trim();
        
        productosFiltrados = productosTodos.filter(p => {
            const idMatch = p.id.toString().includes(termino);
            const nombreMatch = p.nombre.toLowerCase().includes(termino);
            const catMatch = (p.categoria_nombre || "").toLowerCase().includes(termino);
            return idMatch || nombreMatch || catMatch;
        });

        paginaActual = 1;
        renderizarTablaPaginada();
    }

    function renderizarTablaPaginada() {
        tbody.innerHTML = "";

        if (productosFiltrados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="td-empty">
                        No se encontraron productos registrados.
                    </td>
                </tr>`;
            infoPaginacion.textContent = "Mostrando 0 - 0 de 0 productos";
            btnPaginacion.innerHTML = "";
            return;
        }

        const totalRegistros = productosFiltrados.length;
        const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
        
        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * registrosPorPagina;
        const fin = Math.min(inicio + registrosPorPagina, totalRegistros);
        const subconjuntoPaginado = productosFiltrados.slice(inicio, fin);

        subconjuntoPaginado.forEach(prod => {
            const tr = document.createElement("tr");

            const estadoBadge = parseInt(prod.estado) === 1 
                ? '<span class="badge-activo">Activo</span>' 
                : '<span class="badge-inactivo">Inactivo</span>';

            const precioFormateado = parseFloat(prod.precioUnitario).toFixed(4);
            const stockFormateado = parseFloat(prod.stockActual).toFixed(2);
            const descripcionTexto = prod.descripcion ? prod.descripcion : 'Sin descripción';

            tr.innerHTML = `
                <td><strong>${prod.id}</strong></td>
                <td>
                    <span class="prod-nombre">${prod.nombre}</span>
                    <small class="prod-desc" title="${descripcionTexto}">${descripcionTexto}</small>
                </td>
                <td><span class="categoria-badge">${prod.categoria_nombre || 'General'}</span></td>
                <td class="td-precio">$${precioFormateado}</td>
                <td class="td-stock">${stockFormateado}</td>
                <td class="td-unidad"><code class="unit-code">${prod.unidadMedida}</code></td>
                <td class="td-estado">${estadoBadge}</td>
            `;

            tbody.appendChild(tr);
        });

        infoPaginacion.textContent = `Mostrando ${inicio + 1} - ${fin} de ${totalRegistros} productos`;
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
        infoPaginacion.textContent = "Mostrando 0 - 0 de 0 productos";
        btnPaginacion.innerHTML = "";
    }
});