function inicializarVerRoles() {
  const tbody = document.getElementById("tbodyRoles");
  const btnRefrescar = document.getElementById("btnRefrescarRoles");
  const txtBuscar = document.getElementById("txtBuscarRol");

  // Variable local para almacenar los roles y filtrar de manera eficiente
  let rolesLocales = [];

  function cargarTabla() {
    if (!tbody) return;
    // Corrección: colspan="3" para coincidir exactamente con las columnas del HTML
    tbody.innerHTML =
      '<tr><td colspan="3" style="text-align:center; padding: 20px; color: #7f8c8d;">⏳ Cargando roles...</td></tr>';

    if (txtBuscar) txtBuscar.value = ""; // Limpiamos el buscador al refrescar

    fetch("Backend/controllers/rol_controller.php")
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          rolesLocales = response.data; // Respaldamos los datos originalmente cargados
          renderizarFilas(rolesLocales);
        } else {
          tbody.innerHTML = `<tr><td colspan="3" style="color:#e74c3c; text-align:center; padding: 20px; font-weight:bold;">⚠️ ${response.message}</td></tr>`;
        }
      })
      .catch(() => {
        tbody.innerHTML =
          '<tr><td colspan="3" style="color:#e74c3c; text-align:center; padding: 20px; font-weight:bold;">❌ Error de conexión con el servidor.</td></tr>';
      });
  }

  function renderizarFilas(roles) {
    if (!tbody) return;
    tbody.innerHTML = "";

    if (roles.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="3" style="text-align:center; padding: 20px; color: #7f8c8d;">No hay roles registrados.</td></tr>';
      return;
    }

    roles.forEach((r) => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid #e2e8f0";

      // Flexibilidad si el estado llega como entero (1) o string ("1")
      const estadoActivo = parseInt(r.estado) === 1;
      const estadoBadge = estadoActivo
        ? '<span style="color:#27ae60; font-weight:bold; background-color:#e8f8f5; padding:4px 8px; border-radius:4px; font-size:0.85rem;">Activo</span>'
        : '<span style="color:#c0392b; font-weight:bold; background-color:#fce4d6; padding:4px 8px; border-radius:4px; font-size:0.85rem;">Inactivo</span>';

      tr.innerHTML = `
                <td style="padding: 12px 15px;"><b>${r.nombre}</b></td>
                <td style="padding: 12px 15px; color: #34495e;">${r.descripcion || '<em style="color:#b2bec3;">Sin descripción</em>'}</td>
                <td style="padding: 12px 15px;">${estadoBadge}</td>
            `;

      // Efecto Hover simple en las filas
      tr.onmouseenter = () => (tr.style.backgroundColor = "#f8fafc");
      tr.onmouseleave = () => (tr.style.backgroundColor = "transparent");

      tbody.appendChild(tr);
    });
  }

  if (btnRefrescar) {
    btnRefrescar.onclick = () => cargarTabla();
  }

  // Filtro predictivo optimizado usando el arreglo local
  if (txtBuscar) {
    txtBuscar.oninput = (e) => {
      const term = e.target.value.toLowerCase().trim();

      // Si el buscador está vacío, renderizamos todo el set original
      if (term === "") {
        renderizarFilas(rolesLocales);
        return;
      }

      // Filtramos sobre la memoria local evaluando nombre o descripción
      const rolesFiltrados = rolesLocales.filter((r) => {
        const nombreMatch = r.nombre
          ? r.nombre.toLowerCase().includes(term)
          : false;
        const descMatch = r.descripcion
          ? r.descripcion.toLowerCase().includes(term)
          : false;
        return nombreMatch || descMatch;
      });

      renderizarFilas(rolesFiltrados);
    };
  }

  // Ejecución por defecto al cargar el componente de la SPA
  cargarTabla();
}

function inicializarCrearRol() {
  const form = document.getElementById("formCrearRol");
  const btnCancelar = document.getElementById("btnCancelarCrearRol");

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      // Agregamos la acción requerida por el controlador
      formData.append("accion", "CREAR");

      fetch("Backend/controllers/rol_controller.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Rol registrado exitosamente.");
            form.reset();
            document.dispatchEvent(new CustomEvent("cambioRoles"));
          } else {
            alert("⚠️ Error: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error al registrar rol:", error);
          alert(
            "❌ Error de conexión. No se pudo registrar el rol en el servidor.",
          );
        });
    };
  }

  if (btnCancelar && form) {
    btnCancelar.onclick = (e) => {
      e.preventDefault();
      form.reset();
    };
  }
}

