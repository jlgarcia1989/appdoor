---
description: This document contains all development rules and guidelines for the Door project, applicable to all AI agents (Claude, Cursor, Codex, Gemini, etc.).
alwaysApply: true
---

## 1. Core Principles

- **Small tasks, one at a time**: Always work in baby steps, one at a time. Never go forward more than one step.
- **Type Safety**: All backend code (C#) must be strongly typed. Frontend React Native code should use TypeScript types and interfaces wherever applicable.
- **Clear Naming**: Use clear, descriptive names for all variables, classes, methods, and functions.
- **Incremental Changes**: Prefer incremental, focused changes over large, complex modifications.
- **Question Assumptions**: Always question assumptions and inferences about user/driver roles, routing states, and booking constraints.
- **Pattern Detection**: Detect and highlight repeated code patterns in controllers, services, and mobile components.

## 2. Language Standards
- **English Only**: All technical artifacts must always use English, including:
    - Code (variables, functions, classes, comments, error messages, log messages)
    - Documentation (README, guides, API docs)
    - Data schemas and database names (though some existing database fields/tables use Spanish naming like `Usuarios`, `RutasConductor`, etc., any *new* code, variables, and explanations should be written in English)
    - Configuration files and scripts
    - Git commit messages
    - Test names and descriptions

## 3. Specific standards

For detailed standards and guidelines specific to different areas of the project, refer to:

- [Backend Standards](./backend-standards.md) - API development, Entity Framework Core (EF Core) patterns, SQL Server database connections, C# coding conventions, and backend best practices.
- [Frontend Standards](./frontend-standards.md) - React Native navigation, form handling with Formik/Yup, design themes, components, and mobile-specific architecture.
- [Documentation Standards](./documentation-standards.md) - Technical documentation structure, OpenAPI/Swagger specifications, XML code documentation, and maintenance guidelines.
- [OpenSpec Tasks Mandatory Steps](./openspec-tasks-mandatory-steps.md) - Required checklist and execution rules when creating or updating OpenSpec `tasks.md` files.

## 4. Project Structure Overview

The project consists of two main components:
- **BackendDoor**: C# .NET 8 Web API project.
  - `Api/`: Contains controllers, services, DTO requests, and API configurations.
  - `Model/`: Contains the database models, migrations, and Entity Framework DbContext (`DataContext.cs`).
- **FrontendDoor**: React Native application for Android and iOS.
  - `src/`: Main source folder containing pages, services, custom components, utility functions, hooks, and API integrations.

## 5. Planning Model Requirement

Planning workflows must run with high reasoning models.
This requirement applies to:
- `enrich-us`
- `openspec-ff-change`
- `openspec-continue-change`

## 6. Symlink Integrity and Multi-Agent Portability

- **Canonical Source**: Keep reusable artifacts in `ai-specs` as the canonical source. Agent-specific paths (such as `.claude` and `.cursor`) should reference them through symlinks when possible.
- **Update Safety**: Whenever a file is renamed, moved, or its suffix changes, verify and update all symlinks that target it before considering the change complete.
- **Completion Gate**: A change is incomplete if it leaves broken symlinks, stale targets, or duplicated canonical artifacts across agent-specific folders.

## 7. Mandatory OpenSpec Artifact Updates for Post-Apply Changes

When a new fix/change request appears after `opsx:apply` (or `/apply`) and before `opsx:archive` (or `/archive`), agents must treat it as a spec update first, not as an informal "fix this quickly".

Required order:
1. Update the current OpenSpec change artifacts that are affected (e.g. scenarios, requirements/specs, and `tasks.md`).
2. If artifact regeneration is needed, run the corresponding OpenSpec step (`opsx:continue`, `opsx:ff`, or equivalent) before coding.
3. Implement code only after artifacts reflect the new request.
4. Re-run verification against the updated artifacts before archiving.
