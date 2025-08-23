# Solución para Error "URL.protocol is not implemented" en Hermes

## 🚨 Problema

Al ejecutar la app en Android con Hermes, aparece el error:

```
[Error]: URL.protocol is not implemented, js engine: hermes
```

## ✅ Solución Implementada

### 1. Instalación del Polyfill

```bash
npm install react-native-url-polyfill --legacy-peer-deps
```

### 2. Configuración en App.js

Se agregó la importación del polyfill **AL INICIO** del archivo App.js:

```javascript
// IMPORTANT: Import URL polyfill FIRST to fix Hermes compatibility
import "react-native-url-polyfill/auto";
```

### 3. ¿Por qué funciona?

- Hermes no incluye la API `URL` por defecto
- `react-native-url-polyfill/auto` proporciona una implementación compatible
- Al importarlo primero, se asegura que esté disponible antes de cualquier código que lo use
- `fetch()` y otras APIs internamente pueden usar `URL`, por eso necesitamos el polyfill

## 🔧 Alternativas si el polyfill no funciona

### Opción 1: Usar axios en lugar de fetch

```bash
npm install axios
```

```javascript
import axios from "axios";

// En lugar de fetch
const response = await axios.get(API_ENDPOINTS.GOALS, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### Opción 2: Deshabilitar Hermes (no recomendado)

En `app.json`:

```json
{
  "expo": {
    "jsEngine": "jsc"
  }
}
```

### Opción 3: Implementar helper personalizado para URLs

```javascript
// src/utils/urlHelper.js
export const buildURL = (base, path, params = {}) => {
  let url = `${base}${path}`;
  const queryParams = new URLSearchParams(params).toString();
  return queryParams ? `${url}?${queryParams}` : url;
};
```

## 🧪 Cómo probar la solución

1. Reinicia el servidor Expo:

   ```bash
   npx expo start --clear
   ```

2. Ejecuta en Android:

   ```bash
   npx expo run:android
   ```

3. Verifica que no aparezca el error de URL.protocol

## 📝 Notas importantes

- El polyfill debe importarse **ANTES** que cualquier otra importación
- Funciona tanto para desarrollo como producción
- Compatible con Expo SDK 53 y Hermes
- No afecta el rendimiento significativamente

## 🔍 Archivos modificados

- `App.js` - Agregada importación del polyfill
- `package.json` - Agregada dependencia react-native-url-polyfill

La solución está implementada y lista para usar.
