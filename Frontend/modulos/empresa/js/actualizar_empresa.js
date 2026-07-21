/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA LA CONFIGURACIÓN/ACTUALIZACIÓN DE LA EMPRESA
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  inicializarActualizarEmpresa();
});

function inicializarActualizarEmpresa() {
  const loader = document.getElementById("loaderEmpresa");
  const formEmpresa = document.getElementById("formActualizarEmpresa");
  const txtEmpresaId = document.getElementById("txtEmpresaId");
  const contenedorCampos = document.getElementById("contenedorCamposEmpresa");
  const btnRestablecer = document.getElementById("btnRestablecerEmpresa");

  const RUTA_EMPRESA_CONTROLLER = "../../../Backend/controllers/empresa_controller.php";

  let datosEmpresaOriginales = {};
  let datosEmpresaEditados = {};

  /**
   * Carga la información de la empresa desde el Backend
   */
  function cargarDatosEmpresa() {
    loader.style.display = "block";
    formEmpresa.style.display = "none";
    contenedorCampos.innerHTML = "";

    fetch(`${RUTA_EMPRESA_CONTROLLER}?accion=OBTENER_EMPRESA_UNICA`)
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success" && response.data) {
          datosEmpresaOriginales = { ...response.data };
          datosEmpresaEditados = { ...response.data };

          txtEmpresaId.value = response.data.id || 1;

          renderizarCamposEmpresa();
          loader.style.display = "none";
          formEmpresa.style.display = "block";
        } else {
          loader.style.display = "none";
          contenedorCampos.innerHTML = `<div style="grid-column: 1 / -1; color: #ef4444; padding: 20px;">⚠️ ${response.message || "No se pudo recuperar la información de la empresa."}</div>`;
          formEmpresa.style.display = "block";
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos de la empresa:", err);
        loader.style.display = "none";
        contenedorCampos.innerHTML = '<div style="grid-column: 1 / -1; color: #ef4444; padding: 20px;">❌ Error de conexión con el controlador de empresa.</div>';
        formEmpresa.style.display = "block";
      });
  }

  /**
   * Genera dinámicamente las tarjetas de edición por cada columna/campo
   */
  function renderizarCamposEmpresa() {
    contenedorCampos.innerHTML = "";

    // Mapeo estricto basado en la estructura fiscal/comercial
    const esquemaCampos = [
      { clave: "razonSocial", etiqueta: "Razón Social", tipo: "text", icono: "🏢" },
      { clave: "nombreComercial", etiqueta: "Nombre Comercial", tipo: "text", icono: "🏷️" },
      { clave: "ruc", etiqueta: "RUC", tipo: "text", icono: "🆔" },
      { clave: "dirMatriz", etiqueta: "Dirección Matriz", tipo: "text", icono: "📍" },
      { clave: "obligadoContabilidad", etiqueta: "Obligado a Llevar Contabilidad", tipo: "select", opciones: ["SI", "NO"], icono: "📊" },
      { clave: "contribuyenteEspecial", etiqueta: "Nro. Contribuyente Especial", tipo: "text", icono: "⭐" }
    ];

    esquemaCampos.forEach((campo) => {
      const valorActual = datosEmpresaEditados[campo.clave] !== undefined ? datosEmpresaEditados[campo.clave] : "";

      const cardAtributo = document.createElement("div");
      cardAtributo.className = "card-atributo";

      const headerAtributo = document.createElement("div");
      headerAtributo.className = "card-atributo-header";
      headerAtributo.innerHTML = `
        <span>
          ${campo.icono} ${campo.etiqueta}
        </span>
      `;

      const cuerpoAtributo = document.createElement("div");
      cuerpoAtributo.className = "card-atributo-body";

      let inputElement;

      if (campo.tipo === "select") {
        inputElement = document.createElement("select");
        inputElement.className = "form-control";

        campo.opciones.forEach((opcion) => {
          const opt = document.createElement("option");
          opt.value = opcion;
          opt.textContent = opcion;
          if (opcion === valorActual) opt.selected = true;
          inputElement.appendChild(opt);
        });

        inputElement.addEventListener("change", (e) => {
          datosEmpresaEditados[campo.clave] = e.target.value;
        });
      } else {
        inputElement = document.createElement("input");
        inputElement.type = campo.tipo;
        inputElement.className = "form-control";
        inputElement.value = valorActual;

        inputElement.addEventListener("input", (e) => {
          datosEmpresaEditados[campo.clave] = e.target.value;
        });
      }

      cuerpoAtributo.appendChild(inputElement);
      cardAtributo.appendChild(headerAtributo);
      cardAtributo.appendChild(cuerpoAtributo);
      contenedorCampos.appendChild(cardAtributo);
    });
  }

  /**
   * Guardar cambios
   */
  if (formEmpresa) {
    formEmpresa.onsubmit = (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("accion", "EDITAR");
      formData.append("id", txtEmpresaId.value);

      Object.keys(datosEmpresaEditados).forEach((clave) => {
        if (clave !== "id") {
          formData.append(clave, datosEmpresaEditados[clave]);
        }
      });

      fetch(RUTA_EMPRESA_CONTROLLER, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Información de la empresa actualizada con éxito.");
            cargarDatosEmpresa();
          } else {
            alert("⚠️ No se pudo guardar: " + (data.message || "Fallo en el servidor."));
          }
        })
        .catch((err) => {
          console.error(err);
          alert("❌ Error crítico al procesar la actualización de la empresa.");
        });
    };
  }

  /**
   * Restablecer campos a sus valores originales
   */
  if (btnRestablecer) {
    btnRestablecer.onclick = () => {
      if (confirm("¿Estás seguro de que deseas descartar los cambios y restaurar los valores actuales?")) {
        datosEmpresaEditados = { ...datosEmpresaOriginales };
        renderizarCamposEmpresa();
      }
    };
  }

  // Carga inicial
  cargarDatosEmpresa();
}