# 📱 Guía para Probar la App en tu Teléfono

## 🚀 Cómo ejecutar la app en tu dispositivo móvil

### Opción 1: Usando Expo Go (Recomendado para pruebas rápidas)

1. **Instala Expo Go en tu teléfono:**

   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Inicia el servidor de desarrollo:**

   ```bash
   cd ProyectoIngSisMovil
   npx expo start
   ```

3. **Conecta tu teléfono:**

   - **Android**: Escanea el código QR con la app Expo Go
   - **iOS**: Escanea el código QR con la cámara del iPhone

4. **Verifica que no aparezca el error de Hermes:**
   - La app debería cargar sin errores de "URL.protocol is not implemented"
   - Todas las funciones de fetch() deberían funcionar correctamente

### Opción 2: Build nativo (Para pruebas más realistas)

1. **Para Android:**

   ```bash
   cd ProyectoIngSisMovil
   npx expo run:android
   ```

2. **Para iOS:**
   ```bash
   cd ProyectoIngSisMovil
   npx expo run:ios
   ```

## 🔧 Configuración importante para tu teléfono

### 1. Asegúrate de que el backend esté corriendo

```bash
# En otra terminal
cd Backend
npm start
```

### 2. Verifica la IP en api.js

El archivo `src/config/api.js` debe tener tu IP local correcta:

```javascript
return "http://192.168.1.5:3001"; // Cambia por tu IP
```

### 3. Encuentra tu IP local:

**Windows:**

```bash
ipconfig
# Busca "IPv4 Address" en tu adaptador de red
```

**Mac/Linux:**

```bash
ifconfig
# Busca "inet" (generalmente 192.168.x.x)
```

## 🧪 Pruebas específicas para Hermes

### Funciones que debes probar en tu teléfono:

1. **Login/Registro** - Verifica que las peticiones HTTP funcionen
2. **Cargar metas** - Prueba fetch() con autenticación
3. **Alimentar mascota** - Prueba POST requests
4. **Comprar en tienda** - Prueba múltiples llamadas API
5. **Timer** - Verifica que no haya errores de URL

### Señales de que el polyfill funciona:

- ✅ No aparece error "URL.protocol is not implemented"
- ✅ Las peticiones fetch() se completan exitosamente
- ✅ La navegación entre pantallas funciona
- ✅ Los datos se cargan correctamente

### Si aún hay problemas:

1. **Reinicia Expo:**

   ```bash
   npx expo start --clear
   ```

2. **Verifica que el polyfill esté al inicio de App.js:**

   ```javascript
   // DEBE ser la PRIMERA línea de importación
   import "react-native-url-polyfill/auto";
   ```

3. **Revisa los logs en Expo Go:**
   - Agita el teléfono para abrir el menú de desarrollo
   - Selecciona "Remote JS Debugging" para ver errores

## 📋 Checklist de pruebas en teléfono

- [ ] App carga sin errores
- [ ] Login funciona correctamente
- [ ] Registro de usuario funciona
- [ ] Pantalla principal muestra la mascota
- [ ] Sistema de metas carga datos
- [ ] Tienda muestra productos
- [ ] Timer funciona correctamente
- [ ] Alimentar mascota actualiza estado
- [ ] No hay errores de "URL.protocol" en los logs

## 🆘 Solución de problemas comunes

### Error de red:

- Verifica que tu teléfono esté en la misma red WiFi que tu computadora
- Actualiza la IP en `src/config/api.js`

### Error de Hermes persiste:

- Asegúrate de que `react-native-url-polyfill` esté instalado
- Verifica que la importación esté al inicio de App.js
- Reinicia el servidor con `--clear`

### App no carga:

- Verifica que el backend esté corriendo en puerto 3001
- Revisa los logs en la terminal de Expo

¡La app está lista para probar en tu teléfono! El polyfill de Hermes debería resolver todos los problemas de compatibilidad.
