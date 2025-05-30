import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { AUTHER_SERVICE, Blog } from "@/context/AppContext";
import React, { useState } from "react";
import Link from "next/link";

interface UserBlogCardProps {
      blog: Blog;
      onDelete: (id: string) => void;
}

const UserBlogCard: React.FC<UserBlogCardProps> = ({ blog, onDelete }) => {
      const router = useRouter();
      const [loading, setLoading] = useState(false);

      const handleDelete = async () => {
            if (confirm("Are you sure you want to delete this blog?")) {
                  try {
                        setLoading(true);
                        const token = Cookies.get("token");
                        const { data } = await axios.delete(
                              `${AUTHER_SERVICE}/api/v1/blog/${blog.id}`,
                              {
                                    headers: {
                                          Authorization: `Bearer ${token}`,
                                    },
                              }
                        );
                        toast.success(data.message);
                        onDelete(blog.id);
                  } catch (error) {
                        toast.error("Problem while deleting blog");
                  } finally {
                        setLoading(false);
                  }
            }
      };

      return (
            <Link href={`/blog/${blog.id}`}>
                  <div className="flex items-center gap-4 bg-primary shadow-xs p-3 border-2 border-dashed border-gray-300 rounded-xl">
                        <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                              <div className="font-semibold text-[var(--tertiary)] truncate">{blog.title}</div>
                              <div className="text-xs text-[var(--tertiary)] mt-1">{blog.category}</div>
                        </div>
                        <Button
                              size="icon"
                              variant="ghost"
                              className="text-black bg-secondary"
                              onClick={() => router.push(`/blog/edit/${blog.id}`)}
                              disabled={loading}
                        >
                              <Edit />
                        </Button>
                        <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-600"
                              onClick={handleDelete}
                              disabled={loading}
                        >
                              <Trash2 />
                        </Button>
                  </div>
            </Link>
      );
};

export default UserBlogCard;