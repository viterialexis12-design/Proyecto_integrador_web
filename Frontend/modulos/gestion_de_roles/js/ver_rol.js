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

    // Elementos de la paginación
    const infoPaginacion = document.getElementById("infoPaginacionRoles");
    const contenedorBotones = document.getElementById("botonesPaginacionRoles");

    // Variables de control de datos y paginación
    let rolesLocales = [];
    let rolesFiltrados = [];
    let paginaActual = 1;
    const filasPorPagina = 5; // Cambia este valor para ajustar cuántos roles mostrar por página

    /**
     * Consume la API y obtiene la lista de roles actualizada
     */
    function cargarTabla() {
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px; color: #7f8c8d;">⏳ Cargando roles...</td></tr>';
        if (txtBuscar) txtBuscar.value = ""; 

        fetch("../../../Backend/controllers/rol_controller.php")
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success") {
                    rolesLocales = response.data;
                    rolesFiltrados = [...rolesLocales]; // Copia inicial para filtrado
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
        const totalPaginas = Math.ceil(totalRegistros / filasPorPagina) || 1;

        // Ajustar rango de página actual por si los filtros reducen el dataset
        if (paginaActual > totalPaginas) paginaActual = totalPaginas;
        if (paginaActual < 1) paginaActual = 1;

        const indiceInicio = (paginaActual - 1) * filasPorPagina;
        const indiceFin = Math.min(indiceInicio + filasPorPagina, totalRegistros);

        // Segmentar roles para la página actual
        const rolesPagina = rolesFiltrados.slice(indiceInicio, indiceFin);
        renderizarFilas(rolesPagina);

        // Actualizar la botonera e información de la paginación
        if (totalRegistros > 0) {
            infoPaginacion.textContent = `Mostrando ${indiceInicio + 1} a ${indiceFin} de ${totalRegistros} registros`;
        } else {
            infoPaginacion.textContent = "Mostrando 0 a 0 de 0 registros";
        }

        renderizarBotonera(totalPaginas);
    }

    /**
     * Dibuja físicamente las filas en el tbody de la tabla
     */
    function renderizarFilas(roles) {
        if (!tbody) return;
        tbody.innerHTML = "";

        if (roles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px; color: #7f8c8d;">No se encontraron roles.</td></tr>';
            return;
        }

        roles.forEach((r) => {
            const tr = document.createElement("tr");
            tr.style.borderBottom = "1px solid #e2e8f0";
            tr.style.transition = "background-color 0.2s ease";

            const estadoActivo = parseInt(r.estado) === 1;
            const estadoBadge = estadoActivo
                ? '<span style="color:#27ae60; font-weight:bold; background-color:#e8f8f5; padding:4px 8px; border-radius:4px; font-size:0.85rem;">Activo</span>'
                : '<span style="color:#c0392b; font-weight:bold; background-color:#fce4d6; padding:4px 8px; border-radius:4px; font-size:0.85rem;">Inactivo</span>';

            tr.innerHTML = `
                <td style="padding: 12px 15px;"><b>${r.nombre}</b></td>
                <td style="padding: 12px 15px; color: #34495e;">${r.descripcion || '<em style="color:#b2bec3;">Sin descripción</em>'}</td>
                <td style="padding: 12px 15px;">${estadoBadge}</td>
            `;

            tr.onmouseenter = () => (tr.style.backgroundColor = "#f8fafc");
            tr.onmouseleave = () => (tr.style.backgroundColor = "transparent");

            tbody.appendChild(tr);
        });
    }

    /**
     * Genera dinámicamente los botones de navegación de páginas (Anterior, Números, Siguiente)
     */
    function renderizarBotonera(totalPaginas) {
        if (!contenedorBotones) return;
        contenedorBotones.innerHTML = "";

        // Botón "Anterior" (◀)
        const btnAnterior = document.createElement("button");
        btnAnterior.textContent = "◀";
        btnAnterior.className = "btn btn-secondary";
        btnAnterior.style.padding = "5px 10px";
        btnAnterior.disabled = paginaActual === 1;
        btnAnterior.onclick = () => {
            if (paginaActual > 1) {
                paginaActual--;
                actualizarVistaTabla();
            }
        };
        contenedorBotones.appendChild(btnAnterior);

        // Botones numéricos de páginas
        for (let i = 1; i <= totalPaginas; i++) {
            const btnPagina = document.createElement("button");
            btnPagina.textContent = i;
            btnPagina.style.padding = "5px 10px";
            
            if (i === paginaActual) {
                // Botón activo (Página actual)
                btnPagina.className = "btn";
                btnPagina.style.backgroundColor = "#2c3e50";
                btnPagina.style.color = "#ffffff";
            } else {
                // Botón inactivo
                btnPagina.className = "btn btn-secondary";
            }

            btnPagina.onclick = () => {
                paginaActual = i;
                actualizarVistaTabla();
            };
            contenedorBotones.appendChild(btnPagina);
        }

        // Botón "Siguiente" (▶)
        const btnSiguiente = document.createElement("button");
        btnSiguiente.textContent = "▶";
        btnSiguiente.className = "btn btn-secondary";
        btnSiguiente.style.padding = "5px 10px";
        btnSiguiente.disabled = paginaActual === totalPaginas;
        btnSiguiente.onclick = () => {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                actualizarVistaTabla();
            }
        };
        contenedorBotones.appendChild(btnSiguiente);
    }

    /**
     * Resetea el texto y la botonera si ocurre algún error de carga
     */
    function limpiarControlesPaginacion() {
        if (infoPaginacion) infoPaginacion.textContent = "Mostrando 0 a 0 de 0 registros";
        if (contenedorBotones) contenedorBotones.innerHTML = "";
    }

    // Evento del botón de refrescar manual
    if (btnRefrescar) {
        btnRefrescar.onclick = () => cargarTabla();
    }

    // Filtro reactivo local con recalculación de páginas en tiempo real
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

            paginaActual = 1; // Reiniciamos siempre a la primera página al buscar
            actualizarVistaTabla();
        };
    }

    // Inicialización automática de la vista
    cargarTabla();
}