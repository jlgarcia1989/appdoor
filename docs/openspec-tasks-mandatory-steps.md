---
description: Enforce mandatory steps when creating tasks.md artifacts and ensure agent executes unit, API, and emulator verification tests
alwaysApply: true
---

# OpenSpec Tasks: Mandatory Steps Enforcement

When creating or updating `tasks.md` artifacts in OpenSpec changes, you MUST:

---

## 1. Structure Requirements

All implementation tasks MUST include these steps in the correct order:

### Step 0: Setup - Create Feature Branch (FIRST STEP)
- **Action**: Create and switch to a clean git branch.
- **Branch Naming**: `feature/[ticket-id]` or `feature/[change-name]`.

### Mandatory Execution Steps:
- **Step N**: Review and Update Existing Unit Tests (MANDATORY)
- **Step N+1**: Run Unit Tests and Verify Database State (MANDATORY)
- **Step N+2**: Manual Endpoint Testing with curl/Swagger (MANDATORY) - **AGENT MUST EXECUTE**
- **Step N+3**: UI Verification on Mobile Emulator/Simulator (MANDATORY) - **AGENT MUST EXECUTE**
- **Step N+4**: Update Technical Documentation (MANDATORY)

---

## 2. Testing Details & Agent Execution Requirements

**CRITICAL**: The coding agent (AI) MUST perform all testing steps itself. **NEVER delegate testing to the user**. These tests must be executed by the agent to mark tasks as completed.

### Step N+1: Run Unit Tests and Verify Database State (MANDATORY)

**Agent Responsibility**: The agent must run tests and verify that the database connection has not been mutated or broken.

**Implementation Steps**:
1. **Database Baseline**: Capture pre-test counts or key record states in SQL Server.
2. **Run C# and Jest Tests**:
   - Backend: `dotnet test` (if unit/integration tests are configured).
   - Frontend: `npm test` inside `FrontendDoor/`.
3. **Verify Post-Test State**: Re-run check on SQL Server. Restore data changes if test transactions did not auto-rollback.
4. **Create Verification Report**:
   - Save the test verification report under the current change folder: `specs/<change-name>/reports/YYYY-MM-DD-step-N+1-unit-test-and-db-verification.md`.
   - Report must list: commands run, tests count, status, pre/post database checks, and restoration actions.

---

### Step N+2: Manual Endpoint Testing with curl/Swagger (MANDATORY)

**Agent Responsibility**: The agent must boot the C# backend API and send test HTTP requests, checking returned statuses and schemas.

**Implementation Steps**:
1. **Boot API Server**: Run `dotnet run --project Api/Api.csproj` inside `BackendDoor/`.
2. **Send Test Requests**:
   - Perform queries using `curl` or automated HTTP requests.
   - For GET endpoints (e.g. `GET /api/Usuarios/ObtenerUsuario`): Verify response profiles.
   - For POST/PUT endpoints (e.g. `POST /api/Rutas/CrearRutaConductor`): Execute the request, verify success, and then clean up/delete test records in SQL Server to restore the database to its original state.
3. **Log Outcomes**: Record the exact commands, requests, and returned payloads.

---

### Step N+3: UI Verification on Mobile Emulator/Simulator (MANDATORY)

**Agent Responsibility**: Validate screen components, navigation transitions, and inputs on Android/iOS emulators.

**Implementation Steps**:
1. **Boot Packager**: Run `npm start` inside `FrontendDoor/`.
2. **Compile App**: Build on emulator via `npm run android` or `npm run ios`.
3. **Visual Inspections**: Verify component rendering, form validation error styling (Formik/Yup checks), modal overlays, map marker rendering, and drawer navigators.
4. **Data Link Checks**: Confirm inputs properly trigger service calls (e.g. check logs for API requests mapping to `API_ENDPOINT_DOOR`).
5. **Log Outcomes**: Document screens verified, actions taken, and log assertions.

---

### Step N+4: Update Technical Documentation (MANDATORY)
- Align any API change in `docs/api-spec.yml` or schema updates in `docs/data-model.md`.
