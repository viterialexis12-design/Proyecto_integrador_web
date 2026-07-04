document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('../Backend/index.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            localStorage.setItem('userSession', JSON.stringify({
                token: data.token,
                nombre: data.nombre,
                rol: data.rol,         
                permisos: data.permisos 
            }));

            window.location.href = 'html/principal.html';
        } else {
            alert(data.message || 'Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en el login:', error);
    }
});