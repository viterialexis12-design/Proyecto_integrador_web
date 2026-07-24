/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA LA ACTUALIZACIÓN DE CATEGORÍAS
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  inicializarEditarCategoria();
});

function inicializarEditarCategoria() {
  const form = document.getElementById("formEditarCategoria");
  const txtBuscar = document.getElementById("txtBuscarParaEditarCategoria");
  const sugerencias = document.getElementById("listaSugerenciasEditarCategoria");
  const contenedorForm = document.getElementById("contenedorFormEditarCategoria");
  const btnCancelar = document.getElementById("btnCancelar");

  const txtIdCategoria = document.getElementById("txtIdCategoria");
  const txtNombre = document.getElementById("txtNombre");
  const txtDescripcion = document.getElementById("txtDescripcion");
  const selIvaSRI = document.getElementById("selIvaSRI");
  const selEstado = document.getElementById("selEstado");

  const RUTA_CONTROLLER = "../../../Backend/controllers/categoria_controller.php";
  let categoriasLocales = [];

  /**
   * Carga el catálogo global de categorías para búsqueda local
   */
  function cargarCategoriasLocales() {
    fetch(`${RUTA_CONTROLLER}?gestion_crud=true`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" && Array.isArray(res.data)) {
          categoriasLocales = res.data;
        } else if (Array.isArray(res)) {
          categoriasLocales = res;
        }
      })
      .catch((err) => console.error("Error cargando categorías:", err));
  }
  cargarCategoriasLocales();

  /**
   * Buscador interactivo y autocompletado por Nombre o Descripción
   */
  if (txtBuscar) {
    txtBuscar.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      sugerencias.innerHTML = "";

      if (query === "") {
        sugerencias.style.display = "none";
        return;
      }

      const filtrados = categoriasLocales.filter((c) => {
        const nom = (c.nombre || "").toLowerCase();
        const desc = (c.descripcion || "").toLowerCase();
        return nom.includes(query) || desc.includes(query);
      });

      filtrados.forEach((c) => {
        const item = document.createElement("div");
        item.style.padding = "10px";
        item.style.cursor = "pointer";
        item.style.borderBottom = "1px solid #eee";

        const estadoTexto = String(c.estado) === "1" ? "Activo" : "Inactivo";
        const badgeColor = String(c.estado) === "1" ? "#27ae60" : "#e74c3c";

        item.innerHTML = `
          <b>${c.nombre}</b> 
          <span style="float: right; color: ${badgeColor}; font-weight: bold; font-size: 0.85em;">● ${estadoTexto}</span>
        `;

        item.onmouseenter = () => (item.style.backgroundColor = "#f1f5f9");
        item.onmouseleave = () => (item.style.backgroundColor = "transparent");

        item.onclick = () => {
          txtBuscar.value = c.nombre;
          sugerencias.style.display = "none";

          // Desplegar datos en el formulario
          txtIdCategoria.value = c.id;
          txtNombre.value = c.nombre || "";
          txtDescripcion.value = c.descripcion || "";
          selIvaSRI.value = c.id_ivaSRI !== undefined ? c.id_ivaSRI : "2";
          selEstado.value = c.estado !== undefined ? c.estado : "1";

          contenedorForm.style.display = "block";
        };

        sugerencias.appendChild(item);
      });

      sugerencias.style.display = filtrados.length ? "block" : "none";
    };
  }

  /**
   * Botón Cancelar - Resetea el buscador y oculta la vista de formulario
   */
  if (btnCancelar) {
    btnCancelar.onclick = () => {
      txtBuscar.value = "";
      contenedorForm.style.display = "none";
      form.reset();
    };
  }

  /**
   * Enviar Formulario de Actualización
   */
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      if (txtNombre.value.trim() === "") {
        alert("El nombre de la categoría no puede quedar vacío.");
        return;
      }

      const formData = new FormData();
      formData.append("accion", "EDITAR");
      formData.append("id", txtIdCategoria.value);
      formData.append("nombre", txtNombre.value.trim());
      formData.append("descripcion", txtDescripcion.value.trim());
      formData.append("id_ivaSRI", selIvaSRI.value);
      formData.append("estado", selEstado.value);

      fetch(RUTA_CONTROLLER, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Categoría modificada con éxito.");

            // Limpiar y ocultar formulario
            txtBuscar.value = "";
            contenedorForm.style.display = "none";
            form.reset();

            // Refrescar lista local para búsquedas consecutivas
            cargarCategoriasLocales();
          } else {
            alert("Error al actualizar: " + (data.message || "Operación fallida."));
          }
        })
        .catch((err) => {
          console.error(err);
          alert("❌ Falla crítica de red al procesar los cambios.");
        });
    };
  }
}