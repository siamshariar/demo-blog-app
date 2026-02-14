'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/api';

async function fetchBlogs(page: number, limit: number = 20): Promise<BlogPost[]> {
  const response = await fetch(`/api/blogs?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }
  return response.json();
}

export default function BlogListISR() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [prefetchingPost, setPrefetchingPost] = useState<string | null>(null);
  
  // Use ref to track current page for API calls to avoid stale closures
  const currentPageRef = useRef(1);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newPosts = await fetchBlogs(currentPageRef.current, 20);
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => {
          // Filter out any posts that are already in the list to prevent duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
          return [...prev, ...uniqueNewPosts];
        });
        setPage(prev => prev + 1);
        currentPageRef.current += 1;
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    loadMorePosts();
  }, []);

  // Use ref to store the latest loadMorePosts function
  const loadMorePostsRef = useRef(loadMorePosts);
  
  // Update the ref whenever loadMorePosts changes
  useEffect(() => {
    loadMorePostsRef.current = loadMorePosts;
  }, [loadMorePosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePostsRef.current();
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
  }, [hasMore, loading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <h2 className="text-xl font-semibold mb-3 text-black">{post.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">By {post.author}</span>
            <Link
              href={`/blog-detail-isr?id=${post.id}`}
              prefetch={true}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              onMouseEnter={() => {
                console.log(`🚀 Prefetching post: ${post.id}`);
                setPrefetchingPost(post.id);
                // Reset after a short delay
                setTimeout(() => setPrefetchingPost(null), 1000);
              }}
              onClick={() => console.log(`📖 Navigating to post: ${post.id}`)}
            >
              Read More {prefetchingPost === post.id && <span className="text-green-500">⚡</span>} →
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