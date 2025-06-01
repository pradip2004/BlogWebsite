"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card} from "@/components/ui/card";
import { useAppContext, USER_SERVICE } from "@/context/AppContext";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { Facebook, Instagram, Linkedin, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {  useRouter } from "next/navigation";
import UserBlogCard from "@/components/UserBlogCard";


const ProfilePage = () => {
  const router = useRouter();
  const { user, setUser, logout, blogs } = useAppContext();

  useEffect(() => {
    if (!user) {
      router.replace("/"); // or router.push("/")
    }
  }, [user, router]);

  const userBlogs = blogs.filter((blog) => blog.author === user?._id);
  console.log("User Blogs:", userBlogs);

  const logoutHandler = () => {
    logout();
    router.push("/");
  };
  const InputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    linkedin: user?.linkedin || "",
    bio: user?.bio || "",
  });

  const clickHandler = () => {
    InputRef.current?.click();
  };

  const changeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();

      formData.append("file", file);
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.post(
          `${USER_SERVICE}/api/v1/user/update/pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(data.message);
        setLoading(false);
        Cookies.set("token", data.token, {
          expires: 5,
          secure: true,
          path: "/",
        });
        setUser(data.user);
      } catch (error) {
        console.error("Image update error:", error);
        toast.error("Image Update Failed");
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${USER_SERVICE}/api/v1/user/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setLoading(false);
      Cookies.set("token", data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });
      setUser(data.user);
      setOpen(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Update Failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[91vh] bg-primary flex justify-center items-start py-10 px-2">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {/* Left: User Details */}
          <div className="flex items-center justify-center max-w-lg h-[80vh] ">
            <Card className="bg-secondary  border rounded-2xl shadow-lg flex flex-col items-center p-8 w-xs">
              <Avatar
                className="w-32 h-32 border-4 border-gray-200 shadow-md cursor-pointer mb-4"
                onClick={clickHandler}
              >
                <AvatarImage src={user?.image} alt="profile pic" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={InputRef}
                  onChange={changeHandler}
                />
              </Avatar>
              <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-primary">{user?.name}</h2>
                <p className="text-[var(--tertiary)] mt-2">
                  {user?.bio?.trim() ? user.bio : "No bio provided"}
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                {/* Instagram */}
                {user?.instagram ? (
                  <a
                    href={user.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="text-pink-500 text-2xl" />
                  </a>
                ) : (
                  <span className="opacity-40 cursor-not-allowed pointer-events-none">
                    <Instagram className="text-pink-500 text-2xl" />
                  </span>
                )}
                {/* Facebook */}
                {user?.facebook ? (
                  <a
                    href={user.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="text-blue-500 text-2xl" />
                  </a>
                ) : (
                  <span className="opacity-40 cursor-not-allowed pointer-events-none">
                    <Facebook className="text-blue-500 text-2xl" />
                  </span>
                )}
                {/* Linkedin */}
                {user?.linkedin ? (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="text-blue-700 text-2xl" />
                  </a>
                ) : (
                  <span className="opacity-40 cursor-not-allowed pointer-events-none">
                    <Linkedin className="text-blue-700 text-2xl" />
                  </span>
                )}
              </div>
              <div className="flex gap-2 w-full items-center justify-center">


                <Button onClick={logoutHandler} className="hover:bg-[var(--tertiary)]/70">
                  Logout
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant={"outline"} className="">
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="flex flex-col items-start gap-2 justify-center mb-4">
                        <Label>Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex flex-col items-start gap-2 justify-center mb-4">
                        <Label>Bio</Label>
                        <Input
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex flex-col items-start gap-2 justify-center mb-4">
                        <Label>Instagram</Label>
                        <Input
                          value={formData.instagram}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instagram: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col items-start gap-2 justify-center mb-4">
                        <Label>Facebook</Label>
                        <Input
                          value={formData.facebook}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              facebook: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col items-start gap-2 justify-center mb-4">
                        <Label>Linkedin</Label>
                        <Input
                          className=""
                          value={formData.linkedin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              linkedin: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        onClick={handleFormSubmit}
                        className="w-full mt-4 bg-[#ef233c] hover:bg-[#d90429]"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </div>

          {/* Right: User Blogs */}
          <div className="flex flex-col w-full h-[80vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--tertiary)]">Your Blogs</h2>
              <Button className="bg-[#ef233c] hover:bg-[#d90429]" onClick={() => router.push("/blog/new")}>
                <PenLine />
                Add Blog
              </Button>
            </div>
            {/* Blog list placeholder */}
            <div className="flex flex-col gap-4 overflow-y-auto px-8">
              {userBlogs.length > 0 ? (
                userBlogs.map((blog) => (
                  <UserBlogCard
                    key={blog.id}
                    blog={blog}
                    onDelete={() => {
                    }
                  }
                  />
                ))
              ) : (
                <div className="text-[var(--tertiary)] text-center opacity-60 py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  No blogs to show yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;