/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA EL CRUD DE MENÚS (menus.js)
 * ==========================================================================
 */

function inicializarVerMenu() {
    const tbody = document.getElementById("tbodyMenus");
    const btnRefrescar = document.getElementById("btnRefrescarMenus");
    const txtBuscar = document.getElementById("txtBuscarMenu");

    function cargarTabla() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">⏳ Cargando menús...</td></tr>';

        fetch("Backend/controllers/menu_controller.php?gestion_crud=true")
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    renderizarFilasJerarquicas(response.data);
                } else {
                    tbody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">${response.message}</td></tr>`;
                }
            }).catch(() => {
                tbody.innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Error de conexión con el servidor.</td></tr>';
            });
    }

    function renderizarFilasJerarquicas(menus) {
        tbody.innerHTML = "";
        if (menus.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay menús registrados.</td></tr>';
            return;
        }

        // Mapeamos los nombres por ID internamente para poder saber el nombre del padre
        const infoMenus = {};
        menus.forEach(m => {
            infoMenus[m.id] = m.nombre;
        });

        // Separamos estructuralmente padres de hijos
        const padres = menus.filter(m => m.id_menuPadre === null || m.id_menuPadre === "");
        const hijos = menus.filter(m => m.id_menuPadre !== null && m.id_menuPadre !== "");

        function agregarFila(m, esHijo = false) {
            const tr = document.createElement("tr");
            
            if (esHijo) {
                tr.style.backgroundColor = "#fcfcfc";
            }
            else{
                tr.style.backgroundColor = "#f9f9f9";
            }

            const estadoText = parseInt(m.estado) === 1 
                ? '<span style="color:green; font-weight:bold;">Activo</span>' 
                : '<span style="color:red; font-weight:bold;">Inactivo</span>';
            
            const nombrePadre = m.id_menuPadre ? infoMenus[m.id_menuPadre] || "Desconocido" : "—";
            
            // Renderizamos solo los datos legibles para el usuario
            tr.innerHTML = `
                <td style="padding: 12px; ${esHijo ? 'padding-left: 30px;' : ''}">
                    ${esHijo ? '<span style="color: #7f8c8d; margin-right: 5px;">↳</span>' : ''} <b>${m.nombre}</b>
                </td>
                <td style="padding: 12px; color: #555;">${m.descripcion || ''}</td>
                <td style="padding: 12px; font-style: italic; color: #7f8c8d;">${nombrePadre}</td>
                <td style="padding: 12px; text-align: center;">${estadoText}</td>
            `;
            tbody.appendChild(tr);
        }

        // Dibujamos los bloques jerárquicos
        padres.forEach(padre => {
            agregarFila(padre, false);

            const hijosDeEstePadre = hijos.filter(h => String(h.id_menuPadre) === String(padre.id));
            hijosDeEstePadre.forEach(hijo => {
                agregarFila(hijo, true);
            });
        });

        // Hijos sin padre asignado o "huérfanos" en el sistema
        hijos.forEach(hijo => {
            const padreExiste = padres.some(p => String(p.id) === String(hijo.id_menuPadre));
            if (!padreExiste) {
                agregarFila(hijo, true);
            }
        });
    }

    if (btnRefrescar) btnRefrescar.onclick = cargarTabla;
    
    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            tbody.querySelectorAll("tr").forEach(tr => {
                tr.style.display = tr.textContent.toLowerCase().includes(term) ? "" : "none";
            });
        };
    }
    
    cargarTabla();
}

