# Tech Stack

## Framework & Core

- **Nuxt 4.2.0** - Vue.js meta-framework with SSR/SSG capabilities
- **Vue 3.5.22** - Composition API with `<script setup>` syntax
- **TypeScript 5.9.3** - Type-safe development
- **Pinia** - State management (preferred over Vuex)

## UI & Styling

- **Tailwind CSS 4.1.16** - Utility-first CSS framework with custom theme
- **shadcn-nuxt** - Component library (components in `app/components/ui`)
- **Reka UI** - Headless UI components
- **Lucide Vue Next** - Icon library
- **@nuxt/icon** - Icon management
- **@nuxt/fonts** - Font optimization
- **class-variance-authority** - Component variant management
- **tw-animate-css** - Tailwind animations

## Additional Libraries

- **@tanstack/vue-table** - Table/data grid functionality
- **@vueuse/core** - Vue composition utilities
- **@nuxt/image** - Image optimization
- **@nuxt/scripts** - Script loading optimization

## Development Tools

- **ESLint** - Code linting with @nuxt/eslint
- **pnpm** - Package manager (preferred)

## Build System

Nuxt uses Vite as the build tool with Tailwind CSS Vite plugin.

## Common Commands

```bash
# Development
pnpm dev              # Start dev server on http://localhost:3006

# Building
pnpm build            # Build for production
pnpm generate         # Generate static site
pnpm preview          # Preview production build

# Setup
pnpm install          # Install dependencies
pnpm postinstall      # Runs automatically after install (nuxt prepare)
```

## Environment Configuration

- Dev server runs on port **3006** (not default 3000)
- Environment variables configured via `.env` file
- Runtime config uses `DEV_ADMIN_API_URL` and `DEV_API_URL`
