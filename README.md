# 🚪 Door — Plataforma de Transporte y Delivery

<div align="center">

![Door App](Door%20Prototype/Splash%20Screens.jpg)

**Conecta usuarios con conductores para transporte de personas y entrega de objetos**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue?logo=react)](https://reactnative.dev/)
[![.NET](https://img.shields.io/badge/.NET-8-purple?logo=dotnet)](https://dotnet.microsoft.com/)

</div>

---

## 📱 ¿Qué es Door?

**Door** es una aplicación móvil de transporte y delivery que conecta en tiempo real a usuarios que necesitan movilizarse o enviar paquetes con conductores verificados. Disponible para Android e iOS.

### Roles en la plataforma
| Rol | Descripción |
|-----|-------------|
| 🧑 **Usuario** | Solicita viajes o envíos de objetos |
| 🚗 **Conductor** | Acepta solicitudes de transporte y delivery |

---

## 🗂️ Estructura del Proyecto

```
Door/
├── FrontendDoor/          # App móvil React Native (Android & iOS)
│   ├── src/
│   │   ├── components/    # Componentes por módulo (Booking, Driver, User...)
│   │   ├── services/      # Capa de servicios / API
│   │   ├── hooks/         # Contextos y hooks personalizados
│   │   └── pages/         # Componentes de páginas reutilizables
│   ├── assets/            # Imágenes, fuentes y recursos estáticos
│   └── android/ ios/      # Código nativo por plataforma
│
├── BackendDoor/           # API REST en .NET 8
│   ├── Api/               # Controladores y configuración de la API
│   └── Model/             # Modelos de dominio y entidades
│
├── Door Prototype/        # Prototipos de UI/UX (imágenes de referencia)
├── docs/                  # Estándares y documentación técnica
│   ├── api-spec.yml       # Especificación OpenAPI
│   ├── data-model.md      # Modelo de datos
│   ├── base-standards.md  # Estándares base de desarrollo
│   └── ...
├── ai-specs/              # Configuración de agentes IA y skills
└── hoja de ruta.csv       # Roadmap del proyecto
```

---

## 🛠️ Stack Tecnológico

### Frontend (Mobile)
- **React Native** 0.72+ — Framework multiplataforma
- **TypeScript** — Tipado estático
- **React Navigation** — Navegación (Stack, Drawer, Tabs)
- **OneSignal** — Notificaciones push
- **Inter Font** — Tipografía del sistema

### Backend (API)
- **.NET 8** — Framework de la API REST
- **Clean Architecture** — Separación de capas (Api / Model)
- **OpenAPI** — Documentación de endpoints

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js `20.x` o superior
- React Native CLI
- Android Studio / Xcode
- .NET 8 SDK

### Frontend

```bash
cd FrontendDoor

# Instalar dependencias
npm install

# Android
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

### Backend

```bash
cd BackendDoor

# Restaurar dependencias y ejecutar
dotnet restore
dotnet run --project Api
```

---

## 📲 Funcionalidades Principales

### Para el Usuario
- 🔐 Login con verificación OTP
- 🏠 Pantalla principal con modos: **Transporte** y **Delivery**
- 📍 Selección de ubicación origen/destino en mapa
- 📅 Selección de fecha y hora del servicio
- 📋 Lista y detalle de reservas
- 🔔 Notificaciones en tiempo real
- 👤 Gestión de perfil, direcciones e historial

### Para el Conductor
- 📄 Registro con documentos (licencia, vehículo)
- 🗺️ Visualización y aceptación de rutas
- ✅ Confirmación y finalización de servicios
- 📊 Panel de rutas activas

### General
- 💬 Chat entre usuario y conductor
- ⭐ Sistema de valoraciones
- 🔒 Políticas de privacidad y términos de servicio
- ⚙️ Configuración de cuenta y notificaciones

---

## 🎨 Prototipo de UI

El directorio [`Door Prototype/`](Door%20Prototype/) contiene las pantallas de diseño de referencia:

| Pantalla | Vista previa |
|----------|-------------|
| Sign In / OTP | `01_sign_in.jpg` / `02_verify_otp.jpg` |
| Home Usuario | `06_home_screen_Transport_User.jpg` |
| Home Conductor | `21_Driver_home.jpg` |
| Reservas | `10_Reservation_list.jpg` |
| Ruta activa | `24_Active_routes.jpg` |

---

## 📐 Estándares de Desarrollo

El proyecto sigue estándares documentados en `docs/`:

- [`base-standards.md`](docs/base-standards.md) — Principios SOLID, DRY, KISS
- [`backend-standards.md`](docs/backend-standards.md) — API, base de datos, seguridad
- [`frontend-standards.md`](docs/frontend-standards.md) — Componentes React Native, UX
- [`api-spec.yml`](docs/api-spec.yml) — Contratos OpenAPI
- [`data-model.md`](docs/data-model.md) — Modelo de dominio y entidades

---

## 🗺️ Roadmap

Ver [`hoja de ruta.csv`](hoja%20de%20ruta.csv) para el seguimiento detallado de funcionalidades y progreso.

---

## 📄 Licencia

Copyright © 2025 — Proyecto Door  
Licenciado bajo [MIT License](LICENSE)

---

<div align="center">
  <strong>Door</strong> — Muévete. Envía. Conecta.
</div>