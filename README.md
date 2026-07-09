# RecAI — Mobile Client

A React Native (Expo) mobile app for viewing, managing and acting on AI-style business recommendations. Users can register, sign in, browse a personal list of recommendations, filter and search them, view details, and accept, dismiss, create or delete them — all backed by a .NET REST API.

This is the **mobile client**. The backend lives in a separate repository: [RecAI API](#) *(add your backend repo link here)*.

> **Note:** the app requires the backend API to be running to log in and load data. See [Configuration](#configuration).

## Screenshots

*(Add screenshots or a short screen recording here — it's the single biggest thing that makes a portfolio repo stand out.)*

| Login | Dashboard | Recommendations |
| :---: | :---: | :---: |
| _tbd_ | _tbd_ | _tbd_ |

## Tech stack

- **React Native** with **Expo** (SDK 54)
- **TypeScript**
- **Expo Router** — file-based navigation with protected route groups
- **Axios** — HTTP client with request/response interceptors
- **expo-secure-store** — encrypted on-device JWT storage

## Features

- JWT authentication (register / login / logout) with a reactive, protected navigation flow
- Encrypted token storage and automatic session restore on app start
- Automatic bearer-token injection and global `401` handling via Axios interceptors
- Dashboard with live summary statistics
- Recommendations: list, detail, create, update, delete, accept, dismiss
- Dynamic filtering by status and full-text search (debounced)
- Keyset (cursor) pagination with infinite scroll
- Explicit loading, empty and error states throughout
- Client-side form validation

## Project structure

```
recai-mobile/
├── app/                       # Routes (file-based navigation)
│   ├── _layout.tsx            # Root layout — provides the auth context
│   ├── index.tsx              # Entry redirect (session-aware)
│   ├── (auth)/                # Public routes: login, register
│   └── (app)/                 # Protected routes: dashboard, recommendations
│       └── recommendations/   # list · [id] detail · create
└── src/
    ├── api/                   # Axios client + data-access layer
    ├── auth/                  # Auth context and token storage
    ├── components/            # Reusable UI (buttons, inputs, badges, cards)
    ├── config.ts              # Backend URL configuration
    └── types/                 # TypeScript interfaces mirroring the API DTOs
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- The [RecAI backend API](#) running and reachable (see its README)
- One of:
  - An Android emulator (Android Studio), or
  - A physical device with the **Expo Go** app

## Getting started

1. **Clone and install dependencies**

   ```bash
   git clone <this-repo-url>
   cd recai-mobile
   npm install
   ```

2. **Configure the backend URL** (see [Configuration](#configuration) below).

3. **Start the backend** so the app has an API to talk to.

4. **Run the app**

   ```bash
   npx expo start
   ```

   Then press `a` to open on an Android emulator, or scan the QR code with Expo Go on a physical device.

## Configuration

The API base URL is set in `src/config.ts`. The correct host depends on where the app runs:

| Environment | Host to use |
| --- | --- |
| Android emulator | `10.0.2.2` (alias for the host machine's `localhost`) |
| iOS simulator | `localhost` |
| Physical device | Your computer's LAN IP (e.g. `192.168.1.x`) |

Update the port to match the one your backend listens on.

```ts
// src/config.ts
const HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";
export const API_BASE_URL = `http://${HOST}:5189/api`;
```

## Related

- **RecAI API** — the ASP.NET Core (.NET) backend with Clean Architecture, Entity Framework Core, PostgreSQL and JWT authentication: *(add link)*

## License

This project is for portfolio and educational purposes.
