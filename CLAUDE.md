# RENT Frontend — Claude Code Instructions

## 1. Project Overview

RENT is a property rental-management platform designed to digitalize and centralize the administrative, financial, contractual and communication processes associated with rental properties.

The frontend is a **React Native application built with Expo and Expo Router**.

The application allows users to:

* Authenticate and manage their account.
* Register and manage properties.
* Manage property members and their roles.
* Manage contracts and contract drafts.
* Consult financial information and reports.
* Manage property-related services.
* Consult public services.
* Receive notifications.
* Interact with backend services according to their permissions and property relationships.

The frontend communicates with the RENT backend through HTTP APIs and other supported communication mechanisms.

---

# 2. Core Technology Stack

Use the technologies already established in the repository.

* React Native
* Expo
* Expo Router
* TypeScript
* TanStack Query
* Zustand
* Zod
* React Native SVG support
* Socket.IO where already implemented
* Cloudinary for image/resource uploads where applicable
* pnpm

Do not introduce a new library when the existing stack already provides an appropriate solution.

Before adding a dependency, verify whether the current project already has a solution for the problem.

---

# 3. Main Architecture

The project follows a separation between:

```text
app/
    Expo Router routes

features/
    Business/domain features

components/
    Shared reusable UI components

core/
    Application infrastructure

stores/
    Global state

hooks/
    Shared hooks

themes/
    Design tokens/theme

constants/
    Shared constants

types/
    Shared TypeScript types

assets/
    Fonts, icons, images and visual resources
```

### Important distinction

`app/` is primarily responsible for **routing and connecting routes to feature screens**.

Business logic should generally live under `features/`.

Do not place substantial business logic directly inside route files unless the existing implementation clearly requires it.

---

# 4. Feature-Based Organization

Features currently include:

```text
features/
├── auth/
├── contract/
├── finance-reports/
├── properties-services/
├── property-registration/
└── public-services/
```

When implementing functionality belonging to an existing domain, place it inside the corresponding feature.

For example:

```text
features/property-registration/
```

should contain property-registration related:

* API functions
* response types
* schemas
* services
* stores
* screens
* components
* tests
* domain-specific types

Avoid putting feature-specific logic into global folders.

---

# 5. Routing

The application uses Expo Router.

Routes are located under:

```text
app/
```

Examples:

```text
app/auth/
app/contracts/
app/home/
app/property/
app/property-member/
```

When adding a screen:

1. Determine whether the screen belongs to an existing route.
2. Check the corresponding feature implementation.
3. Reuse an existing feature screen when appropriate.
4. Keep route files thin.
5. Use Expo Router's existing navigation patterns.

Do not introduce a second navigation architecture.

Prefer existing patterns such as:

```ts
router.push(...)
router.navigate(...)
```

and route parameters through Expo Router.

---

# 6. Data Fetching

The project uses **TanStack Query** for server state.

Prefer:

```ts
useQuery(...)
useMutation(...)
```

for server data rather than duplicating server state in Zustand or local state.

A typical query should follow the existing project pattern:

```ts
const { isLoading, data, isError } = useQuery({
  queryKey: ["properties"],
  queryFn: () => GetAllProperties(...),
  staleTime: ...,
});
```

### Rules

* Query keys must be stable and meaningful.
* Do not duplicate API state unnecessarily.
* Do not manually recreate caching logic that TanStack Query already provides.
* Use mutations for create/update/delete operations.
* Invalidate or update relevant queries after mutations.
* Respect the existing API abstraction.
* Do not put raw HTTP requests directly inside presentation components when an existing API/service layer exists.

---

# 7. API Layer

API communication should remain separated from UI components.

The project already contains patterns such as:

```text
core/api/
features/*/api.ts
features/*/services/
```

Before creating a new API function:

1. Search for an existing endpoint.
2. Search `core/api/api-endpoints.ts`.
3. Search `core/api/api-config.ts`.
4. Search the relevant feature's `api.ts`.
5. Reuse existing request/response abstractions when possible.

Do not duplicate endpoint definitions.

Do not hardcode backend URLs inside components.

Environment-dependent configuration belongs in the existing configuration/environment system.

---

# 8. Authentication

Authentication is a core application concern.

Relevant areas include:

```text
features/auth/
core/schemas/auth-schema.ts
stores/auth-store.ts
core/api/
app/auth/
```

The application currently supports authentication flows including:

* Login
* Registration
* Email verification
* OAuth callback
* Current-user retrieval
* Authentication persistence

Authentication state must not be duplicated across multiple independent stores/providers.

Before modifying authentication:

