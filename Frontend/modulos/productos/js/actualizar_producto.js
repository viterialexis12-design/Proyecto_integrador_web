/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA LA ACTUALIZACIÓN DE PRODUCTOS
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  inicializarEditarProducto();
});

function inicializarEditarProducto() {
  const form = document.getElementById("formEditarProducto");
  const txtBuscar = document.getElementById("txtBuscarParaEditarProducto");
  const sugerencias = document.getElementById("listaSugerenciasEditarProducto");
  const contenedorForm = document.getElementById("contenedorFormEditarProducto");
  const btnCancelar = document.getElementById("btnCancelar");

  const txtIdProducto = document.getElementById("txtIdProducto");
  const txtNombre = document.getElementById("txtNombre");
  const txtDescripcion = document.getElementById("txtDescripcion");
  const selCategoria = document.getElementById("selCategoria");
  const txtUnidadMedida = document.getElementById("txtUnidadMedida");
  const txtPrecioUnitario = document.getElementById("txtPrecioUnitario");
  const txtStockActual = document.getElementById("txtStockActual");
  const selEstado = document.getElementById("selEstado");

  const RUTA_PRODUCTO_CONTROLLER = "../../../Backend/controllers/producto_controller.php";
  const RUTA_CATEGORIA_CONTROLLER = "../../../Backend/controllers/categoria_controller.php";

  let productosLocales = [];

  /**
   * Carga el catálogo de categorías dinámicamente en el <select>
   */
  function cargarCategorias() {
    fetch(`${RUTA_CATEGORIA_CONTROLLER}?gestion_crud=true`)
      .then((res) => res.json())
      .then((res) => {
        const lista = res.status === "success" && Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
        selCategoria.innerHTML = '<option value="" disabled selected>Seleccione una categoría...</option>';
        
        lista.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.id;
          option.textContent = cat.nombre;
          selCategoria.appendChild(option);
        });
      })
      .catch((err) => {
        console.error("Error al obtener categorías:", err);
        selCategoria.innerHTML = '<option value="" disabled>Error cargando categorías</option>';
      });
  }

  /**
   * Carga todos los productos para el autocomplete local
   */
  function cargarProductosLocales() {
    fetch(`${RUTA_PRODUCTO_CONTROLLER}?gestion_crud=true`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" && Array.isArray(res.data)) {
          productosLocales = res.data;
        } else if (Array.isArray(res)) {
          productosLocales = res;
        }
      })
      .catch((err) => console.error("Error cargando productos:", err));
  }

  // Carga inicial de catálogos
  cargarCategorias();
  cargarProductosLocales();

  /**
   * Buscador interactivo en tiempo real
   */
  if (txtBuscar) {
    txtBuscar.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      sugerencias.innerHTML = "";

      if (query === "") {
        sugerencias.style.display = "none";
        return;
      }

      const filtrados = productosLocales.filter((p) => {
        const nom = (p.nombre || "").toLowerCase();
        const desc = (p.descripcion || "").toLowerCase();
        return nom.includes(query) || desc.includes(query);
      });

      filtrados.forEach((p) => {
        const item = document.createElement("div");
        item.style.padding = "10px 14px";
        item.style.cursor = "pointer";
        item.style.borderBottom = "1px solid #f1f5f9";

        const estadoTexto = String(p.estado) === "1" ? "Activo" : "Inactivo";
        const badgeColor = String(p.estado) === "1" ? "#27ae60" : "#e74c3c";
        const precio = parseFloat(p.precioUnitario || 0).toFixed(2);

        item.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <b> ${p.nombre}</b>
              <small style="display: block; color: #64748b;">$${precio} | Stock: ${p.stockActual || 0} ${p.unidadMedida || ''}</small>
            </div>
            <span style="color: ${badgeColor}; font-weight: bold; font-size: 0.85em;">● ${estadoTexto}</span>
          </div>
        `;

        item.onmouseenter = () => (item.style.backgroundColor = "#f8fafc");
        item.onmouseleave = () => (item.style.backgroundColor = "transparent");

        item.onclick = () => {
          txtBuscar.value = p.nombre;
          sugerencias.style.display = "none";

          // Desplegar datos en el formulario
          txtIdProducto.value = p.id;
          txtNombre.value = p.nombre || "";
          txtDescripcion.value = p.descripcion || "";
          selCategoria.value = p.id_categoria;
          txtUnidadMedida.value = p.unidadMedida || "";
          txtPrecioUnitario.value = parseFloat(p.precioUnitario || 0);
          txtStockActual.value = parseFloat(p.stockActual || 0);
          selEstado.value = p.estado !== undefined ? p.estado : "1";

          contenedorForm.style.display = "block";
        };

        sugerencias.appendChild(item);
      });

      sugerencias.style.display = filtrados.length ? "block" : "none";
    };
  }

  /**
   * Cancelar edición
   */
  if (btnCancelar) {
    btnCancelar.onclick = () => {
      txtBuscar.value = "";
      contenedorForm.style.display = "none";
      form.reset();
    };
  }

  /**
   * Envío del Formulario
   */
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      if (txtNombre.value.trim() === "") {
        alert("El nombre del producto es obligatorio.");
        return;
      }

      if (parseFloat(txtPrecioUnitario.value) < 0) {
        alert("El precio unitario no puede ser negativo.");
        return;
      }

      const formData = new FormData();
      formData.append("accion", "EDITAR");
      formData.append("id", txtIdProducto.value);
      formData.append("nombre", txtNombre.value.trim());
      formData.append("descripcion", txtDescripcion.value.trim());
      formData.append("id_categoria", selCategoria.value);
      formData.append("unidadMedida", txtUnidadMedida.value.trim().toUpperCase());
      formData.append("precioUnitario", parseFloat(txtPrecioUnitario.value));
      formData.append("stockActual", parseFloat(txtStockActual.value));
      formData.append("estado", selEstado.value);

      fetch(RUTA_PRODUCTO_CONTROLLER, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Producto actualizado con éxito.");

            // Limpiar y ocultar vista
            txtBuscar.value = "";
            contenedorForm.style.display = "none";
            form.reset();

            // Refrescar caché local de productos
            cargarProductosLocales();
          } else {
            alert("Error al guardar los cambios: " + (data.message || "Fallo en el backend."));
          }
        })
        .catch((err) => {
          console.error(err);
          alert("❌ Falla crítica de red al procesar la actualización.");
        });
    };
  }
}