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
            A performance-optimized blog system using Next.js App Router with dynamic pages. Handle 5,000-10,000 blog posts with different rendering strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blogs"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Demo 1: Normal List
            </Link>
            <Link
              href="/blogs-prefetch"
              className="inline-block px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Demo 2: ISR prefetch list
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <p>Demo 1: Client-side pagination with dynamic detail pages</p>
            <p>Demo 2: Client-side pagination with ISR detail pages (20s revalidation)</p>
          </div>
        </main>
      </div>
    </div>
  );
}