function inicializarActualizarRoles() {
  const form = document.getElementById("formEditarRol");
  const txtBuscar = document.getElementById("txtBuscarParaEditarRol");
  const sugerencias = document.getElementById("listaSugerenciasEditarRol");
  const contenedorForm = document.getElementById("contenedorFormEditarRol");
  let rolesLocales = [];

  // Función aislada para solicitar los roles frescos de la base de datos
  function actualizarMemoriaRoles() {
    fetch("Backend/controllers/rol_controller.php")
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") rolesLocales = res.data;
      })
      .catch((err) => console.error("Error cargando roles base:", err));
  }

  // Carga inicial al inicializar la vista de la SPA
  actualizarMemoriaRoles();

  if (txtBuscar && sugerencias) {
    txtBuscar.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      sugerencias.innerHTML = "";

      if (query === "") {
        sugerencias.style.display = "none";
        return;
      }

      const filtrados = rolesLocales.filter(
        (r) => r.nombre && r.nombre.toLowerCase().includes(query),
      );

      filtrados.forEach((r) => {
        const item = document.createElement("div");
        item.style.padding = "10px 15px";
        item.style.cursor = "pointer";
        item.style.borderBottom = "1px solid #f1f5f9";
        item.style.fontSize = "0.95rem";
        item.innerHTML = `🔑 <b>${r.nombre}</b>`;

        item.onclick = () => {
          txtBuscar.value = r.nombre;
          sugerencias.style.display = "none";

          // Captura de elementos del formulario
          const txtId = document.getElementById("txtEditIdRol");
          const txtNombre = document.getElementById("txtEditRolNombre");
          const txtDescripcion = document.getElementById(
            "txtEditRolDescripcion",
          );
          const cmbEstado = document.getElementById("cmbEditRolEstado");

          // Mapeo de datos del rol seleccionado
          txtId.value = r.id;
          txtNombre.value = r.nombre;
          txtDescripcion.value = r.descripcion || "";
          cmbEstado.value = r.estado;

          // Regla de negocio: Si es el Super Admin (id === 1 o "1"), no se puede cambiar el estado
          if (parseInt(r.id) === 1) {
            cmbEstado.value = "1"; // Forzar Activo por seguridad
            cmbEstado.disabled = true; // Bloquear interacción en la interfaz
            cmbEstado.style.backgroundColor = "#e2e8f0"; // Estilo visual de deshabilitado
            cmbEstado.style.cursor = "not-allowed";
          } else {
            cmbEstado.disabled = false; // Habilitar para el resto de roles
            cmbEstado.style.backgroundColor = "#ffffff";
            cmbEstado.style.cursor = "default";
          }

          if (contenedorForm) contenedorForm.style.display = "block";
        };

        item.onmouseenter = () => (item.style.backgroundColor = "#f8fafc");
        item.onmouseleave = () => (item.style.backgroundColor = "transparent");
        sugerencias.appendChild(item);
      });

      sugerencias.style.display = filtrados.length ? "block" : "none";
    };

    // Ocultar el dropdown si el usuario hace clic fuera de la zona de búsqueda
    document.addEventListener("click", (e) => {
      if (e.target !== txtBuscar && e.target !== sugerencias) {
        sugerencias.style.display = "none";
      }
    });
  }

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      formData.append("accion", "EDITAR");

      fetch("Backend/controllers/rol_controller.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Rol actualizado correctamente.");
            if (txtBuscar) txtBuscar.value = "";
            if (contenedorForm) contenedorForm.style.display = "none";
            form.reset();
            document.dispatchEvent(new CustomEvent("cambioRoles"));
            actualizarMemoriaRoles(); // Sincroniza la memoria intermedia local
          } else {
            alert("⚠️ Error: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error al actualizar:", error);
          alert("❌ Error de comunicación con el servidor.");
        });
    };
  }

  const btnCancelar = document.getElementById("btnCancelarEditarRol");
  if (btnCancelar) {
    btnCancelar.onclick = (e) => {
      e.preventDefault();
      if (txtBuscar) txtBuscar.value = "";
      if (contenedorForm) contenedorForm.style.display = "none";
      if (form) form.reset();
    };
  }
}

