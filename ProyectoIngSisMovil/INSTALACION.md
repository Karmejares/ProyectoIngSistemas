# Instrucciones de Instalación - Proyecto Ing Sistemas Móvil

## Problema con PowerShell

Si encuentras el error de política de ejecución de PowerShell, sigue estos pasos:

### Opción 1: Usar Command Prompt (CMD)

1. Abre Command Prompt (cmd) como administrador
2. Navega al directorio del proyecto:
   ```cmd
   cd "c:\Users\james\OneDrive\Desktop\ProyectoIngSis\ProyectoIngSisMovil"
   ```
3. Instala las dependencias:
   ```cmd
   npm install
   ```

### Opción 2: Cambiar política de ejecución de PowerShell

1. Abre PowerShell como administrador
2. Ejecuta:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Confirma con "Y" cuando se te pregunte
4. Luego ejecuta:
   ```powershell
   cd "c:\Users\james\OneDrive\Desktop\ProyectoIngSis\ProyectoIngSisMovil"
   npm install
   ```

## Pasos de Instalación

1. **Instalar Node.js** (si no está instalado):

   - Descarga desde https://nodejs.org/
   - Instala la versión LTS

2. **Instalar Expo CLI**:

   ```cmd
   npm install -g @expo/cli
   ```

3. **Instalar dependencias del proyecto**:

   ```cmd
   cd "c:\Users\james\OneDrive\Desktop\ProyectoIngSis\ProyectoIngSisMovil"
   npm install
   ```

4. **Ejecutar la aplicación**:
   ```cmd
   npm start
   ```

## Ejecutar en Dispositivo

### Android

1. Instala la app "Expo Go" desde Google Play Store
2. Ejecuta `npm start` en el proyecto
3. Escanea el código QR con la app Expo Go

### iOS

1. Instala la app "Expo Go" desde App Store
2. Ejecuta `npm start` en el proyecto
3. Escanea el código QR con la cámara del iPhone

### Emulador Android

1. Instala Android Studio
2. Configura un emulador Android
3. Ejecuta `npm run android`

### Simulador iOS (solo en Mac)

1. Instala Xcode
2. Ejecuta `npm run ios`

## Verificar Backend

Antes de usar la aplicación móvil, asegúrate de que el backend esté ejecutándose:

1. Abre otra terminal/cmd
2. Navega al directorio del backend:
   ```cmd
   cd "c:\Users\james\OneDrive\Desktop\ProyectoIngSis\Backend"
   ```
3. Ejecuta el backend:
   ```cmd
   npm start
   ```

El backend debe estar ejecutándose en `http://localhost:3001`

## Solución de Problemas

### Error de dependencias

Si hay errores con las dependencias, sigue estos pasos:

1. **Eliminar node_modules y reinstalar:**

   ```cmd
   rmdir /s node_modules
   del package-lock.json
   npm install
   ```

2. **Si persiste el error, usar legacy peer deps:**

   ```cmd
   npm install --legacy-peer-deps
   ```

3. **Si hay problemas con Metro/Expo, limpiar caché:**
   ```cmd
   npm install -g @expo/cli@latest
   npx expo install --fix
   ```

### Error de Metro

Si hay problemas con Metro bundler:

```cmd
npx expo start --clear
```

### Error de red

Si la aplicación no puede conectarse al backend:

1. Verifica que el backend esté ejecutándose en puerto 3001
2. En un emulador Android, usa `http://10.0.2.2:3001` en lugar de `localhost:3001`
3. En un dispositivo físico, usa la IP de tu computadora en lugar de `localhost`

## Estructura de Archivos Creados

```
ProyectoIngSisMovil/
├── App.js                           # ✅ Navegación principal
├── app.json                         # ✅ Configuración Expo
├── babel.config.js                  # ✅ Configuración Babel
├── package.json                     # ✅ Dependencias
├── README.md                        # ✅ Documentación
├── INSTALACION.md                   # ✅ Este archivo
└── src/
    ├── components/
    │   ├── ApplicationScreen.js     # ✅ Pantalla principal
    │   ├── LoginScreen.js           # ✅ Pantalla de login
    │   ├── SignUpScreen.js          # ✅ Pantalla de registro
    │   ├── UserContext.js           # ✅ Contexto de usuario
    │   └── TimerContext.js          # ✅ Contexto de temporizador
    └── redux/
        ├── store.js                 # ✅ Store de Redux
        ├── coinsSlice.js            # ✅ Slice de monedas
        ├── foodInventorySlice.js    # ✅ Slice de inventario
        ├── petStatusSlice.js        # ✅ Slice de mascota
        └── goalsSlice.js            # ✅ Slice de objetivos
```

## Estado de la Migración

✅ **Completado:**

- Configuración básica de Expo
- Redux store y slices migrados
- Contextos de usuario y temporizador
- Pantallas de autenticación (Login/SignUp)
- Pantalla principal de la aplicación
- Integración con AsyncStorage
- Reemplazo de axios por fetch

🔄 **Pendiente para futuras mejoras:**

- Navegación por pestañas
- Pantallas adicionales (Store, Goals, etc.)
- Componentes específicos de la mascota
- Optimizaciones de UI/UX
- Notificaciones push
