document.addEventListener("DOMContentLoaded", () => {
    inicializarConsultaClientes();
});

function inicializarConsultaClientes() {
    let clientesTodos = [];
    let clientesFiltrados = [];
    let paginaActual = 1;
    let registrosPorPagina = 10;

    const tbody = document.getElementById("tbodyClientes");
    const inputBuscar = document.getElementById("inputBuscarCliente");
    const btnLimpiar = document.getElementById("btnLimpiarCliente");
    const selectPageSize = document.getElementById("selectPageSize");
    const infoPaginacion = document.getElementById("infoPaginacion");
    const btnPaginacion = document.getElementById("btnPaginacion");

    const RUTA_CONTROLLER = "../../../Backend/controllers/cliente_controller.php";

    const TIPO_IDENTIFICACION = {
        "04": "RUC",
        "05": "Cédula",
        "06": "Pasaporte",
        "07": "Consumidor Final",
        "08": "Identificación Exterior"
    };

    cargarClientes();

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

    function cargarClientes() {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="td-empty">
                    ⏳ Cargando registros de la base de datos...
                </td>
            </tr>`;

        fetch(RUTA_CONTROLLER)
            .then(res => res.json())
            .then(response => {
                if (response.status === "success" && response.data) {
                    clientesTodos = response.data;
                    clientesFiltrados = [...clientesTodos];
                    paginaActual = 1;
                    renderizarTablaPaginada();
                } else {
                    mostrarMensajeError("⚠️ " + (response.message || "No se encontraron clientes."));
                }
            })
            .catch(err => {
                console.error(err);
                mostrarMensajeError("❌ Error de comunicación con el servidor.");
            });
    }

    function filtrarEnMemoria() {
        const termino = inputBuscar.value.toLowerCase().trim();

        clientesFiltrados = clientesTodos.filter(c => {
            const nombreCompleto = `${c.apellido1} ${c.apellido2 || ''} ${c.nombre1} ${c.nombre2 || ''}`.toLowerCase();
            const identificacion = (c.identificacion || "").toLowerCase();
            const correo = (c.correo || "").toLowerCase();

            return nombreCompleto.includes(termino) || 
                   identificacion.includes(termino) || 
                   correo.includes(termino);
        });

        paginaActual = 1;
        renderizarTablaPaginada();
    }

    function renderizarTablaPaginada() {
        tbody.innerHTML = "";

        if (clientesFiltrados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="td-empty">
                        No se encontraron registros de clientes con los criterios ingresados.
                    </td>
                </tr>`;
            infoPaginacion.textContent = "Mostrando 0 - 0 de 0 clientes";
            btnPaginacion.innerHTML = "";
            return;
        }

        const totalRegistros = clientesFiltrados.length;
        const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * registrosPorPagina;
        const fin = Math.min(inicio + registrosPorPagina, totalRegistros);
        const subconjunto = clientesFiltrados.slice(inicio, fin);

        subconjunto.forEach(cliente => {
            const tr = document.createElement("tr");

            const nombreCompleto = `${cliente.apellido1} ${cliente.apellido2 || ''} ${cliente.nombre1} ${cliente.nombre2 || ''}`.trim().replace(/\s+/g, ' ');
            const tipoLegible = TIPO_IDENTIFICACION[cliente.tipoIdentificacion] || cliente.tipoIdentificacion;

            const badgeEstado = cliente.estado == 1 
                ? '<span class="badge badge-success">Activo</span>' 
                : '<span class="badge badge-danger">Inactivo</span>';

            tr.innerHTML = `
                <td><code class="id-code">${cliente.identificacion}</code></td>
                <td><small class="tipo-tag">${tipoLegible}</small></td>
                <td><strong>${nombreCompleto}</strong></td>
                <td>${cliente.correo ? `<a href="mailto:${cliente.correo}">${cliente.correo}</a>` : '<span class="text-muted">—</span>'}</td>
                <td>${cliente.telefono || '<span class="text-muted">—</span>'}</td>
                <td><span class="text-truncate" title="${cliente.direccion || ''}">${cliente.direccion || '<span class="text-muted">—</span>'}</span></td>
                <td style="text-align: center;">${badgeEstado}</td>
            `;

            tbody.appendChild(tr);
        });

        infoPaginacion.textContent = `Mostrando ${inicio + 1} - ${fin} de ${totalRegistros} clientes`;
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
        infoPaginacion.textContent = "Mostrando 0 - 0 de 0 clientes";
        btnPaginacion.innerHTML = "";
    }
}