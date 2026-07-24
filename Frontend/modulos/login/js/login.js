/**
 * ==========================================================================
 * CONTROLADOR DE AUTENTICACIÓN Y CAPTCHA (Frontend/modulos/login/js/login.js)
 * ==========================================================================
 */

// Variable de ámbito local al archivo para resguardar el token generado
let captchaGenerado = "";

function inicializarLogin() {
    console.log("Lógica de login.js iniciada de manera modular...");

    const formLogin = document.getElementById("formLogin");
    const feedback = document.getElementById("loginFeedback");
    const btnVolver = document.getElementById("btnVolverInicio");
    
    // Elementos del Captcha
    const captchaBox = document.getElementById("captchaCodeBox");
    const btnRefresh = document.getElementById("btnRefreshCaptcha");

    // --- 1. CONFIGURACIÓN DEL CAPTCHA ---
    function generarCaptcha() {
        const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Evita 0, O, 1, I
        let resultado = "";
        for (let i = 0; i < 5; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        captchaGenerado = resultado;
        if (captchaBox) {
            captchaBox.textContent = captchaGenerado;
        }
    }

    // Inicializa el primer código al cargar la vista
    generarCaptcha();

    // Evento para renovar el captcha
    if (btnRefresh) {
        btnRefresh.onclick = () => {
            generarCaptcha();
            const txtCaptcha = document.getElementById("txtCaptchaInput");
            if (txtCaptcha) {
                txtCaptcha.value = "";
                txtCaptcha.focus();
            }
        };
    }

    // --- 2. EVENTOS DE NAVEGACIÓN ---
    if (btnVolver) {
        btnVolver.onclick = () => {
            navegarA(''); // Regresa a la raíz limpia y muestra la bienvenida original
        };
    }

    // --- 3. ENVÍO DEL FORMULARIO Y AUTENTICACIÓN ---
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault(); // Evitamos que el formulario recargue la página

            // Ocultamos mensajes previos
            if (feedback) feedback.style.display = "none";

            // Validación de seguridad del Captcha (Client Side)
            const txtCaptcha = document.getElementById("txtCaptchaInput");
            const captchaInput = txtCaptcha ? txtCaptcha.value.trim().toUpperCase() : "";

            if (captchaInput !== captchaGenerado) {
                mostrarFeedback(feedback, "El código de validación Captcha es incorrecto.", "error");
                generarCaptcha(); // Refrescar por seguridad
                if (txtCaptcha) {
                    txtCaptcha.value = "";
                    txtCaptcha.focus();
                }
                return;
            }

            // Capturar credenciales
            const username = document.getElementById("userInput").value;
            const password = document.getElementById("passInput").value;

            // Petición al controlador PHP usando JSON
            fetch("Backend/controllers/autentificacion.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (!response.ok) throw new Error("Error en la respuesta de la red");
                return response.json();
            })
            .then(data => {
                if (data.status === "success") {
                    mostrarFeedback(feedback, data.message, "#2ecc71");
                    
                    if (txtCaptcha) txtCaptcha.value = "";
                    
                    // Esperamos 1.5s para que se visualice el éxito y navegamos al menú "principal"
                    setTimeout(() => {
                        navegarA(data.redirect); 
                    }, 1500);
                } else {
                    mostrarFeedback(feedback, data.message, "#e74c3c");
                    generarCaptcha(); // Renueva el código tras un intento fallido
                    if (txtCaptcha) txtCaptcha.value = "";
                }
            })
            .catch(error => {
                console.error("Error en login.js:", error);
                mostrarFeedback(feedback, "Error al procesar la solicitud en el servidor.", "#f1c40f");
                generarCaptcha();
            });
        });
    }
}

// Función auxiliar para formatear los mensajes de error/éxito
function mostrarFeedback(elemento, mensaje, color) {
    if (!elemento) return;
    elemento.style.display = "block";
    elemento.style.color = color;
    elemento.style.fontWeight = "bold";
    elemento.textContent = mensaje;
}