# Blog Demo App

A performance-optimized blog application built with Next.js 15, TypeScript, and Tailwind CSS. This demo showcases efficient handling of dynamic pages using query parameters and server-side caching.

## Features

- **Dynamic Blog Pages**: Handle millions of blog posts without pre-building
- **Server-Side Rendering**: SEO-friendly with dynamic metadata generation
- **Query Parameter Routing**: Uses `/blog-detail?id={blog-id}` for flexible routing
- **Automatic Caching**: Next.js ISR caches pages for optimal performance
- **TypeScript**: Fully typed for better development experience

## Project Structure

```
app/
├── page.tsx          # Home page with link to blog list
├── blogs/
│   └── page.tsx      # Blog list page
└── blog-detail/
    └── page.tsx      # Dynamic blog detail page

lib/
└── api.ts            # Mock API functions
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3001](http://localhost:3001) in your browser.

## How It Works

- **Blog List** (`/blogs`): Displays a list of blog posts with links to details
- **Blog Detail** (`/blog-detail?id={id}`): Dynamically renders any blog post by ID
- **Caching**: First visit fetches from API, subsequent visits use cache
- **SEO**: Metadata generated server-side for each dynamic page

## API

The app uses mock API functions in `lib/api.ts`:
- `getBlogList()`: Returns list of blog posts
- `getBlogDetail(id)`: Returns a specific blog post by ID

## Build

```bash
npm run build
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
