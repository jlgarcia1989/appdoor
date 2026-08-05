---
description: Standards and best practices for technical documentation in this project, including documentation structure, update processes, and language rules.
globs: ["docs/**/*.md", "docs/**/*.yml"]
alwaysApply: true
---
# Rules and Patterns for Documentation and AI Specs

## Introduction
Technical documentation applies to all documentation relative to the project, such as the data model, development setup, API specs, and other Markdown files that describe how the project is structured and operated.
AI specs refers to the documents that explain to AI agents how to behave, document, plan, code, etc., which includes team agreements, standards, and conventions.

---

## General Rules
- **ALWAYS WRITE IN ENGLISH**: All code comments, Markdown documentation files, API specifications, and database model explanations must be written in English. This ensures multi-agent portability and standard code reviews.
- **Implementation-Ready**: Maintain docs with clear command-lines, exact file paths, and snippets so they are immediately actionable for AI coding agents.

---

## Technical Documentation Areas

### 1. Backend Documentation (C# / .NET)
- **XML Documentation Comments**: Use standard triple-slash `///` XML comments for all public classes, controller endpoints, and service methods. Define summary, parameters, and returns. E.g.:
  ```csharp
  /// <summary>
  /// Resolves user existence and profile type mapping by cellphone number.
  /// </summary>
  /// <param name="numeroCelular">The cellular telephone number to lookup.</param>
  /// <returns>A DTO containing user profiles and active driver state.</returns>
  ```
- **API Spec Synchronization**: Whenever a controller route parameter, payload DTO, or HTTP action changes, immediately update `docs/api-spec.yml` to preserve schema accuracy.

### 2. Database Schema (EF Core / SQL Server)
- **Data Model Docs**: Update `docs/data-model.md` immediately after adding new entities or modifying columns in `BackendDoor/Model/`.
- **Mermaid Diagrams**: Update the entity relationship diagram in `docs/data-model.md` to reflect new tables, keys, and relational cardinality.

### 3. Frontend Documentation (React Native)
- **Component Docs**: Include inline descriptions explaining component state boundaries, hooks usage, styling conventions, and custom prop specifications.
- **Props Validation**: Use TypeScript types/interfaces or JSDoc comments to document component input props to ensure strict type validation.

---

## AI Specs & Learning Cycle

This standard establishes a mandatory learning process for AI agents during user interactions:
- **Reactive Updates**: Learn from user feedback, preferences, and corrections to adjust guidelines.
- **Rule Adjustments**: Propose precise modifications to standard files in `docs/` or agent config profiles only after obtaining explicit user review and approval.
- **Pitfalls to Avoid**:
  - Direct code changes without updating corresponding specs.
  - Proposing unlinked rule changes that do not connect directly to user feedback.
  - Mixed language documents (e.g. Spanish summaries in English documentation files).