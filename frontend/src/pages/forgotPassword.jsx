import React, { useState } from 'react';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRecoverPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.recoverPassword(email);
      
      // Dependiendo de cómo manejes la recuperación de contraseña
      // Podrías redirigir a una página de verificación de código
      toast.success('Código de recuperación enviado');
      navigate('/reset-password', { 
        state: { email } 
      });
    } catch (error) {
      toast.error(error.message || 'Error en la recuperación de contraseña');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperación de Contraseña</h2>
      <p>Ingresa tu correo electrónico para recuperar tu contraseña</p>
      <form onSubmit={handleRecoverPassword}>
        <input 
          type="email" 
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar Código de Recuperación</button>
      </form>
      <p>
        <span 
          onClick={() => navigate('/login')}
          className="back-to-login-link"
        >
          Volver al Inicio de Sesión
        </span>
      </p>
    </div>
  );
};

export default ForgotPassword;