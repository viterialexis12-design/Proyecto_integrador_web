function inicializarVerUsuarios() {
  const tbody = document.getElementById("tbodyUsuarios");
  const btnRefrescar = document.getElementById("btnRefrescarUsuarios");
  const txtBuscar = document.getElementById("txtBuscarUsuario");

  // Guardaremos los usuarios originales en memoria para un filtrado ultra rápido y preciso
  let usuariosLocales = [];

  function cargarTabla() {
    if (!tbody) return;
    if (txtBuscar) txtBuscar.value = ""; // Limpiamos el buscador al refrescar
    tbody.innerHTML =
      '<tr><td colspan="7" style="text-align:center; padding: 20px; color: #475569;">⏳ Cargando usuarios...</td></tr>';

    fetch("Backend/controllers/usuario_controller.php")
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          usuariosLocales = response.data;
          renderizarFilas(usuariosLocales);
        } else {
          tbody.innerHTML = `<tr><td colspan="7" style="color:#e74c3c; text-align:center; padding: 20px; font-weight: bold;">⚠️ ${response.message}</td></tr>`;
        }
      })
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
        tbody.innerHTML =
          '<tr><td colspan="7" style="color:#e74c3c; text-align:center; padding: 20px; font-weight: bold;">❌ Error al conectar con el servidor.</td></tr>';
      });
  }

  function renderizarFilas(usuarios) {
    tbody.innerHTML = "";
    if (usuarios.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7" style="text-align:center; padding: 20px; color: #7f8c8d;">No se encontraron usuarios registrados.</td></tr>';
      return;
    }

    usuarios.forEach((u, index) => {
      const tr = document.createElement("tr");

      // Estilizado alternado de filas para mejorar la legibilidad (cebra)
      tr.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f8fafc";
      tr.style.borderBottom = "1px solid #e2e8f0";

      // Tratamiento de valores nulos para construir el nombre de forma limpia
      const n1 = u.nombre1 ? u.nombre1.trim() : "";
      const n2 = u.nombre2 ? u.nombre2.trim() : "";
      const a1 = u.apellido1 ? u.apellido1.trim() : "";
      const a2 = u.apellido2 ? u.apellido2.trim() : "";

      // Unimos los fragmentos ignorando los nulos o vacíos
      const nombreCompleto = [n1, n2, a1, a2].filter(Boolean).join(" ");

      const estadoTexto =
        parseInt(u.estado) === 1
          ? '<span style="color:#22c55e; background-color: #f0fdf4; padding: 4px 8px; border-radius: 4px; font-weight:bold; font-size: 0.85rem;">Activo</span>'
          : '<span style="color:#ef4444; background-color: #fef2f2; padding: 4px 8px; border-radius: 4px; font-weight:bold; font-size: 0.85rem;">Inactivo</span>';

      tr.innerHTML = `
                <td style="padding: 12px 15px; font-weight: bold; color: #64748b;">${u.id}</td>
                <td style="padding: 12px 15px; color: #1e293b; font-weight: 500;">${nombreCompleto}</td>
                <td style="padding: 12px 15px; color: #334155;">${u.cedula}</td>
                <td style="padding: 12px 15px; color: #334155;">${u.correo}</td>
                <td style="padding: 12px 15px; color: #475569; font-family: monospace;">${u.username}</td>
                <td style="padding: 12px 15px; color: #334155;"><span style="background-color: #e2e8f0; padding: 3px 6px; border-radius: 4px; font-size: 0.85rem;">${u.nombre_rol || "Sin Rol"}</span></td>
                <td style="padding: 12px 15px;">${estadoTexto}</td>
            `;
      tbody.appendChild(tr);
    });
  }

  // Evento manual para refrescar la lista
  if (btnRefrescar) btnRefrescar.onclick = cargarTabla;

  // Filtro avanzado en memoria (Evita colisiones con las etiquetas HTML de los estados)
  if (txtBuscar) {
    txtBuscar.oninput = (e) => {
      const termino = e.target.value.toLowerCase().trim();

      if (termino === "") {
        renderizarFilas(usuariosLocales);
        return;
      }

      const usuariosFiltrados = usuariosLocales.filter((u) => {
        const n1 = u.nombre1 ? u.nombre1.toLowerCase() : "";
        const n2 = u.nombre2 ? u.nombre2.toLowerCase() : "";
        const a1 = u.apellido1 ? u.apellido1.toLowerCase() : "";
        const a2 = u.apellido2 ? u.apellido2.toLowerCase() : "";
        const cedula = u.cedula ? u.cedula.toLowerCase() : "";
        const username = u.username ? u.username.toLowerCase() : "";
        const correo = u.correo ? u.correo.toLowerCase() : "";

        return (
          n1.includes(termino) ||
          n2.includes(termino) ||
          a1.includes(termino) ||
          a2.includes(termino) ||
          cedula.includes(termino) ||
          username.includes(termino) ||
          correo.includes(termino)
        );
      });

      renderizarFilas(usuariosFiltrados);
    };
  }

  // Ejecución inmediata al cargar el módulo
  cargarTabla();
}

