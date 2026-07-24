document.addEventListener("DOMContentLoaded", () => {
    let puntosTodos = [];
    let puntosFiltrados = [];
    let paginaActual = 1;
    let registrosPorPagina = 10;

    const tbody = document.getElementById("tbodyPuntosEmision");
    const inputBuscar = document.getElementById("inputBuscar");
    const selectPageSize = document.getElementById("selectPageSize");
    const infoPaginacion = document.getElementById("infoPaginacion");
    const btnPaginacion = document.getElementById("btnPaginacion");

    const RUTA_CONTROLLER = "../../../Backend/controllers/puntoEmision_controller.php";

    cargarPuntosEmision();

    inputBuscar.addEventListener("input", () => {
        filtrarPuntos();
    });

    selectPageSize.addEventListener("change", (e) => {
        registrosPorPagina = parseInt(e.target.value);
        paginaActual = 1;
        renderizarTablaPaginada();
    });

    function cargarPuntosEmision() {
        fetch(RUTA_CONTROLLER, { method: "GET" })
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    puntosTodos = response.data || [];
                    puntosFiltrados = [...puntosTodos];
                    renderizarTablaPaginada();
                } else {
                    mostrarMensajeError("" + (response.message || "No se encontraron puntos de emisión."));
                }
            })
            .catch(err => {
                console.error(err);
                mostrarMensajeError("❌ Error de comunicación con el servidor.");
            });
    }

    function filtrarPuntos() {
        const termino = inputBuscar.value.toLowerCase().trim();

        puntosFiltrados = puntosTodos.filter(p => {
            const nombreMatch = (p.nombre || "").toLowerCase().includes(termino);
            const codigoMatch = (p.codigoSRI || "").toLowerCase().includes(termino);
            const usuarioMatch = p.id_usuario ? p.id_usuario.toString().includes(termino) : false;
            return nombreMatch || codigoMatch || usuarioMatch;
        });

        paginaActual = 1;
        renderizarTablaPaginada();
    }

    function renderizarTablaPaginada() {
        tbody.innerHTML = "";

        if (puntosFiltrados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="td-empty">
                        No se encontraron puntos de emisión registrados.
                    </td>
                </tr>`;
            infoPaginacion.textContent = "Mostrando 0 - 0 de 0 puntos";
            btnPaginacion.innerHTML = "";
            return;
        }

        const totalRegistros = puntosFiltrados.length;
        const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * registrosPorPagina;
        const fin = Math.min(inicio + registrosPorPagina, totalRegistros);
        const subconjuntoPaginado = puntosFiltrados.slice(inicio, fin);

        subconjuntoPaginado.forEach(punto => {
            const tr = document.createElement("tr");

            const estadoBadge = parseInt(punto.estado) === 1
                ? '<span class="badge-activo">Activo</span>'
                : '<span class="badge-inactivo">Inactivo</span>';

            const usuarioTexto = punto.id_usuario 
                ? `<span class="usuario-tag">Usuario #${punto.id_usuario}</span>` 
                : '<span class="usuario-vacio">Sin asignar</span>';

            tr.innerHTML = `
                <td><span class="punto-nombre">${punto.nombre}</span></td>
                <td class="td-codigo"><code class="sri-code">${punto.codigoSRI}</code></td>
                <td class="td-secuencial">${punto.secuencial}</td>
                <td>${usuarioTexto}</td>
                <td class="td-estado">${estadoBadge}</td>
            `;

            tbody.appendChild(tr);
        });

        infoPaginacion.textContent = `Mostrando ${inicio + 1} - ${fin} de ${totalRegistros} puntos`;
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
        infoPaginacion.textContent = "Mostrando 0 - 0 de 0 puntos";
        btnPaginacion.innerHTML = "";
    }
});