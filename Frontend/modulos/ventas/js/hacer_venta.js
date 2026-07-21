document.addEventListener("DOMContentLoaded", () => {
  inicializarPuntoDeVenta();
});

function inicializarPuntoDeVenta() {
  // Elementos DOM
  const txtBuscarProducto = document.getElementById("txtBuscarProducto");
  const listaResultados = document.getElementById("listaResultados");
  const tbodyCarrito = document.getElementById("tbodyCarrito");
  const selCliente = document.getElementById("selCliente");

  const btnCancelarVenta = document.getElementById("btnCancelarVenta");
  const btnFinalizarVenta = document.getElementById("btnFinalizarVenta");

  // Estado Local
  let catalogoProductos = [];
  let carrito = [];

  // Rutas API / Controladores
  const RUTA_PRODUCTOS = "../../../Backend/controllers/producto_controller.php";
  const RUTA_CLIENTES = "../../../Backend/controllers/cliente_controller.php";
  const RUTA_FACTURA = "../../../Backend/controllers/factura_controller.php";

  // 1. Verificar Punto de Emisión y Asignación
  function verificarPermisoEmision() {
    fetch(`${RUTA_FACTURA}?verificar_punto=true`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" && !res.tiene_punto) {
          alert(
            `🚫 ACCESO RESTRINGIDO:\n${res.message}\nNo podrá procesar transacciones hasta que un administrador le asigne un punto de emisión.`
          );

          txtBuscarProducto.disabled = true;
          btnFinalizarVenta.disabled = true;
          btnFinalizarVenta.style.backgroundColor = "#9ca3af";
          btnFinalizarVenta.textContent = "🔒 Sin Punto de Emisión";
        } else if (res.status === "success" && res.tiene_punto) {
          console.log(
            `Punto de emisión autorizado: ${res.datos.nombre} [SRI: ${res.datos.codigoSRI}]`
          );
          cargarDatosIniciales();
        }
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Error al verificar las credenciales de facturación.");
      });
  }

  // 2. Cargar Catálogo de Productos y Clientes
  function cargarDatosIniciales() {
    // Cargar productos activos
    fetch(RUTA_PRODUCTOS)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          catalogoProductos = res.data.filter((p) => parseInt(p.estado) === 1);
        }
      })
      .catch((err) => console.error("Error cargando productos:", err));

    // Cargar clientes
    fetch(RUTA_CLIENTES)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          selCliente.innerHTML =
            '<option value="" disabled selected>Seleccione el cliente...</option>';
          res.data.forEach((c) => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = `${c.apellido1 || ''} ${c.nombre1 || ''} (${c.identificacion})`.trim();
            selCliente.appendChild(opt);
          });
        }
      })
      .catch(() => {
        // Fallback consumidor final
        selCliente.innerHTML =
          '<option value="1" selected>Consumidor Final (9999999999999)</option>';
      });
  }

  // 3. Buscador en Tiempo Real
  txtBuscarProducto.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      listaResultados.style.display = "none";
      return;
    }

    const coincidencias = catalogoProductos.filter((p) =>
      p.nombre.toLowerCase().includes(query)
    );

    if (coincidencias.length === 0) {
      listaResultados.innerHTML =
        '<div class="resultado-item" style="color:gray;">No se encontraron coincidencias</div>';
    } else {
      listaResultados.innerHTML = "";
      coincidencias.slice(0, 6).forEach((prod) => {
        const div = document.createElement("div");
        div.className = "resultado-item";
        div.innerHTML = `
          <span>${prod.nombre} <small style="color:#22c55e;">(Stock: ${parseFloat(prod.stockActual).toFixed(0)})</small></span>
          <strong>$${parseFloat(prod.precioUnitario).toFixed(2)}</strong>
        `;
        div.onclick = () => agregarAlCarrito(prod);
        listaResultados.appendChild(div);
      });
    }
    listaResultados.style.display = "block";
  });

  // Ocultar buscador si se hace clic fuera
  document.addEventListener("click", (e) => {
    if (!txtBuscarProducto.contains(e.target) && !listaResultados.contains(e.target)) {
      listaResultados.style.display = "none";
    }
  });

  // 4. Carrito en Memoria
  function agregarAlCarrito(producto) {
    listaResultados.style.display = "none";
    txtBuscarProducto.value = "";

    const existente = carrito.find((item) => item.id_producto === parseInt(producto.id));
    const stockMaximo = parseFloat(producto.stockActual);

    if (existente) {
      if (existente.cantidad + 1 > stockMaximo) {
        alert("⚠️ No puedes superar el stock disponible.");
        return;
      }
      existente.cantidad++;
    } else {
      if (stockMaximo <= 0) {
        alert("⚠️ El producto seleccionado no tiene unidades en stock.");
        return;
      }
      carrito.push({
        id_producto: parseInt(producto.id),
        nombre: producto.nombre,
        precioUnitario: parseFloat(producto.precioUnitario),
        cantidad: 1,
        stockMaximo: stockMaximo,
        porcentajeIva: parseFloat(producto.porcentajeIva ?? 15.0), // Se prioriza el IVA dinámico del producto
      });
    }
    renderizarCarrito();
  }

  function renderizarCarrito() {
    if (carrito.length === 0) {
      tbodyCarrito.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color:#6b7280; padding:30px;">
            El carrito está vacío. Busca un producto arriba para comenzar.
          </td>
        </tr>`;
      actualizarTotales(0, 0, 0, 0);
      return;
    }

    tbodyCarrito.innerHTML = "";
    let subtotal0 = 0;
    let subtotalGrabado = 0;
    let totalIva = 0;

    carrito.forEach((item, index) => {
      const itemSubtotal = item.cantidad * item.precioUnitario;

      if (item.porcentajeIva > 0) {
        subtotalGrabado += itemSubtotal;
        totalIva += itemSubtotal * (item.porcentajeIva / 100);
      } else {
        subtotal0 += itemSubtotal;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${item.nombre}</strong></td>
        <td style="text-align: right;">$${item.precioUnitario.toFixed(2)}</td>
        <td style="text-align: center;">
          <input type="number" value="${item.cantidad}" min="1" max="${item.stockMaximo}" style="width: 65px; text-align:center;" data-index="${index}" class="form-control txt-cantidad-item">
        </td>
        <td style="text-align: center;"><small class="badge">${item.porcentajeIva}%</small></td>
        <td style="text-align: right; font-weight:bold;">$${itemSubtotal.toFixed(2)}</td>
        <td style="text-align: center;">
          <button class="btn btn-danger btn-sm btn-eliminar-item" data-index="${index}">🗑️</button>
        </td>
      `;
      tbodyCarrito.appendChild(tr);
    });

    // Eventos para modificar cantidad
    document.querySelectorAll(".txt-cantidad-item").forEach((input) => {
      input.addEventListener("change", (e) => {
        const idx = e.target.dataset.index;
        let nuevaCant = parseFloat(e.target.value) || 1;

        if (nuevaCant > carrito[idx].stockMaximo) {
          alert(`⚠️ Cantidad excede el stock disponible (${carrito[idx].stockMaximo}).`);
          nuevaCant = carrito[idx].stockMaximo;
        } else if (nuevaCant < 1) {
          nuevaCant = 1;
        }

        carrito[idx].cantidad = nuevaCant;
        renderizarCarrito();
      });
    });

    // Eventos para eliminar ítems
    document.querySelectorAll(".btn-eliminar-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.currentTarget.dataset.index;
        carrito.splice(idx, 1);
        renderizarCarrito();
      });
    });

    const importeTotal = subtotal0 + subtotalGrabado + totalIva;
    actualizarTotales(subtotal0, subtotalGrabado, totalIva, importeTotal);
  }

  function actualizarTotales(sub0, subG, iva, total) {
    document.getElementById("lblSubtotal0").textContent = `$${sub0.toFixed(2)}`;
    document.getElementById("lblSubtotalGrabado").textContent = `$${subG.toFixed(2)}`;
    document.getElementById("lblIva").textContent = `$${iva.toFixed(2)}`;
    document.getElementById("lblTotal").textContent = `$${total.toFixed(2)}`;

    btnFinalizarVenta.dataset.subtotal = (sub0 + subG).toFixed(2);
    btnFinalizarVenta.dataset.totalIva = iva.toFixed(2);
    btnFinalizarVenta.dataset.importeTotal = total.toFixed(2);
  }

  // 5. Cancelar Venta
  btnCancelarVenta.onclick = () => {
    if (carrito.length === 0) return;
    if (confirm("¿Estás seguro de vaciar el carrito actual?")) {
      carrito = [];
      renderizarCarrito();
    }
  };

  // 6. Procesar Venta / Enviar al Backend
  btnFinalizarVenta.onclick = () => {
    if (!selCliente.value) {
      alert("⚠️ Es obligatorio seleccionar un cliente para emitir la factura.");
      return;
    }
    if (carrito.length === 0) {
      alert("⚠️ Agrega al menos un producto al carrito para continuar.");
      return;
    }

    if (!confirm("¿Confirmar cobro y emisión de factura?")) return;

    btnFinalizarVenta.disabled = true;
    btnFinalizarVenta.textContent = "⏳ Procesando...";

    const payload = {
      id_cliente: parseInt(selCliente.value),
      subtotal: parseFloat(btnFinalizarVenta.dataset.subtotal),
      totalIva: parseFloat(btnFinalizarVenta.dataset.totalIva),
      importeTotal: parseFloat(btnFinalizarVenta.dataset.importeTotal),
      productos: carrito,
    };

    fetch(RUTA_FACTURA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert(`✅ Venta procesada exitosamente.\nFactura Nº: ${data.id_factura}`);

          // Abrir PDF de la factura
          const urlPdf = `/ProyectoV3/Backend/controllers/reporte_factura_pdf.php?id=${data.id_factura}`;
          window.open(urlPdf, "_blank");

          // Resetear carrito y recargar catálogo con nuevos stocks
          carrito = [];
          renderizarCarrito();
          cargarDatosIniciales();
        } else {
          alert("❌ Error: " + data.message);
        }
      })
      .catch((err) => {
        console.error("Error al procesar la venta:", err);
        alert("❌ Ocurrió un error inesperado al conectar con el servidor.");
      })
      .finally(() => {
        btnFinalizarVenta.disabled = false;
        btnFinalizarVenta.textContent = "💳 Guardar Venta";
      });
  };

  // Iniciar flujo con validación de punto de emisión
  verificarPermisoEmision();
}