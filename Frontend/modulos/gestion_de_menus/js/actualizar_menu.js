/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA LA ACTUALIZACIÓN DE MENÚS (actualizar_menu.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  inicializarActualizarMenu();
});

function inicializarActualizarMenu() {
  const form = document.getElementById("formEditarMenu");
  const txtBuscar = document.getElementById("txtBuscarParaEditarMenu");
  const sugerencias = document.getElementById("listaSugerenciasEditarMenu");
  const contenedorForm = document.getElementById("contenedorFormEditarMenu");

  const cmbPadre = document.getElementById("cmbEditMenuPadre");
  const wrapperUrl = document.getElementById("wrapperEditUrlMenu");
  const txtUrl = document.getElementById("txtEditMenuUrl");

  const cmbEstado = document.getElementById("txtUpdateEstadoMenu");
  const alertaHijosUpdate = document.getElementById("alertaHijosUpdateMenu");

  let menusLocales = [];
  let menuSeleccionadoActivo = null;

  /**
   * Carga de datos base (Se ajusta la ruta por estar dentro del Iframe)
   */
  function actualizarDatosLocales() {
    fetch("../../../Backend/controllers/menu_controller.php?gestion_crud=true")
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") menusLocales = res.data;
      })
      .catch((err) => console.error("Error cargando menús locales:", err));
  }
  actualizarDatosLocales();

  /**
   * Evalúa si se debe mostrar la advertencia visual al desactivar un padre
   */
  function evaluarAdvertenciaDesactivacion() {
    if (!menuSeleccionadoActivo || !alertaHijosUpdate || !cmbEstado) return;

    const estadoSeleccionado = cmbEstado.value; // "1" o "0"
    const esPadre =
      menuSeleccionadoActivo.id_menuPadre === null ||
      menuSeleccionadoActivo.id_menuPadre === "" ||
      menuSeleccionadoActivo.id_menuPadre == 0;
    const tieneHijos = menusLocales.some(
      (h) => String(h.id_menuPadre) === String(menuSeleccionadoActivo.id),
    );

    // Si se intenta desactivar un menú padre que tiene hijos dependientes
    if (estadoSeleccionado === "0" && esPadre && tieneHijos) {
      // Reestablecer estilos de peligro (Rojo) y el texto original de cascada
      alertaHijosUpdate.style.backgroundColor = "#f8d7da";
      alertaHijosUpdate.style.borderLeftColor = "#dc3545";
      alertaHijosUpdate.style.color = "#721c24";
      alertaHijosUpdate.innerHTML = "⚠️ <b>¡Atención!</b> Si cambias el estado a 'Inactivo', todos los submenús dependientes de este módulo principal también se desactivarán en cascada.";
      alertaHijosUpdate.style.display = "block";
    } else {
      alertaHijosUpdate.style.display = "none";
    }
  }

  if (cmbEstado) {
    cmbEstado.onchange = evaluarAdvertenciaDesactivacion;
  }

  /**
   * Buscador y lógica de Autocompletado
   */
  if (txtBuscar) {
    txtBuscar.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      sugerencias.innerHTML = "";
      if (query === "") {
        sugerencias.style.display = "none";
        return;
      }

      const filtrados = menusLocales.filter((m) =>
        m.nombre.toLowerCase().includes(query),
      );

      filtrados.forEach((m) => {
        const item = document.createElement("div");
        item.style.padding = "10px";
        item.style.cursor = "pointer";
        item.style.borderBottom = "1px solid #eee";

        const tipoText =
          m.id_menuPadre === null ||
          m.id_menuPadre === "" ||
          m.id_menuPadre == 0
            ? "Menú Principal"
            : "Submenú";
        item.innerHTML = `📁 <b>${m.nombre}</b> <small style="color:#7f8c8d;">[${tipoText}]</small>`;

        // Efecto hover
        item.onmouseenter = () => (item.style.backgroundColor = "#f1f5f9");
        item.onmouseleave = () => (item.style.backgroundColor = "transparent");

        // Al hacer clic en una opción de búsqueda
        item.onclick = () => {
          txtBuscar.value = m.nombre;
          sugerencias.style.display = "none";
          menuSeleccionadoActivo = m;

          // Llenar el formulario con los datos recuperados
          document.getElementById("txtEditIdMenu").value = m.id;
          document.getElementById("txtEditMenuNombre").value = m.nombre;
          document.getElementById("txtEditMenuDescripcion").value =
            m.descripcion || "";
          if (cmbEstado) cmbEstado.value = m.estado;

          // ==========================================
          // REGLA: Proteger el menú de Gestión de Menús
          // ==========================================
          const esGestionMenusPadre =
            m.nombre.toLowerCase().includes("gestión de menús") ||
            m.nombre.toLowerCase().includes("gestion de menus");
          const esGestionMenusHijo = m.url && m.url.includes("menu"); // Valida si la URL contiene palabras clave como "menu"

          if (esGestionMenusPadre || esGestionMenusHijo) {
            cmbEstado.value = "1"; // Forzar a Activo
            cmbEstado.disabled = true; // Impedir que se cambie

            // Estilos informativos de protección (Azul)
            alertaHijosUpdate.style.backgroundColor = "#e8f4fd";
            alertaHijosUpdate.style.borderLeftColor = "#2196f3";
            alertaHijosUpdate.style.color = "#0d47a1";
            alertaHijosUpdate.innerHTML =
              "🛡️ <b>Módulo Protegido:</b> Este menú es vital para la administración del sistema. Su estado no puede ser desactivado.";
            alertaHijosUpdate.style.display = "block";
          } else {
            // Si es un menú normal, habilitamos el combo y ocultamos la alerta
            cmbEstado.disabled = false;
            alertaHijosUpdate.style.display = "none";
          }
          // ==========================================

          // Reconstruir opciones del select de padres...
          cmbPadre.innerHTML =
            '<option value="">— Ninguno (Es un menú principal / Padre) —</option>';
          menusLocales.forEach((p) => {
            if (
              (p.id_menuPadre === null ||
                p.id_menuPadre === "" ||
                p.id_menuPadre == 0) &&
              String(p.id) !== String(m.id)
            ) {
              const opt = document.createElement("option");
              opt.value = p.id;
              opt.textContent = p.nombre;
              cmbPadre.appendChild(opt);
            }
          });

          // Reglas de negocio para controles visuales (Hijo vs Padre)
          if (
            m.id_menuPadre === null ||
            m.id_menuPadre === "" ||
            m.id_menuPadre == 0
          ) {
            cmbPadre.value = "";
            cmbPadre.disabled = true;
            wrapperUrl.style.display = "none";
            txtUrl.required = false;
            txtUrl.value = "";
          } else {
            cmbPadre.value = m.id_menuPadre;
            cmbPadre.disabled = false;

            if (cmbPadre.options[0].value === "") {
              cmbPadre.options[0].remove();
            }

            wrapperUrl.style.display = "block";
            txtUrl.required = true;
            txtUrl.value = m.url || "";
          }

          // Solo evaluar la advertencia de cascada si NO es el menú protegido
          if (!esGestionMenusPadre && !esGestionMenusHijo) {
            evaluarAdvertenciaDesactivacion();
          }

          contenedorForm.style.display = "block";
        };
        sugerencias.appendChild(item);
      });
      sugerencias.style.display = filtrados.length ? "block" : "none";
    };
  }

  /**
   * Procesar actualización (Submit)
   */
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      
      // Rehabilitar temporalmente los campos para que FormData capture sus valores
      cmbPadre.disabled = false; 
      cmbEstado.disabled = false;

      const formData = new FormData(form);
      formData.append("accion", "EDITAR");

      // Asegurarse de mandar campos vacíos para padres (para limpiar en base de datos si aplica)
      if (!formData.get("id_menuPadre")) {
        formData.set("id_menuPadre", "");
        formData.set("url", "");
      }

      // Realizamos la petición relativa a la ubicación del iframe
      fetch(
        "../../../Backend/controllers/menu_controller.php?gestion_crud=true",
        {
          method: "POST",
          body: formData,
        },
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("✅ Estructura de menú actualizada.");

            // Resetear la interfaz
            txtBuscar.value = "";
            contenedorForm.style.display = "none";
            if (alertaHijosUpdate) alertaHijosUpdate.style.display = "none";
            form.reset();
            menuSeleccionadoActivo = null;

            // Refrescar datos y notificar a la app principal
            actualizarDatosLocales();

            // --- COMUNICACIÓN ENTRE IFRAMES ---
            if (window.parent) {
              window.parent.postMessage("refrescarMenuLateral", "*");
            }
          } else {
            alert("⚠️ Error: " + data.message);
            // Si hubo error y era un padre, volver a deshabilitar visualmente el select
            if (!form.id_menuPadre.value) cmbPadre.disabled = true;
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