import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <main className="text-center">
          <h1 className="text-5xl font-bold mb-6 text-black">
            Blog Demo App
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A performance-optimized blog system using Next.js App Router with dynamic pages. Handle millions of blog posts without pre-building them.
          </p>
          <Link
            href="/blogs"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Explore Blog Posts
          </Link>
        </main>
      </div>
    </div>
  );
}
