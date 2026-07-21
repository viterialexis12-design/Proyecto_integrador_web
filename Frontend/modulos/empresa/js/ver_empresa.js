/**
 * ==========================================================================
 * LÓGICA DE VISUALIZACIÓN DE ENTIDAD ÚNICA DE EMPRESA (ver_empresa.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarVerEmpresa();
});

function inicializarVerEmpresa() {
    const loader = document.getElementById("loaderEmpresa");
    const vistaDatos = document.getElementById("vistaDatosEmpresa");
    const lblEmpresaId = document.getElementById("lblEmpresaId");
    const contenedorCampos = document.getElementById("contenedorCamposEmpresa");
    const btnRefrescar = document.getElementById("btnRefrescarEmpresa");

    const RUTA_EMPRESA_CONTROLLER = "../../../Backend/controllers/empresa_controller.php";

    /**
     * Consulta el registro de la empresa y maneja el estado de la UI
     */
    function cargarDatosEmpresa() {
        if (!loader || !vistaDatos) return;

        loader.style.display = "block";
        vistaDatos.style.display = "none";
        contenedorCampos.innerHTML = "";

        fetch(`${RUTA_EMPRESA_CONTROLLER}?accion=OBTENER_EMPRESA_UNICA`)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === "success" && response.data) {
                    const e = response.data;
                    
                    // Asignar el ID en la ficha técnica
                    if (lblEmpresaId) lblEmpresaId.textContent = e.id;

                    // Renderizar los campos restantes de la base de datos
                    renderizarCamposLectura(e);

                    loader.style.display = "none";
                    vistaDatos.style.display = "block";
                } else {
                    contenedorCampos.innerHTML = `
                        <div style="grid-column: 1/-1; color: #ef4444; padding: 20px; text-align: center; font-weight: bold;">
                            ⚠️ ${response.message || "No se pudo recuperar la información de la empresa."}
                        </div>
                    `;
                    loader.style.display = "none";
                    vistaDatos.style.display = "block";
                }
            })
            .catch((err) => {
                console.error("Error al obtener datos de la empresa:", err);
                contenedorCampos.innerHTML = `
                    <div style="grid-column: 1/-1; color: #ef4444; padding: 20px; text-align: center; font-weight: bold;">
                        ❌ Error al conectar con el servidor.
                    </div>
                `;
                loader.style.display = "none";
                vistaDatos.style.display = "block";
            });
    }

    /**
     * Genera tarjetas estáticas de solo lectura basadas únicamente en las columnas de la tabla
     */
    function renderizarCamposLectura(data) {
        // Estructura estricta basada en el esquema de tu base de datos (excluyendo el ID que va arriba)
        const esquemaCampos = [
            { clave: "razonSocial", etiqueta: "Razón Social", icono: "🏢" },
            { clave: "nombreComercial", etiqueta: "Nombre Comercial", icono: "🏷️" },
            { clave: "ruc", etiqueta: "RUC", icono: "🆔" },
            { clave: "dirMatriz", etiqueta: "Dirección Matriz", icono: "📍" },
            { clave: "obligadoContabilidad", etiqueta: "Obligado a Llevar Contabilidad", icono: "📊" },
            { clave: "contribuyenteEspecial", etiqueta: "Nro. Contribuyente Especial", icono: "⭐" }
        ];

        esquemaCampos.forEach((campo) => {
            // Validar que el valor exista o mostrar un indicador limpio de vacío
            const valorDb = data[campo.clave];
            const valorFormateado = (valorDb !== null && valorDb !== undefined && valorDb !== "") ? valorDb : "---";

            const cardAtributo = document.createElement("div");
            cardAtributo.style.background = "#ffffff";
            cardAtributo.style.border = "1px solid #e2e8f0";
            cardAtributo.style.borderRadius = "8px";
            cardAtributo.style.overflow = "hidden";
            cardAtributo.style.display = "flex";
            cardAtributo.style.flexDirection = "column";

            // Encabezado del campo
            const headerAtributo = document.createElement("div");
            headerAtributo.style.backgroundColor = "#f1f5f9";
            headerAtributo.style.padding = "10px 15px";
            headerAtributo.style.borderBottom = "1px solid #e2e8f0";
            headerAtributo.innerHTML = `
                <span style="font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                    ${campo.icono} ${campo.etiqueta}
                </span>
            `;

            // Área de valor en modo lectura
            const cuerpoAtributo = document.createElement("div");
            cuerpoAtributo.style.padding = "15px";
            cuerpoAtributo.style.flexGrow = "1";
            cuerpoAtributo.style.display = "flex";
            cuerpoAtributo.style.alignItems = "center";

            const contenedorTexto = document.createElement("p");
            contenedorTexto.style.margin = "0";
            contenedorTexto.style.fontSize = "1.05rem";
            contenedorTexto.style.fontWeight = "500";
            contenedorTexto.style.color = "#1e293b";
            contenedorTexto.style.wordBreak = "break-word";
            contenedorTexto.textContent = valorFormateado;

            // Estilizado complementario si es una respuesta afirmativa o negativa en la contabilidad
            if (campo.clave === "obligadoContabilidad") {
                if (valorFormateado === "SI") {
                    cardAtributo.style.borderColor = "#bbf7d0";
                    headerAtributo.style.backgroundColor = "#f0fdf4";
                }
            }

            cuerpoAtributo.appendChild(contenedorTexto);
            cardAtributo.appendChild(headerAtributo);
            cardAtributo.appendChild(cuerpoAtributo);
            contenedorCampos.appendChild(cardAtributo);
        });
    }

    // Evento para refrescar la información manualmente
    if (btnRefrescar) {
        btnRefrescar.onclick = cargarDatosEmpresa;
    }

    // Carga inicial al cargar el módulo
    cargarDatosEmpresa();
}