function inicializarBorrarRoles() {
    const btnConfirmar = document.getElementById("btnConfirmarEliminarRol");
    const txtBuscar = document.getElementById("txtBuscarParaEliminarRol");
    const sugerencias = document.getElementById("listaSugerenciasEliminarRol");
    const contenedorFicha = document.getElementById("contenedorFichaEliminarRol");
    const msgProtegido = document.getElementById("msgProtegidoRol");
    
    let rolesLocales = [];
    let idSeleccionado = null;

    function actualizarMemoriaRoles() {
        fetch("Backend/controllers/rol_controller.php")
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") rolesLocales = res.data;
            })
            .catch(err => console.error("Error cargando roles base:", err));
    }

    // Carga inicial
    actualizarMemoriaRoles();

    if (txtBuscar && sugerencias) {
        txtBuscar.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            sugerencias.innerHTML = "";
            if (query === "") {
                if (contenedorFicha) contenedorFicha.style.display = "none";
                sugerencias.style.display = "none";
                return;
            }

            const filtrados = rolesLocales.filter((r) => r.nombre && r.nombre.toLowerCase().includes(query));
            
            filtrados.forEach((r) => {
                const item = document.createElement("div");
                item.style.padding = "10px 15px";
                item.style.cursor = "pointer";
                item.style.borderBottom = "1px solid #f1f5f9";
                item.style.fontSize = "0.95rem";
                item.innerHTML = `❌ <b>${r.nombre}</b>`;
                
                item.onclick = () => {
                    txtBuscar.value = r.nombre;
                    sugerencias.style.display = "none";
                    
                    // Sincronización con la base de datos (usando r.id)
                    idSeleccionado = r.id;
                    document.getElementById("lblDelIdRol").textContent = r.id;
                    document.getElementById("lblDelRolNombre").textContent = r.nombre;
                    document.getElementById("lblDelRolDesc").textContent = r.descripcion || "Sin descripción";
                    document.getElementById("lblDelRolEstado").textContent = parseInt(r.estado) === 1 ? "Activo" : "Inactivo";
                    
                    // Regla de negocio: Validar protección del ID = 1 (Super Admin)
                    if (parseInt(r.id) === 1) {
                        if (msgProtegido) msgProtegido.style.display = "block";
                        if (btnConfirmar) {
                            btnConfirmar.disabled = true;
                            btnConfirmar.style.backgroundColor = "#95a5a6";
                            btnConfirmar.style.cursor = "not-allowed";
                            btnConfirmar.textContent = "🔒 Acción Bloqueada";
                        }
                    } else {
                        if (msgProtegido) msgProtegido.style.display = "none";
                        if (btnConfirmar) {
                            btnConfirmar.disabled = false;
                            btnConfirmar.style.backgroundColor = "#e74c3c";
                            btnConfirmar.style.cursor = "pointer";
                            btnConfirmar.textContent = "🔴 Confirmar Inactivación";
                        }
                    }
                    
                    if (contenedorFicha) contenedorFicha.style.display = "block";
                };
                
                item.onmouseenter = () => (item.style.backgroundColor = "#fdf2f2");
                item.onmouseleave = () => (item.style.backgroundColor = "transparent");
                sugerencias.appendChild(item);
            });
            
            sugerencias.style.display = filtrados.length ? "block" : "none";
        };

        // Ocultar buscador al hacer clic afuera
        document.addEventListener("click", (e) => {
            if (e.target !== txtBuscar && e.target !== sugerencias) {
                sugerencias.style.display = "none";
            }
        });
    }

    if (btnConfirmar) {
        btnConfirmar.onclick = () => {
            if (!idSeleccionado) return;
            
            // Doble validación en UI antes de disparar la petición
            if (parseInt(idSeleccionado) === 1) {
                alert("⛔ Error: No se puede inactivar al Super Administrador por seguridad del sistema.");
                return;
            }

            const formData = new FormData();
            // Cambio de nombre de parámetro para coincidir con la BD relacional ("id")
            formData.append("id", idSeleccionado);
            formData.append("accion", "DESACTIVAR");

            fetch("Backend/controllers/rol_controller.php", {
                method: "POST",
                body: formData,
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    alert("🔴 Rol inhabilitado correctamente.");
                    limpiarFormulario();
                    actualizarMemoriaRoles();
                    document.dispatchEvent(new CustomEvent("cambioRoles"));
                } else {
                    alert("⚠️ Error: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error al inactivar el rol:", error);
                alert("❌ Error de conexión. No se pudo cambiar el estado del rol.");
            });
        };
    }

    const btnCancelar = document.getElementById("btnCancelarEliminarRol");
    if (btnCancelar) {
        btnCancelar.onclick = () => limpiarFormulario();
    }

    function limpiarFormulario() {
        if (txtBuscar) txtBuscar.value = "";
        if (contenedorFicha) contenedorFicha.style.display = "none";
        idSeleccionado = null;
    }
}
