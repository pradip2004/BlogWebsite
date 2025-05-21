"use client"
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {Toaster} from 'react-hot-toast'
import {GoogleOAuthProvider} from '@react-oauth/google'

export const USER_SERVICE = "http://localhost:5000";
export const AUTHER_SERVICE = "http://localhost:5001";
export const BLOG_SERVICE = "http://localhost:5002";

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

interface AppContextType {
      user: User | null;
      loading: boolean;
      isAuth: boolean;
      setUser: (user: User | null) => void;
      setLoading: (loading: boolean) => void;
      setIsAuth: (isAuth: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
      children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
      const [user, setUser] = useState<User | null>(null);
      const [loading, setLoading] = useState<boolean>(false);
      const [isAuth, setIsAuth] = useState<boolean>(false);

      async function fetchUser() {
            setLoading(true);
            try {
                  const token = Cookies.get("token")

                  const {data} = await axios.get(`${USER_SERVICE}/api/v1/me`, {
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

      useEffect(()=> {
            fetchUser();
      }, [])

      return (
            <AppContext.Provider
                  value={{
                        user,
                        loading,
                        isAuth,
                        setUser,
                        setLoading,
                        setIsAuth,
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
      if(!context){
            throw new Error("useAppContext must be used within an AppProvider");
      }
      return context;
};