// --- 2. CREAR MENÚ (per0000014) ---
function inicializarCrearMenu() {
    const form = document.getElementById("formCrearMenu");
    const selectPadre = document.getElementById("selectMenuPadre");
    const wrapperUrl = document.getElementById("wrapperUrlMenu");
    const txtUrl = document.getElementById("txtUrlMenu");

    // 1. Cargar la lista de menús padres disponibles en el select
    function cargarOpcionesPadre() {
        if (!selectPadre) return;
        
        // Limpiamos manteniendo solo la opción por defecto
        selectPadre.innerHTML = '<option value="">— Ninguno (Es un menú principal / Padre) —</option>';

        fetch("Backend/controllers/menu_controller.php?gestion_crud=true")
            .then(res => res.json())
            .then(response => {
                if (response.status === "success" && Array.isArray(response.data)) {
                    // Filtrar únicamente los menús que son Padres (id_menuPadre nulo o vacío)
                    const padres = response.data.filter(m => m.id_menuPadre === null || m.id_menuPadre === "");
                    
                    padres.forEach(p => {
                        const option = document.createElement("option");
                        option.value = p.id; // El ID que se guardará en la base de datos
                        option.textContent = p.nombre;
                        selectPadre.appendChild(option);
                    });
                }
            })
            .catch(err => console.error("Error cargando menús padres:", err));
    }

    // 2. Controlar la visibilidad y obligación de la URL dinámicamente
    if (selectPadre) {
        selectPadre.onchange = () => {
            if (selectPadre.value !== "") {
                // Es un menú hijo: mostramos campo URL y lo hacemos obligatorio
                wrapperUrl.style.display = "block";
                txtUrl.required = true;
            } else {
                // Es un menú padre: ocultamos el campo URL y limpiamos su valor
                wrapperUrl.style.display = "none";
                txtUrl.required = false;
                txtUrl.value = "";
            }
        };
    }

    // 3. Procesar el envío del Formulario
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            formData.append("accion", "CREAR");

            // Aseguramos enviar null o vacío si seleccionó que es un menú padre
            if (!formData.get("id_menuPadre")) {
                formData.set("id_menuPadre", "");
                formData.set("url", ""); // Los padres no tienen URL
            }

            fetch("Backend/controllers/menu_controller.php?gestion_crud=true", { 
                method: "POST", 
                body: formData 
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    alert("✅ Módulo/Menú registrado correctamente.");
                    form.reset();
                    wrapperUrl.style.display = "none"; // Resetear vista de URL
                    txtUrl.required = false;
                    cargarOpcionesPadre(); // Recargamos el select por si se creó un nuevo padre
                    document.dispatchEvent(new CustomEvent("cambioMenus"));
                } else { 
                    alert("⚠️ Error al guardar: " + data.message); 
                }
            })
            .catch(() => {
                alert("❌ Error de comunicación con el servidor.");
            });
        };
    }

    // 4. Botón Limpiar/Cancelar
    if (document.getElementById("btnCancelarCrearMenu")) {
        document.getElementById("btnCancelarCrearMenu").onclick = () => {
            form.reset();
            if (wrapperUrl) wrapperUrl.style.display = "none";
            if (txtUrl) txtUrl.required = false;
        };
    }

    // Inicializar el select al cargar la pantalla
    cargarOpcionesPadre();
}
// --- 3. EDITAR MENÚ (per0000015) ---
function inicializarActualizarMenu() {
    const form = document.getElementById("formEditarMenu");
    const txtBuscar = document.getElementById("txtBuscarParaEditarMenu");
    const sugerencias = document.getElementById("listaSugerenciasEditarMenu");
    const contenedorForm = document.getElementById("contenedorFormEditarMenu");
    
    const cmbPadre = document.getElementById("cmbEditMenuPadre");
    const wrapperUrl = document.getElementById("wrapperEditUrlMenu");
    const txtUrl = document.getElementById("txtEditMenuUrl");
    
    // --- CORRECCIÓN DE ID: Vinculado correctamente con tu HTML ---
    const cmbEstado = document.getElementById("txtUpdateEstadoMenu");
    const alertaHijosUpdate = document.getElementById("alertaHijosUpdateMenu");

    let menusLocales = [];
    let menuSeleccionadoActivo = null;

    // Cargar los menús desde el servidor
    function actualizarDatosLocales() {
        fetch("Backend/controllers/menu_controller.php?gestion_crud=true")
            .then(res => res.json())
            .then(res => { 
                if(res.status === "success") menusLocales = res.data; 
            });
    }
    actualizarDatosLocales();

    // Evalúa si se muestra la advertencia en tiempo real
    function evaluarAdvertenciaDesactivacion() {
        if (!menuSeleccionadoActivo || !alertaHijosUpdate || !cmbEstado) return;

        const estadoSeleccionado = cmbEstado.value; // "1" o "0"
        
        const esPadre = (menuSeleccionadoActivo.id_menuPadre === null || menuSeleccionadoActivo.id_menuPadre === "");
        const tieneHijos = menusLocales.some(h => String(h.id_menuPadre) === String(menuSeleccionadoActivo.id));

        if (estadoSeleccionado === "0" && esPadre && tieneHijos) {
            alertaHijosUpdate.style.display = "block";
        } else {
            alertaHijosUpdate.style.display = "none";
        }
    }

    if (cmbEstado) {
        cmbEstado.onchange = () => {
            evaluarAdvertenciaDesactivacion();
        };
    }

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";
            if (query === "") { sugerencias.style.display = "none"; return; }

            const filtrados = menusLocales.filter(m => m.nombre.toLowerCase().includes(query));
            filtrados.forEach(m => {
                const item = document.createElement("div");
                item.style.padding = "10px"; item.style.cursor = "pointer"; item.style.borderBottom = "1px solid #eee";
                
                const tipoText = (m.id_menuPadre === null || m.id_menuPadre === "") ? "Menú Principal" : "Submenú";
                item.innerHTML = `📁 <b>${m.nombre}</b> <small style="color:#7f8c8d;">[${tipoText}]</small>`;
                
                item.onclick = () => {
                    txtBuscar.value = m.nombre; 
                    sugerencias.style.display = "none";
                    
                    menuSeleccionadoActivo = m;
                    
                    // Seteamos los campos usando los IDs exactos de tu HTML
                    document.getElementById("txtEditIdMenu").value = m.id;
                    document.getElementById("txtEditMenuNombre").value = m.nombre;
                    document.getElementById("txtEditMenuDescripcion").value = m.descripcion || "";
                    
                    if (cmbEstado) cmbEstado.value = m.estado;

                    // Reconstruir opciones del select de padres
                    cmbPadre.innerHTML = '<option value="">— Ninguno (Es un menú principal / Padre) —</option>';
                    menusLocales.forEach(p => {
                        if ((p.id_menuPadre === null || p.id_menuPadre === "") && String(p.id) !== String(m.id)) {
                            const opt = document.createElement("option");
                            opt.value = p.id;
                            opt.textContent = p.nombre;
                            cmbPadre.appendChild(opt);
                        }
                    });

                    // Reglas de negocio para controles visuales
                    if (m.id_menuPadre === null || m.id_menuPadre === "") {
                        cmbPadre.value = "";
                        cmbPadre.disabled = true; 
                        wrapperUrl.style.display = "none";
                        txtUrl.required = false;
                        txtUrl.value = "";
                    } else {
                        cmbPadre.value = m.id_menuPadre;
                        cmbPadre.disabled = false;
                        cmbPadre.options[0].remove(); 

                        wrapperUrl.style.display = "block";
                        txtUrl.required = true;
                        txtUrl.value = m.url || "";
                    }

                    evaluarAdvertenciaDesactivacion();
                    contenedorForm.style.display = "block";
                };
                item.onmouseenter = () => item.style.backgroundColor = "#f1f5f9";
                item.onmouseleave = () => item.style.backgroundColor = "transparent";
                sugerencias.appendChild(item);
            });
            sugerencias.style.display = filtrados.length ? "block" : "none";
        };
    }

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            
            cmbPadre.disabled = false; 

            const formData = new FormData(form);
            formData.append("accion", "EDITAR");

            // Adjuntamos el estado manualmente ya que el HTML carece del atributo 'name'
            if (cmbEstado) {
                formData.append("estado", cmbEstado.value);
            }

            if (!formData.get("id_menuPadre")) {
                formData.set("id_menuPadre", "");
                formData.set("url", ""); 
            }

            fetch("Backend/controllers/menu_controller.php?gestion_crud=true", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("✅ Estructura de menú actualizada.");
                        txtBuscar.value = ""; 
                        contenedorForm.style.display = "none";
                        if (alertaHijosUpdate) alertaHijosUpdate.style.display = "none";
                        form.reset();
                        menuSeleccionadoActivo = null;
                        actualizarDatosLocales();
                        document.dispatchEvent(new CustomEvent("cambioMenus"));
                    } else { 
                        alert("⚠️ Error: " + data.message); 
                        if (!form.id_menuPadre.value) cmbPadre.disabled = true;
                    }
                })
                .catch(() => {
                    alert("❌ Error de conexión con el servidor.");
                });
        };
    }

    if (document.getElementById("btnCancelarEditarMenu")) {
        document.getElementById("btnCancelarEditarMenu").onclick = () => { 
            txtBuscar.value = ""; 
            contenedorForm.style.display = "none"; 
            if (alertaHijosUpdate) alertaHijosUpdate.style.display = "none";
            form.reset();
            menuSeleccionadoActivo = null;
        };
    }
}
// --- 4. BORRAR/INACTIVAR MENÚ (per0000016) ---
function inicializarBorrarMenu() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarMenu");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarMenu");
    const sugerencias = document.getElementById("listaSugerenciasEliminarMenu");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarMenu");
    const alertaHijos = document.getElementById("alertaHijosMenu");

    let menusLocales = []; 
    let idSeleccionado = null;

    // Carga inicial y actualización de los datos del servidor
    function actualizarDatosLocales() {
        fetch("Backend/controllers/menu_controller.php?gestion_crud=true")
            .then(res => res.json())
            .then(res => { 
                if(res.status === "success") menusLocales = res.data; 
            });
    }
    actualizarDatosLocales();

    if (txtBuscar) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";
            if (query === "") { contenedorFicha.style.display = "none"; sugerencias.style.display = "none"; return; }

            const filtrados = menusLocales.filter(m => m.nombre.toLowerCase().includes(query));
            filtrados.forEach(m => {
                const item = document.createElement("div");
                item.style.padding = "10px"; item.style.cursor = "pointer"; item.style.borderBottom = "1px solid #eee";
                
                const tipoText = (m.id_menuPadre === null || m.id_menuPadre === "") ? "Menú Principal" : "Submenú";
                item.innerHTML = `❌ <b>${m.nombre}</b> <small style="color:#7f8c8d;">[${tipoText}]</small>`;
                
                item.onclick = () => {
                    txtBuscar.value = m.nombre; 
                    sugerencias.style.display = "none"; 
                    
                    // Seteamos el ID real de la Base de Datos para el backend de forma oculta
                    idSeleccionado = m.id;
                    
                    // Mapeamos los datos en la ficha visual
                    document.getElementById("lblDelMenuNombre").textContent = m.nombre;
                    document.getElementById("lblDelMenuDescripcion").textContent = m.descripcion || "Sin descripción";
                    document.getElementById("lblDelMenuEstado").textContent = parseInt(m.estado) === 1 ? 'Activo' : 'Inactivo';
                    
                    // Buscar nombre del padre amigable
                    if (m.id_menuPadre) {
                        const padreObj = menusLocales.find(p => String(p.id) === String(m.id_menuPadre));
                        document.getElementById("lblDelMenuPadre").textContent = padreObj ? padreObj.nombre : "Desconocido";
                    } else {
                        document.getElementById("lblDelMenuPadre").textContent = "— (Es un menú principal)";
                    }

                    // --- DETECCIÓN DINÁMICA DE HIJOS ASOCIADOS ---
                    // Buscamos si existen otros menús en el arreglo local cuyo id_menuPadre coincida con el ID seleccionado
                    const tieneHijos = menusLocales.some(h => String(h.id_menuPadre) === String(m.id));
                    
                    if (tieneHijos && (m.id_menuPadre === null || m.id_menuPadre === "")) {
                        alertaHijos.style.display = "block"; // Se muestra el recuadro rojo de advertencia
                    } else {
                        alertaHijos.style.display = "none";
                    }

                    contenedorFicha.style.display = "block";
                };
                item.onmouseenter = () => item.style.backgroundColor = "#fdf2f2";
                item.onmouseleave = () => item.style.backgroundColor = "transparent";
                sugerencias.appendChild(item);
            });
            sugerencias.style.display = filtrados.length ? "block" : "none";
        };
    }

    if (btnConfirmar) {
        btnConfirmar.onclick = () => {
            if (!idSeleccionado) return;
            
            const formData = new FormData();
            // Corrección: Cambiado parámetro de "codigo_menu" a "id" para alinearse con tu SQL
            formData.append("id", idSeleccionado);
            formData.append("accion", "DESACTIVAR");

            fetch("Backend/controllers/menu_controller.php?gestion_crud=true", { method: "POST", body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("🔴 Módulo inhabilitado con éxito.");
                        txtBuscar.value = ""; 
                        contenedorFicha.style.display = "none"; 
                        idSeleccionado = null;
                        actualizarDatosLocales(); // Volvemos a sincronizar la caché local
                        document.dispatchEvent(new CustomEvent("cambioMenus"));
                    } else { 
                        alert("⚠️ Error del sistema: " + data.message); 
                    }
                })
                .catch(() => {
                    alert("❌ Error de conexión con el servidor.");
                });
        };
    }

    if (document.getElementById("btnCancelarEliminarMenu")) {
        document.getElementById("btnCancelarEliminarMenu").onclick = () => { 
            txtBuscar.value = ""; 
            contenedorFicha.style.display = "none"; 
            idSeleccionado = null; 
        };
    }
}