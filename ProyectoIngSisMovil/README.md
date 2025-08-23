# Proyecto Ing Sistemas - Aplicación Móvil

Esta es la versión móvil completa de la aplicación Proyecto Ing Sistemas, desarrollada con React Native y Expo.

## 🚀 Funcionalidades Implementadas

✅ **Sistema de Autenticación**

- Login y registro de usuarios
- Gestión de tokens con AsyncStorage
- Contexto de usuario global

✅ **Mascota Virtual**

- Estados de la mascota (feliz, triste, etc.)
- Sistema de alimentación
- Gestión de inventario de comida

✅ **Sistema de Monedas**

- Ganar monedas completando objetivos
- Gastar monedas en la tienda
- Sincronización con el backend

✅ **Tienda (Store)**

- Compra de alimentos para la mascota
- Interfaz intuitiva con emojis
- Visualización del inventario actual

✅ **Gestión de Objetivos (Goals)**

- Lista de objetivos con seguimiento
- Sistema de rachas (streaks)
- Historial visual de progreso
- Recompensas en monedas por completar objetivos

✅ **Temporizador de Estudio**

- Temporizador personalizable
- Presets rápidos (Pomodoro, Study, Deep Work)
- Barra de progreso visual
- Funciones de agregar tiempo

✅ **Navegación por Pestañas**

- 4 pestañas principales: Home, Store, Goals, Timer
- Iconos intuitivos con Material Community Icons
- Navegación fluida entre secciones

✅ **Redux Store**

- Gestión de estado centralizada
- Slices para monedas, inventario, mascota y objetivos
- Integración con AsyncStorage

## Tecnologías Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desarrollo
- **Redux Toolkit** - Gestión de estado
- **React Navigation** - Navegación (Stack + Bottom Tabs)
- **React Native Paper** - Componentes de UI
- **React Hook Form** - Manejo de formularios
- **AsyncStorage** - Almacenamiento local
- **Material Community Icons** - Iconografía

## Instalación

1. **Instalar Node.js** (si no está instalado)
2. **Instalar Expo CLI globalmente:**

   ```bash
   npm install -g @expo/cli
   ```

3. **Navegar al directorio del proyecto:**

   ```bash
   cd ProyectoIngSisMovil
   ```

4. **Instalar dependencias:**
   ```bash
   npm install
   ```

## Ejecución

### Desarrollo

```bash
npm start
```

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

### Web

```bash
npm run web
```

## Configuración del Backend

⚠️ **Importante**: Asegúrate de que el backend esté ejecutándose en `http://localhost:3001` antes de usar la aplicación móvil.

Para iniciar el backend:

```bash
cd ../Backend
npm start
```

## Estructura del Proyecto

```
ProyectoIngSisMovil/
├── App.js                           # Navegación principal con tabs
├── app.json                         # Configuración de Expo
├── babel.config.js                  # Configuración de Babel
├── package.json                     # Dependencias y scripts
├── INSTALACION.md                   # Guía detallada de instalación
└── src/
    ├── components/                  # Componentes React Native
    │   ├── ApplicationScreen.js     # Pantalla principal (Home)
    │   ├── LoginScreen.js           # Pantalla de login
    │   ├── SignUpScreen.js          # Pantalla de registro
    │   ├── StoreScreen.js           # Pantalla de tienda
    │   ├── GoalsScreen.js           # Pantalla de objetivos
    │   ├── TimerScreen.js           # Pantalla de temporizador
    │   ├── UserContext.js           # Contexto de usuario
    │   └── TimerContext.js          # Contexto de temporizador
    └── redux/                       # Estado global con Redux
        ├── store.js                 # Configuración del store
        ├── coinsSlice.js            # Gestión de monedas
        ├── foodInventorySlice.js    # Gestión de inventario
        ├── petStatusSlice.js        # Estado de la mascota
        └── goalsSlice.js            # Gestión de objetivos
```

## Pantallas de la Aplicación

### 🏠 Home (ApplicationScreen)

- Visualización de la mascota virtual
- Estado actual de hambre y felicidad
- Botones de alimentación
- Información de monedas

### 🛒 Store (StoreScreen)

- Lista de alimentos disponibles
- Precios en monedas
- Compra con un clic
- Visualización del inventario actual

### 🎯 Goals (GoalsScreen)

- Lista de objetivos personales
- Checkbox para marcar como completado
- Sistema de rachas (streaks)
- Historial visual de los últimos 7 días
- Estadísticas detalladas

### ⏱️ Timer (TimerScreen)

- Temporizador personalizable
- Presets rápidos:
  - Pomodoro (25 min)
  - Study (45 min)
  - Deep Work (90 min)
- Barra de progreso visual
- Funciones de agregar tiempo (+5, +10, +15 min)

## Funcionalidades Principales

### Autenticación

- Login con username y password
- Registro de nuevos usuarios
- Gestión automática de tokens JWT
- Persistencia de sesión con AsyncStorage

### Sistema de Recompensas

- +10 monedas por completar un objetivo
- -10 monedas por desmarcar un objetivo completado
- Sincronización automática con el backend

### Mascota Virtual

- Estados visuales dinámicos
- Sistema de alimentación con inventario
- Niveles de hambre que afectan el estado

### Navegación Intuitiva

- 4 pestañas principales con iconos claros
- Navegación fluida sin pérdida de estado
- Diseño consistente en todas las pantallas

## Migración desde Web

Esta aplicación móvil es una migración completa de la versión web original, con las siguientes mejoras:

- **Interfaz Nativa**: Componentes optimizados para móvil
- **Navegación por Pestañas**: Mejor UX en dispositivos móviles
- **Almacenamiento Local**: AsyncStorage en lugar de localStorage
- **Componentes Paper**: UI consistente y moderna
- **Fetch API**: Reemplazo de axios por fetch nativo

## Notas de Desarrollo

- Todas las llamadas a la API utilizan fetch en lugar de axios
- Los estilos están implementados con StyleSheet de React Native
- Se utiliza React Native Paper para componentes de UI consistentes
- AsyncStorage maneja la persistencia local
- Redux Toolkit para gestión de estado eficiente

## Solución de Problemas

Si encuentras problemas durante la instalación o ejecución, consulta el archivo `INSTALACION.md` que contiene soluciones detalladas para errores comunes.

## Estado de la Migración

✅ **Completado al 100%**

- Todas las funcionalidades principales migradas
- Navegación por pestañas implementada
- Integración completa con el backend
- UI/UX optimizada para móvil

## Próximas Mejoras Opcionales

- Notificaciones push
- Modo offline
- Animaciones adicionales
- Más tipos de alimentos
- Sistema de logros
- Compartir progreso en redes sociales

---

**¡La aplicación está lista para usar en dispositivos móviles!** 📱