1. Inspect `AuthProvider`.
2. Inspect `auth-store`.
3. Inspect `auth.service`.
4. Inspect `InfoStorage` and existing persistence mechanisms.
5. Inspect the current route protection/navigation flow.

Do not change authentication architecture casually.

---

# 9. Authorization and Permissions

RENT is permission-driven.

A user may have different capabilities depending on:

* User role
* Property membership
* Property relationship
* Assigned policies
* Explicit permission overrides

The frontend must never assume that because a user can see a screen, they can perform every action within it.

UI actions should respect the permissions returned by the backend/application state.

Examples:

* Edit property
* Delete property
* Manage members
* Manage roles
* View contracts
* Edit contract drafts
* Generate contract drafts
* View financial information

### Important

Frontend authorization is primarily a **UX/access-control layer**.

It is not the ultimate security boundary.

The backend remains responsible for enforcing authorization.

Never remove backend authorization because a frontend check exists.

---

# 10. Contracts

Contracts are a major domain of RENT.

Relevant structure:

```text
features/contract/
app/contracts/
```

The contract feature includes:

* Contract lists
* Contract details
* Contract drafts
* Contract generation
* Contract preview
* Contract actions
* Contract schemas
* Contract API integration

Contract drafts can contain editable and non-editable information.

When modifying contract editors or previews:

* Preserve the existing contract domain model.
* Do not silently modify immutable/template information.
* Respect the existing versioning model.
* Keep landlord/tenant agreement state consistent with backend semantics.
* Do not duplicate contract business rules inside visual components.

If a business rule is unclear, inspect the backend contract implementation before inventing frontend behavior.

---

# 11. Property Management

Property management is another central domain.

Relevant structure:

```text
features/property-registration/
app/property/
app/property-member/
```

Existing concepts include:

* Property registration
* Property details
* Property editing
* Property members
* Member roles
* Property associations
* Invitations
* QR/scan flows
* Property resources

Before implementing property functionality, inspect the existing:

```text
api.ts
schemas/
services/
stores/
types.ts
components/
screens/
```

Do not create a parallel property-management abstraction.

---

# 12. State Management

The project uses both **TanStack Query** and **Zustand**, but they serve different purposes.

### TanStack Query

Use for:

* Server state
* API responses
* Cached backend data
* Loading/error states
* Mutations

### Zustand

Use for:

* Client/application state
* UI state
* Persistent local state where already established
* Cross-screen state that does not belong to server cache

Existing stores include:

```text
stores/auth-store.ts
stores/global-store.ts

features/property-registration/stores/property.store.ts
```

Do not move server state into Zustand merely because it is convenient.

Do not create a Zustand store for every screen.

---

# 13. Forms and Validation

Use the existing Zod schemas when validating structured data.

Existing schemas include:

```text
core/schemas/
features/*/schemas/
```

Before creating validation logic:

1. Search for an existing schema.
2. Reuse it if applicable.
3. Extend it only when necessary.
4. Avoid duplicating the same validation rules in multiple components.

Validation should happen as close as practical to the data boundary.

---

# 14. RENT Visual Design System

The visual identity of RENT is extremely important.

The application should feel:

* Modern
* Clean
* Professional
* Minimalist
* Elegant
* Calm
* Functional
* Reliable
* Productivity-oriented

The design must prioritize:

1. Clarity
2. Hierarchy
3. Readability
4. Consistency
5. Usability

Avoid visual complexity for its own sake.

---

# 15. Visual Style Rules

The current RENT design uses a restrained visual language.

Typical characteristics include:

* White/light backgrounds
* Dark neutral typography
* Soft gray borders
* Moderate rounded corners
* Controlled spacing
* Subtle shadows
* Simple icons
* Clear section titles
* Compact action buttons
* Horizontal filters
* Clean cards
* Generous but controlled whitespace

Existing examples include:

```tsx
backgroundColor: "#FFFFFF"
color: "#111827"
color: "#475569"
borderBottomColor: "#E9EEF5"
```

These are examples of the current visual direction, not values that must be copied blindly everywhere.

Use the existing:

```text
themes/themes.ts
```

and shared components whenever possible.

---

# 16. Avoid These Visual Patterns

Do NOT introduce:

* Excessive gradients
* Neon colors
* Cyberpunk aesthetics
* Gamer-style UI
* Excessive glassmorphism
* Huge shadows
* Excessive rounded containers
* Decorative UI without purpose
* Excessive animations
* Overly colorful dashboards
* Generic SaaS landing-page aesthetics
* Web-dashboard layouts forced into mobile screens
* Excessive cards nested inside cards
* Visual noise

