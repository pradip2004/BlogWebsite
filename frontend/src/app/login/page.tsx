"use client"
import { LoginForm } from "@/components/ui/LoginForm"
import { useAppContext } from "@/context/AppContext"
import { redirect } from "next/navigation";





export default function LoginPage() {
  const {isAuth} = useAppContext();
  if(isAuth) {
    redirect("/")
  }
  return (
    <div className="grid min-h-[90vh] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
       
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        
        <img
          src="https://picsum.photos/2560/1440"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
