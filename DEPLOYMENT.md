# 🚀 Guía de Despliegue en Vercel

## Pasos para Desplegar

### 1. Login en Vercel
```bash
vercel login
```
Sigue las instrucciones en pantalla para autenticarte con tu cuenta de GitHub.

### 2. Desplegar el Proyecto
```bash
vercel
```

Durante el proceso interactivo, responde:
- **Set up and deploy "~/Desktop/programa vacaciones"?** → `Y` (Yes)
- **Which scope do you want to deploy to?** → Selecciona tu cuenta/organización
- **Link to existing project?** → `N` (No, create new)
- **What's your project's name?** → `vacaciones` (o el nombre que prefieras)
- **In which directory is your code located?** → `./` (dejar por defecto)
- **Want to override the settings?** → `N` (No)

Vercel detectará automáticamente que es un proyecto Vite y configurará todo.

### 3. Configurar Variables de Entorno

Una vez desplegado, ve a:
```
https://vercel.com/[tu-usuario]/vacaciones/settings/environment-variables
```

Añade estas variables (copia los valores de tu archivo `.env`):

| Variable | Valor |
|----------|-------|
| `VITE_FIREBASE_API_KEY` | Tu API Key de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | tu-proyecto.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | tu-proyecto-id |
| `VITE_FIREBASE_STORAGE_BUCKET` | tu-proyecto.firebasestorage.app |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Tu Sender ID |
| `VITE_FIREBASE_APP_ID` | Tu App ID |

**IMPORTANTE**: Marca todas las variables para los entornos **Production**, **Preview** y **Development**.

### 4. Re-Desplegar con Variables
```bash
vercel --prod
```

Esto hará un nuevo despliegue incluyendo las variables de entorno.

### 5. ¡Listo!
Tu aplicación estará disponible en:
```
https://vacaciones-[hash-unico].vercel.app
```

## Dominios Personalizados (Opcional)

Si quieres usar un dominio propio como `vacaciones.garciaimpresores.com`:

1. Ve a **Settings → Domains** en tu proyecto de Vercel
2. Añade tu dominio
3. Configura los registros DNS según las instrucciones de Vercel

## Comandos Útiles

```bash
# Ver lista de despliegues
vercel ls

# Ver logs en tiempo real
vercel logs [url-del-despliegue]

# Eliminar un despliegue
vercel rm [nombre-del-proyecto]

# Desplegar a producción directamente
vercel --prod
```

## Troubleshooting

### Error: "No se encontraron variables de entorno"
- Verifica que has añadido todas las variables en Vercel
- Asegúrate de que están marcadas para el entorno correcto
- Re-despliega después de añadir variables

### Error: "Firebase initialization failed"
- Verifica que las credenciales de Firebase sean correctas
- Comprueba que el proyecto de Firebase esté activo
- Revisa la consola del navegador para más detalles

### El sitio no carga
- Verifica que no haya errores de compilación: `npm run build`
- Revisa los logs de Vercel: `vercel logs`
- Asegúrate de que Firebase Firestore está configurado correctamente

## Actualizar el Sitio

Para actualizar el sitio después de hacer cambios:

1. Commit y push a GitHub:
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

2. Vercel detectará el push automáticamente y desplegará los cambios

O manualmente:
```bash
vercel --prod
```

---

**¿Necesitas ayuda?** Consulta la [documentación de Vercel](https://vercel.com/docs)
