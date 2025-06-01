import SideBar from '@/components/SideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React, { ReactNode } from 'react'


interface BlogsProps {
      children: ReactNode;
}
const HomeLayout: React.FC<BlogsProps> = ({children}) => {
  return (

      <SidebarProvider >
            
            <main className='w-full '>
                  <div className='w-full  px-4 '>
                        {children}
                  </div>
            </main>
      </SidebarProvider>
  )
}

export default HomeLayout