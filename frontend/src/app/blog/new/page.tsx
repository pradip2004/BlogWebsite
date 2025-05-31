"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { RefreshCw } from 'lucide-react'
import React, { useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import axios from 'axios'
import { AUTHER_SERVICE } from '@/context/AppContext'
import { Textarea } from '@/components/ui/textarea';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

const blogCategories = [
  "Technology",
  "Health",
  "Finance",
  "Education"
]

const AddBlog = () => {

  const editor = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: ""
  })
  const [aiTitleLoading, setAiTitleLoading] = useState(false)
  const [aiDescLoading, setAiDescLoading] = useState(false);
  const [aiBlogLoading, setAiBlogLoading] = useState(false);


  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    setFormData({ ...formData, image: file })
  }


  const aiTitleResponse = async () => {
    try {
      setAiTitleLoading(true)
      const { data } = await axios.post(`${AUTHER_SERVICE}/api/v1/ai/title`, { text: formData.title })
      setFormData({ ...formData, title: data });
    } catch (error) {
      toast.error("Problem While fetching from ai")
      console.log(error)
    } finally {
      setAiTitleLoading(false)
    }
  }

  const aiDescResponse = async () => {
    try {
      setAiDescLoading(true)
      const { data } = await axios.post(`${AUTHER_SERVICE}/api/v1/ai/desc`, {
        title: formData.title,
        description: formData.description
      })
      setFormData({ ...formData, description: data });
    } catch (error) {
      toast.error("Problem While fetching from ai")
      console.log(error)
    } finally {
      setAiDescLoading(false)
    }
  }


  const aiBlogResponse = async () => {
    try {
      setAiBlogLoading(true)
      const { data } = await axios.post(`${AUTHER_SERVICE}/api/v1/ai/blog`, {
        blog: formData.blogcontent
      })
      setFormData({ ...formData, blogcontent: data });
    } catch (error) {
      toast.error("Problem While fetching from ai")
      console.log(error)
    } finally {
      setAiBlogLoading(false)
    }
  }

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typings...'
  }),
    []
  );

  const handleSubmit = async (e: any) => {
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
        `${AUTHER_SERVICE}/api/v1/blog/new`,
        fromDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: ""
      });

      setContent("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      toast.error("Error while adding blog");
      console.log("new blog creation error", error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='max-w-4xl mx-auto p-6'>
      <Card>
        <CardHeader>
          <h2 className='text-2xl font-bold text-[#ef233c]'>Add New Blog</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title */}
            <div>
              <Label className="text-[var(--tertiary)] mb-2">Title</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={`bg-primary border border-gray-300 rounded-lg focus:border-[#ef233c] focus:ring-[#ef233c]/30 ${aiTitleLoading ? "animate-pulse placeholder:opacity-60" : ""}`}
                  placeholder="Enter your blog title"
                />
                <Button type='button' disabled={formData.title === ""} onClick={aiTitleResponse} size="icon" variant="ghost">
                  <RefreshCw className={aiTitleLoading ? "animate-spin" : ""} />
                </Button>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-[var(--tertiary)]  mb-2">Description</Label>
              <div className="flex items-center gap-2 mt-1">
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className={`bg-primary border border-gray-300 rounded-lg focus:border-[#ef233c] focus:ring-[#ef233c]/30 resize-none ${aiDescLoading ? "animate-pulse placeholder:opacity-60" : ""}`}
                  placeholder="Write a short description..."
                />
                <Button type='button' disabled={formData.title === ""} onClick={aiDescResponse} size="icon" variant="ghost">
                  <RefreshCw className={aiDescLoading ? "animate-spin" : ""} />
                </Button>
              </div>
            </div>

            {/* Category */}
            <div>
              <Label className="text-[var(--tertiary)]  mb-2">Category</Label>
              <Select onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-primary border border-gray-300 rounded-lg focus:border-[#ef233c] focus:ring-[#ef233c]/30">
                  <SelectValue placeholder={formData.category || "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {blogCategories?.map((cat, index) => (
                    <SelectItem key={index} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-[var(--tertiary)]  mb-2">Image Upload</Label>
              <Input
                type="file"
                accept='image/*'
                onChange={handleFileChange}
                ref={fileInputRef}
                className="bg-primary border border-gray-300 rounded-lg focus:border-[#ef233c] focus:ring-[#ef233c]/30"
              />
            </div>

            {/* Blog Content */}
            <div>
              <Label className="text-[var(--tertiary)]">Blog Content</Label>
              <div className='flex justify-between items-center mb-2'>
                <p className='text-xs text-muted-foreground'>
                  Please add image after improving your grammar.
                </p>
                <Button type='button' size="sm" onClick={aiBlogResponse} variant="outline">
                  <RefreshCw size={16} className={aiBlogLoading ? "animate-spin" : ""} />
                  <span className='ml-2'>Fix Grammar</span>
                </Button>
              </div>
              <div className="rounded-lg border border-gray-300 bg-primary focus-within:border-[#ef233c] focus-within:ring-[#ef233c]/30 transition">
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => {
                    setContent(newContent)
                    setFormData({ ...formData, blogcontent: newContent })
                  }}
                />
              </div>
            </div>

            <Button type='submit' className='w-full bg-[#ef233c] hover:bg-[#d90429] text-white font-semibold rounded-lg py-2 text-lg shadow' disabled={loading}>
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddBlog