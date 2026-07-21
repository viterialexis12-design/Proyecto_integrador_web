/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA LA ACTUALIZACIÓN DE PUNTOS DE EMISIÓN
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  inicializarActualizarPunto();
});

function inicializarActualizarPunto() {
  const form = document.getElementById("formEditarPunto");
  const txtBuscar = document.getElementById("txtBuscarParaEditarPunto");
  const sugerencias = document.getElementById("listaSugerenciasEditarPunto");
  const contenedorForm = document.getElementById("contenedorFormEditarPunto");
  const btnCancelar = document.getElementById("btnCancelarEditarPunto");

  const txtId = document.getElementById("txtEditIdPunto");
  const txtNombre = document.getElementById("txtEditNombre");
  const txtCodigoSRI = document.getElementById("txtEditCodigoSRI");
  const txtSecuencial = document.getElementById("txtEditSecuencial");
  const selEstado = document.getElementById("selEditEstado");
  const txtIdEmpresa = document.getElementById("txtEditIdEmpresa");
  const txtIdUsuario = document.getElementById("txtEditIdUsuario");

  const RUTA_CONTROLLER = "../../../Backend/controllers/puntoEmision_controller.php";
  let puntosLocales = [];

  /**
   * Carga la lista global de puntos de emisión para la búsqueda local
   */
  function actualizarDatosLocales() {
    fetch(`${RUTA_CONTROLLER}?gestion_crud=true`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" && Array.isArray(res.data)) {
          puntosLocales = res.data;
        } else if (Array.isArray(res)) {
          puntosLocales = res;
        }
      })
      .catch((err) => console.error("Error cargando puntos de emisión:", err));
  }
  actualizarDatosLocales();

  /**
   * Buscador y lógica de autocompletado
   */
  if (txtBuscar) {
    txtBuscar.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      sugerencias.innerHTML = "";

      if (query === "") {
        sugerencias.style.display = "none";
        return;
      }

      const filtrados = puntosLocales.filter(
        (p) =>
          (p.nombre && p.nombre.toLowerCase().includes(query)) ||
          (p.codigoSRI && p.codigoSRI.toLowerCase().includes(query))
      );

      filtrados.forEach((p) => {
        const item = document.createElement("div");
        item.style.padding = "10px";
        item.style.cursor = "pointer";
        item.style.borderBottom = "1px solid #eee";

        const estadoTexto = String(p.estado) === "1" ? "Activo" : "Inactivo";
        const badgeColor = String(p.estado) === "1" ? "#27ae60" : "#e74c3c";

        item.innerHTML = `
          🏢 <b>${p.nombre}</b> 
          <small style="color:#7f8c8d;">[SRI: ${p.codigoSRI}]</small> 
          <span style="float: right; color: ${badgeColor}; font-weight: bold; font-size: 0.85em;">● ${estadoTexto}</span>
        `;

        // Efecto hover
        item.onmouseenter = () => (item.style.backgroundColor = "#f1f5f9");
        item.onmouseleave = () => (item.style.backgroundColor = "transparent");

        // Selección de un registro
        item.onclick = () => {
          txtBuscar.value = p.nombre;
          sugerencias.style.display = "none";

          // Llenar formulario con el elemento seleccionado
          txtId.value = p.id;
          txtNombre.value = p.nombre || "";
          txtCodigoSRI.value = p.codigoSRI || "";
          txtSecuencial.value = p.secuencial || 1;
          selEstado.value = p.estado !== undefined ? p.estado : "1";
          txtIdEmpresa.value = p.id_empresa || "";
          txtIdUsuario.value = p.id_usuario || "";

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

      const formData = new FormData(form);
      formData.append("accion", "EDITAR");

      fetch(RUTA_CONTROLLER, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Punto de emisión actualizado exitosamente.");

            // Resetear la interfaz
            txtBuscar.value = "";
            contenedorForm.style.display = "none";
            form.reset();

            // Refrescar lista local
            actualizarDatosLocales();
          } else {
            alert("⚠️ Error: " + (data.message || "No se pudo actualizar."));
          }
        })
        .catch((err) => {
          console.error(err);
          alert("❌ Error de conexión con el servidor.");
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