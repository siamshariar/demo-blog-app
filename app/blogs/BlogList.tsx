'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/api';

async function fetchBlogs(page: number, limit: number = 20): Promise<BlogPost[]> {
  const response = await fetch(`/api/blogs?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }
  return response.json();
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newPosts = await fetchBlogs(page, 20);
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMorePosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    const sentinel = document.getElementById('load-more-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMorePosts, hasMore, loading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <h2 className="text-xl font-semibold mb-3 text-black">{post.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">By {post.author}</span>
            <Link
              href={`/blog-detail?id=${post.id}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Read More →
            </Link>
          </div>
        </div>
      ))}
      {loading && (
        <div className="col-span-full text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading more posts...</p>
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className="col-span-full text-center py-8 text-gray-600">
          No more posts to load.
        </div>
      )}
      <div id="load-more-sentinel" className="h-10"></div>
    </div>
  );
}