/**
 * ==========================================================================
 * LÓGICA DE CONTROL PARA EL REGISTRO DE MENÚS (crear_menu.js)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  inicializarCrearMenu();
});

function inicializarCrearMenu() {
  const form = document.getElementById("formCrearMenu");
  const selectPadre = document.getElementById("selectMenuPadre");
  const wrapperUrl = document.getElementById("wrapperUrlMenu");
  const txtUrl = document.getElementById("txtUrlMenu");
  const btnLimpiar = document.getElementById("btnCancelarCrearMenu");

  /**
   * 1. Cargar la lista de menús padres disponibles desde el controlador PHP
   */
  function cargarOpcionesPadre() {
    if (!selectPadre) return;

    // Limpiamos manteniendo solo la opción por defecto
    selectPadre.innerHTML =
      '<option value="">— Ninguno (Es un menú principal / Padre) —</option>';

    // Ajustamos la ruta para salir de la estructura del módulo hacia el Backend
    fetch("../../../Backend/controllers/menu_controller.php?gestion_crud=true")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los menús");
        return res.json();
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          // Filtramos únicamente los menús que son padres legítimos (sin id_menuPadre)
          const padres = response.data.filter(
            (m) =>
              m.id_menuPadre === null ||
              m.id_menuPadre === "" ||
              m.id_menuPadre == 0,
          );

          padres.forEach((p) => {
            const option = document.createElement("option");
            option.value = p.id;
            option.textContent = p.nombre;
            selectPadre.appendChild(option);
          });
        }
      })
      .catch((err) =>
        console.error("Error cargando menús padres desde el Iframe:", err),
      );
  }

  /**
   * 2. Controlar la visibilidad y obligación de la URL dinámicamente
   */
  if (selectPadre) {
    selectPadre.onchange = () => {
      if (selectPadre.value !== "") {
        // Es un menú hijo: requiere URL obligatoriamente
        wrapperUrl.style.display = "block";
        txtUrl.required = true;
      } else {
        // Es un menú padre: no requiere URL
        wrapperUrl.style.display = "none";
        txtUrl.required = false;
        txtUrl.value = "";
      }
    };
  }

  /**
   * 3. Procesar el envío del Formulario
   */
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      formData.append("accion", "CREAR");

      // Si es un menú padre, aseguramos enviar valores vacíos en la base de datos
      if (!formData.get("id_menuPadre")) {
        formData.set("id_menuPadre", "");
        formData.set("url", "");
      }

      // Realizamos la llamada apuntando al controlador relativo al Iframe
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
            alert("✅ Módulo/Menú registrado correctamente.");

            // Resetear el formulario
            form.reset();
            wrapperUrl.style.display = "none";
            txtUrl.required = false;

            // Recargar las opciones de padre locales
            cargarOpcionesPadre();

            // --- COMUNICACIÓN ENTRE IFRAMES ---
            // Notificar a la ventana padre (Main layout) que hubo un cambio en los menús
            // Esto permite que el Sidebar se actualice instantáneamente
            if (window.parent) {
              window.parent.postMessage("refrescarMenuLateral", "*");
            }
          } else {
            alert("Error al guardar: " + data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          alert("❌ Error de comunicación con el servidor.");
        });
    };
  }

  /**
   * 4. Botón Limpiar / Cancelar
   */
  if (btnLimpiar) {
    btnLimpiar.onclick = () => {
      form.reset();
      if (wrapperUrl) wrapperUrl.style.display = "none";
      if (txtUrl) txtUrl.required = false;
    };
  }

  // Inicializar llamando a la API al cargar la pantalla
  cargarOpcionesPadre();
}
