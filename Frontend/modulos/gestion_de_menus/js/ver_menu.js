/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA VISUALIZACIÓN Y PAGINACIÓN DE MENÚS (ver_menu.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarVerMenu();
});

function inicializarVerMenu() {
    const tbody = document.getElementById("tbodyMenus");
    const txtBuscar = document.getElementById("txtBuscarMenu");
    const selectLimites = document.getElementById("selectLimites");
    
    // Elementos del paginador
    const btnPrevPage = document.getElementById("btnPrevPage");
    const btnNextPage = document.getElementById("btnNextPage");
    const contenedorNumerosPagina = document.getElementById("contenedorNumerosPagina");
    const infoPaginacion = document.getElementById("infoPaginacion");

    // Variables de Estado de Paginación y Datos
    let datosCrudosServidor = []; 
    let datosFiltradosYJerarquizados = []; 
    
    let paginaActual = 1;
    let filasPorPagina = 5; 

    /**
     * Solicita los datos frescos al servidor PHP
     */
    function cargarTabla() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="4" class="td-empty"> Cargando menús...</td></tr>';

        fetch("../../../Backend/controllers/menu_controller.php?gestion_crud=true")
            .then(res => {
                if (!res.ok) throw new Error("Error en la respuesta de red");
                return res.json();
            })
            .then(response => {
                if (response.status === "success") {
                    datosCrudosServidor = response.data;
                    procesarYFiltrarDatos();
                } else {
                    tbody.innerHTML = `<tr><td colspan="4" class="td-empty td-error">${response.message}</td></tr>`;
                }
            })
            .catch(err => {
                console.error("Error al obtener menús:", err);
                tbody.innerHTML = '<tr><td colspan="4" class="td-empty td-error">❌ Error de conexión con el servidor.</td></tr>';
            });
    }

    /**
     * Filtra según el buscador de texto y rearma la jerarquía relacional (Padre -> Hijos)
     */
    function procesarYFiltrarDatos() {
        const terminoBusqueda = txtBuscar ? txtBuscar.value.toLowerCase().trim() : "";
        
        const mapaNombresPadre = {};
        datosCrudosServidor.forEach(m => {
            mapaNombresPadre[m.id] = m.nombre;
        });

        // 1. Filtrar los menús
        let listadoFiltrado = datosCrudosServidor;
        if (terminoBusqueda !== "") {
            listadoFiltrado = datosCrudosServidor.filter(m => {
                const nombrePadre = m.id_menuPadre ? (mapaNombresPadre[m.id_menuPadre] || "") : "";
                return (
                    m.nombre.toLowerCase().includes(terminoBusqueda) ||
                    (m.descripcion || "").toLowerCase().includes(terminoBusqueda) ||
                    nombrePadre.toLowerCase().includes(terminoBusqueda)
                );
            });
        }

        // 2. Jerarquizar (Padres e Hijos)
        const padres = listadoFiltrado.filter(m => m.id_menuPadre === null || m.id_menuPadre === "" || m.id_menuPadre == 0);
        const hijos = listadoFiltrado.filter(m => m.id_menuPadre !== null && m.id_menuPadre !== "" && m.id_menuPadre != 0);

        const listadoOrdenado = [];

        padres.forEach(padre => {
            padre.esHijo = false;
            padre.nombrePadreTexto = "—";
            listadoOrdenado.push(padre);

            const hijosDeEstePadre = hijos.filter(h => String(h.id_menuPadre) === String(padre.id));
            hijosDeEstePadre.forEach(hijo => {
                hijo.esHijo = true;
                hijo.nombrePadreTexto = padre.nombre;
                listadoOrdenado.push(hijo);
            });
        });

        hijos.forEach(hijo => {
            const yaAgregado = listadoOrdenado.some(item => String(item.id) === String(hijo.id));
            if (!yaAgregado) {
                hijo.esHijo = true;
                hijo.nombrePadreTexto = mapaNombresPadre[hijo.id_menuPadre] || "Desconocido";
                listadoOrdenado.push(hijo);
            }
        });

        datosFiltradosYJerarquizados = listadoOrdenado;
        paginaActual = 1; 
        renderizarPagina();
    }

    /**
     * Dibuja físicamente en el DOM el subconjunto de filas
     */
    function renderizarPagina() {
        tbody.innerHTML = "";
        
        const totalRegistros = datosFiltradosYJerarquizados.length;

        if (totalRegistros === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="td-empty">No se encontraron menús.</td></tr>';
            actualizarControlesPaginador(0, 0, 0);
            return;
        }

        let inicioIndice = (paginaActual - 1) * filasPorPagina;
        let finIndice = inicioIndice + filasPorPagina;

        if (filasPorPagina === "todos") {
            inicioIndice = 0;
            finIndice = totalRegistros;
        }

        const subconjuntoPaginado = datosFiltradosYJerarquizados.slice(inicioIndice, finIndice);

        subconjuntoPaginado.forEach(m => {
            const tr = document.createElement("tr");
            tr.className = m.esHijo ? "row-hijo" : "row-padre";

            const claseTdNombre = m.esHijo ? "td-nombre es-hijo" : "td-nombre";
            const spanSimboloHijo = m.esHijo ? '<span class="simbolo-hijo">↳</span>' : '';
            const claseSpanNombre = m.esHijo ? 'nombre-hijo-span' : 'nombre-padre-span';

            const descripcionTexto = m.descripcion 
                ? m.descripcion 
                : '<span class="td-descripcion-vacio">Sin descripción</span>';

            const estadoBadge = parseInt(m.estado) === 1 
                ? '<span class="badge badge-success">Activo</span>' 
                : '<span class="badge badge-danger">Inactivo</span>';

            tr.innerHTML = `
                <td class="${claseTdNombre}">
                    ${spanSimboloHijo} 
                    <span class="${claseSpanNombre}">${m.nombre}</span>
                </td>
                <td>${descripcionTexto}</td>
                <td>${m.nombrePadreTexto}</td>
                <td style="text-align: center;">${estadoBadge}</td>
            `;
            tbody.appendChild(tr);
        });

        const registroFinReal = Math.min(finIndice, totalRegistros);
        actualizarControlesPaginador(inicioIndice + 1, registroFinReal, totalRegistros);
    }

    /**
     * Dibuja los controles de navegación
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
            btnNum.className = "page-btn" + (i === paginaActual ? " active" : "");

            btnNum.onclick = () => {
                paginaActual = i;
                renderizarPagina();
            };

            contenedorNumerosPagina.appendChild(btnNum);
        }
    }

    // --- Vinculación de Eventos ---

    if (txtBuscar) {
        txtBuscar.oninput = () => {
            procesarYFiltrarDatos();
        };
    }

    if (selectLimites) {
        selectLimites.onchange = (e) => {
            const valor = e.target.value;
            filasPorPagina = valor === "todos" ? "todos" : parseInt(valor);
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
            const totalPaginas = Math.ceil(datosFiltradosYJerarquizados.length / filasPorPagina);
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderizarPagina();
            }
        };
    }

    // Carga inicial
    cargarTabla();
}