RENT should look like a serious property-management application.

---

# 17. Reuse Existing Components

Before creating a component, search the repository.

Existing shared components include:

```text
components/
├── ai.tsx
├── aside.tsx
├── buttons/
├── error.tsx
├── header.tsx
├── info.tsx
├── inputs/
├── property-card.tsx
├── selects/
└── splash-screen.tsx
```

Examples of existing reusable patterns:

```tsx
<AIButton />
<FilterButton />
<PrincipalError />
<SearchInput />
<PropertyCard />
<ContentAside />
<EmptyList />
<RentHeader />
<RentDescription />
<SplashScreen />
<SplashWaveBackground />
```

### Rule

If an existing component solves approximately the same UI problem, **reuse or extend it before creating another component**.

Do not create:

```text
NewHeader.tsx
CustomHeader.tsx
PropertyHeader.tsx
AnotherEmptyList.tsx
NewButton.tsx
```

just because a slightly different screen needs it.

First determine whether the existing component can support the requirement.

---

# 18. Component Design

Components should have a clear responsibility.

Prefer:

```text
Screen
 ├── feature components
 │    ├── domain components
 │    └── UI components
 └── shared components
```

Avoid giant components containing:

* API calls
* business logic
* navigation
* state management
* validation
* complicated rendering
* styling

all in one file.

However, do not over-engineer simple screens.

The goal is **appropriate separation**, not maximum abstraction.

---

# 19. Styling

The current project primarily uses:

```tsx
StyleSheet.create(...)
```

Prefer this existing pattern.

Example:

```tsx
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
```

Avoid introducing a new styling system without a strong reason.

Do not mix several styling paradigms unnecessarily.

Prefer named styles over excessive inline styling.

Inline styles are acceptable for genuinely dynamic values.

---

# 20. Typography

RENT uses a clean and readable typographic hierarchy.

Typical hierarchy:

```text
Page title
    22px / strong weight

Section title
    16–20px / semibold-bold

Body
    14–16px

Secondary text
    12–14px
```

These are guidelines, not absolute requirements.

Use the existing project font/assets and theme where appropriate.

Avoid using many different font sizes or weights on the same screen.

---

# 21. Spacing and Layout

Prefer consistent spacing.

Common existing patterns include:

```text
paddingHorizontal: 20
gap: 8
gap: 12
marginTop: 8
paddingTop: 12
paddingBottom: 32
```

Do not randomly introduce dozens of spacing values.

When creating a new screen, inspect nearby screens first and follow their spacing rhythm.

---

# 22. Buttons and Interactions

Buttons should have a clear purpose.

The current design uses subtle interaction feedback such as:

```tsx
pressed && styles.buttonPressed
```

with patterns such as:

```tsx
transform: [{ scale: 0.94 }]
opacity: 0.8
```

Use restrained interaction feedback.

Do not add animations simply because they are possible.

Interactions should communicate:

* Pressed state
* Loading state
* Disabled state
* Success/error where appropriate

---

# 23. Loading, Error and Empty States

Every API-driven screen should intentionally handle:

### Loading

Use the existing:

```tsx
<SplashScreen />
```

or the appropriate project loading component.

### Error

Use:

```tsx
<PrincipalError />
```

when appropriate.

### Empty state

Use:

```tsx
<EmptyList />
```

or an appropriate existing empty-state component.

Do not leave users with:

```tsx
return null;
```

when the application can provide a meaningful state.

---

# 24. Lists

For large or potentially growing datasets, use the existing React Native list patterns such as:

```tsx
FlatList
```

Consider:

* Stable `keyExtractor`
* Pagination
* Loading states
* Empty states
* Error states
* Appropriate separators
* `showsVerticalScrollIndicator`
* `contentContainerStyle`

Avoid rendering large collections using `.map()` inside a `ScrollView` unless the dataset is known to be small.

---

# 25. Images and Assets

Assets are located under:

```text
assets/
```

Existing assets include:

```text
assets/icons/
assets/images/
assets/backgrounds/
assets/fonts/
```

Prefer existing icons/assets.

Do not introduce a new icon library merely because an existing asset is inconvenient.

Before adding an asset:

1. Search the existing assets.
2. Search for an existing SVG/icon that performs the same role.
3. Reuse it when possible.

---

# 26. Dark Mode / Themes

If dark mode is implemented or expanded, it must be introduced consistently across the application.

Do not implement dark mode screen-by-screen with random colors.

Use:

```text
themes/
```

as the central place for theme tokens.

