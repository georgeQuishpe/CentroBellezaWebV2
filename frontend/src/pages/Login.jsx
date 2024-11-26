import React, { useState } from 'react';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await authService.login({ email, password });
      
      // Guardar token en localStorage o context
      localStorage.setItem('userToken', userData.token);
      
      toast.success('Inicio de sesión exitoso');
      navigate('/dashboard'); // Redirigir después del login
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
        <button 
          type="button" 
          onClick={handleForgotPassword}
          className="forgot-password-link"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
      <p>
        ¿No tienes cuenta? 
        <span 
          onClick={() => navigate('/register')}
          className="register-link"
        >
          Regístrate
        </span>
      </p>
    </div>
  );
};

export default Login;