# 🎬 KarenFlix Frontend

Una plataforma moderna de streaming desarrollada con Next.js 15, que permite a los usuarios explorar, buscar y gestionar contenido multimedia con un potente panel de administración.

## 🚀 Características Principales

### 🎯 Para Usuarios
- **Exploración de contenido:** Películas, series y anime organizados por categorías
- **Búsqueda avanzada:** Filtros por tipo, categoría y título
- **Rankings y populares:** Contenido destacado y tendencias
- **Gestión de perfil:** Edición de datos personales y cambio de contraseña
- **Sugerencias:** Los usuarios pueden sugerir nuevo contenido

### 👑 Panel de Administración
- **Dashboard administrativo** con estadísticas y métricas
- **Gestión de usuarios** completa (crear, editar, eliminar)
- **Gestión de contenido multimedia:**
  - Crear nuevo contenido con vista previa en tiempo real
  - Editar contenido existente
  - Administrar estados (publicado/borrador)
  - Eliminación de contenido
- **Revisión de contenido pendiente:**
  - Aprobar/rechazar sugerencias de usuarios
  - Editar contenido antes de aprobación
  - Sistema de tarjetas con vista previa
- **Navegación responsive** optimizada para móvil y desktop

## 🛠️ Stack Tecnológico

### Core
- **Framework:** Next.js 15.5.0 con App Router
- **React:** 19.1.0 con Hooks y Context API
- **Estilos:** Tailwind CSS 4 con diseño responsive
- **Notificaciones:** SweetAlert2 11.22.4

### Herramientas de Desarrollo
- **Linting:** ESLint 9 con configuración Next.js
- **Build:** Turbopack para compilación rápida
- **PostCSS:** Configuración optimizada para Tailwind

## 📁 Estructura del Proyecto

```
karenflixfrontend/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── admin/             # Panel de administración
│   │   ├── login/             # Autenticación de usuarios
│   │   ├── register/          # Registro de usuarios
│   │   ├── perfil/editar/[id] # Edición de perfil dinámico
│   │   ├── usuario/[id]/      # Perfil público de usuario
│   │   └── search/            # Búsqueda de contenido
│   ├── components/
│   │   ├── admin/             # Componentes administrativos
│   │   │   ├── AdminDashboard.jsx      # Dashboard principal
│   │   │   ├── MediaManagement.jsx     # Gestión de contenido
│   │   │   ├── AddMediaForm.jsx        # Formulario crear contenido
│   │   │   ├── EditMediaForm.jsx       # Formulario editar contenido
│   │   │   ├── PendingMedia.jsx        # Gestión contenido pendiente
│   │   │   └── UsersManagement.jsx     # Gestión de usuarios
│   │   ├── home/              # Componentes página principal
│   │   │   ├── Hero.jsx               # Banner principal
│   │   │   ├── MovieCard.jsx          # Tarjeta de contenido
│   │   │   ├── MovieSection.jsx       # Secciones de contenido
│   │   │   └── MovieSlider.jsx        # Carrusel de contenido
│   │   ├── layout/            # Componentes de layout
│   │   │   └── Header.jsx             # Navegación principal
│   │   └── users/             # Componentes de usuarios
│   │       └── Users.jsx              # Gestión de usuarios
│   ├── context/
│   │   └── AuthContext.jsx    # Contexto global de autenticación
│   ├── hooks/
│   │   └── useAdminAuth.js    # Hook personalizado para admin
│   └── lib/
│       ├── http.js            # Cliente HTTP personalizado
│       └── api/               # Abstracciones de API
│           ├── index.js       # Exportaciones principales
│           ├── media.js       # API de contenido multimedia
│           └── users.js       # API de usuarios y autenticación
└── public/                    # Archivos estáticos
```

## 🔧 Configuración y Setup

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd karenflixfrontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://glasgow-recruiting-blade-devoted.trycloudflare.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo con Turbopack
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Ejecutar ESLint
```

## 🌐 Integración con Backend

### Base URL API
- **Desarrollo:** `https://glasgow-recruiting-blade-devoted.trycloudflare.com`
- **Rutas base:** `/api/v1/`

### Autenticación
- **Tipo:** JWT Bearer Token
- **Storage:** localStorage del navegador
- **Headers:** `Authorization: Bearer <token>`

### Endpoints Principales

#### Autenticación
```http
POST /api/v1/auth/register    # Registro de usuarios
POST /api/v1/auth/login       # Inicio de sesión
GET  /api/v1/auth/profile     # Perfil del usuario autenticado
POST /api/v1/auth/refresh-token # Renovar token
POST /api/v1/auth/logout      # Cerrar sesión
```

