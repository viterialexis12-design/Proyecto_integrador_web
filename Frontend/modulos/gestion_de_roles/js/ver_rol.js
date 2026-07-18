/**
 * ==========================================================================
 * LÓGICA DE VISUALIZACIÓN Y PAGINACIÓN DE ROLES (ver_roles.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarVerRoles();
});

function inicializarVerRoles() {
    const tbody = document.getElementById("tbodyRoles");
    const btnRefrescar = document.getElementById("btnRefrescarRoles");
    const txtBuscar = document.getElementById("txtBuscarRol");
    const selectLimites = document.getElementById("selectLimitesRoles");

    // Elementos de la paginación
    const infoPaginacion = document.getElementById("infoPaginacionRoles");
    const contenedorBotones = document.getElementById("botonesPaginacionRoles");
    const btnPrevPage = document.getElementById("btnPrevPageRoles");
    const btnNextPage = document.getElementById("btnNextPageRoles");

    // Variables de control de datos y paginación
    let rolesLocales = [];
    let rolesFiltrados = [];
    let paginaActual = 1;
    let filasPorPagina = 5; 

    /**
     * Consume la API y obtiene la lista de roles actualizada
     */
    function cargarTabla() {
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="3" class="loading-row">⏳ Cargando roles...</td></tr>';
        if (txtBuscar) txtBuscar.value = ""; 

        fetch("../../../Backend/controllers/rol_controller.php")
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success") {
                    rolesLocales = response.data;
                    rolesFiltrados = [...rolesLocales]; 
                    paginaActual = 1;
                    actualizarVistaTabla();
                } else {
                    tbody.innerHTML = `<tr><td colspan="3" style="color:#e74c3c; text-align:center; padding: 20px; font-weight:bold;">⚠️ ${response.message}</td></tr>`;
                    limpiarControlesPaginacion();
                }
            })
            .catch((err) => {
                console.error(err);
                tbody.innerHTML = '<tr><td colspan="3" style="color:#e74c3c; text-align:center; padding: 20px; font-weight:bold;">❌ Error de conexión con el servidor.</td></tr>';
                limpiarControlesPaginacion();
            });
    }

    /**
     * Controla la segmentación y el renderizado físico de las filas e indicadores
     */
    function actualizarVistaTabla() {
        const totalRegistros = rolesFiltrados.length;
        
        // Manejo del límite cuando se selecciona "Todos"
        const limiteEfectivo = filasPorPagina === "todos" ? totalRegistros : parseInt(filasPorPagina);
        const totalPaginas = Math.ceil(totalRegistros / limiteEfectivo) || 1;

        if (paginaActual > totalPaginas) paginaActual = totalPaginas;
        if (paginaActual < 1) paginaActual = 1;

        const indiceInicio = (paginaActual - 1) * limiteEfectivo;
        const indiceFin = Math.min(indiceInicio + limiteEfectivo, totalRegistros);

        const rolesPagina = rolesFiltrados.slice(indiceInicio, indiceFin);
        renderizarFilas(rolesPagina);

        if (totalRegistros > 0) {
            infoPaginacion.textContent = `Mostrando ${indiceInicio + 1} a ${indiceFin} de ${totalRegistros} registros`;
        } else {
            infoPaginacion.textContent = "Mostrando 0 a 0 de 0 registros";
        }

        renderizarBotonera(totalPaginas);
    }

    /**
     * Dibuja físicamente las filas en el tbody
     */
    function renderizarFilas(roles) {
        if (!tbody) return;
        tbody.innerHTML = "";

        if (roles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="loading-row">No se encontraron roles.</td></tr>';
            return;
        }

        roles.forEach((r) => {
            const tr = document.createElement("tr");

            const estadoActivo = parseInt(r.estado) === 1;
            const estadoBadge = estadoActivo
                ? '<span class="badge-activo">Activo</span>'
                : '<span class="badge-inactivo">Inactivo</span>';

            tr.innerHTML = `
                <td><b>${r.nombre}</b></td>
                <td style="color: #475569;">${r.descripcion || '<em style="color:#94a3b8;">Sin descripción</em>'}</td>
                <td style="text-align: center;">${estadoBadge}</td>
            `;

            tbody.appendChild(tr);
        });
    }

    /**
     * Genera la botonera de navegación limpia
     */
    function renderizarBotonera(totalPaginas) {
        if (!contenedorBotones) return;
        contenedorBotones.innerHTML = "";

        // Sincronizar botones estructurales Prev/Next
        if (btnPrevPage && btnNextPage) {
            btnPrevPage.disabled = paginaActual === 1;
            btnPrevPage.onclick = () => {
                if (paginaActual > 1) {
                    paginaActual--;
                    actualizarVistaTabla();
                }
            };

            btnNextPage.disabled = paginaActual === totalPaginas;
            btnNextPage.onclick = () => {
                if (paginaActual < totalPaginas) {
                    paginaActual++;
                    actualizarVistaTabla();
                }
            };
        }

        // Renderizar números intermedios
        for (let i = 1; i <= totalPaginas; i++) {
            const btnPagina = document.createElement("button");
            btnPagina.textContent = i;
            
            if (i === paginaActual) {
                btnPagina.className = "btn-pagina-activo";
            } else {
                btnPagina.className = "btn-pagina-comun";
            }

            btnPagina.onclick = () => {
                paginaActual = i;
                actualizarVistaTabla();
            };
            contenedorBotones.appendChild(btnPagina);
        }
    }

    function limpiarControlesPaginacion() {
        if (infoPaginacion) infoPaginacion.textContent = "Mostrando 0 a 0 de 0 registros";
        if (contenedorBotones) contenedorBotones.innerHTML = "";
        if (btnPrevPage) btnPrevPage.disabled = true;
        if (btnNextPage) btnNextPage.disabled = true;
    }

    // Eventores de controles reactivos
    if (btnRefrescar) {
        btnRefrescar.onclick = () => cargarTabla();
    }

    if (selectLimites) {
        selectLimites.onchange = (e) => {
            filasPorPagina = e.target.value;
            paginaActual = 1;
            actualizarVistaTabla();
        };
    }

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const term = e.target.value.toLowerCase().trim();

            if (term === "") {
                rolesFiltrados = [...rolesLocales];
            } else {
                rolesFiltrados = rolesLocales.filter((r) => {
                    const nombreMatch = r.nombre ? r.nombre.toLowerCase().includes(term) : false;
                    const descMatch = r.descripcion ? r.descripcion.toLowerCase().includes(term) : false;
                    return nombreMatch || descMatch;
                });
            }

            paginaActual = 1; 
            actualizarVistaTabla();
        };
    }

    // Carga inicial
    cargarTabla();
}