Components should consume theme values rather than hardcoding incompatible colors everywhere.

When modifying an existing screen, preserve compatibility with the established theme architecture.

---

# 27. Environment Variables

Environment configuration belongs in:

```text
core/env.ts
```

Do not hardcode:

* API URLs
* credentials
* tokens
* secrets
* Cloudinary credentials
* environment-specific configuration

inside components.

Never commit secrets.

---

# 28. Security

Never expose sensitive information in:

* UI
* logs
* source code
* committed configuration
* API responses unnecessarily

Never store sensitive credentials in plain text when the existing authentication architecture provides a secure mechanism.

Do not bypass authentication or authorization to make a feature work.

Do not trust user-provided IDs without backend authorization.

---

# 29. Performance

Avoid unnecessary re-renders and unnecessary network requests.

Before optimizing:

1. Identify the actual bottleneck.
2. Check whether TanStack Query is already solving the problem.
3. Check whether a component is unnecessarily re-rendering.
4. Check whether lists are properly implemented.
5. Check whether expensive calculations are actually necessary.

Do not blindly add:

```ts
useMemo
useCallback
memo
```

everywhere.

Optimization should solve a demonstrated problem.

---

# 30. Navigation and Screen Responsibility

A route should generally connect navigation to a feature screen.

For example:

```text
app/property/property-registration/[id].tsx
        ↓
features/property-registration/screens/details.tsx
```

Prefer keeping business logic in:

```text
features/
```

rather than directly inside:

```text
app/
```

---

# 31. Testing

Tests are located inside feature areas and/or the project test directories.

Existing examples:

```text
features/auth/test/
features/contract/test/
features/property-registration/test/
test/
```

When modifying non-trivial business behavior:

* Search for existing tests.
* Update affected tests.
* Add tests for important new behavior.
* Do not remove tests merely because implementation changed.

Prioritize testing:

* Authentication
* API behavior
* Validation
* Permission-sensitive behavior
* Contract logic
* Property management
* Important transformations

---

# 32. TypeScript

Use TypeScript strictly.

Prefer explicit domain types where they improve clarity.

Avoid:

```ts
any
```

unless there is a justified reason.

Do not silence TypeScript errors with:

```ts
as any
```

just to make the build pass.

Prefer fixing the actual type mismatch.

Reuse existing types from:

```text
types/
features/*/types.ts
```

rather than creating duplicate representations.

---

# 33. Error Handling

Errors should be handled intentionally.

Do not expose raw backend errors directly to users if they are technical or inappropriate.

Prefer existing error components and application patterns.

Distinguish between:

* Validation errors
* Authentication errors
* Authorization errors
* Network errors
* Backend/server errors
* Empty results

User-facing messages should be clear and understandable.

---

# 34. API Response Handling

Do not assume an API response shape.

Inspect:

```text
api.response.ts
types.ts
schemas/
```

and the backend contract when necessary.

If a backend endpoint changes, update the corresponding frontend types/API layer rather than spreading response transformations across multiple components.

---

# 35. Backend-Frontend Contract

The frontend and backend are separate systems.

When implementing a feature that depends on backend behavior:

1. Inspect the frontend API implementation.
2. Inspect response types/schemas.
3. If behavior is unclear, inspect the backend implementation.
4. Do not invent backend fields.
5. Do not silently transform business semantics.

The backend is the source of truth for:

* Authorization
* Financial calculations
* Contract rules
* Property relationships
* Role policies
* Persistent state

The frontend is responsible for presenting and interacting with those rules.

---

# 36. Financial Information

Financial screens require additional care.

Relevant area:

```text
features/finance-reports/
```

Financial values must not be casually formatted or calculated in multiple places.

Before implementing financial UI:

* Determine the backend response format.
* Determine whether values are integers, decimals or strings.
* Determine currency conventions.
* Reuse existing formatting utilities if available.
* Do not invent financial calculations in presentation components.

The frontend should primarily present financial calculations produced by the backend unless a purely visual calculation is required.

---

# 37. Public Services

Public-service functionality belongs under:

```text
features/public-services/
```

and related application routes.

Do not mix public-service logic with property or contract components unless the domain requires it.

External utility providers/APIs should be accessed through the appropriate service/API layer.

---

# 38. Notifications

Notification functionality should respect the existing application architecture.

Relevant areas include frontend notification UI/state and backend notification/WebSocket infrastructure.

Do not create a second notification mechanism without first inspecting the existing implementation.

If Socket.IO behavior is modified:

