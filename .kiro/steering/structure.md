# Project Structure

## Directory Organization

```
app/
├── assets/          # Static assets
│   ├── css/        # Global styles (tailwind.css, main.css)
│   └── images/     # Image assets
├── components/      # Vue components
│   ├── ui/         # shadcn-nuxt UI components
│   └── svg/        # SVG components
├── layouts/         # Layout components (default.vue, dashboard.vue)
├── lib/            # Utility functions (utils.ts with cn helper)
├── pages/          # File-based routing pages
├── plugins/        # Nuxt plugins
├── stores/         # Pinia stores for state management
├── types/          # TypeScript type definitions
└── app.vue         # Root application component

public/             # Public static files
├── images/         # Public images
├── favicon.ico
└── robots.txt

.nuxt/              # Generated Nuxt files (gitignored)
node_modules/       # Dependencies (gitignored)
```

## Key Conventions

### File Naming

- Vue components: PascalCase (e.g., `NavBar.vue`, `PageFooter.vue`)
- Pages: kebab-case or camelCase (e.g., `index.vue`, `dashboard.vue`)
- Types: camelCase with `.ts` extension (e.g., `user.ts`, `ad.ts`)
- Stores: camelCase with descriptive names (e.g., `userInfo.ts`, `appResourceInfo.ts`)

### Component Structure

- Use `<script setup lang="ts">` for all Vue components
- Composition API is the standard (no Options API)
- Auto-imports enabled for Vue composables (ref, computed, etc.)
- Auto-imports enabled for Nuxt composables (useRouter, navigateTo, etc.)

### Layouts

- `default.vue` - Standard layout with NavBar and PageFooter
- `dashboard.vue` - Admin dashboard layout
- Layouts wrap pages via `<NuxtLayout>` in `app.vue`

### Routing

- File-based routing via `app/pages/` directory
- Use `useRouter()` or `navigateTo()` for navigation
- No manual route configuration needed

### State Management

- Pinia stores in `app/stores/`
- Use `defineStore` with composition or options API
- Store naming: `use[Name]Store` (e.g., `useUserInfoStore`)

### Styling

- Tailwind utility classes preferred
- Custom CSS variables defined in `tailwind.css` for theming
- Dark mode support via `.dark` class
- Use `cn()` utility from `lib/utils.ts` for conditional classes
- Scoped styles in components when needed

### Types

- Centralized type definitions in `app/types/`
- Export interfaces for domain models (User, Ad, etc.)
- Use TypeScript for all new files

### Configuration

- Main config in `nuxt.config.ts`
- Module configuration inline
- Environment variables via `runtimeConfig.public`
- shadcn components configured with no prefix, stored in `app/components/ui`
