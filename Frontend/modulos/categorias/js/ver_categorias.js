document.addEventListener("DOMContentLoaded", () => {
    let categoriasTodas = [];
    let categoriasFiltradas = [];
    let paginaActual = 1;
    let registrosPorPagina = 10;

    const tbody = document.getElementById("tbodyCategorias");
    const inputBuscar = document.getElementById("inputBuscarCategoria");
    const btnLimpiar = document.getElementById("btnLimpiarCategoria");
    const selectPageSize = document.getElementById("selectPageSize");
    const infoPaginacion = document.getElementById("infoPaginacion");
    const btnPaginacion = document.getElementById("btnPaginacion");

    const RUTA_CONTROLLER = "../../../Backend/controllers/categoria_controller.php";

    cargarCatalogoCategorias();

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

    function cargarCatalogoCategorias() {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="td-empty">
                    ⏳ Cargando categorías desde el servidor...
                </td>
            </tr>`;

        fetch(RUTA_CONTROLLER, { method: "GET" })
            .then(res => res.json())
            .then(response => {
                if (response.status === "success" && response.data) {
                    categoriasTodas = response.data;
                    categoriasFiltradas = [...categoriasTodas];
                    paginaActual = 1;
                    renderizarTablaPaginada();
                } else {
                    mostrarMensajeError("⚠️ " + (response.message || "No se encontraron categorías."));
                }
            })
            .catch(err => {
                console.error(err);
                mostrarMensajeError("❌ Error de comunicación con el controlador de categorías.");
            });
    }

    function filtrarEnMemoria() {
        const termino = inputBuscar.value.toLowerCase().trim();

        categoriasFiltradas = categoriasTodas.filter(cat => {
            const nombre = (cat.nombre || "").toLowerCase();
            const descripcion = (cat.descripcion || "").toLowerCase();
            const idIva = (cat.id_ivaSRI || "").toString().toLowerCase();

            return nombre.includes(termino) || 
                   descripcion.includes(termino) || 
                   idIva.includes(termino);
        });

        paginaActual = 1;
        renderizarTablaPaginada();
    }

    function renderizarTablaPaginada() {
        tbody.innerHTML = "";

        if (categoriasFiltradas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="td-empty">
                        No se encontraron registros de categorías con los criterios ingresados.
                    </td>
                </tr>`;
            infoPaginacion.textContent = "Mostrando 0 - 0 de 0 categorías";
            btnPaginacion.innerHTML = "";
            return;
        }

        const totalRegistros = categoriasFiltradas.length;
        const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * registrosPorPagina;
        const fin = Math.min(inicio + registrosPorPagina, totalRegistros);
        const subconjunto = categoriasFiltradas.slice(inicio, fin);

        subconjunto.forEach(cat => {
            const tr = document.createElement("tr");

            const badgeEstado = cat.estado == 1 
                ? '<span class="badge badge-success">Activo</span>' 
                : '<span class="badge badge-danger">Inactivo</span>';

            const textoDescripcion = cat.descripcion 
                ? cat.descripcion 
                : '<em class="text-muted">Sin descripción</em>';

            tr.innerHTML = `
                <td><code class="id-code">${cat.id}</code></td>
                <td><strong>${cat.nombre}</strong></td>
                <td>${textoDescripcion}</td>
                <td><code class="id-code">${cat.id_ivaSRI}</code></td>
                <td style="text-align: center;">${badgeEstado}</td>
            `;

            tbody.appendChild(tr);
        });

        infoPaginacion.textContent = `Mostrando ${inicio + 1} - ${fin} de ${totalRegistros} categorías`;
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
                <td colspan="5" class="td-empty" style="color: #dc2626; font-weight: 500;">
                    ${mensaje}
                </td>
            </tr>`;
        infoPaginacion.textContent = "Mostrando 0 - 0 de 0 categorías";
        btnPaginacion.innerHTML = "";
    }
});