1. Inspect the existing client connection.
2. Inspect authentication/token handling.
3. Inspect namespace/path configuration.
4. Verify compatibility with the backend gateway.
5. Test connection/disconnection/error behavior.

---

# 39. AI Features

The project contains AI-related UI:

```text
components/ai.tsx
assets/icons/ai.svg
```

AI functionality must remain visually consistent with the rest of RENT.

Do not allow AI UI to turn the application into a futuristic/chatbot-heavy interface.

AI should feel like a productivity feature integrated into the existing product.

---

# 40. Before Modifying Code

Always follow this process:

### Step 1 — Understand

Identify:

* Which feature owns the behavior?
* Which screen is involved?
* Which API is involved?
* Which state is involved?
* Which permissions are involved?
* Which existing components are relevant?

### Step 2 — Search

Search the repository before creating anything.

Look for:

* Existing components
* Existing API methods
* Existing schemas
* Existing types
* Existing stores
* Existing hooks
* Existing styling patterns
* Existing tests

### Step 3 — Plan

Choose the smallest set of files required.

### Step 4 — Implement

Make the smallest coherent change.

### Step 5 — Validate

Run the relevant:

* TypeScript checks
* ESLint
* Tests
* Expo/build validation when applicable

### Step 6 — Review

Check:

* Does it follow the architecture?
* Does it reuse existing components?
* Does it follow RENT's visual system?
* Did it introduce unnecessary dependencies?
* Did it duplicate logic?
* Did it break permissions?
* Did it introduce unnecessary state?

---

# 41. Minimal Change Principle

Do not refactor unrelated code while implementing a feature.

If the task is:

> Add a delete-property button.

Do not automatically:

* Rewrite the property feature.
* Replace Zustand.
* Replace TanStack Query.
* Redesign all property cards.
* Rename unrelated files.
* Introduce a new UI library.

Only make broader changes when they are required for correctness or explicitly requested.

---

# 42. Do Not Guess

If important information is missing, inspect the repository first.

Examples:

Instead of guessing an API endpoint:

```text
Search api-endpoints.ts and feature api.ts.
```

Instead of guessing a permission:

```text
Inspect existing permission/policy implementation.
```

Instead of guessing a response:

```text
Inspect api.response.ts / types / backend.
```

Instead of creating a new component:

```text
Search components/ and the current feature first.
```

Instead of guessing the design:

```text
Inspect themes/ and nearby screens.
```

---

# 43. Source of Truth Priority

When information conflicts, use this priority:

1. Actual source code
2. Backend API/domain behavior
3. Existing schemas/types
4. Existing tests
5. Existing documentation
6. `CLAUDE.md`
7. Assumptions

Do not preserve a documented behavior if the actual implementation clearly differs unless the task is specifically to restore the documented behavior.

---

# 44. Important Repository Boundaries

Avoid reading or modifying generated/dependency directories unless explicitly necessary.

In particular, do not unnecessarily inspect:

```text
node_modules/
dist/
```

Prefer:

```text
app/
components/
core/
features/
hooks/
stores/
themes/
types/
constants/
```

and relevant configuration files.

Generated files should generally not be manually edited.

---

# 45. Code Quality Principles

Prefer code that is:

* Simple
* Readable
* Typed
* Testable
* Reusable where appropriate
* Consistent with the existing project
* Easy for another developer to understand

Avoid:

* Clever abstractions
* Premature optimization
* Massive components
* Duplicate API logic
* Duplicate state
* Unnecessary dependencies
* Unnecessary abstractions
* Unrelated refactors

The best implementation is usually the smallest implementation that fits the existing architecture correctly.

---

# 46. UI Quality Checklist

Before considering a screen complete, verify:

* [ ] Correct safe-area handling
* [ ] Correct loading state
* [ ] Correct error state
* [ ] Correct empty state
* [ ] Correct navigation
* [ ] Correct permissions
* [ ] Correct API integration
* [ ] Correct spacing
* [ ] Consistent typography
* [ ] Consistent colors
* [ ] Existing icons/components reused
* [ ] Pressed/disabled states handled
* [ ] Long text does not break layout
* [ ] Lists use stable keys
* [ ] No unnecessary visual decoration
* [ ] UI feels consistent with existing RENT screens

---

# 47. General Rule for Claude

When working on RENT frontend:

> **Do not build a new system when the repository already has one.**

First understand the existing architecture.

Then reuse it.

Then extend it only when necessary.

The objective is not to produce the most sophisticated code possible.

The objective is to produce code that feels like it was written by the same team that built the rest of RENT.

The frontend should remain:

**clean, consistent, predictable, professional and maintainable.**
