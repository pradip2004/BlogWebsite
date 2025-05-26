import React, { ReactNode } from 'react'
import { SidebarProvider } from './ui/sidebar';
import SideBar from './SideBar';

interface BlogsProps {
      children: ReactNode;
}
const HomeLayout: React.FC<BlogsProps> = ({children}) => {
  return (

      <SidebarProvider >
            <SideBar />
            <main className='w-full '>
                  <div className='w-full px-4 '>
                        {children}
                  </div>
            </main>
      </SidebarProvider>
  )
}

export default HomeLayout