#### Usuarios
```http
GET    /api/v1/users          # Listar usuarios (admin)
GET    /api/v1/users/{id}     # Obtener usuario específico
PUT    /api/v1/users/{id}     # Actualizar usuario (admin)
DELETE /api/v1/users/{id}     # Eliminar usuario (admin)
PATCH  /api/v1/users/{id}/update-profile  # Actualizar perfil propio
PATCH  /api/v1/users/{id}/change-password # Cambiar contraseña
```

#### Contenido Multimedia
```http
# Rutas públicas
GET /api/v1/media/public      # Contenido público
GET /api/v1/media/ranking     # Rankings
GET /api/v1/media/popular     # Contenido popular
GET /api/v1/media/category/{slug} # Por categoría

# Rutas administrativas
POST   /api/v1/media          # Crear contenido (admin)
PUT    /api/v1/media/{id}     # Editar contenido (admin)
DELETE /api/v1/media/{id}     # Eliminar contenido (admin)
PUT    /api/v1/media/{id}/approve  # Aprobar contenido (admin)
PUT    /api/v1/media/{id}/reject   # Rechazar contenido (admin)

# Sugerencias de usuarios
POST /api/v1/media/suggest    # Sugerir contenido (usuarios autenticados)
```

## 🎨 Diseño y UX

### Responsive Design
- **Mobile-first:** Optimizado para dispositivos móviles
- **Breakpoints:** Tailwind CSS responsive utilities
- **Navegación adaptiva:** Sidebar en desktop, tabs en móvil

### Componentes UI
- **Tarjetas de contenido** con imágenes y metadatos
- **Modales interactivos** para formularios
- **Vista previa en tiempo real** en formularios de creación/edición
- **Notificaciones** elegantes con SweetAlert2
- **Carga lazy** de imágenes con fallbacks

