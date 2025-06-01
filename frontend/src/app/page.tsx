"use client";

import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { AvatarImage } from '@radix-ui/react-avatar';
import Link from 'next/link';
import React from 'react'

const HomePage = () => {
  const { isAuth, blogLoading, recentBlogs } = useAppContext();

  // console.log(recentBlogs);
  return (
    <div className='bg-primary w-full'>
      <div className='bg-secondary '>
        <div className='lg:max-w-6xl mx-auto flex items-center justify-between'>
          <div className='py-10'>
            <h1 className='text-7xl'>Human</h1>
            <h1 className="text-7xl">stories & ideas</h1>
            <p className='text-xl mt-5 text-[var(--tertiary)]'>A place to read, write, and deepen your understanding.</p>
          </div>

          {isAuth ? (
            <Link href={'/blog/new'} className='hidden md:block relative'>
              <svg
                viewBox="0 0 200 200"
                width="200"
                height="200"
                // className="text-lg tracking-widest animate-spin animatedButton"
                className="text-lg tracking-widest"
              >
                <path
                  id="circlePath"
                  fill="none"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                />
                <text>
                  <textPath href='#circlePath' startOffset="0%">
                    Write your story •
                  </textPath>
                  <textPath href='#circlePath' startOffset="50%">
                    Share your idea •
                  </textPath>
                </text>
              </svg>
              <button className='absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-[#ef233c] rounded-full flex items-center justify-center'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="50"
                  height="50"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <line x1="6" y1="18" x2="18" y2="6" />
                  <polyline points="9 6 18 6 18 15" />
                </svg>
              </button>
            </Link>
          ) : null}

        </div>
      </div>

      {/* features post  */}

      <div className='lg:max-w-6xl mx-auto px-4 lg:px-0 py-10'>
        {blogLoading ? (
          <Loading />
        ) : (
          <div className='mt-8 flex flex-col lg:flex-row gap-8'>
            {/* Left Large Blog Card */}

            {recentBlogs.length >= 1 && (
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <img
                  src={recentBlogs[0].image}
                  alt={recentBlogs[0].title}
                  className="rounded-3xl object-cover"
                />
                <div className='flex items-center gap-4'>
                  <h1 className="font-semibold lg:text-lg">01.</h1>
                  <span className='text-blue-800 lg:text-lg'>{recentBlogs[0].category}</span>
                  <span className='text-gray-500'>2 days ago</span>
                </div>
                <Link href={`${isAuth? `/blog/${recentBlogs[0].id}` : `/login` }`} className='text-xl lg:text-3xl font-semibold lg:font-bold'>
                  {recentBlogs[0].title}
                </Link>
              </div>
            )}

            {/* Right Small Blog Cards */}
            {recentBlogs.length > 1 && (
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                {recentBlogs.slice(1).map((blog, index) => (
                  <div key={blog.id} className="lg:h-1/3 flex justify-between gap-4">
                    <img src={blog.image} alt={blog.title} className="rounded-3xl object-cover w-1/3 aspect-video" />
                    <div className='w-2/3'>
                      <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                        <h1 className="font-semibold">0{index + 2}.</h1>
                        <span className="text-blue-800">{blog.category}</span>
                        <span className="text-gray-500 text-sm">2 days ago</span>
                      </div>
                      <Link
                        href={`${isAuth? `/blog/${blog.id}` : `/login` }`}
                        className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
                      >
                        {blog.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className='bg-secondary '>
        <div className='lg:max-w-6xl mx-auto flex items-center justify-center'>
          <div className='py-10 flex items-center justify-center flex-col gap-4 text-center'>
            <h1 className='text-7xl font-medium'>Want To <span className='text-[#ef233c]'>Read More</span></h1>
            <Link href={'/blogs'}>
              <Button className='bg-[#ef233c] hover:bg-[#d90429]'>Read More</Button>
            </Link>
          </div>
        </div>
      </div>


      <div className='bg-primary my-10'>
        <div className='lg:max-w-6xl mx-auto flex items-center justify-center'>
          <div className='py-10 flex items-center justify-center flex-col text-center'>
            <h1 className='text-6xl font-medium'>Top <span className='text-[#ef233c]'>Author</span></h1>
            <div className=' mt-10'>
              <Avatar className='flex items-center justify-center gap-10'>
                <AvatarImage
                  src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?cs=srgb&dl=pexels-moose-photos-170195-1036623.jpg&fm=jpg"
                  alt="Author"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <AvatarImage
                  src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?cs=srgb&dl=pexels-moose-photos-170195-1036623.jpg&fm=jpg"
                  alt="Author"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <AvatarImage
                  src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?cs=srgb&dl=pexels-moose-photos-170195-1036623.jpg&fm=jpg"
                  alt="Author"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </Avatar>

            </div>
          </div>
        </div>
      </div>

      <Footer />


    </div>
  )
}

export default HomePage