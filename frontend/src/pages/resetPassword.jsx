import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/auth.service';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validaciones de contraseña
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      // Aquí deberías implementar la lógica de reset de contraseña en tu backend
      // Usando el email de location.state o un código de recuperación
      const email = location.state?.email;
      
      // Esta parte dependerá de cómo implementes el reset en tu backend
      await authService.resetPassword({
        email,
        newPassword: password
      });

      toast.success('Contraseña restablecida exitosamente');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Error al restablecer la contraseña');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Restablecer Contraseña</h2>
      <p>Ingresa tu nueva contraseña</p>
      <form onSubmit={handleResetPassword}>
        <input 
          type="password" 
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Restablecer Contraseña</button>
      </form>
    </div>
  );
};

export default ResetPassword;