<div align="center">
  <a href="https://nelsonlai.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="apps/web/public/images/dark-header.png">
      <img alt="Project Cover" src="apps/web/public/images/light-header.png">
    </picture>
  </a>

  <h1 align="center">
    nelsonlai.dev
  </h1>

  <img src="https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=Next.js&labelColor=000" alt="Framework" />
  <img src="https://img.shields.io/github/languages/top/nelsonlaidev/nelsonlai.dev?style=for-the-badge&labelColor=000" alt="Language" />
  <img src="https://img.shields.io/github/license/nelsonlaidev/nelsonlai.dev?style=for-the-badge&labelColor=000" alt="License" />
</div>

Welcome to the monorepo of my personal blog! This repository houses the code for my blog, where I share my thoughts, projects, and insights. Feel free to explore and get inspired.

## Features

### Core Technologies

- Next.js 15 with App Router
- TypeScript with strict configuration
- Tailwind CSS for styling
- MDX for content
- Drizzle ORM
- I18n for internationalization support

### UI/UX

- Radix UI for accessible UI components
- Responsive design
- Light/Dark mode
- Image zoom in blog posts
- Shiki for code syntax highlighting
- Motion for animations
- Table of contents for blog posts

### Blog Features

- Comment system
- Like functionality
- Post view counter
- Blog post search
- RSS feed
- Sitemap

### Performance & SEO

- Lighthouse score of nearly 100
- SEO optimized with meta tags and JSON-LD
- Dynamic open graph images using `next/og`

### Development Experience

- Vitest for unit/integration testing
- Playwright for E2E testing
- ESLint configuration
- Prettier code formatting
- Husky & lint-staged
- Conventional commit lint
- CSpell for spell checking

### Authentication & Data

- Better Auth
- Redis caching
- Upstash for API rate limiting
- t3-env for environment variables
- Umami Analytics

### Email Templates

#### Comment Notification

<div align="center">
  <img alt="Comment notification template" src="apps/web/public/images/comment-email-notification.png">
</div>

#### Reply Notification

<div align="center">
  <img alt="Reply notification template" src="apps/web/public/images/reply-email-notification.png">
</div>

## Getting Started

### Prerequisites

- Node.js with [corepack](https://nodejs.org/api/corepack.html) enabled
- pnpm
- Docker
- [Visual Studio Code](https://code.visualstudio.com/) with [recommended extensions](.vscode/extensions.json)
- Optionally [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)

## Development

To run this project locally, you need to set up the development environment.

### Setup

1. Clone the repository:

```bash
git clone https://github.com/nelsonlaidev/nelsonlai.dev
```

2. Navigate to the project directory:

```bash
cd nelsonlai.dev
```

3. Install dependencies using pnpm:

```bash
pnpm install
```

### Environment Setup

1. Copy `.env.example` to `.env.local` and update the environment variables as needed.

```bash
cp .env.example .env.local
```

2. Run required services using Docker:

```bash
docker compose up -d
```

3. Run the database migrations:

```bash
pnpm db:migrate
```

4. Seed the database:

```bash
pnpm db:seed
```

5. Run the app:

```bash
pnpm dev # Run all services
# or
pnpm dev:web # Run only the web app
# or
pnpm dev:docs # Run only the documentation app
```

The services will be available at the following URLs:

| Service          | URL              |
| ---------------- | ---------------- |
| App              | `localhost:3000` |
| React Email      | `localhost:3001` |
| Docs             | `localhost:3002` |
| Database         | `localhost:5432` |
| Redis            | `localhost:6379` |
| Redis serverless | `localhost:8079` |

## Credits

This project has been made possible thanks to the wonderful open-source community. Special thanks to:

- [Timothy](https://www.timlrx.com/) for the [Tailwind nextjs starter blog template](https://github.com/timlrx/tailwind-nextjs-starter-blog).
- [Eihab](https://www.eihabkhan.com/) for the UI design inspiration ([Figma](https://www.figma.com/community/file/1266863403759514317/geist-ui-kit-for-figma))

This project also uses/adapts the following open-source projects:

- Comment System - from [fuma-comment](https://github.com/fuma-nama/fuma-comment)
- Rehype Plugins - from [fumadocs](https://github.com/fuma-nama/fumadocs)
- UI components - from [shadcn/ui](https://github.com/shadcn-ui/ui)
- ESLint config - from [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- Admin UI - from [shadcn-admin](https://github.com/satnaing/shadcn-admin)

The following projects were referenced for inspiration:

- [fumadocs](https://fumadocs.vercel.app/)
- [leerob.io](https://leerob.io/)
- [nerdfish.be](https://www.nerdfish.be/)
- [nextra.site](https://nextra.site/)
- [theodorusclarence.com](https://theodorusclarence.com/)
- [ped.ro](https://ped.ro/)
- [delba.dev](https://delba.dev/)
- [joshwcomeau.com](https://www.joshwcomeau.com/)
- [blog.maximeheckel.com](https://blog.maximeheckel.com/)
- [zenorocha.com](https://zenorocha.com/)
- [jahir.dev](https://jahir.dev/)
- [anishde.dev](https://anishde.dev/)
- [nikolovlazar.com](https://nikolovlazar.com/)
- [samuelkraft.com](https://samuelkraft.com/)
- [bentogrids.com](https://bentogrids.com/)
- [ui.aceternity.com](https://ui.aceternity.com/)
- [hover.dev](https://www.hover.dev/)
- [vocs.dev](https://vocs.dev/)

## Author

- [@nelsonlaidev](https://github.com/nelsonlaidev)

## Donation

If you find this project helpful, consider supporting me by [sponsoring the project](https://github.com/sponsors/nelsonlaidev).

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
Made with ❤️ in Hong Kong
</p>
