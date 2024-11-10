// src/components/ForgotPassword.js
import React from 'react';

const ForgotPassword = () => {
  return (
    <div className="auth-container">
      <h2>Olvidé mi Contraseña</h2>
      <form>
        <input type="email" placeholder="Correo electrónico" required />
        <button type="submit">Enviar Instrucciones</button>
      </form>
      <div className="auth-links">
        <a href="/login">Volver a Iniciar Sesión</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
