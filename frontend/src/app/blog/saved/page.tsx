"use client";
import SavedBlogCard from "@/components/SavedBlogCard";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { BLOG_SERVICE } from "@/context/AppContext";

const SavedBlogs = () => {
  const { blogs, savedBlogs, getSavedBlogs } = useAppContext();
  // const [removing, setRemoving] = useState<string | null>(null);
  const [localSaved, setLocalSaved] = useState(savedBlogs);

  React.useEffect(() => {
    setLocalSaved(savedBlogs);
  }, [savedBlogs]);

  if (!blogs || !localSaved) {
    return <Loading />;
  }

  const filteredBlogs = blogs.filter((blog) =>
    localSaved.some((saved) => saved.blogid === blog.id.toString())
  );

  const handleUnsave = async (id: string) => {
    // setRemoving(id);
    try {
      const token = Cookies.get("token");
      await axios.delete(`${BLOG_SERVICE}/api/v1/unsave/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Instantly update UI
      setLocalSaved((prev) => prev?.filter((saved) => saved.blogid !== id) || []);
      toast.success("Blog unsaved!");
      // Optionally refresh global savedBlogs
      if (getSavedBlogs) getSavedBlogs();
    } catch (error) {
      console.error("Error unsaving blog:", error);
      toast.error("Failed to unsave blog");
    } 
  };

  return (
    <div className="min-h-[91vh] bg-primary py-8 px-2">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--tertiary)] mb-8 text-center ">
          Saved Blogs
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((e) => (
              <SavedBlogCard
                key={e.id}
                image={e.image}
                title={e.title}
                desc={e.description}
                id={e.id}
                time={e.created_at}
                onUnsave={() => handleUnsave(e.id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-[var(--tertiary)] text-lg opacity-70 py-16 border-2 border-dashed border-gray-300 rounded-xl">
              No saved blogs yet!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedBlogs;