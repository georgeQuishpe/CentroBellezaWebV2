// src/components/Signup.js
import React from 'react';

const Signup = () => {
  return (
    <div className="auth-container">
      <h2>Registro</h2>
      <form>
        <input type="text" placeholder="Nombre completo" required />
        <input type="email" placeholder="Correo electrónico" required />
        <input type="password" placeholder="Contraseña" required />
        <input type="text" placeholder="Teléfono" required />
        <button type="submit">Registrarse</button>
      </form>
      <div className="auth-links">
        <a href="/login">¿Ya tienes cuenta? Inicia Sesión</a>
      </div>
    </div>
  );
};

export default Signup;
