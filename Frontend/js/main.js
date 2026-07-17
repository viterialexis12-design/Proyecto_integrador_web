// 1. FUNCIÓN GLOBAL DE NAVEGACIÓN
function navegarA(vista) {
    console.log("-> Navegando hacia:", vista);
    const nuevaUrl = `${window.location.pathname}?view=${vista}`;
    window.history.pushState({}, '', nuevaUrl);
    router();
}

// 2. ENRUTADOR PRINCIPAL
function router() {
    const contentView = document.getElementById("content-view");
    if (!contentView) return;

    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');

    const inicioWelcome = document.getElementById("inicio-welcome");

    if (!view) {
        if (inicioWelcome) inicioWelcome.style.display = "block";
        contentView.innerHTML = "";
        return;
    }

    // Ocultar la sección de bienvenida si hay una vista activa
    if (inicioWelcome) inicioWelcome.style.display = "none";

    // Rutas actualizadas a la estructura modular ProyectoV2
    const vistasIndependientes = {
        'login': 'Frontend/modulos/login/login.html',
        'principal': 'Frontend/modulos/principal/principal.html',
    };

    const rutaArchivo = vistasIndependientes[view];

    if (rutaArchivo) {
        fetch(rutaArchivo)
            .then(response => {
                if (!response.ok) throw new Error("No se pudo encontrar el archivo HTML de la vista");
                return response.text();
            })
            .then(html => {
                contentView.innerHTML = html;
                ejecutarScriptsDeVista(view);
            })
            .catch(error => {
                contentView.innerHTML = `<h2>⚠️ Error 404</h2><p>No se pudo cargar la vista.</p>`;
                console.error("Error en Fetch:", error);
            });
    } else {
        contentView.innerHTML = `<h2>⚠️ Vista no válida</h2>`;
    }
}

// 3. EVENTO AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app");
    if (appContainer) appContainer.style.display = "block";

    // Verificar el estado de la Base de Datos
    verificarEstadoBD();

    // Procesar la ruta actual
    router();

    // Escuchar la navegación del historial del navegador
    window.addEventListener("popstate", () => {
        router();
    });
});

// 4. VERIFICACIÓN BD
function verificarEstadoBD() {
    const statusLabel = document.getElementById("serverStatus");
    if (!statusLabel) return;

    fetch("Backend/config/test_conexion.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                statusLabel.textContent = "Conectado 🟢";
                statusLabel.style.color = "#2ecc71";
            } else {
                statusLabel.textContent = "Desconectado 🔴";
                statusLabel.style.color = "#e74c3c";
            }
        })
        .catch(() => {
            statusLabel.textContent = "Error de Conexión ⚠️";
            statusLabel.style.color = "#f1c40f";
        });
}

// 5. INYECTOR DINÁMICO DE SCRIPTS PARA VISTAS PRINCIPALES
// Dentro de main.js

function ejecutarScriptsDeVista(view) {
    if (view === 'login') {
        // Cargamos dinámicamente el JS del login JUSTO cuando se necesita
        cargarScriptDinamicamente('Frontend/modulos/login/js/login.js', () => {
            if (typeof inicializarLogin === 'function') {
                inicializarLogin();
            } else {
                console.error("Error: No se encontró la función inicializarLogin() en login.js");
            }
        });
    }
    else if (view === 'principal') {
        // Cargamos el JS del panel principal solo al entrar a él
        cargarScriptDinamicamente('Frontend/modulos/principal/js/principal.js', () => {
            if (typeof inicializarPrincipal === 'function') {
                inicializarPrincipal();
            } else {
                console.error("Error: No se encontró la función inicializarPrincipal() en principal.js");
            }
        });
    }
}

// Función auxiliar para cargar archivos .js bajo demanda sin saturar el index.html
function cargarScriptDinamicamente(ruta, callback) {
    // Evitar duplicados
    const scriptExistente = document.querySelector(`script[src="${ruta}"]`);
    if (scriptExistente) {
        if (callback) callback();
        return;
    }

    const script = document.createElement('script');
    script.src = ruta;
    script.onload = () => {
        if (callback) callback();
    };
    script.onerror = () => {
        console.error(`No se pudo cargar el script: ${ruta}`);
    };
    document.body.appendChild(script);
}