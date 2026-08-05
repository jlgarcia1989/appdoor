---
description: Backend development standards, best practices, and conventions for the Door C# .NET Web API application including EF Core, SOLID principles, architecture patterns, API design, and testing practices
globs: ["BackendDoor/**/*.cs", "BackendDoor/Api/appsettings.json", "BackendDoor/BackendDoor.sln"]
alwaysApply: true
---

# Backend Project Standards and Best Practices

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Entity Framework Core & Database Patterns](#entity-framework-core--database-patterns)
- [SOLID and DRY Principles in C#](#solid-and-dry-principles-in-c)
- [Coding & Style Standards](#coding--style-standards)
- [API Design Standards](#api-design-standards)
- [Testing Standards](#testing-standards)

---

## Overview

This document outlines the best practices, conventions, and standards used in the **Door** backend application. The backend is designed as an ASP.NET Core Web API that handles user profiles, driver document uploads, route listings, and booking reservations (including cargo shipments).

---

## Technology Stack

### Core Technologies
- **C# / .NET 8**: Strongly typed language and runtime framework.
- **ASP.NET Core Web API**: Framework for building RESTful HTTP services.
- **Entity Framework Core (EF Core)**: Object-Relational Mapper (ORM) for MSSQL database access.
- **AutoMapper**: DTO-to-entity and entity-to-DTO object mapping library.

### Database & Connections
- **Microsoft SQL Server (MSSQL)**: Relational database hosted externally (e.g. `doordb1.mssql.somee.com`) or locally for development.
- **EF Core SQL Server Provider**: Database provider configured via `.UseSqlServer()` in the DbContext lifecycle.
- **EF Core Migrations**: Database schema management and migration deployment.

### Tools & Libraries
- **Newtonsoft.Json** / **System.Text.Json**: JSON serialization/deserialization.
- **Swashbuckle.AspNetCore**: Swagger/OpenAPI documentation generation.

---

## Architecture Overview

The backend uses a controller-service-repository (data access) pattern to decouple HTTP handling, business orchestration, and database operations.

```
BackendDoor/
├── Api/                     # Presentation & Application Orchestration Layer
│   ├── Controllers/         # API Controllers handling HTTP Requests (UsuariosController, RutasController)
│   ├── Request/             # Data Transfer Objects (DTOs) representing request payloads
│   ├── ServicioUsuarios.cs  # Service encapsulating business logic for User & Document flows
│   ├── ServicioRutas.cs     # Service encapsulating business logic for Routes & Bookings
│   ├── MapperConfig.cs      # AutoMapper profile configurations
│   ├── Program.cs           # Application entrypoint & Dependency Injection setup
│   └── appsettings.json     # Configuration file (ConnectionStrings, base URLs)
└── Model/                   # Data Access & Entity Domain Layer
    ├── DataContext.cs       # Entity Framework DbContext
    ├── Migrations/          # EF Core database migrations
    └── [Entities].cs        # Database entities (Usuarios, RutasConductor, Encomiendas, etc.)
```

### Layer Responsibilities

1. **API / Controllers Layer (`Api/Controllers/`)**:
   - Classify routing attributes clearly using `[Route("api/[controller]")]` and `[ApiController]`.
   - Parse inputs, invoke service logic, and map request payloads to database models using AutoMapper.
   - Return appropriate `ActionResult` responses (e.g. `Ok()`, `BadRequest(message)`, `NotFound()`).

2. **Service Layer (`Api/` - `ServicioUsuarios.cs`, `ServicioRutas.cs`)**:
   - Execute core business logic (e.g. validation checks, transaction handling, coordinate mappings).
   - Read from and write to the database context.
   - Separate business calculations from the HTTP requests context (they receive the context `DataContext` and payloads).

3. **Data / Entity Layer (`Model/`)**:
   - Define tables, primary/foreign keys, and data-types using EF Core Attributes (`[Key]`, `[ForeignKey]`, `[DatabaseGenerated]`).
   - Manage schema alterations via Code-First EF Migrations.

---

## Entity Framework Core & Database Patterns

### DbContext Configuration (`DataContext.cs`)
- **ConnectionString Lifecycle**: In development, connection strings can be hardcoded inside `OnConfiguring` or read from `appsettings.json` via Configuration providers.
- **OnModelCreating Configuration**: Set up table constraints. For example, disable cascade deletes by default to ensure reference safety:
  ```csharp
  var cascadeFKs = modelBuilder.Model.GetEntityTypes()
      .SelectMany(t => t.GetForeignKeys())
      .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

  foreach (var fk in cascadeFKs)
      fk.DeleteBehavior = DeleteBehavior.Restrict;
  ```

### Database Transactions
- For operations modifying multiple tables (e.g. creating a driver route and inserting its locations, or saving driver documents alongside plate/license updates), use EF Core database transactions:
  ```csharp
  using (var transaction = context.Database.BeginTransaction())
  {
      try
      {
          // Database actions...
          context.SaveChanges();
          transaction.Commit();
      }
      catch (Exception)
      {
          transaction.Rollback();
          throw;
      }
  }
  ```

---

## SOLID and DRY Principles in C#

### 1. Single Responsibility Principle (SRP)
- **Controllers** should only handle HTTP routing, request parsing, and response status mapping.
- **Services** (e.g. `ServicioRutas`) should handle transactional business operations and data processing.
- **Entities** should represent clean database schemas with annotations for serialization only.

### 2. Dependency Inversion Principle (DIP)
- Inject controllers with services (`ServicioUsuarios`, `ServicioRutas`), the EF database context (`DataContext`), and config providers (`IConfiguration`) via constructor injection:
  ```csharp
  public UsuariosController(ServicioUsuarios usuarios, DataContext dtx, IMapper mapper, IConfiguration configuration)
  {
      _usuarios = usuarios;
      _dtx = dtx;
      _mapper = mapper;
      _config = configuration;
  }
  ```

### 3. DRY (Don't Repeat Yourself)
- Use mapping configurations (`MapperConfig.cs`) to avoid manually copying properties from DTOs to entities (e.g. mapping `UsuarioDto` to `Usuarios`).
- Consolidate file saving or database search filters in reusable methods.

---

## Coding & Style Standards

### C# Coding Conventions
- **Naming Style**:
  - Use **PascalCase** for namespaces, classes, methods, properties, and constants (e.g. `UsuariosController`, `ObtenerUsuario`, `IdUsuario`).
  - Use **camelCase** for parameters, local variables, and private read-only fields (e.g. `numeroCelular`, `dtx`, `mapper`).
- **Asynchronous Programming**:
  - Always use `async` / `await` for I/O operations (like database access or file handling) to prevent thread pool starvation.
  - Return `Task` or `Task<T>` from async methods.

### Exception & Error Handling
- Wrap controller actions in try-catch blocks to catch and handle processing exceptions.
- Return `BadRequest(ex.Message)` on execution failures, and descriptive JSON messages.
- Clean up server resources (e.g. delete uploaded local files if db transaction fails).

---

## API Design Standards

### REST Endpoints
- Endpoints are action-centric or resource-centric depending on use cases. E.g.:
  - `POST /api/Usuarios/CrearUsuario` - Registers a user.
  - `PUT /api/Usuarios/EditarUsuario` - Edits user profile.
  - `GET /api/Usuarios/ObtenerUsuario?numeroCelular={phone}` - Gets user details.
  - `POST /api/Rutas/CancelarReservaRuta` - Cancels booking.

### File & Form Uploads
- Use `[FromForm]` attribute to bind incoming multipart/form-data.
- Store documents (e.g. driver license images, profile pictures) under `wwwroot/Documentos` with UUID-based filenames to avoid conflicts:
  ```csharp
  string folder = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\Documentos");
  string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
  string fullPath = Path.Combine(folder, fileName);
  ```
- Save relative image paths or base URLs in the database to allow frontend fetching.

---

## Testing Standards

### Service & Controller Testing
- Maintain modular services so they can be unit-tested using mock database contexts.
- Use `Microsoft.EntityFrameworkCore.InMemory` or SQLite in-memory databases to run isolated integration tests for queries in `ServicioRutas` and `ServicioUsuarios`.
