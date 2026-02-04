# 🏖️ Portal de Gestión de Vacaciones

Sistema web completo para la gestión de vacaciones y eventos corporativos de García Impresores.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-12.8.0-FFCA28?logo=firebase)

## ✨ Características

### 👤 Portal del Empleado
- 📅 Visualización de vacaciones propias (vista mensual y anual)
- 📊 Dashboard con estadísticas de días disponibles y consumidos
- 🎉 Visualización de eventos corporativos y festivos
- 👁️ Control de visibilidad de eventos
- 📱 Interfaz responsive y moderna

### 👨‍💼 Portal del Administrador
- 👥 Gestión completa de empleados
- 🗓️ Vista timeline por empleado (mensual y anual)
- ⚠️ Detección automática de conflictos de vacaciones
- 🎪 Gestión de eventos corporativos
  - Eventos globales (para todos)
  - Eventos asignados (para empleados específicos)
- 📥 Exportación a Excel de datos
- 🎨 Código de colores único por empleado

### 🎯 Funcionalidades Adicionales
- 🇪🇸 Calendario de festivos nacionales y autonómicos (Andalucía)
- 🔍 Filtrado avanzado de empleados
- 💾 Persistencia de datos en tiempo real con Firebase
- 🎨 Interfaz moderna con diseño glassmorphism
- ⚡ Rendimiento optimizado con Vite

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 16+ y npm
- Cuenta de Firebase (para la base de datos)

### 1. Clonar el repositorio
```bash
git clone https://github.com/garciaimpresores/vacaciones.git
cd vacaciones
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase
1. Crea un archivo `.env` en la raíz del proyecto (usa `.env.example` como plantilla)
2. Rellena las credenciales de Firebase:
```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

3. Obtén estas credenciales desde [Firebase Console](https://console.firebase.google.com/)

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Compilar para producción
```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🌐 Despliegue en Vercel

### Despliegue Automático (Recomendado)

1. Instala Vercel CLI globalmente:
```bash
npm install -g vercel
```

2. Inicia sesión en Vercel:
```bash
vercel login
```

3. Despliega el proyecto:
```bash
vercel
```

4. Configura las variables de entorno en Vercel:
   - Ve a tu proyecto en [vercel.com](https://vercel.com)
   - Settings → Environment Variables
   - Añade cada variable de `.env` con sus valores

5. Para despliegues futuros (producción):
```bash
vercel --prod
```

### Despliegue Manual via Web

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno en la sección "Environment Variables"
4. Click en "Deploy"

## 📚 Estructura del Proyecto

```
vacaciones/
├── src/
│   ├── components/         # Componentes React
│   │   ├── App.jsx        # Componente principal
│   │   ├── LoginView.jsx  # Vista de login
│   │   ├── EmployeeView.jsx       # Portal del empleado
│   │   ├── Timeline.jsx           # Vista mensual admin
│   │   ├── YearView.jsx           # Vista anual
│   │   ├── DayDetailsModal.jsx    # Modal de detalles de día
│   │   ├── EventManagerModal.jsx  # Gestión de eventos
│   │   ├── EmployeeManager.jsx    # Gestión de empleados
│   │   └── ...
│   ├── firebase/          # Configuración y servicios Firebase
│   │   ├── config.js      # Configuración de Firebase
│   │   └── services.js    # Funciones CRUD
│   ├── utils/             # Utilidades
│   │   ├── holidays.js    # Gestión de festivos
│   │   ├── colors.js      # Sistema de colores
│   │   ├── conflicts.js   # Detección de conflictos
│   │   └── exportUtils.js # Exportación a Excel
│   ├── index.css          # Estilos globales
│   └── main.jsx           # Punto de entrada
├── .env.example           # Plantilla de variables de entorno
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Seguridad

- ✅ Las credenciales de Firebase están protegidas mediante variables de entorno
- ✅ El archivo `.env` está excluido de Git
- ⚠️ **IMPORTANTE**: Nunca compartas tu archivo `.env` ni subas credenciales al repositorio

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19, Vite 7
- **Base de Datos**: Firebase Firestore
- **Estilos**: CSS moderno con variables CSS
- **Iconos**: Lucide React
- **Fechas**: date-fns
- **Exportación**: XLSX (Excel)

## 👥 Usuarios de Prueba

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`

### Empleado
- **Usuario**: `empleado1`
- **Contraseña**: `emp123`

## 📝 Licencia

Este proyecto es privado y está desarrollado específicamente para García Impresores.

## 🤝 Soporte

Para cualquier duda o problema, contacta con el administrador del sistema.

---

**Desarrollado con ❤️ para García Impresores**
