"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import axios from "axios";

import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AUTHER_SERVICE, BLOG_SERVICE, blogCategories, useAppContext } from "@/context/AppContext";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditBlogPage = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const { fetchBlogs } = useAppContext();

  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    image: File | null;
    blogcontent: string;
  }>({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      setFormData({ ...formData, image: file ?? null })
    }

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typings...",
    }),
    []
  );

  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${BLOG_SERVICE}/api/v1/blog/${id}`);
        const blog = data.blog;

        setFormData({
          title: blog.title,
          description: blog.description,
          category: blog.category,
          image: null,
          blogcontent: blog.blogcontent,
        });

        setContent(blog.blogcontent);
        setExistingImage(blog.image);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const fromDataToSend = new FormData();

    fromDataToSend.append("title", formData.title);
    fromDataToSend.append("description", formData.description);
    fromDataToSend.append("blogcontent", formData.blogcontent);
    fromDataToSend.append("category", formData.category);

    if (formData.image) {
      fromDataToSend.append("file", formData.image);
    }

    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${AUTHER_SERVICE}/api/v1/blog/${id}`,
        fromDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      fetchBlogs();
    } catch (error) {
      console.error("Error while adding blog:", error);
      toast.error("Error while adding blog");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-[#ef233c]">Edit Blog</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label className="text-[var(--tertiary)] mb-2">Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="bg-primary border border-gray-300 rounded-lg focus:border-[#ef233c] focus:ring-[#ef233c]/30"
                placeholder="Enter your blog title"
              />
            </div>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleTextareaChange}
                required
                rows={3}
                className="bg-primary border border-gray-300 rounded-lg focus:border-[#ef233c] focus:ring-[#ef233c]/30 resize-none"
                placeholder="Write a short description..."
              />
                
            

            {/* Category */}
            <div>
              <Label className="text-[var(--tertiary)] mb-2">Category</Label>
              <Select
                onValueChange={(value: string) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-primary border border-gray-300 rounded-lg focus:border-[#ef233c] focus:ring-[#ef233c]/30">
                  <SelectValue placeholder={formData.category || "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {blogCategories?.map((e, i) => (
                    <SelectItem key={i} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-[var(--tertiary)] mb-2">Image Upload</Label>
              {existingImage && !formData.image && (
                <img
                  src={existingImage}
                  className="w-40 h-40 object-cover rounded mb-2"
                  alt=""
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-primary border border-gray-300 rounded-lg focus:border-[#ef233c] focus:ring-[#ef233c]/30"
              />
            </div>

            {/* Blog Content */}
            <div>
              <Label className="text-[var(--tertiary)]">Blog Content</Label>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-muted-foreground">
                  Paste your blog or type here. You can use rich text formatting.
                  Please add image after improving your grammar.
                </p>
              </div>
              <div className="rounded-lg border border-gray-300 bg-primary focus-within:border-[#ef233c] focus-within:ring-[#ef233c]/30 transition">
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => {
                    setContent(newContent);
                    setFormData({ ...formData, blogcontent: newContent });
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ef233c] hover:bg-[#d90429] text-white font-semibold rounded-lg py-2 text-lg shadow"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlogPage;