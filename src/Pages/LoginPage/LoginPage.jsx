// src/Pages/LoginPage/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      // Redirigir según el rol
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const response = await AuthService.login(email, password);
      message.success('Inicio de sesión exitoso');
      
      // Redirigir según el rol
      if (response.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Mostrar mensaje específico si está disponible
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Error al iniciar sesión. Verifique sus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #91d5ff 0%, #69c0ff 100%)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    }}>
      <Card
        style={{ 
          width: 400, 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          border: 'none'
        }}
        styles={{ body: { padding: '24px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 8 }}>Iniciar Sesión</Title>
          <Text type="secondary">Bienvenido a TaskManage</Text>
        </div>
        
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Por favor ingrese su correo electrónico', type: 'email' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Correo Electrónico" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Contraseña" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', height: '40px' }}
              size="large"
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <Text>¿No tienes una cuenta? </Text>
            <Link to="/register">Regístrate ahora</Link>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/">Volver a la página de inicio</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;