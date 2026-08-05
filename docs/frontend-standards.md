---
description: Frontend development standards, best practices, and conventions for the Door React Native mobile application including navigation patterns, state management, form validation, and UI/UX guidelines
globs: ["FrontendDoor/src/**/*.{js,jsx,ts,tsx}", "FrontendDoor/package.json", "FrontendDoor/tsconfig.json", "FrontendDoor/App.tsx"]
alwaysApply: true
---

# Frontend Project Standards and Best Practices

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Navigation Patterns](#navigation-patterns)
- [Forms & Data Validation](#forms--data-validation)
- [UI/UX & Component Guidelines](#uiux--component-guidelines)
- [API Service Layer](#api-service-layer)
- [Performance Optimization](#performance-optimization)

---

## Overview

This document defines the development conventions and patterns for the **Door** frontend mobile application. The frontend is built as a cross-platform React Native app designed for drivers (to publish routes and verify documents) and passengers (to request trips and track cargo delivery).

---

## Technology Stack

### Core Technologies
- **React Native 0.73.0** & **React 18.2.0**: Framework for cross-platform mobile apps.
- **TypeScript & JavaScript (ES6+)**: Typed and script files configuration.

### Navigation
- **React Navigation v6**: Stack, Drawer, and Bottom Tabs routing controllers.
  - `@react-navigation/native`
  - `@react-navigation/stack`
  - `@react-navigation/drawer`
  - `@react-navigation/bottom-tabs`

### UI Frameworks & Icons
- **React Native Paper (v5)**: Material Design component library.
- **React Native Vector Icons**: Custom font icons for buttons and tabs.
- **React Native Animatable**: Declarative animations.

### Maps & Location
- **React Native Maps (1.11.3)**: Render interactive Google/Apple maps.
- **React Native Geocoding** & **Google Places Autocomplete**: Address searching, lat/long conversions.
- **Geolocation**: Fetch current coordinates of users.

### Native Integrations
- **React Native Image Picker**: Profile picture and driver document uploads.
- **React Native Device Info**: Retrieve hardware details for push notifications.

### Forms & Validation
- **Formik**: Dynamic form state management.
- **Yup**: Object schema validation.

---

## Project Structure

The project code resides in `FrontendDoor/src/`, organized by feature/responsibility:

```
FrontendDoor/src/
├── api/             # Central fetch setup (fetchData.ts)
├── components/      # Global shared UI elements & screen sections:
│   ├── Booking/     # Booking-related UI components (DetailBooking, ModalBooking, SearchBooking, etc.)
│   ├── Drawer/      # Custom navigation drawer component
│   ├── Driver/      # Driver-specific UI components
│   ├── Home/        # Home screen UI components
│   ├── Login/       # Login screen UI components
│   ├── Navigation/  # Navigation setups (DrawerNavigator, StackNavigator, TabNavigator)
│   ├── NavigationDriver/ # Navigation setups for Driver panel
│   └── User/        # User profile UI components
├── hooks/           # Custom React hooks (AuthContext.js, BookingContext.js, RequestPermissionCamera.js, useOneSignal.js)
├── pages/           # Screen dialogs, terms, spinner, location (ChooseSideButtons.jsx, ConfirmDialog.jsx, CustomUploadModal.jsx, Dialog.jsx, DialogCamera.jsx, FormDialog.jsx, LocationView.jsx, ModalTerms.jsx, SelectSideModal.jsx, SpinnerActivity.jsx)
├── services/        # Service layer grouping backend communication by domain:
│   ├── Booking/     # booking.js - Booking reservations API services
│   ├── Driver/      # Driver.js - Vehicle registration & document upload services
│   ├── Location/    # location.js - Geocoding & coordinate search services
│   ├── Notifications/ # sendNotification.js - OneSignal push notification integration
│   └── User/        # User.js - User lookup, registration, activation, & edit services
└── utils/           # Shared helper functions (Icons.js, Logo.js, TermsAndConditions.js, Utils.js)
```

---

## Coding Standards

### Naming Conventions
- **Components & Screen Pages**: Use **PascalCase** (e.g. `LocationView.jsx`, `SpinnerActivity.jsx`, `ChooseSideButtons.jsx`).
- **Files**:
  - Components and Pages use `.jsx` or `.tsx`.
  - Service, helper, and configuration files use `.js` or `.ts` (e.g. `User.js`, `fetchData.ts`).
- **Variables & Functions**: Use **camelCase** (e.g. `idUsuario`, `userExist`, `createUser`, `phoneNumber`).
- **Custom Hooks**: Prefix with "use" (e.g. `useLocation`, `useAppState`).
- **Global Constants**: Use **UPPER_SNAKE_CASE** (e.g. `API_ENDPOINT_DOOR`).

### Code Style
- Use **arrow functions** for functional components.
- Rely on hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) for side-effects and performance.
- Avoid inline calculations inside JSX; define them as helper functions or variables above the `return` statement.
- Keep components focused and modular. Avoid giant screen files.

---

## Navigation Patterns

1. **Stack Navigators**: Used for drill-down page flows (e.g. going from passenger/driver select to user registration, or details of a route reservation).
2. **Drawer Navigators**: Main app side-menu containing options like Profile, Route Search, My Trips, Driver panel, Settings, and Sign out.
3. **Bottom Tab Navigators**: Main workspace screen division (e.g. Map View, Bookings list, Notifications).

Always wrap navigation screens in a `SafeAreaView` (from `react-native-safe-area-context`) to prevent status bar or notch clipping.

---

## Forms & Data Validation

### Formik & Yup
- Implement forms using Formik's `<Formik>` component or `useFormik` hook.
- Enforce validation rules utilizing Yup schemas.
- Display helper validation text beneath input elements in red/error colors.

### File & Document Upload
- Utilize `react-native-image-picker` to select image files.
- Convert assets to `multipart/form-data` structures using `FormData` class:
  ```javascript
  let data = new FormData();
  data.append('archivos', {
    uri: file.uri,
    type: file.type,
    name: file.fileName,
  });
  ```
- Send payloads via forms-specific functions (e.g. `fethFormData`).

---

## UI/UX & Component Guidelines

1. **Responsiveness**: Use flexible flexbox layouts (`flex: 1`, `flexDirection: 'row'`, etc.) instead of hardcoded component widths/heights to ensure layout compatibility across varied screen sizes (Android & iOS).
2. **Modals & Dialogs**:
   - Centralize confirmation modals (`ConfirmDialog.jsx`), camera/gallery choosing sheets (`DialogCamera.jsx`), and terms and conditions screens (`ModalTerms.jsx`).
   - Use clean backdrops, smooth transitions (via `react-native-modal`), and loading spinners (`SpinnerActivity.jsx`) during network roundtrips.
3. **Typography & Styling**: Apply styles through StyleSheet.create to compile layout constraints. Avoid stylesheet bloat inside the JSX elements.

---

## API Service Layer

- API endpoints are read from configuration files using environment variables (`@env` via `react-native-dotenv` mapping `API_ENDPOINT_DOOR`).
- Wrap backend calls in try-catch structures and catch connection timeouts or invalid statuses.
- Standard API call methods:
  - `userExist`: check if user's phone is registered.
  - `createUser`: register driver or passenger details.
  - `editUser`: update profile image, address, or email.
  - `disabledUser`: toggle active state for user profiles.
  - `getTypesUsers`: retrieves lookup list of user types.

---

## Performance Optimization

1. **Images**: Prefer `react-native-fast-image` over native `Image` for caching remote resources.
2. **Lists**: Use `FlatList` or `SectionList` instead of `.map()` on ScrollViews to optimize memory utilization when rendering large collections of routes or bookings.
3. **Map rendering**: Minimize markers re-renders by caching coordinates and utilizing custom shapes/pins cleanly.
