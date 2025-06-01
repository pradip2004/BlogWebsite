"use client";

import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { useAppContext, blogCategories } from "@/context/AppContext";
import React, { useEffect } from "react";

const Blogs = () => {
  const { blogs, loading, blogLoading, fetchBlogs, searchQuery, setSearchQuery, setCategory } = useAppContext();

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="lg:max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Blog Cards Left */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--tertiary)]">Latest Blogs</h1>
        </div>
        {loading ? (
          <Loading />
        ) : blogLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-5">
            {blogs?.length === 0 && <p>No Blogs Yet</p>}
            {blogs &&
              blogs.map((e, i) => (
                <BlogCard
                  key={i}
                  image={e.image}
                  title={e.title}
                  desc={e.description}
                  id={e.id}
                  time={e.created_at}
                  category={e.category}
                />
              ))}
          </div>
        )}
      </div>
      {/* Filter Sidebar Right */}
      <aside className="w-full lg:w-80 flex-shrink-0">
        <div className="sticky top-8">
          <div className="bg-secondary rounded-2xl shadow-md p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-primary mb-2">Filters</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search blogs"
              className="mb-4 p-2 rounded border border-gray-300 bg-primary focus:border-[#ef233c] focus:ring-[#ef233c]/30"
            />
            <div>
              <div className="font-semibold mb-2 text-[var(--tertiary)]">Categories</div>
              <button
                className="block w-full text-left px-2 py-1 rounded hover:bg-[#ef233c]/10"
                onClick={() => setCategory("")}
              >
                All
              </button>
              {blogCategories?.map((cat, i) => (
                <button
                  key={i}
                  className="block w-full text-left px-2 py-1 rounded hover:bg-[#ef233c]/10"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Blogs;