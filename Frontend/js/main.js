// 1. FUNCIÓN GLOBAL DE NAVEGACIÓN (Se dispara al dar clic en el botón con onclick)
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

    // CASO 2: Si hay una vista activa (?view=...), ocultamos por completo la sección de bienvenida anterior
    if (inicioWelcome) inicioWelcome.style.display = "none";

    const vistasIndependientes = {
        'login': 'Frontend/html/login.html',
        'menu': 'Frontend/html/menu.html',
        'permiso': 'Frontend/html/permiso.html',
        'principal': 'Frontend/html/principal.html',
        'rol': 'Frontend/html/rol.html',
        'usuario': 'Frontend/html/usuario.html'
    };

    const rutaArchivo = vistasIndependientes[view];

    if (rutaArchivo) {
        fetch(rutaArchivo)
            .then(response => {
                if (!response.ok) throw new Error("No se pudo encontrar el archivo HTML");
                return response.text();
            })
            .then(html => {
                contentView.innerHTML = html;
                ejecutarScriptsDeVista(view); // Aquí se activa el submit del login
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

    // Cargar la vista si el usuario entra directo con un enlace largo (ej: ?view=login)
    router();

    // Escuchar las flechas de navegación
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

// 5. DISPARADOR DE SCRIPTS
function ejecutarScriptsDeVista(view) {
    if (view === 'login') {
        if (typeof inicializarLogin === 'function') inicializarLogin();
    }
    else if (view === 'principal') { // 👈 Registramos la inicialización de la pantalla principal
        if (typeof inicializarPrincipal === 'function') {
            inicializarPrincipal();
        } else {
            console.error("Error: La función inicializarPrincipal() no está disponible.");
        }
    }
}