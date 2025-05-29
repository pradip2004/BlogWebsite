"use client"
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'

export const USER_SERVICE = "http://localhost:5000";
export const AUTHER_SERVICE = "http://localhost:5001";
export const BLOG_SERVICE = "http://localhost:5002";

export const blogCategories = [
      "Technology",
      "Health",
      "Finance",
      "Education"
]

export interface User {
      _id: string;
      name: string;
      email: string;
      image: string;
      instagram: string;
      facebook: string;
      linkedin: string;
      bio: string;
}

export interface Blog {
      id: string;
      title: string;
      description: string;
      category: string;
      image: string;
      blogcontent: string;
      author: string;
      created_at: string;
}

interface SavedBlogType {
      id: string;
      userid: string;
      blogid: string;
      create_at: string;
}

interface AppContextType {
      user: User | null;
      loading: boolean;
      isAuth: boolean;
      setUser: (user: User | null) => void;
      setLoading: (loading: boolean) => void;
      setIsAuth: (isAuth: boolean) => void;
      logout: () => void;
      fetchBlogs: () => Promise<void>;
      blogLoading: boolean;
      blogs: Blog[];
      setBlogs: (blogs: Blog[]) => void;
      searchQuery: string;
      setSearchQuery: (query: string) => void;
      category: string;
      setCategory: (category: string) => void;
      savedBlogs: SavedBlogType[] | null;
      getSavedBlogs: () => Promise<void>;
      recentBlogs: Blog[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
      children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
      const [user, setUser] = useState<User | null>(null);
      const [loading, setLoading] = useState<boolean>(false);
      const [isAuth, setIsAuth] = useState<boolean>(false);
      const [blogLoading, setBlogLoading] = useState<boolean>(false);
      const [blogs, setBlogs] = useState<Blog[]>([]);
      const [category, setCategory] = useState("");
      const [searchQuery, setSearchQuery] = useState("");
      const [savedBlogs, setSavedBlogs] = useState<SavedBlogType[] | null>(null);
      const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);



      async function fetchUser() {
            setLoading(true);
            try {
                  const token = Cookies.get("token")

                  const { data } = await axios.get(`${USER_SERVICE}/api/v1/me`, {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  })

                  setUser(data);
                  setIsAuth(true);
                  setLoading(false);
            } catch (error) {
                  setLoading(false);
                  console.log(error);
            }
      }

      async function logout() {
            setLoading(true);
            Cookies.remove("token");
            setUser(null);
            setIsAuth(false);
            setLoading(false);
            toast.success("Logged out successfully");
      }

      async function fetchBlogs() {
            setBlogLoading(true);
            try {
                  const { data } = await axios.get(`${BLOG_SERVICE}/api/v1/blog/all?searchQuery=${searchQuery}&category=${category}`);
                  setBlogs(data);
            } catch (error) {
                  console.log("Error fetching blogs", error);
                  toast.error("Failed to fetch blogs");
            } finally {
                  setBlogLoading(false);
            }
      }

      async function getSavedBlogs() {
            const token = Cookies.get("token");
            try {
                  const { data } = await axios.get(
                        `${BLOG_SERVICE}/api/v1/blog/saved/all`,
                        {
                              headers: {
                                    Authorization: `Bearer ${token}`,
                              },
                        }
                  );
                  setSavedBlogs(data);
            } catch (error) {
                  console.log(error);
            }
      }

      useEffect(() => {
            fetchUser();
            getSavedBlogs();
      }, [])

      useEffect(() => {
            const sortedRecent = blogs.slice(0, 4);
            setRecentBlogs(sortedRecent);
      }, [blogs]);

      useEffect(() => {
            fetchBlogs();
      }, [searchQuery, category]);

      return (
            <AppContext.Provider
                  value={{
                        user,
                        loading,
                        isAuth,
                        setUser,
                        setLoading,
                        setIsAuth,
                        logout,
                        fetchBlogs,
                        blogLoading,
                        blogs,
                        setBlogs,
                        searchQuery,
                        setSearchQuery,
                        category,
                        setCategory,
                        savedBlogs,
                        getSavedBlogs,
                        recentBlogs
                  }}
            >
                  <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}>

                        {children}
                        <Toaster />
                  </GoogleOAuthProvider>
            </AppContext.Provider>
      )
}


export const useAppContext = () => {
      const context = useContext(AppContext);
      if (!context) {
            throw new Error("useAppContext must be used within an AppProvider");
      }
      return context;
};