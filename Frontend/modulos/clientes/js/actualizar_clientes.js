/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA LA ACTUALIZACIÓN DE CLIENTES
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  inicializarActualizarCliente();
});

function inicializarActualizarCliente() {
  const form = document.getElementById("formEditarCliente");
  const txtBuscar = document.getElementById("txtBuscarParaEditarCliente");
  const sugerencias = document.getElementById("listaSugerenciasEditarCliente");
  const contenedorForm = document.getElementById("contenedorFormEditarCliente");
  const btnCancelar = document.getElementById("btnCancelarEditarCliente");

  const txtId = document.getElementById("txtEditIdCliente");
  const selTipoIdentificacion = document.getElementById("selEditTipoIdentificacion");
  const txtIdentificacion = document.getElementById("txtEditIdentificacion");
  const txtNombre1 = document.getElementById("txtEditNombre1");
  const txtNombre2 = document.getElementById("txtEditNombre2");
  const txtApellido1 = document.getElementById("txtEditApellido1");
  const txtApellido2 = document.getElementById("txtEditApellido2");
  const txtCorreo = document.getElementById("txtEditCorreo");
  const txtTelefono = document.getElementById("txtEditTelefono");
  const selEstado = document.getElementById("selEditEstado");
  const txtDireccion = document.getElementById("txtEditDireccion");

  const RUTA_CONTROLLER = "../../../Backend/controllers/cliente_controller.php";
  let clientesLocales = [];

  /**
   * Configura validaciones de min/max length según tipo de documento (Cédula/RUC)
   */
  function configurarMascaraDocumento(tipo) {
    if (tipo === "05") { // Cédula
      txtIdentificacion.maxLength = 10;
      txtIdentificacion.minLength = 10;
    } else if (tipo === "04") { // RUC
      txtIdentificacion.maxLength = 13;
      txtIdentificacion.minLength = 13;
    } else {
      txtIdentificacion.removeAttribute("maxLength");
      txtIdentificacion.removeAttribute("minLength");
    }
  }

  selTipoIdentificacion.addEventListener("change", () => {
    configurarMascaraDocumento(selTipoIdentificacion.value);
  });

  /**
   * Carga la lista global de clientes para la búsqueda local
   */
  function actualizarDatosLocales() {
    fetch(`${RUTA_CONTROLLER}?gestion_crud=true`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" && Array.isArray(res.data)) {
          clientesLocales = res.data;
        } else if (Array.isArray(res)) {
          clientesLocales = res;
        }
      })
      .catch((err) => console.error("Error cargando el catálogo de clientes:", err));
  }
  actualizarDatosLocales();

  /**
   * Buscador interactivo y autocompletado
   */
  if (txtBuscar) {
    txtBuscar.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      sugerencias.innerHTML = "";

      if (query === "") {
        sugerencias.style.display = "none";
        return;
      }

      const filtrados = clientesLocales.filter((c) => {
        const iden = (c.identificacion || "").toLowerCase();
        const n1 = (c.nombre1 || "").toLowerCase();
        const n2 = (c.nombre2 || "").toLowerCase();
        const a1 = (c.apellido1 || "").toLowerCase();
        const a2 = (c.apellido2 || "").toLowerCase();
        const nombreCompleto = `${n1} ${n2} ${a1} ${a2}`;

        return iden.includes(query) || nombreCompleto.includes(query);
      });

      filtrados.forEach((c) => {
        const item = document.createElement("div");
        item.style.padding = "10px";
        item.style.cursor = "pointer";
        item.style.borderBottom = "1px solid #eee";

        const estadoTexto = String(c.estado) === "1" ? "Activo" : "Inactivo";
        const badgeColor = String(c.estado) === "1" ? "#27ae60" : "#e74c3c";
        const nombreMostrar = `${c.nombre1 || ""} ${c.apellido1 || ""}`.trim();

        item.innerHTML = `
          👤 <b>${nombreMostrar}</b> 
          <small style="color:#7f8c8d;">[${c.identificacion || "S/I"}]</small> 
          <span style="float: right; color: ${badgeColor}; font-weight: bold; font-size: 0.85em;">● ${estadoTexto}</span>
        `;

        item.onmouseenter = () => (item.style.backgroundColor = "#f1f5f9");
        item.onmouseleave = () => (item.style.backgroundColor = "transparent");

        item.onclick = () => {
          txtBuscar.value = `${nombreMostrar} (${c.identificacion})`;
          sugerencias.style.display = "none";

          // Llenar campos con el objeto seleccionado
          txtId.value = c.id;
          selTipoIdentificacion.value = c.tipoIdentificacion || "05";
          txtIdentificacion.value = c.identificacion || "";
          txtNombre1.value = c.nombre1 || "";
          txtNombre2.value = c.nombre2 || "";
          txtApellido1.value = c.apellido1 || "";
          txtApellido2.value = c.apellido2 || "";
          txtCorreo.value = c.correo || "";
          txtTelefono.value = c.telefono || "";
          selEstado.value = c.estado !== undefined ? c.estado : "1";
          txtDireccion.value = c.direccion || "";

          configurarMascaraDocumento(selTipoIdentificacion.value);
          contenedorForm.style.display = "block";
        };

        sugerencias.appendChild(item);
      });

      sugerencias.style.display = filtrados.length ? "block" : "none";
    };
  }

  /**
   * Procesar Guardado / Actualización (Submit)
   */
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      const identificacion = txtIdentificacion.value.trim();
      const tipoId = selTipoIdentificacion.value;

      // Validaciones rápidas en cliente
      if (tipoId === "05" && identificacion.length !== 10) {
        alert("⚠️ Formato incorrecto. La cédula requiere 10 dígitos.");
        return;
      }
      if (tipoId === "04" && identificacion.length !== 13) {
        alert("⚠️ Formato incorrecto. El RUC requiere 13 dígitos.");
        return;
      }

      const formData = new FormData(form);
      formData.append("accion", "EDITAR");

      fetch(RUTA_CONTROLLER, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Registro de cliente actualizado exitosamente.");

            // Resetear interfaz
            txtBuscar.value = "";
            contenedorForm.style.display = "none";
            form.reset();

            // Recargar datos para búsquedas posteriores
            actualizarDatosLocales();
          } else {
            alert("⚠️ Error al guardar: " + (data.message || "Operación no completada."));
          }
        })
        .catch((err) => {
          console.error(err);
          alert("❌ Fallo crítico al intentar enviar la actualización del cliente.");
        });
    };
  }

  /**
   * Botón Cancelar
   */
  if (btnCancelar) {
    btnCancelar.onclick = () => {
      txtBuscar.value = "";
      contenedorForm.style.display = "none";
      form.reset();
    };
  }
}