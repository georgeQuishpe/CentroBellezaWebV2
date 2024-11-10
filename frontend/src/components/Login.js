// src/components/Login.js
import React, { useState, useEffect } from 'react';

const Login = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Hacer la llamada al backend usando fetch
    fetch('http://localhost:5000/api/test')
      .then(response => response.json()) // Convertir la respuesta a JSON
      .then(data => {
        setMessage(data.message); // Guardar el mensaje en el estado
      })
      .catch(error => {
        setMessage('Error al conectar con el backend');
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      {/*message && <p>{message}</p>*/ /*Mensaje para comprobar la conexion al backend*/}
      <form>
        <input type="email" placeholder="Correo electrónico" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <div className="auth-links">
        <a href="/signup">¿No tienes cuenta? Regístrate</a>
        <a href="/forgot-password">Olvidé mi contraseña</a>
      </div>
    </div>
  );
};

export default Login;
