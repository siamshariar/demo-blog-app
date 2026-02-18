import BlogList from './BlogList';

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <h1 className="text-4xl font-bold mb-10 text-center text-black">Trending Posts</h1>
        <BlogList />
      </div>
    </div>
  );
}
