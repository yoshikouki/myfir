# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MyFir (初めての〜〜)** is an interactive learning platform for children aged 3-6, focusing on "first-time" experiences with various concepts and technologies.

### Target Audience
- **Primary**: Children aged 3-6 years
- **Secondary**: Parents/guardians (co-learning experience)

### Content Philosophy
- **Visual Learning**: Colorful, intuitive design with large, friendly UI elements
- **Progressive Learning**: Step-by-step content that builds understanding
- **Accessibility**: Child-friendly interfaces with simple interactions
- **Parent Guidance**: Features to help parents guide their children

### Current Content Series

#### 1. First PC Experience (`/pc`)
Located at `src/features/learn-pc-basics/`
- Introduces basic computer components
- Mouse and keyboard usage
- Screen navigation and basic operations
- Uses hiragana and simple kanji for text

### Development Notes
- Use child-friendly language (hiragana preferred)
- Large touch targets (minimum 44px)
- High contrast colors for visibility
- Sound feedback for interactions (when applicable)
- Error states should be encouraging, not punitive

## Common Development Commands

**Note: This project uses Bun as the package manager**

### Development & Build
- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build production application
- `bun run start` - Start production server

### Code Quality
- `bun run lint` - Run Biome linter (check only)
- `bun run format` - Format code with Biome (safe fixes)
- `bun run format:unsafe` - Format with unsafe fixes
- `bun run typecheck` - Run TypeScript type checking

### Testing
- `bun run test` - Run unit tests with Vitest
- `bun run test:watch` - Run tests in watch mode
- `bun run test:ui` - Run tests with Vitest UI
- `bun run test:coverage` - Run tests with coverage report
- `bun run test:e2e` - Run Playwright E2E tests
- `bun run test:e2e:ui` - Run E2E tests in interactive mode
- `bun run test:e2e:headed` - Run E2E tests in headed mode

### Maintenance
- `bun run update:all` - Update all dependencies to latest versions

## Architecture Overview

This is a Next.js 15 application using the App Router with TypeScript and modern tooling:

### Core Stack
- **Next.js 15** with App Router (`app/` directory structure)
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library (new-york style)
- **Bun** as package manager and runtime

### Development Tools
- **Biome** for linting and formatting
  - 96 character line width, double quotes
  - Unused imports/variables warnings with auto-fix
  - Sorted classes warning for Tailwind
- **Vitest** with React Testing Library for unit testing
- **Playwright** for E2E testing across browsers
- **Husky** for pre-commit hooks
- **Zod** for schema validation

### Architecture Pattern: Package by Features

The project follows a **Package by Features** (use-case based) pattern:

#### Feature Organization
- Each feature represents a distinct user goal
- Features are organized in `src/features/[use-case-name]/`
- No public API - direct imports allowed from features
- Naming convention: user-focused verb-object format (e.g., `learn-pc-basics`)

#### Feature Structure
```
src/features/[use-case-name]/
├── components/      # UI components
├── hooks/          # Custom hooks
├── api/            # API communication
├── utils/          # Utility functions
└── types.ts        # Type definitions
```

#### Current Features
- `learn-pc-basics/` - First PC experience tutorial

### Data Management Strategy

#### Data Fetching
1. **Server-First Approach**: Use React Server Components (RSC) for data fetching
2. **Client-Side When Needed**: Use Server Actions for user interactions
3. **Dependency Injection**: Props-based injection preferred, Context only when necessary

#### State Management
- Each feature maintains independent state
- Shared state requires separate feature (e.g., `user-context/`)
- Server Actions and fetch treated as external dependencies

### Project Structure
- `app/` - Next.js App Router pages and layouts
- `src/features/` - Feature-based organization
- `src/components/` - Shared UI components
- `lib/` - Utility functions
- `e2e/` - Playwright E2E tests

### Path Aliases
- `@/*` maps to root directory
- Components: `@/components`
- Utils: `@/lib/utils`
- UI components: `@/components/ui`

### Testing Configuration
- Unit tests use jsdom environment with setup in `src/test/setup.ts`
- Test files: `src/**/*.{test,spec}.{js,ts,tsx}`
- Coverage includes `src/**/*.{ts,tsx}` excluding test files and configs

### CI/CD
- GitHub Actions for automated testing on push/PR to main
- Weekly dependency updates via automated workflow
- Pre-commit hooks enforce code quality