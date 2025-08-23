# 🔧 Solución para Network Error en React Native

## 🚨 Problema

Cuando intentas registrarte o hacer login, aparece un "network error" porque React Native no puede conectarse a `localhost:3001`.

## 🔍 ¿Por qué ocurre esto?

En React Native, cuando ejecutas la app en un dispositivo móvil o emulador:

- `localhost` NO apunta a tu computadora
- El dispositivo/emulador necesita la IP real de tu computadora

## ✅ Solución Paso a Paso

### 1. Encuentra la IP de tu computadora

#### En Windows:

```bash
ipconfig
```

Busca "IPv4 Address" bajo tu adaptador de red (ejemplo: `192.168.1.100`)

#### En Mac/Linux:

```bash
ifconfig
```

Busca "inet" (ejemplo: `192.168.1.100`)

### 2. Actualiza la configuración de API

Abre el archivo: `ProyectoIngSisMovil/src/config/api.js`

Encuentra esta línea:

```javascript
return "http://192.168.1.100:3001"; // Change this to your IP
```

Reemplaza `192.168.1.100` con la IP que encontraste en el paso 1.

### 3. Asegúrate de que tu backend esté corriendo

Verifica que tu servidor backend esté ejecutándose en el puerto 3001:

```bash
cd Backend
npm start
```

### 4. Verifica la conexión

Desde tu navegador web, ve a: `http://TU_IP:3001`
(Reemplaza TU_IP con la IP que encontraste)

Si ves algo como "Cannot GET /" es normal - significa que el servidor está corriendo.

## 🔧 Configuraciones Específicas por Plataforma

### Android Emulator

- Usa `10.0.2.2:3001` (ya configurado automáticamente)

### iOS Simulator

- Usa la IP real de tu computadora

### Dispositivo Físico

- Usa la IP real de tu computadora
- Asegúrate de que el dispositivo esté en la misma red WiFi

## 🚀 Pasos Adicionales

### 1. Reinicia Metro Bundler

```bash
npx react-native start --reset-cache
```

### 2. Reinstala la app

```bash
expo start
# o
npx react-native run-ios
```

### 3. Verifica que el backend permita conexiones externas

En tu archivo `Backend/server.js`, asegúrate de que esté configurado así:

```javascript
app.listen(3001, "0.0.0.0", () => {
  console.log("Server running on port 3001");
});
```

## 🔍 Debugging

### Verifica la URL que se está usando:

Agrega esto en tu LoginScreen para ver qué URL se está usando:

```javascript
console.log("API URL:", API_ENDPOINTS.LOGIN);
```

### Verifica la respuesta del servidor:

```javascript
console.log("Response status:", response.status);
console.log("Response headers:", response.headers);
```

## 📱 Ejemplo de IPs Comunes

- `192.168.1.x` - Red doméstica típica
- `192.168.0.x` - Otra configuración común
- `10.0.0.x` - Algunas redes corporativas
- `172.16.x.x` - Redes privadas

## ⚠️ Notas Importantes

1. **Firewall**: Asegúrate de que tu firewall permita conexiones en el puerto 3001
2. **Red**: Tu dispositivo y computadora deben estar en la misma red WiFi
3. **CORS**: El backend debe permitir conexiones desde otras IPs

## 🆘 Si Aún No Funciona

1. Verifica que el backend esté corriendo: `curl http://TU_IP:3001`
2. Usa una herramienta como Postman para probar las APIs
3. Revisa los logs del servidor backend
4. Verifica que no haya otro proceso usando el puerto 3001

## 📞 Comando Rápido para Verificar

```bash
# Verifica que el puerto esté abierto
telnet TU_IP 3001
```

Si se conecta, el problema está en la configuración de React Native.
Si no se conecta, el problema está en el backend o la red.
