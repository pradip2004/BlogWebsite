"use client"
import { LoginForm } from "@/components/ui/LoginForm"
import { useAppContext } from "@/context/AppContext"
import { redirect } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const img = [
  "https://i.pinimg.com/736x/b7/84/f4/b784f4474f2957e9ac29f1c4d6d68cd8.jpg",
  "https://i.pinimg.com/736x/16/e7/2e/16e72e6fb3a471ae614e33794d4420b9.jpg",
  "https://i.pinimg.com/736x/63/41/d5/6341d588f535e51222eda363462a4fdc.jpg",
  "https://i.pinimg.com/736x/98/21/51/982151de5162ec73f27b87fe819b287e.jpg",
  "https://i.pinimg.com/736x/6d/98/f1/6d98f1ea6eb7e7425a2c7f9ee039bdd3.jpg",
  "https://i.pinimg.com/736x/e5/0e/ea/e50eea51ff32cf315a5db7107c5eec52.jpg",
  "https://i.pinimg.com/736x/1f/82/b2/1f82b214325509d2a5cc8f70ae74f2ee.jpg",
  "https://i.pinimg.com/736x/22/0a/dc/220adc665e49ee04d15e36728d059f4e.jpg",
  "https://i.pinimg.com/736x/9a/59/49/9a594945716f011c8c59314eca236e5e.jpg",
  "https://i.pinimg.com/736x/80/a7/45/80a74588425b5791243abb15ccae9771.jpg",
  "https://i.pinimg.com/736x/d4/00/bf/d400bf75867c952d023f014b78aefd25.jpg"

]



export default function LoginPage() {
  const {isAuth} = useAppContext();
  if(isAuth) {
    redirect("/")
  }

  const [randomImage, setRandomImage] = useState<string | null>(null);

  useEffect(() => {
    const imgUrl = img[Math.floor(Math.random() * img.length)];
    setRandomImage(imgUrl);
  }, []);
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
        
         {randomImage && (
          <img
            src={randomImage}
            alt="Login background"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        )}
      </div>
    </div>
  )
}
