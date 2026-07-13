function inicializarVerPermiso() {
  const txtBuscarRol = document.getElementById("txtBuscarRolVerPermiso");
  const sugerenciasRol = document.getElementById(
    "listaSugerenciasRolVerPermiso",
  );
  const contenedorArbol = document.getElementById("contenedorArbolPermisos");
  const listaJerarquia = document.getElementById("listaModulosJerarquia");

  let rolesLocales = [];

  // 1. Cargar el catálogo de roles en memoria para búsquedas reactivas
  function cargarRoles() {
    fetch("Backend/controllers/rol_controller.php")
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          rolesLocales = response.data;
        }
      })
      .catch((err) => console.error("Error al cargar roles:", err));
  }

  // 2. Lógica del Buscador Predictivo (Idéntica al módulo de edición)
  if (txtBuscarRol) {
    txtBuscarRol.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      sugerenciasRol.innerHTML = "";

      if (query === "") {
        sugerenciasRol.style.display = "none";
        contenedorArbol.style.display = "none";
        return;
      }

      // Filtrar el catálogo en local
      const filtrados = rolesLocales.filter(
        (rol) =>
          (rol.nombre || "").toLowerCase().includes(query) ||
          (rol.descripcion || "").toLowerCase().includes(query),
      );

      filtrados.forEach((rol) => {
        const item = document.createElement("div");
        item.style.padding = "10px 15px";
        item.style.cursor = "pointer";
        item.style.borderBottom = "1px solid #f1f5f9";
        item.innerHTML = `👤 <b>${rol.nombre}</b> <br> <small style="color:#64748b;">${rol.descripcion || "Sin descripción"}</small>`;

        item.onclick = () => {
          txtBuscarRol.value = rol.nombre;
          sugerenciasRol.style.display = "none";

          // Cargar los permisos del rol seleccionado
          cargarPermisosPorRol(rol.id);
        };

        item.onmouseenter = () => (item.style.backgroundColor = "#f8fafc");
        item.onmouseleave = () => (item.style.backgroundColor = "transparent");
        sugerenciasRol.appendChild(item);
      });

      sugerenciasRol.style.display = filtrados.length ? "block" : "none";
    };

    // Cerrar el menú flotante si el usuario hace clic afuera del input
    document.addEventListener("click", (e) => {
      if (e.target !== txtBuscarRol) sugerenciasRol.style.display = "none";
    });
  }

  // 3. Obtener los permisos asignados desde la API
  function cargarPermisosPorRol(idRol) {
    listaJerarquia.innerHTML =
      '<div style="grid-column: 1 / -1; text-align:center; color:#64748b; font-style:italic;">⏳ Organizando estructura de accesos...</div>';
    contenedorArbol.style.display = "block";

    fetch(`Backend/controllers/permiso_controller.php?id_rol=${idRol}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          renderizarJerarquiaMenus(response.data);
        } else {
          listaJerarquia.innerHTML = `<div style="grid-column: 1 / -1; color:#ef4444; font-weight:bold;">⚠️ ${response.message}</div>`;
        }
      })
      .catch(() => {
        listaJerarquia.innerHTML =
          '<div style="grid-column: 1 / -1; color:#ef4444;">Error al conectar con el servidor de permisos.</div>';
      });
  }

  // 4. Procesar y agrupar la estructura jerárquica en tarjetas limpias
  // 4. Procesar y agrupar la estructura jerárquica en tarjetas limpias sin duplicaciones
  // 4. Procesar y agrupar la estructura jerárquica en tarjetas limpias
  function renderizarJerarquiaMenus(data) {
    listaJerarquia.innerHTML = "";

    if (!data || data.length === 0) {
      listaJerarquia.innerHTML =
        '<div style="grid-column: 1 / -1; color:#64748b; font-style: italic; text-align:center; padding: 20px;">Este rol no cuenta con ningún acceso asignado actualmente.</div>';
      return;
    }

    const mapasPadres = {};
    const submenusHuerfanos = [];
    const idsMenusRegistrados = new Set();

    // Paso 1: Filtrar duplicados usando la propiedad real 'id_menu_catalogo'
    const dataLimpia = data.filter((item) => {
      const idMenu = item.id_menu_catalogo || item.id_menu || item.id;
      if (idsMenusRegistrados.has(idMenu)) {
        return false;
      }
      idsMenusRegistrados.add(idMenu);
      return true;
    });

    // Paso 2: Clasificación inicial estricta de Menús Padre
    dataLimpia.forEach((item) => {
      const idPadre = item.id_menuPadre ? parseInt(item.id_menuPadre, 10) : 0;
      const idMenu = item.id_menu_catalogo || item.id_menu || item.id;
      const nombreMenu = item.nombre_menu || item.nombre;

      if (idPadre === 0) {
        mapasPadres[idMenu] = {
          nombre_menu: nombreMenu,
          submenus: [],
        };
      } else {
        submenusHuerfanos.push({
          ...item,
          id_padre: idPadre,
          nombre_menu: nombreMenu,
          id_final: idMenu
        });
      }
    });

    // Paso 3: Asociar submenús a sus padres correspondientes si existen
    submenusHuerfanos.forEach((sub) => {
      const idPadre = sub.id_padre;

      if (mapasPadres[idPadre]) {
        mapasPadres[idPadre].submenus.push(sub);
      } else {
        const claveHuerfano = "modulo_general_huerfanos";
        
        if (!mapasPadres[claveHuerfano]) {
          mapasPadres[claveHuerfano] = {
            nombre_menu: "Otros Accesos Asignados",
            submenus: [],
          };
        }
        
        const yaExiste = mapasPadres[claveHuerfano].submenus.some(s => (s.id_menu_catalogo || s.id) === sub.id_final);
        if (!yaExiste) {
          mapasPadres[claveHuerfano].submenus.push(sub);
        }
      }
    });

    // Paso 4: Renderizar tarjetas estructuradas en el DOM
    Object.keys(mapasPadres).forEach((idPadreKey) => {
      const bloque = mapasPadres[idPadreKey];

      // Si es la sección de huérfanos y está vacía, no la dibujamos
      if (bloque.submenus.length === 0 && idPadreKey === "modulo_general_huerfanos") {
        return;
      }

      const cardMenu = document.createElement("div");
      cardMenu.style.background = "#ffffff";
      cardMenu.style.border = "1px solid #e2e8f0";
      cardMenu.style.borderRadius = "8px";
      cardMenu.style.overflow = "hidden";
      cardMenu.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
      cardMenu.style.display = "flex";
      cardMenu.style.flexDirection = "column";

      const headerPadre = document.createElement("div");
      headerPadre.style.backgroundColor = "#f1f5f9";
      headerPadre.style.padding = "12px 15px";
      headerPadre.style.borderBottom = "1px solid #e2e8f0";
      headerPadre.style.display = "flex";
      headerPadre.style.justifyContent = "space-between";
      headerPadre.style.alignItems = "center";
      headerPadre.innerHTML = `
            <span style="font-weight: bold; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                📁 ${bloque.nombre_menu}
            </span>
            <span style="font-size: 0.75rem; background: #cbd5e1; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Módulo</span>
        `;
      cardMenu.appendChild(headerPadre);

      const cuerpoSubmenus = document.createElement("div");
      cuerpoSubmenus.style.padding = "12px 15px";
      cuerpoSubmenus.style.flexGrow = "1";

      if (bloque.submenus.length === 0) {
        cuerpoSubmenus.innerHTML = `<div style="color: #94a3b8; font-size: 0.85rem; font-style: italic; padding: 5px 0;">Sin submenús asignados</div>`;
      } else {
        bloque.submenus.forEach((sub) => {
          const itemSub = document.createElement("div");
          itemSub.style.padding = "8px 12px";
          itemSub.style.margin = "6px 0";
          itemSub.style.borderRadius = "4px";
          itemSub.style.backgroundColor = "#f8fafc";
          itemSub.style.borderLeft = "3px solid #3b82f6";
          itemSub.style.display = "flex";
          itemSub.style.justifyContent = "space-between";
          itemSub.style.alignItems = "center";
          itemSub.style.fontSize = "0.9rem";
          itemSub.innerHTML = `
                <span style="color: #334155; font-weight: 500;">🔹 ${sub.nombre_menu}</span>
                <span style="font-size: 0.75rem; color: #94a3b8; font-family: monospace;">ID: ${sub.id_final}</span>
          `;
          cuerpoSubmenus.appendChild(itemSub);
        });
      }

      cardMenu.appendChild(cuerpoSubmenus);
      listaJerarquia.appendChild(cardMenu);
    });
  }

  // Inicializar carga de datos remotos
  cargarRoles();
}

function inicializarEditarPermiso() {
  const txtBuscarRol = document.getElementById("txtBuscarRolPermiso");
  const sugerenciasRol = document.getElementById("listaSugerenciasRol");
  const formMatriz = document.getElementById("formMatrizPermisos");
  const txtRolId = document.getElementById("txtRolSeleccionadoId");
  const listaModulos = document.getElementById("listaModulosEdicion");

  let rolesLocales = [];

  // 1. Descargar catálogo completo en memoria para hacer búsquedas instantáneas
  fetch("Backend/controllers/rol_controller.php")
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        rolesLocales = response.data;
      }
    })
    .catch((err) => console.error("Error cargando roles:", err));

  // 2. Evento de escritura del Buscador Predictivo
  if (txtBuscarRol) {
    txtBuscarRol.oninput = (e) => {
      const query = e.target.value.toLowerCase().trim();
      sugerenciasRol.innerHTML = "";

      if (query === "") {
        sugerenciasRol.style.display = "none";
        return;
      }

      // Filtrar roles locales
      const filtrados = rolesLocales.filter(
        (rol) =>
          (rol.nombre || "").toLowerCase().includes(query) ||
          (rol.descripcion || "").toLowerCase().includes(query),
      );

      filtrados.forEach((rol) => {
        const item = document.createElement("div");
        item.style.padding = "10px 15px";
        item.style.cursor = "pointer";
        item.style.borderBottom = "1px solid #f1f5f9";
        item.innerHTML = `👤 <b>${rol.nombre}</b> <br> <small style="color:#64748b;">${rol.descripcion || "Sin descripción"}</small>`;

        item.onclick = () => {
          txtBuscarRol.value = rol.nombre;
          sugerenciasRol.style.display = "none";
          txtRolId.value = rol.id;

          // Lanzar la carga de la matriz de casillas
          cargarEstructuraYPermisos(rol.id);
        };

        item.onmouseenter = () => (item.style.backgroundColor = "#f8fafc");
        item.onmouseleave = () => (item.style.backgroundColor = "transparent");
        sugerenciasRol.appendChild(item);
      });

      sugerenciasRol.style.display = filtrados.length ? "block" : "none";
    };

    // Cerrar sugerencias al hacer clic fuera del campo
    document.addEventListener("click", (e) => {
      if (e.target !== txtBuscarRol) sugerenciasRol.style.display = "none";
    });
  }

  // 3. Obtener combinatoria completa de Menús
  function cargarEstructuraYPermisos(idRol) {
    listaModulos.innerHTML =
      '<div style="grid-column:1/-1; text-align:center; color:#64748b;">⏳ Cargando matriz interactiva...</div>';
    formMatriz.style.display = "block";

    fetch(`Backend/controllers/permiso_controller.php?id_rol_matriz=${idRol}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          // Le pasamos el idRol actual para aplicar las reglas de congelamiento
          renderizarMatrizCheckboxes(response.data, parseInt(idRol, 10));
        } else {
          listaModulos.innerHTML = `<div style="grid-column:1/-1; color:#ef4444;">⚠️ ${response.message}</div>`;
        }
      });
  }

  // 4. Dibujar la estructura con las reglas del SuperAdministrador
  function renderizarMatrizCheckboxes(data, idRolActual) {
    listaModulos.innerHTML = "";
    const mapasPadres = {};
    const submenusHuerfanos = [];

    data.forEach((item) => {
      const idPadre = item.id_menuPadre ? parseInt(item.id_menuPadre, 10) : 0;
      const idMenu = parseInt(item.id_menu_catalogo, 10);

      if (idPadre === 0) {
        mapasPadres[idMenu] = {
          id_menu: idMenu,
          nombre_menu: item.nombre_menu,
          tiene_permiso: parseInt(item.tiene_permiso, 10) === 1,
          submenus: [],
        };
      } else {
        submenusHuerfanos.push({
          id_menu: idMenu,
          id_padre: idPadre,
          nombre_menu: item.nombre_menu,
          tiene_permiso: parseInt(item.tiene_permiso, 10) === 1,
        });
      }
    });

    submenusHuerfanos.forEach((sub) => {
      if (mapasPadres[sub.id_padre]) {
        mapasPadres[sub.id_padre].submenus.push(sub);
      }
    });

    Object.keys(mapasPadres).forEach((idPadreKey) => {
      const bloque = mapasPadres[idPadreKey];
      const idBloquePadre = parseInt(bloque.id_menu, 10);

      const cardMenu = document.createElement("div");
      cardMenu.style.background = "#ffffff";
      cardMenu.style.border = "1px solid #e2e8f0";
      cardMenu.style.borderRadius = "8px";
      cardMenu.style.overflow = "hidden";
      cardMenu.style.display = "flex";
      cardMenu.style.flexDirection = "column";

      // Determinar si el elemento padre es intocable (Módulo de Permisos = ID 4)
      const esPadreProtegido = idRolActual === 1 && idBloquePadre === 4;

      const headerPadre = document.createElement("div");
      headerPadre.style.backgroundColor = "#f1f5f9";
      headerPadre.style.padding = "12px 15px";
      headerPadre.style.borderBottom = "1px solid #e2e8f0";
      headerPadre.style.display = "flex";
      headerPadre.style.alignItems = "center";
      headerPadre.style.justifyContent = "space-between";

      headerPadre.innerHTML = `
          <label style="font-weight: bold; color: #1e293b; display: flex; align-items: center; gap: 8px; cursor:${esPadreProtegido ? "not-allowed" : "pointer"};">
              <input type="checkbox" name="menus[]" value="${bloque.id_menu}" 
                     class="chk-padre-${bloque.id_menu}" 
                     ${bloque.tiene_permiso || esPadreProtegido ? "checked" : ""} 
                     ${esPadreProtegido ? "disabled" : ""}>
              📁 ${bloque.nombre_menu} ${esPadreProtegido ? '<small style="color:#ef4444;">(Requerido)</small>' : ""}
          </label>
          <span style="font-size: 0.75rem; background: #cbd5e1; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Módulo</span>
      `;

      // Si está deshabilitado por el flujo de JS, agregamos el input oculto para que viaje en el FormData de igual forma
      if (esPadreProtegido) {
        headerPadre.innerHTML += `<input type="hidden" name="menus[]" value="${bloque.id_menu}">`;
      }

      cardMenu.appendChild(headerPadre);

      const cuerpoSubmenus = document.createElement("div");
      cuerpoSubmenus.style.padding = "12px 15px";
      cuerpoSubmenus.style.flexGrow = "1";

      if (bloque.submenus.length === 0) {
        cuerpoSubmenus.innerHTML = `<div style="color: #94a3b8; font-size: 0.85rem; font-style: italic;">Sin submenús asignados</div>`;
      } else {
        bloque.submenus.forEach((sub) => {
          const idHijo = (honestInt = parseInt(sub.id_menu, 10));

          // Regla: si el rol es SA (1), "Ver Permisos" (18) y "Actualizar Permiso" (20) se congelan marcados
          const esHijoProtegido =
            idRolActual === 1 && (idHijo === 18 || idHijo === 20);

          const itemSub = document.createElement("div");
          itemSub.style.padding = "6px 0";
          itemSub.innerHTML = `
              <label style="color: #334155; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; cursor:${esHijoProtegido ? "not-allowed" : "pointer"};">
                  <input type="checkbox" name="menus[]" value="${sub.id_menu}" 
                         class="chk-hijo-de-${bloque.id_menu}" 
                         ${sub.tiene_permiso || esHijoProtegido ? "checked" : ""} 
                         ${esHijoProtegido ? "disabled" : ""}>
                  🔹 ${sub.nombre_menu} ${esHijoProtegido ? '<b style="color:#ef4444; font-size:0.75rem;">(Protegido)</b>' : ""}
              </label>
          `;

          if (esHijoProtegido) {
            itemSub.innerHTML += `<input type="hidden" name="menus[]" value="${sub.id_menu}">`;
          }

          cuerpoSubmenus.appendChild(itemSub);
        });
      }
      cardMenu.appendChild(cuerpoSubmenus);
      listaModulos.appendChild(cardMenu);

      // --- LOGICA DE CASCADA INTERACTIVA ---
      const chkPadre = headerPadre.querySelector(
        `.chk-padre-${bloque.id_menu}`,
      );
      const chksHijos = cuerpoSubmenus.querySelectorAll(
        `.chk-hijo-de-${bloque.id_menu}:not([disabled])`,
      ); // Ignoramos los congelados

      if (chkPadre && !chkPadre.disabled) {
        chkPadre.addEventListener("change", function () {
          if (!this.checked) {
            chksHijos.forEach((ch) => (ch.checked = false));
          } else {
            chksHijos.forEach((ch) => (ch.checked = true));
          }
        });
      }

      chksHijos.forEach((chkHijo) => {
        chkHijo.addEventListener("change", function () {
          if (this.checked && chkPadre) {
            chkPadre.checked = true;
          }
        });
      });
    });
  }

  // 5. Envío Masivo al Servidor
  formMatriz.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formMatriz);
    formData.append("accion", "GUARDAR_MATRIZ");

    fetch("Backend/controllers/permiso_controller.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("✅ Matriz de permisos actualizada exitosamente para el rol.");
          // Refrescar datos en caliente
          cargarEstructuraYPermisos(txtRolId.value);
        } else {
          alert("⚠️ Error: " + data.message);
        }
      });
  };

  document.getElementById("btnCancelarMatriz").onclick = () => {
    txtBuscarRol.value = "";
    txtRolId.value = "";
    formMatriz.style.display = "none";
  };
}
