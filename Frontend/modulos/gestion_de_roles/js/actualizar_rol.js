/**
 * ==========================================================================
 * LÓGICA DE ACTUALIZACIÓN DE ROLES (actualizar_rol.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  inicializarActualizarRoles();
});

function inicializarActualizarRoles() {
  const form = document.getElementById("formEditarRol");
  const txtBuscar = document.getElementById("txtBuscarParaEditarRol");
  const sugerencias = document.getElementById("listaSugerenciasEditarRol");
  const contenedorForm = document.getElementById("contenedorFormEditarRol");
  const btnGuardar = document.getElementById("btnGuardarCambiosRol");
  const btnCancelar = document.getElementById("btnCancelarEditarRol");

  let rolesLocales = [];

  /**
   * Sincroniza la lista interna de roles desde la base de datos
   */
  function actualizarMemoriaRoles() {
    fetch("../../../Backend/controllers/rol_controller.php")
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          rolesLocales = res.data;
        }
      })
      .catch((err) => console.error("Error cargando roles base:", err));
  }

  // Carga inicial al cargar la SPA
  actualizarMemoriaRoles();

  // Sincronizar memoria si se añade un rol desde otra pestaña/sección
  document.addEventListener("cambioRoles", () => {
    actualizarMemoriaRoles();
  });

  // Control del buscador predictivo
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

          // Elementos del formulario
          const txtId = document.getElementById("txtEditIdRol");
          const txtNombre = document.getElementById("txtEditRolNombre");
          const txtDescripcion = document.getElementById(
            "txtEditRolDescripcion",
          );
          const cmbEstado = document.getElementById("cmbEditRolEstado");

          // Mapear los valores seleccionados
          txtId.value = r.id;
          txtNombre.value = r.nombre;
          txtDescripcion.value = r.descripcion || "";
          cmbEstado.value = r.estado;

          // Regla de Negocio: Si es el Super Administrador (ID: 1), proteger estado
          if (parseInt(r.id) === 1) {
            cmbEstado.value = "1"; // Forzar Activo
            cmbEstado.disabled = true;
            cmbEstado.style.backgroundColor = "#e2e8f0";
            cmbEstado.style.cursor = "not-allowed";
          } else {
            cmbEstado.disabled = false;
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

    // Cerrar dropdown si el usuario hace clic fuera del buscador
    document.addEventListener("click", (e) => {
      if (e.target !== txtBuscar && e.target !== sugerencias) {
        sugerencias.style.display = "none";
      }
    });
  }

  // Procesar el formulario al enviar
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      const txtIdVal = document.getElementById("txtEditIdRol").value;

      if (btnGuardar) {
        btnGuardar.disabled = true;
        btnGuardar.textContent = "⏳ Guardando...";
      }

      const formData = new FormData(form);
      formData.append("accion", "EDITAR");

      // IMPORTANTE: Si el select está deshabilitado (Super Admin), FormData NO lo incluye.
      // Nos aseguramos manualmente de enviar el estado en "1" para evitar fallos en backend.
      if (parseInt(txtIdVal) === 1) {
        formData.set("estado", "1");
      }

      fetch("../../../Backend/controllers/rol_controller.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Rol actualizado correctamente.");

            // Resetear interfaz
            if (txtBuscar) txtBuscar.value = "";
            if (contenedorForm) contenedorForm.style.display = "none";
            form.reset();

            // Propagar cambios de manera global y refrescar memoria local
            document.dispatchEvent(new CustomEvent("cambioRoles"));
            actualizarMemoriaRoles();
          } else {
            alert("⚠️ Error: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error al actualizar:", error);
          alert("❌ Error de conexión con el servidor.");
        })
        .finally(() => {
          if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = "💾 Guardar Cambios";
          }
        });
    };
  }

  // Botón cancelar / limpiar buscador
  if (btnCancelar) {
    btnCancelar.onclick = (e) => {
      e.preventDefault();
      if (txtBuscar) txtBuscar.value = "";
      if (contenedorForm) contenedorForm.style.display = "none";
      if (form) form.reset();
    };
  }
}
