// lib/api.ts

// Type definition for a Blog Post
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
}

// SIMULATE: Fetching a list of blogs (e.g., from Strapi) with pagination
export async function getBlogList(page: number = 1, limit: number = 20): Promise<BlogPost[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Generate infinite demo data
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const allPosts = Array.from({ length: 1000 }).map((_, i) => ({
    id: `post-${i + 1}`,
    title: `Blog Post #${i + 1}: The Future of Textiles`,
    content: "This is a summary of the blog post...",
    author: "John Doe",
    publishedAt: new Date().toISOString(),
  }));

  // Return paginated data
  return allPosts.slice(startIndex, endIndex);
}

// SIMULATE: Fetching a single blog by ID (The "Millions" part)
export async function getBlogDetail(id: string): Promise<BlogPost> {
  console.log(`⚡ FETCHING DATA FROM DB FOR ID: ${id}`); // Log to show when cache is missed
  
  // Simulate network delay (DB query)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For demo, generate data based on ID
  const postNumber = parseInt(id.replace('post-', '')) || Math.floor(Math.random() * 1000) + 1;

  return {
    id: id,
    title: `Deep Dive into Post ${postNumber}`,
    content: `Here is the full content for post ${postNumber}. This content was generated on the server and cached. In a real app, this would be 2000 words long. This demonstrates how Next.js can handle dynamic pages for millions of blog posts without pre-building them.`,
    author: "Jane Smith",
    publishedAt: new Date().toISOString(),
  };
}