# Development Guide

This guide provides step-by-step instructions for setting up the development environment and running both the backend and frontend systems for the **Door** application.

---

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **.NET SDK 8.0**
- **MS SQL Server** (or access to the external SQL Server db)
- **Android Studio** & **Android SDK** (for Android emulator)
- **Xcode** & **CocoaPods** (Mac only, for iOS simulator)
- **Git**

---

## 🚀 Setup Instructions

### 1. Repository Structure

The workspace contains two primary project folders:
- **BackendDoor**: C# Web API solution.
- **FrontendDoor**: React Native mobile app.

---

### 2. Backend Setup (ASP.NET Core & SQL Server)

#### Environment Configuration
1. Open the solution in Visual Studio, Rider, or VS Code.
2. Open `BackendDoor/Api/appsettings.json` and review the database connection details:
   ```json
   "ConnectionStrings": {
     "DoorConnectionString": "workstation id=doordb1.mssql.somee.com;packet size=4096;user id=vrcdev_SQLLogin_1;pwd=imr1y2j85j;data source=doordb1.mssql.somee.com;persist security info=False;initial catalog=doordb1;TrustServerCertificate=True"
   }
   ```
   *Note: Modify the connection string to target your local SQL Server instance if performing offline development.*

#### Building and Running the API
1. Navigate to the `BackendDoor` directory:
   ```bash
   cd BackendDoor
   ```
2. Restore NuGet dependencies:
   ```bash
   dotnet restore
   ```
3. Run the migrations to update the database schema:
   ```bash
   dotnet ef database update --project Model/Model.csproj --startup-project Api/Api.csproj
   ```
4. Run the Web API:
   ```bash
   dotnet run --project Api/Api.csproj
   ```
    The backend API will start and display the listening URLs (usually `http://localhost:5278` or `https://localhost:7171`).
5. Open `http://localhost:5278/swagger` (or the corresponding port) in your browser to view the OpenAPI interactive Swagger documentation.

---

### 3. Frontend Setup (React Native)

#### Environment Configuration
1. Navigate to the `FrontendDoor` directory:
   ```bash
   cd FrontendDoor
   ```
2. Create or verify the `.env` file in the root of the `FrontendDoor` folder. Specify the correct backend API endpoint:
   ```env
   API_ENDPOINT_DOOR=http://10.0.2.2:5278/api
   ```
   *Note: On Android Emulators, `10.0.2.2` acts as a loopback mapping to your host machine's `localhost`. If testing on a physical device, replace this with your computer's local network IP address (e.g. `http://192.168.1.50:5278/api`).*

#### Installing Dependencies
1. Install Node modules:
   ```bash
   npm install
   ```
2. (iOS only) Install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

#### Running the Application
1. Start the Metro bundler:
   ```bash
   npm start
   ```
2. In a separate terminal terminal or via the Metro CLI options, run the app on your target platform:
   - **Android**:
     ```bash
     npm run android
     ```
   - **iOS**:
     ```bash
     npm run ios
     ```

---

## 🧪 Testing

### Backend Endpoint Testing
- Use the built-in **Swagger UI** (`http://localhost:5278/swagger`) to send requests directly from your browser to verify API actions.
- Use tools like Postman or `curl` to test controllers manually.

### Frontend Testing
- **Unit Testing**: Run unit/component tests configured in Jest:
  ```bash
  cd FrontendDoor
  npm test
  ```
- **Linter**: Check for formatting and syntax warnings using ESLint:
  ```bash
  npm run lint
  ```