function inicializarCrearUsuario() {
  const form = document.getElementById("formCrearUsuario");
  const cmbRol = document.getElementById("cmbRol");
  const btnCancelar = document.getElementById("btnCancelarUsuario");

  // Cargar dinámicamente los roles disponibles
  // Cargar dinámicamente los roles disponibles (Protegido)
  if (cmbRol) {
    fetch("Backend/controllers/rol_controller.php")
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          cmbRol.innerHTML =
            '<option value="">-- Seleccione un Rol --</option>';

          response.data.forEach((rol) => {
            // Regla de negocio: Si el rol es ID = 1 (Superadministrador),
            // se omite para evitar que se cree un segundo Superadmin.
            if (parseInt(rol.id) === 1) {
              return; // Salta este registro
            }

            cmbRol.innerHTML += `<option value="${rol.id}">${rol.nombre}</option>`;
          });
        } else {
          console.error("No se pudieron cargar los roles:", response.message);
        }
      })
      .catch((err) =>
        console.error("Error al obtener catálogo de roles:", err),
      );
  }

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      // Añadimos explícitamente la acción esperada por el controlador
      formData.append("accion", "REGISTRAR");

      fetch("Backend/controllers/usuario_controller.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Usuario registrado con éxito.");
            form.reset();
          } else {
            alert("⚠️ Error: " + data.message);
          }
        })
        .catch((err) => {
          console.error("Error en la solicitud de registro:", err);
          alert(
            "❌ Ocurrió un error al conectar con el servidor. Inténtalo de nuevo.",
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

function inicializarActualizarUsuario() {
  const form = document.getElementById("formEditarUsuario");
  const cmbRol = document.getElementById("cmbEditRol");
  const btnCancelar = document.getElementById("btnCancelarEditarUsuario");

  const txtBuscar = document.getElementById("txtBuscarParaEditar");
  const contenedorSugerencias = document.getElementById(
    "listaSugerenciasEditar",
  );
  const contenedorForm = document.getElementById("contenedorFormEditar");

  let usuariosLocales = []; // Cache en memoria de los usuarios para la barra de búsqueda

  // 1. Cargar catálogo de roles dinámicamente
  if (cmbRol) {
    fetch("Backend/controllers/rol_controller.php")
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          cmbRol.innerHTML =
            '<option value="">-- Seleccione un Rol --</option>';
          response.data.forEach((rol) => {
            // Ajustado al campo real de tu catálogo: rol.id
            cmbRol.innerHTML += `<option value="${rol.id}">${rol.nombre}</option>`;
          });
          // Cargamos los usuarios una vez que el combo de roles esté listo
          cargarCatalogoUsuarios();
        }
      })
      .catch((err) => console.error("Error al cargar roles:", err));
  }

  function cargarCatalogoUsuarios() {
    fetch("Backend/controllers/usuario_controller.php")
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          usuariosLocales = response.data;
        }
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }

  // 2. Controladores de eventos del buscador en tiempo real
  if (txtBuscar) {
    txtBuscar.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      contenedorSugerencias.innerHTML = "";

      if (query === "") {
        contenedorSugerencias.style.display = "none";
        return;
      }

      // Filtrado interactivo considerando campos existentes
      const filtrados = usuariosLocales.filter(
        (u) =>
          (u.nombre1 && u.nombre1.toLowerCase().includes(query)) ||
          (u.apellido1 && u.apellido1.toLowerCase().includes(query)) ||
          (u.cedula && u.cedula.includes(query)) ||
          (u.username && u.username.toLowerCase().includes(query)),
      );

      if (filtrados.length === 0) {
        contenedorSugerencias.innerHTML = `<div style="padding: 10px; color: #94a3b8; font-style: italic; font-size:0.9rem;">No se encontraron resultados</div>`;
      } else {
        filtrados.forEach((u) => {
          const item = document.createElement("div");
          item.style.padding = "10px 15px";
          item.style.cursor = "pointer";
          item.style.borderBottom = "1px solid #f1f5f9";
          item.style.fontSize = "0.95rem";
          item.innerHTML = `👤 <b>${u.nombre1} ${u.apellido1}</b> <small style="color:#64748b;">(${u.cedula} - ${u.username})</small>`;

          item.onclick = () => {
            txtBuscar.value = `${u.nombre1} ${u.apellido1} (${u.username})`;
            contenedorSugerencias.style.display = "none";
            // Pasamos u.id mapeando correctamente la Primary Key
            cargarUsuarioEnFormulario(u.id);
          };

          item.onmouseenter = () => (item.style.backgroundColor = "#f1f5f9");
          item.onmouseleave = () =>
            (item.style.backgroundColor = "transparent");

          contenedorSugerencias.appendChild(item);
        });
      }
      contenedorSugerencias.style.display = "block";
    };
  }

  // 3. Renderizado y protección del formulario según el rol
  function cargarUsuarioEnFormulario(idUsuario) {
    fetch(`Backend/controllers/usuario_controller.php?id=${idUsuario}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success" && response.data) {
          const u = response.data;

          // Seteamos valores mapeados a los inputs
          document.getElementById("txtEditIdUsuario").value = u.id;
          document.getElementById("txtEditNombre1").value = u.nombre1;
          document.getElementById("txtEditNombre2").value = u.nombre2 || "";
          document.getElementById("txtEditApellido1").value = u.apellido1;
          document.getElementById("txtEditApellido2").value = u.apellido2 || "";
          document.getElementById("txtEditCedula").value = u.cedula;
          document.getElementById("txtEditFechaNac").value =
            u.fecha_nacimiento || "";
          document.getElementById("txtEditTelefono").value = u.telefono || "";
          document.getElementById("txtEditCorreo").value = u.correo;
          document.getElementById("txtEditUsername").value = u.username;

          const cmbEditRol = document.getElementById("cmbEditRol");
          const cmbEditEstado = document.getElementById("cmbEditEstado");

          cmbEditRol.value = u.id_rol;
          cmbEditEstado.value = u.estado;

          // --- REGLA DE NEGOCIO EN EL FRONTEND ---
          // Si el id_rol del usuario es igual a 1 (Superadministrador) congelamos Rol y Estado
          if (parseInt(u.id_rol) === 1) {
            cmbEditRol.disabled = true;
            cmbEditEstado.disabled = true;
            cmbEditRol.style.backgroundColor = "#f1f5f9";
            cmbEditEstado.style.backgroundColor = "#f1f5f9";
          } else {
            cmbEditRol.disabled = false;
            cmbEditEstado.disabled = false;
            cmbEditRol.style.backgroundColor = "white";
            cmbEditEstado.style.backgroundColor = "white";
          }

          contenedorForm.style.display = "block";
        }
      })
      .catch((err) =>
        console.error("Error al obtener detalles del usuario:", err),
      );
  }

  // 4. Envío del formulario
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      // Habilitamos temporalmente los campos bloqueados para que FormData pueda capturarlos
      const cmbEditRol = document.getElementById("cmbEditRol");
      const cmbEditEstado = document.getElementById("cmbEditEstado");
      const rolBloqueado = cmbEditRol.disabled;

      if (rolBloqueado) {
        cmbEditRol.disabled = false;
        cmbEditEstado.disabled = false;
      }

      const formData = new FormData(form);
      formData.append("accion", "EDITAR");

      // Restauramos el estado disabled inmediatamente después de leer los datos
      if (rolBloqueado) {
        cmbEditRol.disabled = true;
        cmbEditEstado.disabled = true;
      }

      fetch("Backend/controllers/usuario_controller.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Usuario actualizado correctamente.");
            txtBuscar.value = "";
            contenedorForm.style.display = "none";
            cargarCatalogoUsuarios(); // Refrescar la memoria local
          } else {
            alert("⚠️ Error: " + data.message);
          }
        })
        .catch((err) => console.error("Error al guardar cambios:", err));
    };
  }

  if (btnCancelar) {
    btnCancelar.onclick = () => {
      txtBuscar.value = "";
      contenedorForm.style.display = "none";
      form.reset();
    };
  }
}

function inicializarEliminarUsuario() {
  const btnConfirmar = document.getElementById("btnConfirmarEliminar");
  const btnCancelar = document.getElementById("btnCancelarEliminar");
  const txtBuscar = document.getElementById("txtBuscarParaEliminar");
  const contenedorSugerencias = document.getElementById(
    "listaSugerenciasEliminar",
  );
  const contenedorFicha = document.getElementById("contenedorFichaEliminar");

  // Elementos de aviso y acciones
  const divAvisoBloqueo = document.getElementById("divAvisoBloqueo");
  const divAccionesEliminar = document.getElementById("divAccionesEliminar");

  let usuariosLocales = [];
  let idSeleccionado = null;

  // Cargar catálogo inicial
  fetch("Backend/controllers/usuario_controller.php")
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") usuariosLocales = response.data;
    });

  if (txtBuscar) {
    txtBuscar.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      contenedorSugerencias.innerHTML = "";

      if (query === "") {
        contenedorSugerencias.style.display = "none";
        return;
      }

      const filtrados = usuariosLocales.filter(
        (u) =>
          u.nombre1.toLowerCase().includes(query) ||
          u.apellido1.toLowerCase().includes(query) ||
          u.cedula.includes(query) ||
          u.username.toLowerCase().includes(query),
      );

      if (filtrados.length === 0) {
        contenedorSugerencias.innerHTML = `<div style="padding: 10px; color: #95a5a6; font-style: italic;">No se encontraron resultados</div>`;
      } else {
        filtrados.forEach((u) => {
          const item = document.createElement("div");
          item.style.padding = "10px 15px";
          item.style.cursor = "pointer";
          item.style.borderBottom = "1px solid #f1f5f9";
          item.innerHTML = `❌ <b>${u.nombre1} ${u.apellido1}</b> <small style="color:#e74c3c;">(${u.username})</small>`;

          item.onclick = () => {
            txtBuscar.value = `${u.nombre1} ${u.apellido1}`;
            contenedorSugerencias.style.display = "none";
            idSeleccionado = u.id; // Correcto: usamos el campo 'id'
            mostrarFichaBaja(u.id);
          };
          contenedorSugerencias.appendChild(item);
        });
      }
      contenedorSugerencias.style.display = "block";
    };
  }

  function mostrarFichaBaja(idUsuario) {
    fetch(`Backend/controllers/usuario_controller.php?id=${idUsuario}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success" && response.data) {
          const u = response.data;
          document.getElementById("lblDelIdUsuario").textContent = u.id;
          document.getElementById("lblDelNombreCompleto").textContent =
            `${u.nombre1} ${u.apellido1}`;
          document.getElementById("lblDelCedula").textContent = u.cedula;
          document.getElementById("lblDelUsername").textContent = u.username;
          document.getElementById("lblDelEstado").textContent =
            parseInt(u.estado) === 1 ? "Activo" : "Inactivo";

          // REGLA DE SEGURIDAD: Bloqueo de id_rol 1
          if (parseInt(u.id_rol) === 1) {
            divAvisoBloqueo.style.display = "block";
            divAccionesEliminar.style.display = "none";
          } else {
            divAvisoBloqueo.style.display = "none";
            divAccionesEliminar.style.display = "flex";
          }

          contenedorFicha.style.display = "block";
        }
      });
  }

  if (btnConfirmar) {
    btnConfirmar.onclick = () => {
      if (!idSeleccionado) return;

      const formData = new FormData();
      formData.append("id", idSeleccionado); // Correcto: enviamos campo 'id'
      formData.append("accion", "DESACTIVAR");

      fetch("Backend/controllers/usuario_controller.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("🔴 Cuenta de usuario desactivada con éxito.");
            txtBuscar.value = "";
            contenedorFicha.style.display = "none";
            idSeleccionado = null;
            // Recargar catálogo
            fetch("Backend/controllers/usuario_controller.php")
              .then((res) => res.json())
              .then((res) => {
                if (res.status === "success") usuariosLocales = res.data;
              });
          } else {
            alert("⚠️ Error: " + data.message);
          }
        });
    };
  }

  if (btnCancelar) {
    btnCancelar.onclick = () => {
      txtBuscar.value = "";
      contenedorFicha.style.display = "none";
      idSeleccionado = null;
    };
  }
}
