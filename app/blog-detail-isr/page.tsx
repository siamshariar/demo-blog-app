import { Metadata } from 'next';
import { getBlogDetail } from '@/lib/api';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Enable ISR with revalidation every 20 seconds
export const revalidate = 20;

// Track generation time for demo purposes
const generationTime = new Date().toISOString();

// Helper to define props interface
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 1. DYNAMIC SEO METADATA (Runs on Server)
// Next.js automatically dedupes the fetch request below.
// It won't call the API twice (once for metadata, once for body).
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';

  if (!id) return { title: 'Blog Not Found' };

  // Fetch data for SEO tags
  const post = await getBlogDetail(id);

  return {
    title: post.title,
    description: post.content.substring(0, 160), // SEO snippet
    openGraph: {
      title: post.title,
      type: 'article',
      authors: [post.author],
    },
  };
}

// 2. THE PAGE CONTENT
export default async function BlogDetailISRPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';

  if (!id) {
    redirect('/blogs-prefetch');
  }

  // --- ISR MAGIC ---
  // This page uses Incremental Static Regeneration
  // First request generates the page, subsequent requests serve from cache
  // Cache is invalidated every 20 seconds

  let post;
  try {
    post = await getBlogDetail(id);
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6 md:p-10">
          <Link href="/blogs-prefetch" className="text-gray-600 hover:text-gray-800 mb-6 inline-block text-sm font-medium">
            ← Back to Blog List
          </Link>
          <div className="text-red-500 text-center">Error loading blog post. Please try again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <Link href="/blogs-prefetch" className="text-gray-600 hover:text-gray-800 mb-6 inline-block text-sm font-medium">
          ← Back to Blog List
        </Link>

        <article className="bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-black">{post.title}</h1>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600 border-b border-gray-200 pb-4">
              <span className="mb-2 sm:mb-0">By {post.author}</span>
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none text-black">
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
          </div>
        </article>

        {/* ISR Info */}
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-black mb-2">ISR Demo</h3>
          <p className="text-sm text-gray-600 mb-4">
            This page uses Incremental Static Regeneration with 20-second revalidation.
            The first visit generates the page, subsequent visits serve from cache until revalidation.
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Page generated at: {generationTime}
          </p>
          <p className="text-sm text-green-600 font-medium">
            ⚡ Thanks to prefetching, this page loads instantly when you click the link!
          </p>
        </div>
      </div>
    </div>
  );
}