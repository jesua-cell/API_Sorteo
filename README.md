# 🚀 La Orquídea - Sistema de Gestión de Sorteos

Plataforma web completa para publicar, gestionar y participar en sorteos con validación de usuarios y administración avanzada.

## 🌟 Características Principales

### 🎨 Frontend - Interfaz de Usuario

**Para Participantes:**
- ✅ Publicación de Sorteos: Visualización de sorteos activos con detalles de cantidad de boletos y puestos disponibles
- ✅ Verificador de Participaciones: Sistema para que los clientes verifiquen el estado de validación, número asignado y cantidad de puestos adquiridos
- ✅ Sistema de Pagos: Enlace dedicado con medios de pago disponibles y procesamiento seguro
- ✅ Portal de Usuarios: Área personalizada para acceso y gestión de participaciones

**Para Administradores:**
- ✅ Gestión de Sorteos: Publicar, editar o eliminar sorteos a través de formularios intuitivos
- ✅ Panel de Control: Visualización detallada de información de jugadores por sorteo
- ✅ Dashboard Administrativo: Acceso exclusivo con validación de permisos

### ⚙️ Backend - Lógica y Datos

**Gestión de Datos:**
- ✅ Base de Datos MySQL: Almacenamiento seguro de usuarios, administradores y publicaciones
- ✅ API RESTful: Recepción y procesamiento de datos del frontend con funciones optimizadas
- ✅ Sistema de Autenticación: Validaciones robustas para uso exclusivo de administradores
- ✅ Procesamiento de Transacciones: Manejo seguro de operaciones financieras y validaciones

## 🛠️ Stack Tecnológico

### Backend (Node.js + Express)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-3178C6?style=for-the-badge&logo=bcrypt&logoColor=white)

**Dependencias principales:**
- `express@^4.18.2` - Framework web
- `mysql2@^3.14.0` - Cliente MySQL
- `jsonwebtoken@^9.0.2` - Autenticación JWT
- `bcryptjs@^3.0.2` - Encriptación de contraseñas
- `cors@^2.8.5` - Control de acceso HTTP
- `multer@^1.4.5` - Manejo de archivos

### Frontend (React + Vite)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

**Dependencias principales:**
- `react@^18.3.1` - Biblioteca UI
- `react-router-dom@^7.5.0` - Enrutamiento
- `axios@^1.9.0` - Cliente HTTP
- `rsuite@^5.79.1` - Componentes UI
- `react-hot-toast@^2.5.2` - Notificaciones
- `react-datepicker@^8.4.0` - Selector de fechas

### Herramientas de Desarrollo
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![VSCode](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/jesua-cell/API_Sorteo.git
cd API_Sorteo