### Paleta de Colores
- **Primario:** Azul (#3B82F6)
- **Secundario:** Gris (#6B7280)
- **Fondo:** Gris claro (#F3F4F6)
- **Texto:** Gris oscuro (#1F2937)

## 🔐 Sistema de Autenticación

### Roles de Usuario
- **Usuario regular:** Explorar contenido, sugerir títulos, editar perfil
- **Administrador:** Acceso completo al panel admin, gestión de usuarios y contenido

### Flujo de Autenticación
1. **Registro/Login** → Token JWT almacenado en localStorage
2. **Context Provider** → Estado global de autenticación
3. **Protected Routes** → Validación automática de permisos
4. **Auto-refresh** → Renovación automática de tokens

### Seguridad
- **JWT Tokens** con expiración automática
- **Validación client-side** de permisos
- **Headers de autorización** en todas las peticiones admin
- **Sanitización** de datos de entrada

## 📊 Gestión de Contenido

### Estructura de Media
Los contenidos multimedia tienen la siguiente estructura mínima:

```javascript
{
  title: "Título del contenido",        // Requerido
  type: "movie|series|anime",          // Requerido
  description: "Descripción",
  category: { name: "Nombre categoría" }, // Objeto con propiedad name
  year: 2024,                          // Número
  imageurl: "https://imagen.url"       // URL de imagen
}
```

### Estados del Contenido
- **`pending`** - Sugerido por usuario, esperando revisión
- **`approved`** - Aprobado por admin, listo para publicar
- **`rejected`** - Rechazado por admin
- **`published`** - Visible públicamente
- **`draft`** - Borrador, no visible

### Tipos de Contenido
- **Películas** (`movie`)
- **Series** (`series`)
- **Anime** (`anime`)

## 🧩 Componentes Principales

### HomePage Components
- **`Hero`** - Banner principal con contenido destacado
- **`MovieSection`** - Secciones de contenido por categoría
- **`MovieSlider`** - Carrusel horizontal de contenido
- **`MovieCard`** - Tarjeta individual de contenido

### Admin Components
- **`AdminDashboard`** - Panel principal con estadísticas
- **`MediaManagement`** - CRUD completo de contenido
- **`AddMediaForm`** - Formulario de creación con vista previa
- **`EditMediaForm`** - Formulario de edición reutilizable
- **`PendingMedia`** - Gestión de contenido pendiente de aprobación
- **`UsersManagement`** - Administración de usuarios

### Layout Components
- **`Header`** - Navegación principal responsive
- **`AuthContext`** - Proveedor de contexto de autenticación

## 🔍 Funcionalidades Especiales

### Filtrado Inteligente
- **Búsqueda en tiempo real** por título
- **Filtros por categoría** dinámicos desde backend
- **Filtros por tipo** (películas, series, anime)
- **Paginación** eficiente para grandes volúmenes de datos

### Vista Previa en Tiempo Real
- **Formularios de creación/edición** muestran preview instantáneo
- **Validación visual** de URLs de imágenes
- **Actualización automática** conforme se escriben los datos

### Gestión de Estados
- **Context API** para estado global de autenticación
- **Local state** para formularios y componentes específicos
- **Sincronización automática** con backend después de acciones

## 🚦 Comandos de Desarrollo

### Desarrollo Local
```bash
npm run dev     # Inicia servidor en http://localhost:3000
```

### Build y Deploy
```bash
npm run build   # Genera build optimizado
npm run start   # Servidor de producción
```

### Calidad de Código
```bash
npm run lint    # Verificar código con ESLint
```

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

### Dispositivos
- **Desktop:** Diseño de sidebar completo
- **Tablet:** Navegación por tabs horizontales
- **Mobile:** Interfaz optimizada para touch

## 🔧 APIs y Servicios

### Cliente HTTP Personalizado
- **Base URL configurable** via variables de entorno
- **Manejo automático de headers** de autorización
- **Construcción inteligente de URLs** con query parameters
- **Soporte SSR/CSR** con detección de entorno

### Gestión de Errores
- **Interceptors de respuesta** para errores HTTP
- **Manejo centralizado** de errores de autenticación
- **Notificaciones user-friendly** con SweetAlert2
- **Logs detallados** para debugging

## 🎭 Roles y Permisos

### Usuario Regular
- ✅ Ver contenido público
- ✅ Buscar y filtrar
- ✅ Editar su propio perfil
- ✅ Sugerir nuevo contenido
- ❌ Acceso al panel admin

### Administrador
- ✅ Todo lo del usuario regular
- ✅ Acceso completo al panel admin
- ✅ Gestión de usuarios (CRUD)
- ✅ Gestión de contenido (CRUD)
- ✅ Aprobar/rechazar sugerencias
- ✅ Cambiar estados de contenido

## 🌟 Funcionalidades Destacadas

### 1. **Creación de Contenido con Vista Previa**
- Modal de dos columnas: formulario + preview
- Validación en tiempo real de campos
- Preview automático de imágenes
- Estructura de categorías como objetos

### 2. **Gestión de Contenido Pendiente**
- Layout de tarjetas con imágenes
- Botones de acción (aprobar/rechazar/editar)
- Modal de edición inline
- Filtros por categoría

### 3. **Autenticación Robusta**
- Context Provider con persistencia
- Validación automática de tokens
- Redirecciones inteligentes
- Manejo de expiración de sesión

### 4. **Diseño Responsive Avanzado**
- Sidebar en desktop → Tabs en móvil
- Navegación adaptiva
- Formularios responsive
- Optimización touch para móviles

## 🔄 Estado de Desarrollo

### ✅ Completado
- Sistema de autenticación completo
- Panel de administración funcional
- Gestión de usuarios y contenido
- Diseño responsive
- Integración con backend API
- Sistema de permisos y roles

### 🔄 En Desarrollo
- Optimizaciones de rendimiento
- Tests automatizados
- Internacionalización (i18n)

## 🚀 Deploy y Producción

### Build Optimizado
```bash
npm run build
```

### Variables de Producción
```env
NEXT_PUBLIC_API_URL=https://tu-backend-api.com
NEXT_PUBLIC_SITE_URL=https://tu-frontend.com
```

### Recomendaciones de Deploy
- **Vercel** (recomendado para Next.js)
- **Netlify** 
- **Docker** con nginx
- **AWS S3 + CloudFront**

## 👥 Contribución

### Estructura de Código
- **Componentes funcionales** con Hooks
- **Named exports** para componentes
- **Separación de concerns** (UI, lógica, API)
- **Código autodocumentado** con JSDoc donde sea necesario

### Estándares de Código
- **ESLint** configurado con reglas Next.js
- **Tailwind CSS** para estilos consistentes
- **Estructura de carpetas** clara y escalable
- **Naming conventions** descriptivos

## 📞 Soporte y Documentación

### APIs Principales
- **Media API:** Gestión completa de contenido multimedia
- **Users API:** Autenticación y gestión de usuarios
- **Categories API:** Organización por categorías

### Debugging
- **Console logs** estratégicos en desarrollo
- **Error boundaries** para captura de errores React
- **Network inspection** para debugging de APIs

---

**Desarrollado con ❤️ usando Next.js 15 y React 19**

*Este README consolida toda la documentación del proyecto KarenFlix Frontend, integrando funcionalidades de usuario, administración y desarrollo técnico.*
