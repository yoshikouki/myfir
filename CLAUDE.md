# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development & Build
- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build production application
- `bun run start` - Start production server

### Code Quality
- `bun run lint` - Run Biome linter
- `bun run format` - Format code with Biome
- `bun run typecheck` - Run TypeScript type checking

### Testing
- `bun run test` - Run unit tests with Vitest
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Run tests with coverage report
- `bun run test:e2e` - Run Playwright E2E tests
- `bun run test:e2e:ui` - Run E2E tests in interactive mode

## Architecture Overview

This is a Next.js 15 application using the App Router with TypeScript and modern tooling:

### Core Stack
- **Next.js 15** with App Router (`app/` directory structure)
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library (new-york style)

### Development Tools
- **Biome** for linting and formatting (96 character line width, double quotes)
- **Vitest** with React Testing Library for unit testing
- **Playwright** for E2E testing across browsers
- **Husky** for pre-commit hooks

### Project Structure
- `app/` - Next.js App Router pages and layouts
- `src/components/` - React components with co-located tests
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